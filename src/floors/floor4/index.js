import * as THREE from "three";
import { createOuterWalls4 } from "./walls/outerWalls.js";
import { createFloor3Base } from "../floor3/floor/floorBase.js";
import { createFrontGapWallBetween3And4 } from "./walls/frontGapWall.js";
import { createGlassBorder1 } from "../floor1/walls/glassBorder.js";
import { createCeiling3 } from "../floor3/ceiling/ceiling.js";

export function createFloor4() {
  const floor4 = new THREE.Object3D();

  // 1~3층과 동일 스케일
  const floorSize = 24;
  const floorWidth = floorSize * 12;
  const floorHeight = floorWidth / 3;

  // 층 간 높이 25 기준: 1층 0, 2층 25, 3층 50, 4층 75
  const floor4Height = 75 + 4 * 1.5;
  const wallHeight = 25;

  const frontGlassWidth = 50;
  const stairGlassSize = 8;
  const pillarPos2 = -floorSize * (12 / 5) + stairGlassSize * 3; // 2,3층 frontGlass Z와 동일

  // 1) 바닥(=지붕)
  const base = createFloor3Base({ floorWidth, floorHeight });
  base.position.set(0, 0.2, 0);
  floor4.add(base);

  // 2) 옥상 외곽 난간 벽
  const outerWalls = createOuterWalls4({
    floorWidth,
    floorHeight,
    wallHeight,
  });
  floor4.add(outerWalls);
  // 3) 3층과 4층 사이, 정면 유리 영역만 메꾸는 벽
  const frontGapWall = createFrontGapWallBetween3And4({});
  floor4.add(frontGapWall);

  // 4) 지붕
  const ceiling = createCeiling3({
    floorWidth,
    floorHeight,
    floor3Height: wallHeight,
  });
  floor4.add(ceiling);
  // 5) 1층 유리 상단 테두리(1층과 2층 사이 띠)
  const border = createGlassBorder1({
    floorWidth,
    floorHeight,
    height1: wallHeight, // 1층 유리 높이 기준
  });
  floor4.add(border);

  // 전체 높이 이동
  floor4.position.y = floor4Height;

  return floor4;
}
