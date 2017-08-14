import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

export class PlanetSettings {
  id: number;
  planetRadius: number = 10.0;
  planetSeed: number = 1.0;
  planetAmplitude: number = 1.0;
  planetFrequency: number = 1.0;
  oceanLevel: number = 9.0;
  planetTemperature: number = 10.0;
  cloudCount: BehaviorSubject<number> = new BehaviorSubject(10);

  constructor(id: number) {
    this.id = id;
  }
}

@Injectable()
export class SettingsService {
  private _planetsSettings: PlanetSettings[];

  constructor() {
    this._planetsSettings = [];
  }

  public getPlanetSettings(index: number) {
    return this._planetsSettings[index];
  }

  public addPlanet(): PlanetSettings {
    let newPlanet = new PlanetSettings(this._planetsSettings.length);
    this._planetsSettings.push(newPlanet);
    return newPlanet;
  }
}