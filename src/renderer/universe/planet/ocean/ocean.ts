import {IcoSphereGeometry} from '../../../utils/icosphere-geometry';
import {PlanetSettings} from '../../../settings.service';

/*
 Shader imports
 */
const oceanFrag = require('raw-loader!glslify-loader!./shaders/ocean.frag');
const oceanVert = require('raw-loader!glslify-loader!./shaders/ocean.vert');

export default class Ocean {
  private _oceanGeometry: IcoSphereGeometry;
  private _uniforms: any;
  private _shader: THREE.ShaderMaterial;
  private _mesh: THREE.Mesh;

  constructor(private _planetSettings: PlanetSettings) {
    this._oceanGeometry = new IcoSphereGeometry(1, 4);
    this._uniforms = {
      sunPosition: { type: 'v3', value: new THREE.Vector3(10,10,10)},
      oceanLevel: { type: 'f', value: 8.0 },
      time: { type: 'f', value: 0.0 },
      planetTemperature: { type: 'f', value: _planetSettings.planetTemperature }
    };

    this._shader = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader: oceanVert,
      fragmentShader: oceanFrag,
      blending: THREE.AdditiveBlending
    });

    this._shader.needsUpdate = true;
    this._mesh = new THREE.Mesh(this._oceanGeometry.geometry, this._shader);
  }

  public update(time: number) {
    this._uniforms.time.value = time;
    this._uniforms.oceanLevel.value = this._planetSettings.oceanLevel;
    this._uniforms.planetTemperature.value = this._planetSettings.planetTemperature;
  }

  get mesh(): THREE.Mesh { return this._mesh; }
}