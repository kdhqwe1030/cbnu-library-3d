// src/floors/floor1/index.js
import * as THREE from "three";
import { createFloor1Base } from "./floor/floorBase.js";
import { createBackGlass1 } from "./walls/backGlass.js";
import { createSideGlass1 } from "./walls/sideGlass.js";
import { createFrontGlass1 } from "./walls/frontGlass.js";
import { createGlassBorder1 } from "./walls/glassBorder.js"; // ⬅ 추가

export function createFloor1() {
  const floor1 = new THREE.Object3D();

  const floorSize = 24;
  const floorWidth = floorSize * 12;
  const floorHeight = floorWidth / 3;
  const wallHeight = 25; // 한 층 높이

  const stairGlassSize = 8; // 2층 계단 유리 기준값과 동일
  const pillarPos2 = -floorSize * (12 / 5) + stairGlassSize * 3;

  const floor1Width = floorWidth - floorSize;
  const floor1Height = -pillarPos2 * 2;

  // 1) 바닥
  const base = createFloor1Base({ floor1Width, floor1Height });
  floor1.add(base);

  // 2) 후면 유리
  const backGlass = createBackGlass1({
    floor1Width,
    wallHeight,
    pillarPos2,
  });
  floor1.add(backGlass);

  // 3) 좌우 유리
  const sideGlass = createSideGlass1({
    floor1Width,
    floor1Height,
    wallHeight,
  });
  floor1.add(sideGlass);

  // 4) 정면 출입구 유리 2세트
  const frontGlass = createFrontGlass1({
    wallHeight,
    pillarPos2,
  });
  floor1.add(frontGlass);

  // 5) 1층 유리 상단 테두리(1층과 2층 사이 띠)
  const border = createGlassBorder1({
    floorWidth,
    floorHeight,
    height1: wallHeight, // 1층 유리 높이 기준
  });
  floor1.add(border);
  return floor1;
}
