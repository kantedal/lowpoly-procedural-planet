import {Component, AfterViewInit, ViewChild, ElementRef} from "@angular/core";
import {RenderService} from "../renderer/render.service";
import {SettingsService, PlanetSettings} from "../renderer/settings.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('renderArea') renderArea: ElementRef;

  private _selectedPlanet: BehaviorSubject<PlanetSettings>;

  constructor(
    private _renderService: RenderService,
    private _settingsService: SettingsService
  ) {
    this._selectedPlanet = new BehaviorSubject(new PlanetSettings(-1));
  }

  ngAfterViewInit(): void {
    this._renderService.init(this.renderArea);
    this._selectedPlanet.next(this._settingsService.getPlanetSettings(0));
  }

  planetSeedChanged(event: any) { this._selectedPlanet.value.planetSeed = event.value; }
  planetRadiusChanged(event: any) { this._selectedPlanet.value.planetRadius = event.value; }
  oceanLevelChanged(event: any) { this._selectedPlanet.value.oceanLevel = event.value; }
  planetTemperatureChanged(event: any) { this._selectedPlanet.value.planetTemperature = event.value; }
  planetFrequencyChanged(event: any) { this._selectedPlanet.value.planetFrequency = event.value; }
  planetAmplitudeChanged(event: any) { this._selectedPlanet.value.planetAmplitude = event.value; }
  cloudCountChanged(event: any) { this._selectedPlanet.value.cloudCount.next(event.value); }

}
