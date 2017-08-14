import Planet from "./planet/planet";
import Sky from "./sky/sky";
import Composer from "./composer/composer";
import Sun from "./sun/sun";
import {PlanetSettings, SettingsService} from "../settings.service";

export default class Universe {
  private _composer: Composer;
  private _renderTarget: THREE.WebGLRenderTarget;
  private _scene: THREE.Scene;
  private _planets: Planet[];
  private _sun: Sun;
  private _sky: Sky;

  constructor(
    private _renderer: THREE.WebGLRenderer,
    private _camera: THREE.Camera
  ) {
    this._composer = new Composer(_renderer, _camera);
    this._scene = new THREE.Scene();

    this._sky = new Sky(_renderer);
    this._sun = new Sun(_renderer, _camera, this._scene);

    this._planets = [];

    this._renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    });
  }

  public addPlanet(planetSettings: PlanetSettings) {
    let newPlanet = new Planet(planetSettings);
    this._scene.add(newPlanet.planetGroup);
    this._planets.push(newPlanet);
  }

  public render(time: number) {
    this._sky.render(time);

    this._sun.update(time);

    for (let planet of this._planets) {
      planet.update(time);
    }

    this._renderer.render(this._scene, this._camera, this._renderTarget);

    this._composer.render(this._renderTarget.texture, this._sky.texture);
  }
}