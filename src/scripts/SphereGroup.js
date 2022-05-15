import {
  Group,
  BufferGeometry,
  Float32BufferAttribute,
  PointsMaterial,
  Points,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Mesh,
  Sphere,
  MeshStandardMaterial,
  MeshNormalMaterial,
} from 'three';

const POINTS = false;
const WIRE = false;
const TIMER_LABEL = `[SphereSectionGeometry.constructor]`;

export class SphereSectionGroup extends Group {
  /**
   *
   * @param {number} segments The number of segments along each edge of each corner section.
   * @param {number} radius The radius of the resulting sphere.
   */
  constructor(segments = 4, radius = 1) {
    super();

    const pointsMaterial = new PointsMaterial({
      vertexColors: true,
      size: 0.125,
    });

    const wireMaterial = new MeshBasicMaterial({
      color: 0xdddddd,
      vertexColors: false,
      wireframe: true,
    });

    const solidMaterial = new MeshPhongMaterial({
      vertexColors: true,
    });

    /** @type {Array<SphereSectionGeometry>} An array containing the SphereSectionGeometry objects that constitute the group */
    this.sections = Array(8);

    const wireframes = Array(8);

    for (let i = 0; i < 8; i++) {
      const geometry = new SphereSectionGeometry(i, segments, radius);
      this.sections[i] = geometry;
      this.add(new Mesh(geometry, solidMaterial));
      this.add(new Mesh(geometry, wireMaterial));
    }
  }
}

