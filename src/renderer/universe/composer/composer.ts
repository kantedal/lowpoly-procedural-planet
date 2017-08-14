import {FBO} from "../../utils/fbo/fbo";
import Threshold from "../../utils/threshold/threshold";
import Blur from "../../utils/blur/blur";

/*
 Shader imports
 */
const composerFrag = require('raw-loader!glslify-loader!./shaders/composer.frag');
const composerVert = require('raw-loader!glslify-loader!./shaders/composer.vert');


interface IComposerUniforms {
  universeTexture: any;
  glowTexture: any;
  skyTexture: any;
}

export default class Composer {
  private _fbo: FBO;
  private _composerShader: THREE.ShaderMaterial;
  private _uniforms: IComposerUniforms;
  private _thresholdPass: Threshold;
  private _blurPass: Blur;

  constructor(private _renderer: THREE.WebGLRenderer, private _camera: THREE.Camera) {
    this._uniforms = {
      universeTexture: { type: 't', value: null },
      glowTexture: { type: 't', value: null },
      skyTexture: { type: 't', value: null }
    };

    this._composerShader = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader: composerVert,
      fragmentShader: composerFrag,
      blending: THREE.AdditiveBlending
    });
    this._composerShader.needsUpdate = true;

    this._fbo = new FBO(window.innerWidth, window.innerHeight, _renderer, this._composerShader);

    this._thresholdPass = new Threshold(_renderer);
    this._blurPass = new Blur(_renderer, _camera, 10);
  }

  public render(universeTexture: THREE.Texture, skyTexture: THREE.Texture) {
    this._thresholdPass.render(universeTexture);

    this._uniforms.glowTexture.value = this._blurPass.blurThisPlease(this._thresholdPass.texture, 5);
    this._uniforms.universeTexture.value = universeTexture;
    this._uniforms.skyTexture.value = skyTexture;
    this._fbo.renderToViewport();
  }
}