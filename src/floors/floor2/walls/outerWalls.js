import * as THREE from "three";

/**
 * 2층 외벽(좌/우/정면) + 정면 유리 + 기둥 사이 벽
 */
export function createOuterWalls({
  floorSize, // floor_size
  floorWidth, // floor_width
  floorHeight, // floor_height
  height2f, // height_2f
}) {
  const group = new THREE.Object3D();

  const pillarSize = 4;
  const pillarHeight = height2f;

  const wallOutSize = pillarSize;
  const wallOutSize2 = wallOutSize * 1.5;
  const wallOutHalf = wallOutSize2 / 2;

  const stareGlaceSize = 8; // 계단 유리 사이즈와 동일
  const distanceAdjust = 13;
  const frontGlassSize = 50;

  // 유리창 공통 재질
  const windowGlaceMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    ior: 1.7,
    thickness: 0.5,
    transmission: 1,
    side: THREE.DoubleSide,
  });

  // === window_glace + frame ===
  const windowGlaceSize = wallOutSize2 * 2;
  const windowGlaceGeo = new THREE.PlaneGeometry(wallOutSize * 2, pillarHeight);

  const windowGlace = new THREE.Mesh(windowGlaceGeo, windowGlaceMat);
  windowGlace.position.set(0, pillarHeight / 2, 0);

  const windowFrameGeo = new THREE.PlaneGeometry(wallOutSize * 2, 0.5);
  const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

  const frame1 = new THREE.Mesh(windowFrameGeo, windowFrameMat);
  frame1.position.set(0, -pillarHeight / 2 + 3 * 1.5, -0.5);
  const frame2 = new THREE.Mesh(windowFrameGeo, windowFrameMat);
  frame2.position.set(0, -pillarHeight / 2 + 3, -0.5);

  windowGlace.add(frame1);
  windowGlace.add(frame2);

  const wallWindow = new THREE.Object3D();
  wallWindow.add(windowGlace);

  // === 외벽 박스(wall_out) ===
  const wallOutGeo = new THREE.BoxGeometry(
    wallOutSize2,
    pillarHeight,
    wallOutSize2
  );
  const wallOutMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const wallOutBase = new THREE.Mesh(wallOutGeo, wallOutMat);
  wallOutBase.position.set(0, pillarHeight / 2, 0);

  const wallOut = new THREE.Object3D();
  wallOut.add(wallOutBase);

  // === 좌우측 외벽 ===
  for (let j = 0; j < 2; j++) {
    const dir = Math.pow(-1, j);
    for (let i = 0; i < 9; i++) {
      const w = wallOut.clone(true);
      w.position.set(
        dir * (-floorWidth / 2 - wallOutHalf),
        0,
        floorHeight / 2 - i * windowGlaceSize
      );
      group.add(w);

      if (i === 8) continue;

      const win = wallWindow.clone(true);
      win.position.set(
        dir * (-floorWidth / 2 - wallOutHalf),
        0,
        floorHeight / 2 - (wallOutSize * (3 / 2) + i * windowGlaceSize)
      );
      win.rotation.y = j ? -Math.PI * 0.5 : Math.PI * 0.5;
      group.add(win);
    }
  }

  // === 정면/후면 외벽 ===
  for (let k = 0; k < 2; k++) {
    const dirZ = Math.pow(-1, k);
    for (let j = 0; j < 2; j++) {
      const dirX = Math.pow(-1, j);
      for (let i = 0; i < 11; i++) {
        const w = wallOut.clone(true);
        w.position.set(
          dirX * (floorWidth / 2 + wallOutHalf - i * windowGlaceSize),
          0,
          dirZ * (-floorHeight / 2 - wallOutHalf)
        );
        group.add(w);

        if (i === 10) continue;

        const win = wallWindow.clone(true);
        win.position.set(
          dirX *
            (floorWidth / 2 +
              wallOutHalf -
              (wallOutSize * (3 / 2) + i * windowGlaceSize)),
          0,
          dirZ * (-floorHeight / 2 - wallOutHalf)
        );
        group.add(win);
      }
    }
  }

  // === 정면 큰 유리 (front_glass_ob) ===
  const pillarPos2 = -floorSize * (12 / 5) + stareGlaceSize * 3;

  const frontGlassGeo = new THREE.PlaneGeometry(frontGlassSize, height2f);
  const frontGlass = new THREE.Mesh(frontGlassGeo, windowGlaceMat);
  frontGlass.position.set(0, height2f / 2, pillarPos2);

  // 수평 프레임들
  const frontFrameGeoH = new THREE.BoxGeometry(frontGlassSize, 0.3, 0.3);
  const frontFrameGeoV = new THREE.BoxGeometry(0.3, height2f, 0.3);

  const makeFrontFrameH = () => new THREE.Mesh(frontFrameGeoH, windowFrameMat);
  const makeFrontFrameV = () => new THREE.Mesh(frontFrameGeoV, windowFrameMat);

  for (let i = 0; i < 5; i++) {
    const f = makeFrontFrameH();
    f.position.set(0, height2f / 2 - (height2f / 4) * i, 0);
    frontGlass.add(f);
  }

  for (let i = 0; i < 6; i++) {
    const f = makeFrontFrameV();
    f.position.set(frontGlassSize / 2 - (frontGlassSize / 5) * i, 0, 0);
    frontGlass.add(f);
  }

  const frontGlassOb = new THREE.Object3D();
  frontGlassOb.add(frontGlass);
  group.add(frontGlassOb);

  // === 정면 유리와 외벽 사이의 벽(miniwall) ===
  const miniwallSize =
    -floorHeight / 2 + (floorSize * 12) / 5 - stareGlaceSize * 3;

  const miniwallGeo = new THREE.BoxGeometry(
    miniwallSize * 0.98,
    height2f * 0.99,
    pillarSize * 0.9
  );
  const pillarTex = new THREE.TextureLoader().load("/imgs/white-wall.jpg");
  pillarTex.wrapS = THREE.RepeatWrapping;
  pillarTex.wrapT = THREE.RepeatWrapping;
  pillarTex.magFilter = THREE.NearestFilter;
  pillarTex.repeat.set(1, pillarHeight / 4);
  const pillarMat = new THREE.MeshStandardMaterial({ map: pillarTex });

  const miniwall1 = new THREE.Mesh(miniwallGeo, pillarMat);
  miniwall1.receiveShadow = true;
  miniwall1.rotation.y = Math.PI * 0.5;
  miniwall1.position.set(
    floorSize / 2 + 2 + distanceAdjust,
    pillarHeight / 2,
    pillarPos2 + miniwallSize / 2
  );
  group.add(miniwall1);

  const miniwall2 = miniwall1.clone();
  miniwall2.position.set(
    -floorSize / 2 - 2 - distanceAdjust,
    pillarHeight / 2,
    pillarPos2 + miniwallSize / 2
  );
  group.add(miniwall2);

  return group;
}
