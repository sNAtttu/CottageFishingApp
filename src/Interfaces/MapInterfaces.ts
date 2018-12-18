export interface IPopup {
  explanation: string;
}

export interface IMarker {
  lat: number;
  lng: number;
  popupData: IPopup;
}
