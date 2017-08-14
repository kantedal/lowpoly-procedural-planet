import {FBO} from "../../utils/fbo/fbo";

/*
 Shader imports
 */
const thresholdFrag = require('raw-loader!glslify-loader!./shaders/threshold.frag');
const thresholdVert = require('raw-loader!glslify-loader!./shaders/threshold.vert');


interface IThresholdUniforms {
  universeTexture: any;
  threshold: any;
}

export default class Threshold {
  private _fbo: FBO;
  private _thresholdShader: THREE.ShaderMaterial;
  private _uniforms: IThresholdUniforms;

  constructor(private _renderer: THREE.WebGLRenderer) {
    this._uniforms = {
      universeTexture: { type: 't', value: null },
      threshold: { type: 'f', value: 0.5 }
    };

    this._thresholdShader = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader: thresholdVert,
      fragmentShader: thresholdFrag,
      blending: THREE.AdditiveBlending
    });
    this._thresholdShader.needsUpdate = true;

    this._fbo = new FBO(window.innerWidth, window.innerHeight, _renderer, this._thresholdShader, THREE.LinearFilter)
  }

  public render(universeTexture: THREE.Texture) {
    this._uniforms.universeTexture.value = universeTexture;
    this._fbo.render();
  }

  get texture(): THREE.Texture { return this._fbo.texture; }
}