import {IcoSphereGeometry} from "../../utils/icosphere-geometry";

/*
 Shader imports
 */
const sunFrag = require('raw-loader!glslify-loader!./shaders/sun.frag');
const sunVert = require('raw-loader!glslify-loader!./shaders/sun.vert');

export default class Sun {
  private _sunGeometry: IcoSphereGeometry;
  private _mesh: THREE.Mesh;
  private _uniforms: any;
  private _shader: THREE.ShaderMaterial;
  private _renderTarget: THREE.WebGLRenderTarget;

  constructor(private _renderer: THREE.WebGLRenderer, private _camera: THREE.Camera, private _scene: THREE.Scene) {
    this._sunGeometry = new IcoSphereGeometry(6.0, 1);

    this._uniforms = { time: { type: 'f', value: 0.0 } };
    this._shader = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader: sunVert,
      fragmentShader: sunFrag,
      blending: THREE.AdditiveBlending
    });
    this._shader.needsUpdate = true;

    this._mesh = new THREE.Mesh(this._sunGeometry.geometry, this._shader);
    this._mesh.position.set(20, 20, 20);
    this._scene.add(this._mesh);
  }

  public update(time: number) {
    this._uniforms.time.value = time;
  }

  get texture(): THREE.Texture { return this._renderTarget.texture; }

}