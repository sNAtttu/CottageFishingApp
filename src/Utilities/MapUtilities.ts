import { LeafletMouseEvent } from "leaflet";
import Uuid from "uuid";
import { IMarker, IPopup } from "../Interfaces/MapInterfaces";
export default class MapUtilities {
  public static CreateMarkerFromClickEvent(
    e: LeafletMouseEvent,
    popupData: IPopup,
  ): IMarker {
    const { lat, lng } = e.latlng;
    const markerId = Uuid();
    const newMarker: IMarker = {
      lat,
      lng,
      markerId,
      popupData,
    };
    console.log(newMarker);
    return newMarker;
  }
}
