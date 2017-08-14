import {IcoSphereGeometry} from "../../../utils/icosphere-geometry";

/*
 Shader imports
 */
const treeFrag = require('raw-loader!glslify-loader!./shaders/tree.frag');
const treeVert = require('raw-loader!glslify-loader!./shaders/tree.vert');

export default class Tree {
  private _treeGeometry: IcoSphereGeometry;
  private _stemGeometry: THREE.CylinderGeometry;
  private _treeGroup: THREE.Group;
  private _uniforms: any;
  private _shader: any;

  constructor() {

  }
}