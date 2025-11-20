import * as THREE from "three";

/**
 * 계단 옆 유리 파티션(양쪽 통로를 둘러싸는 유리벽)
 * 원본: stare_side + 배치 루프
 */
export function createStairGlass({
  height2f, // height_2f
  floorSize, // floor_size
}) {
  const group = new THREE.Object3D();

  const tableLegHeight = 3;
  const stareGlaceSize = 8;
  const glaceHandleSize = 0.25;
  const distanceAdjust = 13;

  // 유리 한 세트(stare_side) 만들기
  const stareSide = new THREE.Object3D();

  // 메인 유리판
  const glassGeo = new THREE.PlaneGeometry(
    stareGlaceSize,
    (tableLegHeight / 3) * 7
  );
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    ior: 1.4,
    thickness: 0.2,
    transmission: 1,
    side: THREE.DoubleSide,
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(0, tableLegHeight / 2, 0);
  stareSide.add(glass);

  // 손잡이(수평 원통)
  const handleGeo = new THREE.CylinderGeometry(
    glaceHandleSize,
    glaceHandleSize,
    stareGlaceSize,
    50
  );
  const handleMat = new THREE.MeshPhysicalMaterial({
    color: 0xd1d1d1,
    emissive: 0x999999,
    roughness: 1,
    metalness: 1,
    clearcoat: 0.22,
  });
  const handle = new THREE.Mesh(handleGeo, handleMat);
  handle.rotation.z = Math.PI * 0.5;
  handle.position.set(0, (tableLegHeight / 3) * 4, 1);
  stareSide.add(handle);

  // 양쪽 세로 프레임
  const sideGeo = new THREE.BoxGeometry(
    glaceHandleSize,
    (tableLegHeight / 3) * 7,
    glaceHandleSize
  );
  const side1 = new THREE.Mesh(sideGeo, handleMat);
  const side2 = new THREE.Mesh(sideGeo, handleMat);
  side1.position.set(stareGlaceSize / 2, (tableLegHeight / 12) * 7, 0);
  side2.position.set(-stareGlaceSize / 2, (tableLegHeight / 12) * 7, 0);
  stareSide.add(side1);
  stareSide.add(side2);

  // 위쪽 가로 프레임 2개
  const topGeo = new THREE.BoxGeometry(glaceHandleSize, 1, glaceHandleSize);
  const top1 = new THREE.Mesh(topGeo, handleMat);
  const top2 = new THREE.Mesh(topGeo, handleMat);
  top1.position.set(-stareGlaceSize / 2, (tableLegHeight / 3) * 4, 0.5);
  top2.position.set(stareGlaceSize / 2, (tableLegHeight / 3) * 4, 0.5);
  top1.rotation.x = Math.PI * 0.5;
  top2.rotation.x = Math.PI * 0.5;
  stareSide.add(top1);
  stareSide.add(top2);

  // === 배치 ===
  // z 기준: -floor_size * 6 / 5 + stare_glace_size * 3, -floor_size * 6 / 5, ...
  const baseZ1 = -floorSize * (6 / 5) + stareGlaceSize * 3;
  const baseZ2 = -floorSize * (6 / 5);
  const baseZ3 = -floorSize * (6 / 5) + stareGlaceSize / 2;

  for (let j = 0; j < 2; j++) {
    const dir = Math.pow(-1, j);

    // 앞쪽 긴 라인
    for (let i = 0; i < 8; i++) {
      const s = stareSide.clone(true);
      s.position.set(
        dir * (floorSize + distanceAdjust + i * stareGlaceSize),
        0,
        baseZ1
      );
      group.add(s);
    }

    // 뒤쪽 긴 라인 (180도 뒤집은 것)
    for (let i = 0; i < 8; i++) {
      const s = stareSide.clone(true);
      s.rotation.y = Math.PI;
      s.position.set(
        dir * (floorSize + distanceAdjust + i * stareGlaceSize),
        0,
        baseZ2
      );
      group.add(s);
    }

    // 옆면 3개
    for (let i = 0; i < 3; i++) {
      const s = stareSide.clone(true);
      if (j) s.rotation.y = Math.PI * 0.5;
      else s.rotation.y = -Math.PI * 0.5;

      s.position.set(
        dir * (floorSize + distanceAdjust - stareGlaceSize / 2),
        0,
        baseZ3 + i * stareGlaceSize
      );
      group.add(s);
    }
  }

  return group;
}
