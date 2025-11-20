import * as THREE from "three";

export function createOuterWalls3({ floorWidth, floorHeight, wallHeight }) {
  const group = new THREE.Object3D();

  // ===== 기본 파라미터 (2층과 동일) =====
  const pillarSize = 4;
  const pillarHeight = wallHeight;

  const wallOutSize = pillarSize;
  const wallOutSize2 = wallOutSize * 1.5;
  const wallOutHalf = wallOutSize2 / 2;

  const windowGlassSize = wallOutSize2 * 2;

  // 공용 벽 텍스처
  const wallTex = new THREE.TextureLoader().load("/imgs/white-wall.jpg");
  wallTex.wrapS = THREE.RepeatWrapping;
  wallTex.wrapT = THREE.RepeatWrapping;
  wallTex.magFilter = THREE.NearestFilter;
  wallTex.repeat.set(1, pillarHeight / 4);

  const wallMat = new THREE.MeshStandardMaterial({ map: wallTex });

  // 유리 재질 (2층 outerWalls / window_glace_mat와 동일 컨셉)
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    ior: 1.7,
    thickness: 0.5,
    transmission: 1,
    side: THREE.DoubleSide,
  });

  // ===== 벽 블록 (wall_out) =====
  const wallOut = new THREE.Object3D();
  {
    const geo = new THREE.BoxGeometry(wallOutSize2, pillarHeight, wallOutSize2);
    const obj = new THREE.Mesh(geo, wallMat);
    obj.position.set(0, pillarHeight / 2, 0);
    obj.castShadow = true;
    obj.receiveShadow = true;
    wallOut.add(obj);
  }

  // ===== 유리창 블록 (wall_window) =====
  const wallWindow = new THREE.Object3D();
  {
    // 유리
    const glassGeo = new THREE.PlaneGeometry(wallOutSize * 2, pillarHeight);
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, pillarHeight / 2, 0);
    wallWindow.add(glass);

    // 아래/위 가로 벽 (2층에서 wall_out2 + clone 구조였던 부분 단순화)
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

    // 상단 네모(장식) 템플릿
    const boxGeo = new THREE.BoxGeometry(
      wallOutSize2,
      wallOutSize2,
      wallOutSize
    );
    const boxMat = new THREE.MeshPhongMaterial({ color: 0x595959 });
    const boxTemplate = new THREE.Mesh(boxGeo, boxMat);

    // 박스 높이의 절반
    const boxHalfY = wallOutSize2 / 2;

    // 위쪽 박스
    const boxTop = boxTemplate.clone();
    boxTop.position.set(
      0,
      pillarHeight - boxHalfY - wallOutSize * 0.1,
      -wallOutSize * 0.3
    );
    wallWindow.add(boxTop);

    //아래쪽 박스 (예: 아랫쪽에 조금만 붙이기)
    const boxBottom = boxTemplate.clone();
    boxBottom.position.set(
      0,
      -boxHalfY, // 바닥에서 조금 띄운 높이
      -wallOutSize * 0.3
    );
    wallWindow.add(boxBottom);
  }

  // ===== 좌우측 외벽 =====
  // 원래 코드:
  // for (j=0..1) for (i=0..8) { wall_out + wall_window }
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 9; i++) {
      // 벽 블록
      const wall = wallOut.clone(true);
      wall.position.set(
        Math.pow(-1, j) * (-floorWidth / 2 - wallOutHalf),
        0,
        floorHeight / 2 - i * windowGlassSize
      );
      group.add(wall);

      // 마지막 칸은 유리 건너뜀
      if (i === 8) continue;

      // 유리 블록
      const win = wallWindow.clone(true);
      win.position.set(
        Math.pow(-1, j) * (-floorWidth / 2 - wallOutHalf),
        0,
        floorHeight / 2 - (wallOutSize * 1.5 + i * windowGlassSize)
      );

      // 안쪽을 향하도록 회전
      win.rotation.y = j ? -Math.PI * 0.5 : Math.PI * 0.5;
      group.add(win);
    }
  }

  // ===== 정면/후면 외벽 =====
  // 원래 코드:
  // for(k=0..1) for(j=0..1) for(i=0..10) { wall_out + wall_window }
  for (let k = 0; k < 2; k++) {
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 11; i++) {
        const wall = wallOut.clone(true);
        wall.position.set(
          Math.pow(-1, j) *
            (floorWidth / 2 + wallOutHalf - i * windowGlassSize),
          0,
          Math.pow(-1, k) * (-floorHeight / 2 - wallOutHalf)
        );
        group.add(wall);

        if (i === 10) continue;

        const win = wallWindow.clone(true);
        win.position.set(
          Math.pow(-1, j) *
            (floorWidth / 2 +
              wallOutHalf -
              (wallOutSize * 1.5 + i * windowGlassSize)),
          0,
          Math.pow(-1, k) * (-floorHeight / 2 - wallOutHalf)
        );
        group.add(win);
      }
    }
  }

  return group;
}
