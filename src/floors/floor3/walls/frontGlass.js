import * as THREE from "three";

export function createFrontGlass3({
  floorSize,
  floorWidth,
  floorHeight,
  wallHeight,
  distanceAdjust = 13,
}) {
  const group = new THREE.Object3D();

  const frontGlassSize = 50; // 원래 front_glass_size
  const stairGlassSize = 8; // 원래 stare_glace_size

  // 원래 pillar_posi_2 = -floor_size * 12/5 + stare_glace_size * 3;
  const pillarPos2 = -floorSize * (12 / 5) + stairGlassSize * 3; // z 위치

  // ===== 유리 재질(2층 window_glace_mat와 동일 컨셉) =====
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    ior: 1.7,
    thickness: 0.5,
    transmission: 1,
    side: THREE.DoubleSide,
  });

  // ===== 정면 유리 =====
  const glassGeo = new THREE.PlaneGeometry(frontGlassSize, wallHeight);
  const frontGlass = new THREE.Mesh(glassGeo, glassMat);
  frontGlass.position.set(0, wallHeight / 2, pillarPos2);

  // 가로 프레임
  const frameHGeo = new THREE.BoxGeometry(frontGlassSize, 0.3, 0.3);
  const frameVGeo = new THREE.BoxGeometry(0.3, wallHeight, 0.3);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

  const frameHObj = new THREE.Mesh(frameHGeo, frameMat);
  const frameVObj = new THREE.Mesh(frameVGeo, frameMat);

  const frameH = new THREE.Object3D();
  frameH.add(frameHObj);

  const frameV = new THREE.Object3D();
  frameV.add(frameVObj);

  // 세로 방향으로 5줄 (원 코드: i=0..4)
  for (let i = 0; i < 5; i++) {
    const f = frameH.clone(true);
    f.position.set(0, wallHeight / 2 - (wallHeight / 4) * i, 0);
    frontGlass.add(f);
  }

  // 가로 방향으로 6줄 (원 코드와 거의 유사하게 분할)
  for (let i = 0; i < 6; i++) {
    const f = frameV.clone(true);
    f.position.set(frontGlassSize / 2 - (frontGlassSize / 5) * i, 0, 0);
    frontGlass.add(f);
  }

  group.add(frontGlass);

  // ===== 정면 유리와 기둥 사이의 미니 벽 2개 (원래 miniwall_obj / miniwall_obj2) =====
  // 원래 miniwall_size = -floor_height/2 + floor_size * 12/5 - stare_glace_size * 3;
  const pillarSize = 4;
  const miniwallSize =
    -floorHeight / 2 + floorSize * (12 / 5) - stairGlassSize * 3;

  const whiteWallTex = new THREE.TextureLoader().load("/imgs/white-wall.jpg");
  whiteWallTex.wrapS = THREE.RepeatWrapping;
  whiteWallTex.wrapT = THREE.RepeatWrapping;
  whiteWallTex.magFilter = THREE.NearestFilter;
  whiteWallTex.repeat.set(1, wallHeight / 4);

  const miniwallMat = new THREE.MeshStandardMaterial({ map: whiteWallTex });

  const miniwallGeo = new THREE.BoxGeometry(
    miniwallSize * 0.98,
    wallHeight,
    pillarSize * 0.9
  );

  const miniwallRight = new THREE.Mesh(miniwallGeo, miniwallMat);
  miniwallRight.receiveShadow = true;
  miniwallRight.rotation.y = Math.PI * 0.5;
  miniwallRight.position.set(
    floorSize / 2 + 2 + distanceAdjust,
    wallHeight / 2,
    pillarPos2 + miniwallSize / 2
  );

  const miniwallLeft = miniwallRight.clone();
  miniwallLeft.position.x = -floorSize / 2 - 2 - distanceAdjust;

  group.add(miniwallRight);
  group.add(miniwallLeft);

  return group;
}
