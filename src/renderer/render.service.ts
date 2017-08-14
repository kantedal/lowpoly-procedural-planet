import {Injectable, ElementRef} from "@angular/core";
import Universe from "./universe/universe";
import {SettingsService} from "./settings.service";

@Injectable()
export class RenderService {
  private _renderer: THREE.WebGLRenderer;
  private _scene: THREE.Scene;
  private _camera: THREE.Camera;
  private _controls: THREE.TrackballControls;

  private _universe: Universe;

  constructor(public settingsService: SettingsService) {}

  public init(renderElement: ElementRef) {
    this._renderer = new THREE.WebGLRenderer({alpha: true});
    this._renderer.setClearColor( 0x000000, 0 );
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    renderElement.nativeElement.appendChild(this._renderer.domElement);

    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this._camera.position.z = 55;

    this._controls = new THREE.TrackballControls(this._camera, this._renderer.domElement);

    this._universe = new Universe(this._renderer, this._camera);

    this._universe.addPlanet(this.settingsService.addPlanet());

    this.render();
  }

  private _time = 0.0;
  private render = () => {
    requestAnimationFrame( this.render );

    //console.log(this._camera.position.distanceTo(this._planet.position) - 1.0);
    this._time += 0.002;
    this._controls.update();
    this._universe.render(this._time);
    //this._renderer.render(this._scene, this._camera);
  }
}
