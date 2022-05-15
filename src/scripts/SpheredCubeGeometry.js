import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';

export default class SpheredBoxGeometry extends BufferGeometry {
  constructor(radius = 1, segments = 1) {
    super();

    this.type = 'CubedSphereGeometry';

    // eslint-disable-next-line no-param-reassign
    segments = Math.max(Math.floor(segments), 1);

    this.parameters = {
      radius,
      segments,
    };

    const scope = this;

    // segments

    const cornerVertices = 8;
    const edgeVertices = 4 * (3 * segments - 3);
    const faceVertices = 6 * (segments - 1) * (segments - 1);
    const totalVertices = cornerVertices + edgeVertices + faceVertices;

    console.info(
      `Segments: ${segments}; corner verts: ${cornerVertices}; ` +
      `edge verts: ${edgeVertices}; face verts: ${faceVertices};` +
      `total verts: ${totalVertices}; vert components: ${totalVertices * 3}`
    );

    // vertices

    const vertices = Array(3 * totalVertices);
    const normals = Array(3 * totalVertices);
    const colors = Array(3 * totalVertices);
    const uvs = Array(2 * totalVertices);
    const vOne = new Vector3(1, 1, 1);

    const setVertex = (i, x, y, z) => {
      const vec = new Vector3(x / segments, y / segments, z / segments);
      vec.multiplyScalar(2.0);
      vec.sub(vOne);

      const xSq = vec.x * vec.x;
      const ySq = vec.y * vec.y;
      const zSq = vec.z * vec.z;

      const s = new Vector3();
      s.x = vec.x * Math.sqrt(1.0 - ySq / 2.0 - zSq / 2.0 + (ySq * zSq) / 3.0);
      s.y = vec.y * Math.sqrt(1.0 - xSq / 2.0 - zSq / 2.0 + (xSq * zSq) / 3.0);
      s.z = vec.z * Math.sqrt(1.0 - xSq / 2.0 - ySq / 2.0 + (xSq * ySq) / 3.0);

      normals[i] = s.x;
      normals[i + 1] = s.y;
      normals[i + 2] = s.z;

      vertices[i] = normals[i] * radius;
      vertices[i + 1] = normals[i + 1] * radius;
      vertices[i + 2] = normals[i + 2] * radius;

      const lat = Math.asin(s.y) / (Math.PI / 2) / 2 + 0.5;
      const lon = Math.atan2(s.z, -1 * s.x) / Math.PI / 2 + 0.5;

      colors[i] = lat;
      colors[i + 1] = lon;
      colors[i + 2] = 0;

      const uvIndex = (i * 2) / 3;
      uvs[uvIndex] = lon;
      uvs[uvIndex + 1] = lat;

      if (s.y == 0 && s.x > 0.95) {
        console.log([s.z, uvs[uvIndex]])
      }

      return i + 3;
    };

    let v = 0;
    for (let y = 0; y <= segments; y++) {
      for (let x = 0; x <= segments; x++) {
        v = setVertex(v, x, y, 0);
      }
      for (let z = 1; z <= segments; z++) {
        v = setVertex(v, segments, y, z);
      }
      for (let x = segments - 1; x >= 0; x--) {
        v = setVertex(v, x, y, segments);
      }
      for (let z = segments - 1; z > 0; z--) {
        v = setVertex(v, 0, y, z);
      }
    }
    for (let z = 1; z < segments; z++) {
      for (let x = 1; x < segments; x++) {
        v = setVertex(v, x, segments, z);
      }
    }
    for (let z = 1; z < segments; z++) {
      for (let x = 1; x < segments; x++) {
        v = setVertex(v, x, 0, z);
      }
    }

    // triangles

    const quads = 6 * segments * segments;
    const triangles = Array(quads * 6);
    const ringSize = segments * 4;
    let t = 0;
    let triVert = 0;

    const createQuad = (i, v00, v10, v01, v11) => {
      const quadVerts = [v00, v10, v01, v11];
      const onXZero = [];
      for (let j = 0; j < 4; j++) {
        if (vertices[quadVerts[j] * 3 + 2])
      }
      triangles[i] = v00;
      triangles[i + 1] = v01;
      triangles[i + 2] = v10;
      triangles[i + 3] = v10;
      triangles[i + 4] = v01;
      triangles[i + 5] = v11;
      return i + 6;
    };

    // side faces

    for (let y = 0; y < segments; y++, triVert++) {
      for (let q = 0; q < ringSize - 1; q++, triVert++) {
        t = createQuad(
          t,
          triVert,
          triVert + 1,
          triVert + ringSize,
          triVert + ringSize + 1
        );
      }
      t = createQuad(
        t,
        triVert,
        triVert - ringSize + 1,
        triVert + ringSize,
        triVert + 1
      );
    }

    // top faces

    let vMin;
    let vMid;
    let vMax;

    triVert = ringSize * segments;

    // top faces: first row

    for (let x = 0; x < segments - 1; x++, triVert++) {
      t = createQuad(
        t,
        triVert,
        triVert + 1,
        triVert + ringSize - 1,
        triVert + ringSize
      );
    }

    // top faces: first row: last face

    t = createQuad(
      t,
      triVert,
      triVert + 1,
      triVert + ringSize - 1,
      triVert + 2
    );

    vMin = ringSize * (segments + 1) - 1;
    vMid = vMin + 1;
    vMax = triVert + 2;

    // top faces: ring rows

    for (let z = 1; z < segments - 1; z++, vMin--, vMid++, vMax++) {
      // top faces: ring rows: first face

      t = createQuad(t, vMin, vMid, vMin - 1, vMid + segments - 1);

      // top faces: ring rows: non-first faces

      for (let x = 1; x < segments - 1; x++, vMid++) {
        t = createQuad(t, vMid, vMid + 1, vMid + segments - 1, vMid + segments);
      }
      t = createQuad(t, vMid, vMax, vMid + segments - 1, vMax + 1);
    }
    let vTop = vMin - 2;
    t = createQuad(t, vMin, vMid, vTop + 1, vTop);
    for (let x = 1; x < segments - 1; x++, vTop--, vMid++) {
      t = createQuad(t, vMid, vMid + 1, vTop, vTop - 1);
    }
    t = createQuad(t, vMid, vTop - 2, vTop, vTop - 1);

    // bottom faces

    triVert = 1;
    vMid = vertices.length / 3 - (segments - 1) * (segments - 1);
    t = createQuad(t, ringSize - 1, vMid, 0, 1);
    for (let x = 1; x < segments - 1; x++, triVert++, vMid++) {
      t = createQuad(t, vMid, vMid + 1, triVert, triVert + 1);
    }
    t = createQuad(t, vMid, triVert + 2, triVert, triVert + 1);

    vMin = ringSize - 2;
    vMid -= segments - 2;
    vMax = triVert + 2;

    for (let z = 1; z < segments - 1; z++, vMin--, vMid++, vMax++) {
      t = createQuad(t, vMin, vMid + segments - 1, vMin + 1, vMid);
      for (let x = 1; x < segments - 1; x++, vMid++) {
        t = createQuad(t, vMid + segments - 1, vMid + segments, vMid, vMid + 1);
      }
      t = createQuad(t, vMid + segments - 1, vMax + 1, vMid, vMax);
    }
    vTop = vMin - 1;
    t = createQuad(t, vTop + 1, vTop, vTop + 2, vMid);
    for (let x = 1; x < segments - 1; x++, vTop--, vMid++) {
      t = createQuad(t, vTop, vTop - 1, vMid, vMid + 1);
    }
    t = createQuad(t, vTop, vTop - 1, vMid, vTop - 2);

    // create VBOs

    this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
    this.setAttribute(
      'size',
      new Float32BufferAttribute(Array(totalVertices).fill(1))
    );
    this.setAttribute('color', new Float32BufferAttribute(colors, 3));
    this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    this.setIndex(triangles);
  }
}
