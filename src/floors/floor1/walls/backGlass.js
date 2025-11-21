import * as THREE from "three";

export function createBackGlass1({ floor1Width, wallHeight, pillarPos2 }) {
  const group = new THREE.Object3D();

  // 1층 후면 유리는 z = -pillarPos2 (원래 코드: -pillar_posi_2)
  const backZ = -pillarPos2;

  // 유리 재질
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    ior: 1.7,
    thickness: 0.5,
    transmission: 1,
    side: THREE.DoubleSide,
  });

  // 프레임 재질
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

  // 유리 본체
  const glassGeo = new THREE.PlaneGeometry(floor1Width, wallHeight);
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(0, wallHeight / 2, backZ);

  // 가로 프레임 (위/중간/아래 3줄)
  const horizGeo = new THREE.BoxGeometry(floor1Width, 0.3, 0.3);
  const horizMesh = new THREE.Mesh(horizGeo, frameMat);
  const horizObj = new THREE.Object3D();
  horizObj.add(horizMesh);

  for (let i = 0; i < 3; i++) {
    const bar = horizObj.clone(true);
    bar.position.set(0, wallHeight / 2 - (wallHeight / 2) * i, 0);
    glass.add(bar);
  }

  // 세로 프레임 (원래 16개)
  const vertGeo = new THREE.BoxGeometry(0.3, wallHeight, 0.3);
  const vertMesh = new THREE.Mesh(vertGeo, frameMat);
  const vertObj = new THREE.Object3D();
  vertObj.add(vertMesh);

  for (let i = 0; i < 16; i++) {
    const bar = vertObj.clone(true);
    bar.position.set(floor1Width / 2 - (floor1Width / 15) * i, 0, 0);
    glass.add(bar);
  }

  group.add(glass);
  return group;
}
