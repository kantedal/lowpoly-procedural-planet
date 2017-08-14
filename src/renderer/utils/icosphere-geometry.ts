
export class IcoSphereGeometry {
  private _baseFaces: Array<THREE.Face3>;
  private _geometry: THREE.Geometry;

  constructor(private _radius: number, private _detailLevel: number) {
    this._geometry = new THREE.Geometry();
    this.generateBaseGeometry();
    this.generateGeometry();
  }

  private generateBaseGeometry() {
    let t = (1.0 + Math.sqrt(5.0)) / 2.0;

    this._geometry.vertices = [];
    this.addVertex(new THREE.Vector3(-1.0,  t, 0.0));
    this.addVertex(new THREE.Vector3( 1.0,  t, 0.0));
    this.addVertex(new THREE.Vector3(-1.0, -t, 0.0));
    this.addVertex(new THREE.Vector3( 1.0, -t, 0.0));

    this.addVertex(new THREE.Vector3(0.0, -1.0,  t));
    this.addVertex(new THREE.Vector3(0.0,  1.0,  t));
    this.addVertex(new THREE.Vector3(0.0, -1.0, -t));
    this.addVertex(new THREE.Vector3(0.0,  1.0, -t));

    this.addVertex(new THREE.Vector3( t,  0.0, -1.0));
    this.addVertex(new THREE.Vector3( t,  0.0,  1.0));
    this.addVertex(new THREE.Vector3(-t,  0.0, -1.0));
    this.addVertex(new THREE.Vector3(-t,  0.0,  1.0));

    // Add faces
    this._baseFaces = [];
    this._baseFaces.push(new THREE.Face3(0, 11, 5));
    this._baseFaces.push(new THREE.Face3(0, 5, 1));
    this._baseFaces.push(new THREE.Face3(0, 1, 7));
    this._baseFaces.push(new THREE.Face3(0, 7, 10));
    this._baseFaces.push(new THREE.Face3(0, 10, 11));

    this._baseFaces.push(new THREE.Face3(1, 5, 9));
    this._baseFaces.push(new THREE.Face3(5, 11, 4));
    this._baseFaces.push(new THREE.Face3(11, 10, 2));
    this._baseFaces.push(new THREE.Face3(10, 7, 6));
    this._baseFaces.push(new THREE.Face3(7, 1, 8));

    this._baseFaces.push(new THREE.Face3(3, 9, 4));
    this._baseFaces.push(new THREE.Face3(3, 4, 2));
    this._baseFaces.push(new THREE.Face3(3, 2, 6));
    this._baseFaces.push(new THREE.Face3(3, 6, 8));
    this._baseFaces.push(new THREE.Face3(3, 8, 9));

    this._baseFaces.push(new THREE.Face3(4, 9, 5));
    this._baseFaces.push(new THREE.Face3(2, 4, 11));
    this._baseFaces.push(new THREE.Face3(6, 2, 10));
    this._baseFaces.push(new THREE.Face3(8, 6, 7));
    this._baseFaces.push(new THREE.Face3(9, 8, 1));
  }

  private generateGeometry() {
    this._geometry.faces = this._baseFaces;

    for (let i = 0; i < this._detailLevel; i++) {
      let currentFaces = [];
      for (let face of this._geometry.faces) {
        let v0 = this._geometry.vertices[face.a];
        let v1 = this._geometry.vertices[face.b];
        let v2 = this._geometry.vertices[face.c];

        let a = this.getMiddlePoint(v0, v1);
        let b = this.getMiddlePoint(v1, v2);
        let c = this.getMiddlePoint(v2, v0);

        let faces = [];
        faces.push(new THREE.Face3(face.a, a, c));
        faces.push(new THREE.Face3(face.b, b, a));
        faces.push(new THREE.Face3(face.c, c, b));
        faces.push(new THREE.Face3(a, b, c));

        let origin = new THREE.Vector3(0,0,0);
        for (let i = 0; i < 4; i++) {
          faces[i].vertexNormals[0] = origin.clone().sub(this._geometry.vertices[faces[i].a]).normalize();
          faces[i].vertexNormals[1] = origin.clone().sub(this._geometry.vertices[faces[i].b]).normalize();
          faces[i].vertexNormals[2] = origin.clone().sub(this._geometry.vertices[faces[i].c]).normalize();
        }

        currentFaces.push(faces[0]);
        currentFaces.push(faces[1]);
        currentFaces.push(faces[2]);
        currentFaces.push(faces[3]);
      }

      this._geometry.faces = currentFaces;
      this._geometry.uvsNeedUpdate = true;
      this.calculateUVs();
      this._geometry.computeFaceNormals();
    }

    for (let vertex of this._geometry.vertices) {
      vertex.multiplyScalar(this._radius);
    }
  }

  private addVertex(point: THREE.Vector3) {
    let length = Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z);
    this._geometry.vertices.push(new THREE.Vector3(point.x / length, point.y / length, point.z / length));
  }

  private getUVfromPosition(v: THREE.Vector3): THREE.Vector2 {
    let v1 = v.clone().normalize();
    return new THREE.Vector2(
      (Math.atan2(v1.y, v1.x) + Math.PI) / (2.0 * Math.PI),
      Math.atan2(Math.sqrt(v1.x * v1.x + v1.y * v1.y), v1.z) / Math.PI
    )
  }

  private calculateUVs(): void {
    this._geometry.faceVertexUvs[0] = [];

    for (let face of this._geometry.faces) {
      let v0 = this._geometry.vertices[face.a];
      let v1 = this._geometry.vertices[face.b];
      let v2 = this._geometry.vertices[face.c];

      this._geometry.faceVertexUvs[0].push([
        this.getUVfromPosition(v0),
        this.getUVfromPosition(v1),
        this.getUVfromPosition(v2)
      ])
    }
  }

  private getMiddlePoint(v1: THREE.Vector3, v2: THREE.Vector3): number {
    let direction = v2.clone().sub(v1);
    let length = direction.length();
    direction = direction.normalize();

    let mid = 0.5;
    let midPoint = v1.clone().add(direction.multiplyScalar(length * mid));

    let l = Math.sqrt(midPoint.x * midPoint.x + midPoint.y * midPoint.y + midPoint.z * midPoint.z);
    let testPoint = new THREE.Vector3(midPoint.x / l, midPoint.y / l, midPoint.z / l);

    // Search current vertices for existing point
    for (let vertIdx = 0; vertIdx < this._geometry.vertices.length; vertIdx++) {
      let vertex = this._geometry.vertices[vertIdx];
      if (vertex.x == testPoint.x && vertex.y == testPoint.y && vertex.z == testPoint.z) {
        return vertIdx;
      }
    }

    this.addVertex(midPoint);
    return this._geometry.vertices.length - 1;
  }

  get geometry(): THREE.Geometry { return this._geometry; }
}
