// src/floors/floor4/walls/frontGapWall.js
import * as THREE from "three";

/**
 * 3층과 4층 사이, 정면 유리창 영역(x 범위)만 메꿔주는 벽.
 * - 로컬 기준 y=0 이면, 월드에서는 floor4.position.y 높이에 생김.
 */
export function createFrontGapWallBetween3And4() {
  const group = new THREE.Object3D();
  const floorHeight = 100;
  const height1 = 25;
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

  const frontBackGeo = new THREE.BoxGeometry(
    wallOutSize2 * 8,
    beamThickness,
    beamDepth
  );
  const beamMat = new THREE.MeshStandardMaterial({ map: wallTex });
  const y = height1 + beamThickness / 2;

  const front = new THREE.Mesh(frontBackGeo, beamMat);
  front.position.set(
    0,
    -2.5,
    -(floorHeight / 2 + 1) // 2층 정면 기둥과 거의 동일한 z 라인
  );
  front.castShadow = true;
  front.receiveShadow = true;
  group.add(front);

  return group;
}
