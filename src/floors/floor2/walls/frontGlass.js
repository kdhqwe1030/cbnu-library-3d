import * as THREE from "three";

export function createFrontGlass({
  height2f,
  frontGlassSize, // front_glass_size
  pillarPosZ, // pillar_posi_2 위치에 배치
}) {
  const group = new THREE.Object3D();

  const glassGeo = new THREE.PlaneGeometry(frontGlassSize, height2f);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    ior: 1.7,
    thickness: 0.5,
    transmission: 1,
    side: THREE.DoubleSide,
  });

  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(0, height2f / 2, pillarPosZ);
  group.add(glass);

  // 격자 프레임
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const frameHGeo = new THREE.BoxGeometry(frontGlassSize, 0.3, 0.3);
  const frameVGeo = new THREE.BoxGeometry(0.3, height2f, 0.3);

  // 가로 줄 5개 (위에서 아래로)
  for (let i = 0; i < 5; i++) {
    const bar = new THREE.Mesh(frameHGeo, frameMat);
    bar.position.set(0, height2f / 2 - (height2f / 4) * i, 0);
    glass.add(bar);
  }

  // 세로 줄 6개 (좌 → 우)
  for (let i = 0; i < 6; i++) {
    const bar = new THREE.Mesh(frameVGeo, frameMat);
    bar.position.set(frontGlassSize / 2 - (frontGlassSize / 5) * i, 0, 0);
    glass.add(bar);
  }

  return group;
}
