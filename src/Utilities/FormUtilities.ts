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

  public static getAvailableFishes(marker: IMarker, fishName: string): IMarker {
    const { popupData } = marker;
    if (this.fishExistsInMarker(marker, fishName)) {
      _.remove(
        popupData.availableFishes,
        (removedFishName) => removedFishName === fishName,
      );
      popupData.availableFishes = [...popupData.availableFishes];
    } else {
      popupData.availableFishes.push(fishName);
    }
    const newMarker = {
      ...marker,
      popupData: {
        ...marker.popupData,
        availableFishes: [...popupData.availableFishes],
      },
    };
    return newMarker;
  }
}
