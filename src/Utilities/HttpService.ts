import { IMarker } from "../Interfaces/MapInterfaces";
export default class HttpService {
  public static async getMarkersFromDatabase(): Promise<IMarker[]> {
    const markers: IMarker[] = await fetch(
      this.backendUrl + this.markerEndPoint
    )
      .then((resp) => resp.json())
      .then((data: IMarker[]) => data);
    return markers;
  }
  public static async postMarker(markerData: IMarker) {
    fetch(this.backendUrl + this.markerEndPoint, {
      body: JSON.stringify(markerData), // body data type must match "Content-Type" header
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      method: "POST"
    }).then((response) => console.log(response));
  }
  public static async deleteMarker(markerId: string): Promise<string> {
    try {
      return await fetch(this.backendUrl + this.markerEndPoint + markerId, {
        method: "DELETE"
      })
        .then((response: Response) => response.text())
        .then((responseText) => responseText);
    } catch (e) {
      throw e;
    }
  }
  private static readonly backendUrl: string = "http://localhost:3001/";
  private static readonly markerEndPoint: string = "markers/";
}
