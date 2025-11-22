import * as THREE from "three";

export function createFloor3Base({ floorWidth, floorHeight }) {
  // 3층 바닥 – 단순히 전체를 덮는 Plane
  const geo = new THREE.PlaneGeometry(floorWidth, floorHeight);

  const tex = new THREE.TextureLoader().load("/imgs/2f_floor_texture.jpg");
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.repeat.set(floorWidth / 5, floorHeight / 5);

  const mat = new THREE.MeshPhongMaterial({
    map: tex,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = 1.5 * Math.PI;
  mesh.receiveShadow = true;

  return mesh;
}
