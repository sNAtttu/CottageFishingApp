import { LeafletMouseEvent } from "leaflet";
import { IMarker, IPopup } from "../Interfaces/MapInterfaces";

export default class MapUtilities {
  public static CreateMarkerFromClickEvent(
    e: LeafletMouseEvent,
    popupData: IPopup,
  ): IMarker {
    const { lat, lng } = e.latlng;
    const newMarker: IMarker = {
      lat,
      lng,
      popupData,
    };
    return newMarker;
  }
}
