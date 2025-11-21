// src/floors/floor1/walls/glassBorder.js
import * as THREE from "three";

export function createGlassBorder1({
  floorWidth, // floor_size * 12
  floorHeight, // floorWidth / 3
  height1 = 25, // 1층 유리 높이(= 2층 바닥 높이)
}) {
  const group = new THREE.Object3D();

  // 2층과 동일한 기둥 사이즈 기반
  const pillarSize = 4;
  const wallOutSize = pillarSize;
  const wallOutSize2 = wallOutSize * 1.5;
  const wallOutHalf = wallOutSize2 / 2;

  // 띠 두께(세로) & 깊이(가로/안쪽으로 튀어나오는 정도)
  const beamThickness = wallOutSize2; // y 방향(위/아래) 두께
  const beamDepth = wallOutSize2 * 1.01; // z 방향(앞뒤) or x 방향(좌우) 두께

  // 공용 텍스처 (2층 기둥과 동일)
  const wallTex = new THREE.TextureLoader().load("/imgs/white-wall.jpg");
  wallTex.wrapS = THREE.RepeatWrapping;
  wallTex.wrapT = THREE.RepeatWrapping;
  wallTex.magFilter = THREE.NearestFilter;
  wallTex.repeat.set(1, height1 / 4);

  const beamMat = new THREE.MeshStandardMaterial({ map: wallTex });

  // y 위치: 1층 유리 꼭대기(= height1) 바로 위에 살짝 올려서
  const y = height1 + beamThickness / 2;

  // ===== 앞/뒤 방향 띠 =====
  // 폭: 전체 floorWidth + 좌우 기둥 두께만큼 여유
  const frontBackGeo = new THREE.BoxGeometry(
    floorWidth + wallOutSize2 * 2,
    beamThickness,
    beamDepth
  );

  // 앞쪽 (정면)
  const front = new THREE.Mesh(frontBackGeo, beamMat);
  front.position.set(
    0,
    y,
    floorHeight / 2 + wallOutHalf // 2층 정면 기둥과 거의 동일한 z 라인
  );
  front.castShadow = true;
  front.receiveShadow = true;
  group.add(front);

  // 뒤쪽 (후면)
  const back = front.clone();
  back.position.z = -floorHeight / 2 - wallOutHalf;
  group.add(back);

  // ===== 좌/우 방향 띠 =====
  // 깊이: 전체 floorHeight
  const sideGeo = new THREE.BoxGeometry(beamDepth, beamThickness, floorHeight);

  // 왼쪽
  const left = new THREE.Mesh(sideGeo, beamMat);
  left.position.set(-floorWidth / 2 - wallOutHalf, y, 0);
  left.castShadow = true;
  left.receiveShadow = true;
  group.add(left);

  // 오른쪽
  const right = left.clone();
  right.position.x = floorWidth / 2 + wallOutHalf;
  group.add(right);

  return group;
}
