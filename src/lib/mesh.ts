export type Vertex = [number, number, number];
type Face = [number, number, number];

function normalize([x, y, z]: Vertex): Vertex {
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
}

/** A connected triangular sphere, with each shared edge stored only once. */
export function createMesh() {
  const t = (1 + Math.sqrt(5)) / 2;
  const vertices: Vertex[] = [
    [-1,t,0], [1,t,0], [-1,-t,0], [1,-t,0],
    [0,-1,t], [0,1,t], [0,-1,-t], [0,1,-t],
    [t,0,-1], [t,0,1], [-t,0,-1], [-t,0,1],
  ].map(vertex => normalize(vertex as Vertex));
  let faces: Face[] = [
    [0,11,5], [0,5,1], [0,1,7], [0,7,10], [0,10,11],
    [1,5,9], [5,11,4], [11,10,2], [10,7,6], [7,1,8],
    [3,9,4], [3,4,2], [3,2,6], [3,6,8], [3,8,9],
    [4,9,5], [2,4,11], [6,2,10], [8,6,7], [9,8,1],
  ];
  for (let level = 0; level < 3; level++) {
    const midpoints = new Map<string, number>();
    const midpoint = (a: number, b: number) => {
      const key = `${Math.min(a,b)}:${Math.max(a,b)}`;
      const existing = midpoints.get(key);
      if (existing !== undefined) return existing;
      const first = vertices[a]!, second = vertices[b]!;
      const index = vertices.push(normalize([
        first[0] + second[0], first[1] + second[1], first[2] + second[2],
      ])) - 1;
      midpoints.set(key, index);
      return index;
    };
    faces = faces.flatMap(([a,b,c]): Face[] => {
      const ab = midpoint(a,b), bc = midpoint(b,c), ca = midpoint(c,a);
      return [[a,ab,ca], [b,bc,ab], [c,ca,bc], [ab,bc,ca]];
    });
  }
  const edges = new Map<string, [number, number]>();
  for (const [a,b,c] of faces) {
    for (const [first,second] of [[a,b],[b,c],[c,a]] as [number,number][]) {
      const low = Math.min(first,second), high = Math.max(first,second);
      edges.set(`${low}:${high}`, [low,high]);
    }
  }
  return { vertices, edges: [...edges.values()] };
}
