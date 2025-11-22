import * as THREE from "three";

/**
 * 4층 외벽 전체(좌우 + 전후)
 * - 2/3층과 거의 동일한 기둥 + 유리창 패턴
 * - 정면 가운데(3층 front glass 위)에는 기둥 3개 + 가로 검은 바 추가
 */
export function createOuterWalls4({ floorWidth, floorHeight, wallHeight }) {
  const group = new THREE.Object3D();

  // ===== 기본 파라미터 (2·3층과 동일 스케일) =====
  const pillarSize = 4;
  const pillarHeight = wallHeight;

  const wallOutSize = pillarSize;
  const wallOutSize2 = wallOutSize * 1.5; // 기둥 한 블록의 가로/세로
  const wallOutHalf = wallOutSize2 / 2;

  // 2·3층에서 windowGlassSize 역할 (기둥 + 기둥 사이 간격)
  const windowGlassSize = wallOutSize2 * 2;

  // ===== 공용 텍스처 / 재질 =====
  const wallTex = new THREE.TextureLoader().load("/imgs/white-wall.jpg");
  wallTex.wrapS = THREE.RepeatWrapping;
  wallTex.wrapT = THREE.RepeatWrapping;
  wallTex.magFilter = THREE.NearestFilter;
  wallTex.repeat.set(1, pillarHeight / 4);

  const wallMat = new THREE.MeshStandardMaterial({ map: wallTex });

  // 기둥 한 블록 (wall_out)
  const wallOut = new THREE.Object3D();
  {
    const geo = new THREE.BoxGeometry(wallOutSize2, pillarHeight, wallOutSize2);
    const mesh = new THREE.Mesh(geo, wallMat);
    mesh.position.set(0, pillarHeight / 2, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    wallOut.add(mesh);
  }

  // ===== 유리창 블록 (기둥 사이에 들어갈 window + 위쪽 검은 네모) =====
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    ior: 1.7,
    thickness: 0.5,
    transmission: 1,
    side: THREE.DoubleSide,
  });

  const wallWindow = new THREE.Object3D();
  {
    // 유리
    const glassGeo = new THREE.PlaneGeometry(wallOutSize * 2, pillarHeight);
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, pillarHeight / 2, 0);
    wallWindow.add(glass);

    // 아래/위 가로 벽
    const bottomTopGeo = new THREE.BoxGeometry(
      wallOutSize2 * 2,
      wallOutSize / 10,
      wallOutSize2
    );
    const bottom = new THREE.Mesh(bottomTopGeo, wallMat);
    bottom.position.set(0, wallOutSize / 20, 0);
    const top = bottom.clone();
    top.position.set(0, pillarHeight - wallOutSize / 20, 0);
    wallWindow.add(bottom);
    wallWindow.add(top);

    // 위쪽 검은 네모
    const boxGeo = new THREE.BoxGeometry(
      wallOutSize2,
      wallOutSize2,
      wallOutSize
    );
    const boxMat = new THREE.MeshPhongMaterial({ color: 0x595959 });
    const boxHalfY = wallOutSize2 / 2;

    const boxTop = new THREE.Mesh(boxGeo, boxMat);
    boxTop.position.set(
      0,
      pillarHeight - boxHalfY - wallOutSize * 0.1,
      -wallOutSize * 0.3
    );
    wallWindow.add(boxTop);
  }

  // 1) 좌우 벽 (왼쪽 / 오른쪽)

  for (let j = 0; j < 2; j++) {
    const dirX = Math.pow(-1, j); // -1: 왼쪽, 1: 오른쪽

    // 기둥 9개 (2·3층과 동일 개수)
    for (let i = 0; i < 9; i++) {
      // 기둥
      const w = wallOut.clone(true);
      w.position.set(
        dirX * (-floorWidth / 2 - wallOutHalf),
        0,
        floorHeight / 2 - i * windowGlassSize
      );
      group.add(w);

      // 마지막 칸은 유리 없음 (아래 층과 동일하게 비워둠)
      if (i === 8) continue;

      // 기둥 사이 유리창
      const win = wallWindow.clone(true);
      win.position.set(
        dirX * (-floorWidth / 2 - wallOutHalf),
        0,
        floorHeight / 2 - (wallOutSize * 1.5 + i * windowGlassSize)
      );
      // 안쪽을 향하도록 회전
      win.rotation.y = j ? -Math.PI * 0.5 : Math.PI * 0.5;
      group.add(win);
    }
  }

  // 2) 앞 / 뒤 벽 (정면 / 후면)

  for (let k = 0; k < 2; k++) {
    const dirZ = Math.pow(-1, k); // -1: 앞, 1: 뒤

    for (let j = 0; j < 2; j++) {
      const dirX = Math.pow(-1, j); // -1, 1

      // 기둥 11개 (2·3층과 동일 개수)
      for (let i = 0; i < 11; i++) {
        // 기둥
        const w = wallOut.clone(true);
        w.position.set(
          dirX * (floorWidth / 2 + wallOutHalf - i * windowGlassSize),
          0,
          dirZ * (-floorHeight / 2 - wallOutHalf)
        );
        group.add(w);

        // 마지막 칸은 유리 없음
        if (i === 10) continue;

        // 기둥 사이 유리창
        const win = wallWindow.clone(true);
        win.position.set(
          dirX *
            (floorWidth / 2 +
              wallOutHalf -
              (wallOutSize * 1.5 + i * windowGlassSize)),
          0,
          dirZ * (-floorHeight / 2 - wallOutHalf)
        );
        group.add(win);
      }
    }
  }

  // 3) 3층 정면 큰 유리 위쪽을 메우는 4층 기둥 + 가로 검은 바

  const frontGlassSize = 50;
  const pillarCountFront = 3;
  const deltaX = frontGlassSize / (pillarCountFront + 1);
  const frontZ = -floorHeight / 2 - wallOutHalf; // 정면 Z

  //가운데 부분 유리로 채우기(가로 50사이즈)
  const wallCenterWindow = new THREE.Object3D();
  const glassGeo = new THREE.PlaneGeometry(50, pillarHeight);
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(0, pillarHeight / 2, frontZ);
  wallCenterWindow.add(glass);
  group.add(wallCenterWindow);

  // 새로 추가되는 정면 기둥들의 x 좌표
  const pillarXs = [];
  for (let i = 1; i <= pillarCountFront; i++) {
    const x = -frontGlassSize / 2 + deltaX * i;
    const w = wallOut.clone(true);
    w.position.set(x, 0, frontZ);
    group.add(w);
    pillarXs.push(x);
  }

  // 기둥 사이를 잇는 가로 검은 직사각형들
  const spanDecoGeo = new THREE.BoxGeometry(
    deltaX, // 가로 길이
    wallOutSize2,
    wallOutSize * 1.2
  );
  const spanDecoMat = new THREE.MeshPhongMaterial({ color: 0x595959 });

  const decoXs = [
    pillarXs[0] - deltaX / 2,
    (pillarXs[0] + pillarXs[1]) / 2,
    (pillarXs[1] + pillarXs[2]) / 2,
    pillarXs[2] + deltaX / 2,
  ];

  decoXs.forEach((x) => {
    const deco = new THREE.Mesh(spanDecoGeo, spanDecoMat);
    deco.position.set(x, pillarHeight - wallOutSize2 * 0.5, frontZ);
    deco.castShadow = true;
    deco.receiveShadow = true;
    group.add(deco);
  });

  return group;
}
