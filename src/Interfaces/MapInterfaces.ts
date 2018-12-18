export interface IPopup {
  explanation: string;
}

export interface IMarker {
  markerId: string;
  lat: number;
  lng: number;
  popupData: IPopup;
}
