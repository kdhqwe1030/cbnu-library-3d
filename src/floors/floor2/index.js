import * as THREE from "three";
import { createSofaSet } from "./sofa/sofaSet.js";
import { createDeskA } from "./desks/deskA.js";
import { createDeskB } from "./desks/deskB.js";
import { createDeskC } from "./desks/deskC.js";
import { createDeskD } from "./desks/deskD.js";

import { createInsideWalls } from "./walls/insideWalls.js";
import { createOuterWalls } from "./walls/outerWalls.js";
import { createStudyRoomWalls } from "./walls/studyRoomWalls.js";
import { createStairGlass } from "./walls/stairGlass.js";

import { createCeiling } from "./ceiling/ceiling.js";
export async function createFloor2() {
  const floor2 = new THREE.Object3D();

  const height2f = 25;
  const floorSize = 24;
  const floorWidth = floorSize * 12;
  const floorHeight = floorWidth / 3;

  // 바닥 (간단 버전 – 나중에 floorBase 모듈로 교체 가능)
  const geo = new THREE.PlaneGeometry(floorWidth, floorHeight);
  const tex = new THREE.TextureLoader().load("/imgs/2f_floor_texture.jpg");
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.repeat.set(floorWidth / 5, floorHeight / 5);

  const mat = new THREE.MeshPhongMaterial({ map: tex, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geo, mat);
  plane.rotation.x = 1.5 * Math.PI;
  plane.receiveShadow = true;
  floor2.add(plane);

  // 소파
  floor2.add(await createSofaSet());

  // 책상 패턴 하나씩 생성
  const desk2fA = await createDeskA();
  const desk2fB = await createDeskB();
  const desk2fC = await createDeskC();
  const desk2fD = await createDeskD();

  const tableSize = 1;
  const tableLength = 5 * tableSize;
  const tableBSize = 1.8;
  const tableCSize = tableLength * 1.5;
  const distanceAdjust = 13;

  // ===== Desk A 배치 (원본과 동일) =====
  const desk2fADistance = 12;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      const tmp = desk2fA.clone(true);
      tmp.position.set(
        Math.pow(-1, j) * (-floorSize * 4.2 - desk2fADistance * i),
        0,
        floorSize / 2 + 2
      );
      floor2.add(tmp);
    }
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 2; j++) {
      const tmp = desk2fA.clone(true);
      tmp.position.set(
        Math.pow(-1, j) * (-floorSize * 1.6 - desk2fADistance * i),
        0,
        floorSize / 2 + 2
      );
      floor2.add(tmp);
    }
  }

  // ===== Desk B (8인석) =====
  const desk2fBDistance = tableLength * tableBSize * 1.2;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      const tmp = desk2fB.clone(true);
      tmp.position.set(
        Math.pow(-1, j) * (-floorSize - distanceAdjust * 3.5 - 50),
        0,
        floorSize / 5 - desk2fBDistance * 1.5 * i - 4
      );
      floor2.add(tmp);
    }
  }

  // ===== Desk C (조망형) =====
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 2; j++) {
      const tmp = desk2fC.clone(true);
      tmp.rotation.y = j ? -Math.PI * 0.5 : Math.PI * 0.5;
      tmp.position.set(
        Math.pow(-1, j) * (-floorWidth / 2 + tableCSize / 4),
        0,
        -floorHeight / 2 + tableCSize / 4 + tableCSize * i + 10
      );
      floor2.add(tmp);
    }
  }

  for (let i = 0; i < 14; i++) {
    for (let j = 0; j < 2; j++) {
      const tmp = desk2fC.clone(true);
      tmp.position.set(
        Math.pow(-1, j) *
          (-floorWidth / 2 + tableCSize * 2 + tableCSize * i - 2),
        0,
        -floorHeight / 2 + tableCSize / 2 - 2
      );
      floor2.add(tmp);
    }
  }

  // ===== Desk D (스터디룸 내부 책상) =====
  const sturdyRoomDistance1 = 23.75;
  const sturdyRoomDistance2 = 23.6;
  const insideWallWidth = floorSize;

  for (let i = 1; i < 5; i++) {
    const tmp = desk2fD.clone(true);
    tmp.position.set(
      -floorWidth / 2 - sturdyRoomDistance1 / 2 + sturdyRoomDistance1 * i,
      0,
      floorHeight / 2 - insideWallWidth / 2
    );
    floor2.add(tmp);
  }

  for (let i = 1; i < 4; i++) {
    const tmp = desk2fD.clone(true);
    tmp.position.set(
      floorWidth / 2 + sturdyRoomDistance2 / 2 - sturdyRoomDistance2 * i,
      0,
      floorHeight / 2 - insideWallWidth / 2
    );
    floor2.add(tmp);
  }

  // ===== 벽/유리 모듈 조립 =====
  const insideWalls = createInsideWalls({
    floorSize,
    floorWidth,
    floorHeight,
    height2f,
  });
  floor2.add(insideWalls);

  const studyRoomWalls = createStudyRoomWalls({
    floorSize,
    floorWidth,
    floorHeight,
    height2f,
  });
  floor2.add(studyRoomWalls);

  const stairGlass = createStairGlass({
    height2f,
    floorSize,
  });
  floor2.add(stairGlass);

  const outerWalls = createOuterWalls({
    floorSize,
    floorWidth,
    floorHeight,
    height2f,
  });
  floor2.add(outerWalls);

  // ===== 천장 + 조명 =====
  const ceiling = createCeiling({
    floorWidth,
    floorHeight,
    height2f,
    floorSize,
    distanceAdjust,
  });
  floor2.add(ceiling);

  // 층 전체 높이
  floor2.position.y = height2f;

  return floor2;
}
