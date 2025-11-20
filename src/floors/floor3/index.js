import * as THREE from "three";
import { createFloor3Base } from "./floor/floorBase.js";
import { createOuterWalls3 } from "./walls/outerWalls.js";
import { createFrontGlass3 } from "./walls/frontGlass.js";

export function createFloor3() {
  const floor3 = new THREE.Object3D();

  // ===== 기본 파라미터 (2층과 동일한 스케일) =====
  const floorSize = 24;
  const floorWidth = floorSize * 12;
  const floorHeight = floorWidth / 3;

  const wallHeight = 25; // 한 층 높이 (2층 height2f와 동일)
  const floor3Height = 50; // 월드 좌표에서 3층 위치 (원 코드: floor_3.position.set(0, 50, 0))

  const distanceAdjust = 13; // 2층에서 계단/유리 기준으로 쓰던 값 재사용

  // ===== 1) 바닥 =====
  const base = createFloor3Base({ floorWidth, floorHeight });
  floor3.add(base);

  // ===== 2) 외벽 =====
  const outerWalls = createOuterWalls3({
    floorWidth,
    floorHeight,
    wallHeight,
  });
  floor3.add(outerWalls);

  // ===== 3) 정면 유리 + 양 옆 미니 벽 =====
  const frontGlass = createFrontGlass3({
    floorSize,
    floorWidth,
    floorHeight,
    wallHeight,
    distanceAdjust,
  });
  floor3.add(frontGlass);

  // ===== 층 전체 높이 올리기 =====
  floor3.position.y = floor3Height;

  return floor3;
}
