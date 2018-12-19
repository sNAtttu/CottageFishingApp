import { IMarker } from "../Interfaces/MapInterfaces";
export default class HttpService {
  public static async getMarkersFromDatabase(): Promise<IMarker[]> {
    const markers: IMarker[] = await fetch(this.backendUrl + this.deckEndpoint)
      .then((resp) => resp.json())
      .then((data: IMarker[]) => data);
    return markers;
  }
  public static async postDraftDeck(markerData: IMarker) {
    fetch(this.backendUrl + this.deckEndpoint, {
      body: JSON.stringify(markerData), // body data type must match "Content-Type" header
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      method: "POST"
    }).then((response) => console.log(response));
  }
  private static readonly backendUrl: string = "http://localhost:3001/";
  private static readonly deckEndpoint: string = "markers/";
}
