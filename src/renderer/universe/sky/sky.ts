/*
 Shader imports
 */
const skyFrag = require('raw-loader!glslify-loader!./shaders/sky.frag');
const skyVert = require('raw-loader!glslify-loader!./shaders/sky.vert');

export default class Sky {
  private _fboScene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _renderTarget: THREE.WebGLRenderTarget;
  private _shader: THREE.ShaderMaterial;
  private _uniforms: any;

  constructor(private _renderer: THREE.WebGLRenderer) {
    this._camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this._camera.position.z = 1;

    this._renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    });

    this._uniforms = { time: { type: 'f', value: 0.0 } };
    this._shader = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader: skyVert,
      fragmentShader: skyFrag,
      blending: THREE.AdditiveBlending
    });
    this._shader.needsUpdate = true;

    this._fboScene = new THREE.Scene();
    let geometry = new THREE.PlaneGeometry(4, 4, 40, 40);
    let plane = new THREE.Mesh( geometry, this._shader );
    this._fboScene.add( plane );
  }

  public render(time: number) {
    this._uniforms.time.value = time;
    this._renderer.render(this._fboScene, this._camera, this._renderTarget);
  }

  get texture(): THREE.Texture { return this._renderTarget.texture; }
}