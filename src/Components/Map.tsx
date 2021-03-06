import { LeafletMouseEvent, Map as IMap } from "leaflet";
import _ from "lodash";
import React, { Component, createRef, SyntheticEvent } from "react";
import {
  Button,
  Checkbox,
  ControlLabel,
  FormGroup,
  Radio
} from "react-bootstrap";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { FishNames } from "../Constants/Fishes";
import { IMarker, IPopup } from "../Interfaces/MapInterfaces";
import FormUtilities from "../Utilities/FormUtilities";
import HttpService from "../Utilities/HttpService";
import MapUtilities from "../Utilities/MapUtilities";
interface IState {
  centerLat: number;
  centerLng: number;
  markers: IMarker[] | null;
  zoom: number;
}

const mapStyle = {
  height: "100vh"
};
const popupFormStyle = {
  width: "200px"
};

export default class SimpleMap extends Component<{}, IState> {
  public leafletMap: IMap | null = null;
  constructor(props: any) {
    super(props);
    this.state = {
      centerLat: 61.944069,
      centerLng: 28.81044,
      markers: null,
      zoom: 15
    };
  }

  public componentDidMount() {
    console.log(this.leafletMap);
    HttpService.getMarkersFromDatabase().then((markers) =>
      this.setState({ markers })
    );
  }
  public setLeafletMapRef = (map: any) =>
    (this.leafletMap = map && map.leafletElement)
  public render() {
    const centerPos: [number, number] = [
      this.state.centerLat,
      this.state.centerLng
    ];
    let markers = null;
    if (this.state.markers) {
      markers = this.state.markers.map(this.mapMarkerDataToElement);
    }
    return (
      <Map
        ref={this.setLeafletMapRef}
        center={centerPos}
        zoom={this.state.zoom}
        style={mapStyle}
        onClick={this.handleClick}
      >
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers}
      </Map>
    );
  }

  private closePopup = () => {
    if (this.leafletMap !== null) {
      this.leafletMap.closePopup();
    }
  }

  private handleSaveForm = (e: SyntheticEvent, marker: IMarker) => {
    e.preventDefault();
    HttpService.postMarker(marker);
    this.closePopup();
  }

  private handleRadioChange = (fishingSpotGrade: number, markerId: string) => {
    if (this.state.markers) {
      const existingMarkerIndex = _.findIndex(
        this.state.markers,
        (marker) => marker.markerId === markerId
      );
      if (existingMarkerIndex !== -1) {
        const markerWithNewGrade = FormUtilities.changeFishSpotGrade(
          this.state.markers[existingMarkerIndex],
          fishingSpotGrade
        );
        if (markerWithNewGrade) {
          _.remove(this.state.markers, (marker) => marker.markerId === markerId);
          const newMarkers = [...this.state.markers];
          newMarkers.push(markerWithNewGrade);
          this.setState({ markers: newMarkers });
        }
      }
    }
  }

  private handleCheckBoxChange = (fishName: string, markerId: string) => {
    if (this.state.markers) {
      const existingMarkerIndex = _.findIndex(
        this.state.markers,
        (marker) => marker.markerId === markerId
      );
      if (existingMarkerIndex !== -1) {
        const markerWithNewFishes = FormUtilities.getAvailableFishes(
          this.state.markers[existingMarkerIndex],
          fishName
        );
        if (markerWithNewFishes) {
          _.remove(this.state.markers, (marker) => marker.markerId === markerId);
          const newMarkers = [...this.state.markers];
          newMarkers.push(markerWithNewFishes);
          this.setState({ markers: newMarkers });
        }
      }
    }
  }
  private handleMarkerRemove = (markerId: string) => {
    HttpService.deleteMarker(markerId).then((response) => {
      if (this.state.markers) {
        _.remove(
          this.state.markers,
          (marker: IMarker) => marker.markerId === response
        );
        const remainingMarkers = [...this.state.markers];
        this.closePopup();
        this.setState({ markers: remainingMarkers });
      }
    });
  }
  private handleClick = (e: LeafletMouseEvent) => {
    const newPopup: IPopup = { availableFishes: [], spotGrade: 0 };
    const newMarker = MapUtilities.CreateMarkerFromClickEvent(e, newPopup);
    const markers = [];
    if (this.state.markers) {
      markers.push(...this.state.markers);
    }
    markers.push(newMarker);
    this.setState({ markers });
  }

  private mapMarkerDataToElement = (marker: IMarker, markerIndex: number) => {
    return (
      <Marker key={markerIndex} position={[marker.lat, marker.lng]}>
        <Popup>
          <form
            onSubmit={(e) => this.handleSaveForm(e, marker)}
            style={popupFormStyle}
          >
            <FormGroup>
              <ControlLabel>Kalalajit</ControlLabel>
              <FormGroup>
                {FishNames.map((name, nameIndex) => {
                  return (
                    <Checkbox
                      onChange={() =>
                        this.handleCheckBoxChange(name, marker.markerId)
                      }
                      checked={FormUtilities.fishExistsInMarker(marker, name)}
                      key={nameIndex}
                    >
                      {name}
                    </Checkbox>
                  );
                })}
              </FormGroup>
              <ControlLabel>Arvosana</ControlLabel>
              <FormGroup>
                <Radio
                  value="0"
                  checked={marker.popupData.spotGrade === 0}
                  name="radioGroup"
                  onChange={() => this.handleRadioChange(0, marker.markerId)}
                >
                  Huono
                </Radio>
                <Radio
                  value="1"
                  checked={marker.popupData.spotGrade === 1}
                  name="radioGroup"
                  onChange={() => this.handleRadioChange(1, marker.markerId)}
                >
                  Hyvä
                </Radio>
                <Radio
                  value="2"
                  checked={marker.popupData.spotGrade === 2}
                  name="radioGroup"
                  onChange={() => this.handleRadioChange(2, marker.markerId)}
                >
                  Kala hyppää veneeseen
                </Radio>
              </FormGroup>
            </FormGroup>
            <Button type="submit">Tallenna</Button>
            <Button
              style={{ float: "right" }}
              onClick={() => this.handleMarkerRemove(marker.markerId)}
            >
              Poista
            </Button>
          </form>
        </Popup>
      </Marker>
    );
  }
}
