import * as THREE from "three";

export function createFrontGlass1({ wallHeight, pillarPos2 }) {
  const group = new THREE.Object3D();

  // 원본 코드 기준
  const frontGlassSize = 107;
  const offsetX = 25;
  const gapX = 50;

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    ior: 1.7,
    thickness: 0.5,
    transmission: 1,
    side: THREE.DoubleSide,
  });

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

  // === 오른쪽 출입구 유리 ===
  const glassGeo = new THREE.PlaneGeometry(frontGlassSize, wallHeight);
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(
    offsetX + frontGlassSize / 2,
    wallHeight / 2,
    pillarPos2 // 원래: front_glass3.position.z = pillar_posi_2
  );

  // 가로 프레임 3개
  const horizGeo = new THREE.BoxGeometry(frontGlassSize, 0.3, 0.3);
  const horizMesh = new THREE.Mesh(horizGeo, frameMat);
  const horizObj = new THREE.Object3D();
  horizObj.add(horizMesh);

  for (let i = 0; i < 3; i++) {
    const bar = horizObj.clone(true);
    bar.position.set(0, wallHeight / 2 - (wallHeight / 2) * i, 0);
    glass.add(bar);
  }

  // 세로 프레임 11개
  const vertGeo = new THREE.BoxGeometry(0.3, wallHeight, 0.3);
  const vertMesh = new THREE.Mesh(vertGeo, frameMat);
  const vertObj = new THREE.Object3D();
  vertObj.add(vertMesh);

  for (let i = 0; i < 11; i++) {
    const bar = vertObj.clone(true);
    bar.position.set(frontGlassSize / 2 - (frontGlassSize / 10) * i, 0, 0);
    glass.add(bar);
  }

  const frontRight = new THREE.Object3D();
  frontRight.add(glass);
  group.add(frontRight);

  // === 왼쪽 출입구 유리 세트 복제 (원래: tmp_copy.position.x = -floor_1_front_glass_size - 50) ===
  const frontLeft = frontRight.clone(true);
  frontLeft.position.x = -frontGlassSize - gapX;
  group.add(frontLeft);

  return group;
}
