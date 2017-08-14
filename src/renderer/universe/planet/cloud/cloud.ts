import {IcoSphereGeometry} from "../../../utils/icosphere-geometry";

/*
 Shader imports
 */
const cloudFrag = require('raw-loader!glslify-loader!./shaders/cloud.frag');
const cloudVert = require('raw-loader!glslify-loader!./shaders/cloud.vert');

export default class Cloud {
  private _cloudGeometry: IcoSphereGeometry;
  private _uniforms: any;
  private _shader: THREE.ShaderMaterial;
  private _cloudGroup: THREE.Group;
  private _cloudWorldGroup: THREE.Group;

  // Attibutes
  private _cloudSpeed: number;
  private _cloudScale: number;
  private _cloudHeight: number;
  private _cloudRotation: number

  constructor() {
    this._cloudSpeed = Math.random() - 0.5;
    this._cloudScale = Math.random() * 0.4 + 0.6;
    this._cloudHeight = (Math.random() * 2.0) + 11.0;
    this._cloudRotation = (Math.random() - 0.5) * 2.0 * Math.PI;

    this._cloudGeometry = new IcoSphereGeometry(1.0, 0);
    this._uniforms = {
      sunPosition: { type: 'v3', value: new THREE.Vector3(10,10,10)},
      time: { type: 'f', value: 0.0 }
    };
    this._shader = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader: cloudVert,
      fragmentShader: cloudFrag,
      blending: THREE.AdditiveBlending
    });
    this._shader.needsUpdate = true;

    let cloudMeshCount = 4;
    this._cloudGroup = new THREE.Group();
    this._cloudWorldGroup = new THREE.Group();
    for (let i = 0; i < cloudMeshCount; i++) {
      let cloudMesh = new THREE.Mesh(this._cloudGeometry.geometry, this._shader);

      let scale = Math.sin(Math.PI * (i + 0.5) / cloudMeshCount) + Math.random() * 0.3;
      cloudMesh.scale.set(scale, scale, scale);

      cloudMesh.position.set((2 - i) * 1.3, -Math.min(0.5 - scale, 0.0), 0);
      cloudMesh.rotation.set(2 * Math.PI * (Math.random() - 0.5), 2 * Math.PI * (Math.random() - 0.5), 2 * Math.PI * (Math.random() - 0.5));

      this._cloudGroup.add(cloudMesh);
      this._cloudGroup.position.set(0, this._cloudHeight, 0);
      this._cloudGroup.scale.set(this._cloudScale, this._cloudScale, this._cloudScale);
    }

    this._cloudWorldGroup.add(this._cloudGroup);
    this._cloudWorldGroup.rotation.set((Math.random() - 0.5) * 2.0 * Math.PI, (Math.random() - 0.5) * 2.0 * Math.PI, (Math.random() - 0.5) * 2.0 * Math.PI);
  }

  public update(time: number, delta: number) {
    this._uniforms.time.value = time;
    this._cloudWorldGroup.rotateZ(delta * 0.5 * this._cloudSpeed)
  }

  get cloudGroup(): THREE.Group { return this._cloudWorldGroup; }
}