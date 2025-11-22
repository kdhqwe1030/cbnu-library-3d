import * as THREE from "three";

/**
 * 4층 외벽 전체(좌우 + 전후)
 * - 2/3층과 동일한 기둥 패턴
 * - 창문 없이 막힌 벽 + 검은 네모 장식만 추가
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

  // 기둥 한 블록 (wall_out) – 이미 잘 맞는 패턴
  const wallOut = new THREE.Object3D();
  {
    const geo = new THREE.BoxGeometry(wallOutSize2, pillarHeight, wallOutSize2);
    const mesh = new THREE.Mesh(geo, wallMat);
    mesh.position.set(0, pillarHeight / 2, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    wallOut.add(mesh);
  }

  // ===== 검은 네모 장식 템플릿 (2·3층 wallWindow 안 boxTop/boxBottom과 동일 컨셉) =====
  const decoBlock = new THREE.Object3D();
  {
    const boxGeo = new THREE.BoxGeometry(
      wallOutSize2,
      wallOutSize2,
      wallOutSize
    );
    const boxMat = new THREE.MeshPhongMaterial({ color: 0x595959 });
    const boxHalfY = wallOutSize2 / 2;

    // 위쪽 네모
    const boxTop = new THREE.Mesh(boxGeo, boxMat);
    boxTop.position.set(0, pillarHeight - boxHalfY, -wallOutSize * 0.3);
    decoBlock.add(boxTop);
  }

  // =========================
  // 1) 좌우 벽 (왼쪽 / 오른쪽)
  // =========================
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

      // 마지막 칸은 사이 장식 생략 (2·3층에서 마지막에 창문 없던 부분과 맞춤)
      if (i === 8) continue;

      // 검은 네모 장식 (창문 대신)
      const deco = decoBlock.clone(true);
      deco.position.set(
        dirX * (-floorWidth / 2 - wallOutHalf),
        0,
        floorHeight / 2 - (wallOutSize * 1.5 + i * windowGlassSize)
      );
      // 안쪽을 바라보게 회전
      deco.rotation.y = j ? -Math.PI * 0.5 : Math.PI * 0.5;
      group.add(deco);
    }
  }

  // =========================
  // 2) 앞 / 뒤 벽 (정면 / 후면)
  // =========================
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

        // 마지막 칸은 사이 장식 생략
        if (i === 10) continue;

        // 검은 네모 장식
        const deco = decoBlock.clone(true);
        deco.position.set(
          dirX *
            (floorWidth / 2 +
              wallOutHalf -
              (wallOutSize * 1.5 + i * windowGlassSize)),
          0,
          dirZ * (-floorHeight / 2 - wallOutHalf)
        );
        group.add(deco);
      }
    }
    // // ===== 정면 유리 자리(3층 front glass) 위에 기둥 4개 더 채우기 =====
    // // 3층에서 front glass 가 있던 X 범위(frontGlassSize) 안에 4개 배치했다고 가정
    // const frontGlassSize = 50;
    // const pillarCountFront = 3;
    // const deltaX = frontGlassSize / (pillarCountFront + 1);
    // const frontZ = -floorHeight / 2 - wallOutHalf; // 정면 Z

    // for (let i = 1; i <= pillarCountFront; i++) {
    //   const w = wallOut.clone(true);
    //   const deco = decoBlock.clone(true);
    //   deco.position.set(
    //     -frontGlassSize / 2 + pillarSize + deltaX * i,
    //     0,
    //     frontZ
    //   );
    //   w.position.set(-frontGlassSize / 2 + deltaX * i, 0, frontZ);
    //   group.add(w);
    // }
    // ===== 정면 유리 자리(3층 front glass) 위에 기둥 3개 + 사이사이 데코 =====
    const frontGlassSize = 50;
    const pillarCountFront = 3;
    const deltaX = frontGlassSize / (pillarCountFront + 1);
    const frontZ = -floorHeight / 2 - wallOutHalf; // 정면 Z

    // 새로 추가되는 정면 기둥들의 x 좌표를 저장
    const pillarXs = [];

    for (let i = 1; i <= pillarCountFront; i++) {
      const x = -frontGlassSize / 2 + deltaX * i; // 각 기둥 X
      const w = wallOut.clone(true);
      w.position.set(x, 0, frontZ);
      group.add(w);
      pillarXs.push(x);
    }

    // === 기둥 사이 데코 블럭(가로로 긴 검은 직사각형) ===
    const spanDecoGeo = new THREE.BoxGeometry(
      deltaX, // 기둥 간 간격보다 살짝 작은 가로 길이
      wallOutSize2, // 높이
      wallOutSize * 1.2 // 깊이
    );
    const spanDecoMat = new THREE.MeshPhongMaterial({ color: 0x595959 });

    // 양 끝(기존 기둥과 새 기둥 사이)까지 포함해서 4 구간에 데코 배치
    const decoXs = [
      pillarXs[0] - deltaX / 2, // 왼쪽 기존 기둥 ~ 첫 기둥 사이
      (pillarXs[0] + pillarXs[1]) / 2, // 1번~2번 기둥 사이
      (pillarXs[1] + pillarXs[2]) / 2, // 2번~3번 기둥 사이
      pillarXs[2] + deltaX / 2, // 3번 기둥 ~ 오른쪽 기존 기둥 사이
    ];

    decoXs.forEach((x) => {
      const deco = new THREE.Mesh(spanDecoGeo, spanDecoMat);
      deco.position.set(
        x,
        pillarHeight - wallOutSize2 * 0.5, // 기존 검은 네모와 비슷한 높이
        frontZ // 살짝 바깥으로 튀어나오게
      );
      deco.castShadow = true;
      deco.receiveShadow = true;
      group.add(deco);
    });
  }

  return group;
}
