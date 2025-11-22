import * as THREE from "three";

export function createSideGlass1({ floor1Width, floor1Height, wallHeight }) {
  const group = new THREE.Object3D();

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    ior: 1.7,
    thickness: 0.5,
    transmission: 1,
    side: THREE.DoubleSide,
  });

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

  // === 오른쪽 유리 ===
  const glassGeo = new THREE.PlaneGeometry(floor1Height, wallHeight);
  const glassRight = new THREE.Mesh(glassGeo, glassMat);
  glassRight.position.set(floor1Width / 2, wallHeight / 2, 0);
  glassRight.rotation.y = Math.PI * 0.5;

  // 가로 프레임 3개
  const horizGeo = new THREE.BoxGeometry(floor1Height, 0.3, 0.3);
  const horizMesh = new THREE.Mesh(horizGeo, frameMat);
  const horizObj = new THREE.Object3D();
  horizObj.add(horizMesh);

  for (let i = 0; i < 3; i++) {
    const bar = horizObj.clone(true);
    bar.position.set(0, wallHeight / 2 - (wallHeight / 2) * i, 0);
    glassRight.add(bar);
  }

  // 세로 프레임 6개
  const vertGeo = new THREE.BoxGeometry(0.3, wallHeight, 0.3);
  const vertMesh = new THREE.Mesh(vertGeo, frameMat);
  const vertObj = new THREE.Object3D();
  vertObj.add(vertMesh);

  for (let i = 0; i < 6; i++) {
    const bar = vertObj.clone(true);
    bar.position.set(floor1Height / 2 - (floor1Height / 5) * i, 0, 0);
    glassRight.add(bar);
  }

  // floor_1_side_glass 역할
  const rightGroup = new THREE.Object3D();
  rightGroup.add(glassRight);
  group.add(rightGroup);

  // === 왼쪽 유리 (원래: tmp_copy.position.x = -floor_1_width) ===
  const leftGroup = rightGroup.clone(true);
  leftGroup.position.x = -floor1Width;
  group.add(leftGroup);

  return group;
}
