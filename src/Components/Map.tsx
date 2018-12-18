import { LeafletMouseEvent } from "leaflet";
import React, { Component, createRef } from "react";
import { render } from "react-dom";
import { LeafletEvents, Map, Marker, Popup, TileLayer } from "react-leaflet";
import { IMarker, IPopup } from "../Interfaces/MapInterfaces";
import MapUtilities from "../Utilities/MapUtilities";

interface IState {
  centerLat: number;
  centerLng: number;
  markers: IMarker[] | null;
  zoom: number;
}

const mapStyle = {
  height: "100vh",
};

export default class SimpleMap extends Component<{}, IState> {
  public mapRef = createRef<Map>();
  constructor(props: any) {
    super(props);
    this.state = {
      centerLat: 61.944069,
      centerLng: 28.81044,
      markers: null,
      zoom: 15,
    };
  }

  public handleClick = (e: LeafletMouseEvent) => {
    const newPopup: IPopup = { explanation: "Test" };
    const newMarker = MapUtilities.CreateMarkerFromClickEvent(e, newPopup);
    const markers = [];
    if (this.state.markers) {
      markers.push(...this.state.markers);
    }
    markers.push(newMarker);
    this.setState({ markers });
  }

  public render() {
    const centerPos: [number, number] = [
      this.state.centerLat,
      this.state.centerLng,
    ];
    let markers = null;
    if (this.state.markers) {
      markers = this.state.markers.map((marker, index) => {
        return (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            <Popup>{marker.popupData.explanation}</Popup>
          </Marker>
        );
      });
    }
    return (
      <Map
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
}
