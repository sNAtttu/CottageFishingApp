import _ from "lodash";
import { IMarker } from "../Interfaces/MapInterfaces";
export default class FormUtilities {
  public static fishExistsInMarker(marker: IMarker, fishName: string): boolean {
    const { popupData } = marker;
    const fishExists = popupData.availableFishes.indexOf(fishName) !== -1;
    return fishExists;
  }

  public static changeFishSpotGrade(
    marker: IMarker,
    spotGrade: number,
  ): IMarker | undefined {
    if (marker) {
      const newMarker: IMarker = {
        ...marker,
        popupData: {
          ...marker.popupData,
          spotGrade,
        },
      };
      return newMarker;
    }
  }
}
