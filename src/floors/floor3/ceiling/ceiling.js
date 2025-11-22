import * as THREE from "three";

export function createCeiling3({ floorWidth, floorHeight, floor3Height }) {
  const group = new THREE.Object3D();

  // 심플하게 3층 전체를 덮는 천장 한 장
  const geo = new THREE.PlaneGeometry(floorWidth, floorHeight);
  const mat = new THREE.MeshBasicMaterial({ color: 0xc9c9c0 });
  const mesh = new THREE.Mesh(geo, mat);

  mesh.rotation.x = -1.5 * Math.PI;
  mesh.position.set(0, floor3Height - 0.01, 0); // 원래 코드와 비슷한 높이

  group.add(mesh);
  return group;
}