export class SphereSectionGeometry extends BufferGeometry {
  /**
   *
   * @param {number} index The index of the corner being created (0..7).
   * @param {number} segments The number of segments along each edge of the corner section.
   */
  constructor(index = 0, segments = 4, radius = 1) {
    console.time(TIMER_LABEL);

    super();

    if (
      index == null ||
      Number.isNaN(index) ||
      !Number.isInteger(index) ||
      index < 0 ||
      index > 7
    ) {
      throw new Error(
        `[SphereSectionGeometry.constructor] Parameter \`index\` was undefined, null, or out of range.  The supplied value was ${index}.  The supported range is { index ∈ N : (0..7) }.`
      );
    }

    if (
      segments == null ||
      Number.isNaN(segments) ||
      !Number.isInteger(segments) ||
      segments < 1 ||
      index > 147
    ) {
      throw new Error(
        `[SphereSectionGeometry.constructor] Parameter \`segments\` was undefined, null, or out of range.  The supplied value was ${segments}.  The supported range is { segments ∈ N : (1..147) }.`
      );
    }

    /** @type {number} The octant index of the section */
    this.index = index;
    /** @type {number} The number of segments that the octant was initialized with */
    this.segments = segments;

    /** @type Array<number> A vector that maps the scaling of the section's vertices, based on the octant that the section occupies */
    const scaleVector = [
      (index & 4) === 4 ? -1 : 1,
      (index & 2) === 2 ? -1 : 1,
      (index & 1) === 1 ? -1 : 1,
    ];
    console.log(this.scaleVector);

    if (
      segments == null ||
      Number.isNaN(segments) ||
      !Number.isInteger(segments) ||
      segments <= 0
    ) {
      throw new Error(
        `[SphereSectionGeometry.constructor] Parameter \`radius\` was undefined, null, or out of range.  The supplied value was ${radius}.  The supported range is { radius ∈ N : [0..Number.MAX_VALUE) }.`
      );
    }

    /** @type {number} */
    const vertexCount = 3 * (segments * segments) + 3 * segments + 1;
    /** @type {number} */
    const triangleCount = 2 * 3 * (segments * segments);
    /** @type {Array<number>} */
    const vertices = Array(vertexCount * 3);
    /** @type {Array<number>} */
    const normals = Array(vertexCount * 3);
    /** @type {Array<number>} */
    const colors = Array(vertexCount * 3);
    /** @type {Array<number>} */
    const uvs = Array(vertexCount * 2);
    /** @type {Array<number>} */
    const sizes = Array(vertexCount);
    /** @type {Array<number>} */
    const triangles = Array(triangleCount);

    let vertexIndex = 0;
    let triangleIndex = 0;

    const invertNormal = [1, 2, 4, 7].indexOf(index) >= 0 ? -1 : 1;
    console.log(`Index: ${index}, invertNormal: ${invertNormal}`)

    const setVertex = (i, x, y, z, r = 1, g = 1, b = 1) => {
      const vertexOffset = i * 3;
      // const d = 1 / (segments * radius);
      const d = 1 / segments;
      // s.x = vec.x * Math.sqrt(1.0 - ySq / 2.0 - zSq / 2.0 + (ySq * zSq) / 3.0);
      // s.y = vec.y * Math.sqrt(1.0 - xSq / 2.0 - zSq / 2.0 + (xSq * zSq) / 3.0);
      // s.z = vec.z * Math.sqrt(1.0 - xSq / 2.0 - ySq / 2.0 + (xSq * ySq) / 3.0);

      x = x * d;
      y = y * d;
      z = z * d;
      const xSq = x * x;
      const ySq = y * y;
      const zSq = z * z;
      const s = [
        x * Math.sqrt(1.0 - ySq / 2.0 - zSq / 2.0 + (ySq * zSq) / 3.0),
        y * Math.sqrt(1.0 - xSq / 2.0 - zSq / 2.0 + (xSq * zSq) / 3.0),
        z * Math.sqrt(1.0 - xSq / 2.0 - ySq / 2.0 + (xSq * ySq) / 3.0),
      ];
      vertices[vertexOffset + 0] = s[0] * radius * scaleVector[0];
      vertices[vertexOffset + 1] = s[1] * radius * scaleVector[1];
      vertices[vertexOffset + 2] = s[2] * radius * scaleVector[2];
      normals[vertexOffset + 0] = s[0] * scaleVector[0];
      normals[vertexOffset + 1] = s[1] * scaleVector[1];
      normals[vertexOffset + 2] = s[2] * scaleVector[2];
      colors[vertexOffset + 0] = r;
      colors[vertexOffset + 1] = g;
      colors[vertexOffset + 2] = b;
      sizes[vertexOffset] = 1 / (2 * segments);
    };

    const createQuad = (i, v00, v10, v01, v11, debug = 3) => {
      const triangleOffset = i * 3;
      let trianglesAdded = 0;
      if ((debug & 1) === 1) {
        triangles[triangleOffset + 0] = v00;
        triangles[triangleOffset + 1] = invertNormal > 0 ? v01 : v10;
        triangles[triangleOffset + 2] = invertNormal > 0 ? v10 : v01;
        trianglesAdded += 1;
      }

      if ((debug & 2) === 2) {
        triangles[triangleOffset + 3] = v10;
        triangles[triangleOffset + 4] = invertNormal > 0 ? v01 : v11;
        triangles[triangleOffset + 5] = invertNormal > 0 ? v11 : v01;
        trianglesAdded += 1;
      }

      return trianglesAdded;
    };

    // helper variables
    const sPlusOneSq = (segments + 1) * (segments + 1);

    // x side (with normal (1, 0, 0) for section 0)
    for (let iz = segments; iz >= 0; iz--) {
      for (let iy = segments; iy >= 0; iy--, vertexIndex++) {
        setVertex(vertexIndex, segments, iy, iz, 0.5, 0, 0);
        if (iz > 0 && iy > 0) {
          triangleIndex += createQuad(
            triangleIndex,
            vertexIndex + segments + 1,
            vertexIndex + segments + 2,
            vertexIndex,
            vertexIndex + 1
          );
        }
      }
    }

    // y side (with normal (0, 1, 0) for section 0)
    // note the change to segments - 1, because that edge has already been built
    for (let iz = segments; iz >= 0; iz -= 1) {
      for (let ix = segments - 1; ix >= 0; ix--, vertexIndex++) {
        setVertex(vertexIndex, ix, segments, iz, 0, 0.5, 0);
        // first ring (shared between x and y sides)
        if (ix === segments - 1 && iz > 0) {
          const v00 = vertexIndex;
          const v10 = v00 + segments;
          const v01 = vertexIndex - sPlusOneSq + (segments - iz);
          const v11 = v01 + segments + 1;
          triangleIndex += createQuad(triangleIndex, v00, v10, v01, v11);
        }

        if (iz > 0 && ix > 0) {
          triangleIndex += createQuad(
            triangleIndex,
            vertexIndex + 1,
            vertexIndex + segments + 1,
            vertexIndex,
            vertexIndex + segments
          );
        }
      }
    }

    // z side (with normal (0, 0, 1) for section 0)
    // note the changes to segments - 1, because those edges have already been built
    const firstYSideVert = vertexIndex;
    for (let iy = segments - 1; iy >= 0; iy -= 1) {
      for (let ix = segments - 1; ix >= 0; ix -= 1, vertexIndex++) {
        setVertex(vertexIndex, ix, iy, segments, 0, 0, 0.5);

        if (iy === segments - 1 && ix > 0) {
          const v00 = vertexIndex;
          const v10 = v00 + 1;
          const v01 = vertexIndex - sPlusOneSq + (segments + 1);
          const v11 = v01 + 1;
          triangleIndex += createQuad(triangleIndex, v00, v10, v01, v11);
        }

        if (ix === segments - 1) {
          // const v00 = vertexIndex - firstYSideVert + 2 * (segments - (iy + 1));
          const v00 =
            iy === segments - 1
              ? vertexIndex - sPlusOneSq + (segments + 1)
              : vertexIndex - segments;
          const v10 = segments - (iy + 1);
          const v01 = vertexIndex;
          const v11 = v10 + 1;
          triangleIndex += createQuad(triangleIndex, v00, v10, v01, v11);
        }

        if (iy > 0 && ix > 0) {
          triangleIndex += createQuad(
            triangleIndex,
            vertexIndex + 1,
            vertexIndex,
            vertexIndex + segments + 1,
            vertexIndex + segments
          );
        }
      }
    }

    this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
    this.setAttribute('color', new Float32BufferAttribute(colors, 3));
    this.setAttribute('size', new Float32BufferAttribute(sizes, 1));
    if (!POINTS) {
      this.setIndex(triangles);
    }

    console.timeEnd(TIMER_LABEL);
    console.info(
      `[SphereSectionGeometry] ${segments} segments, ${vertexCount} vertices.`
    );
  }
}
