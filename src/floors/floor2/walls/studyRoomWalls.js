import * as THREE from "three";

/**
 * 스터디룸 벽 + 창문 + 나무 기둥 세트
 * - 뒷쪽 긴 벽을 여러 개의 스터디룸으로 구분
 */
export function createStudyRoomWalls({
  floorSize, // floor_size
  floorWidth, // floor_width
  floorHeight, // floor_height
  height2f, // height_2f
}) {
  const group = new THREE.Object3D();

  // === 공통 값 ===
  const insideWallWidth = floorSize; // floor_2f_insideWall_size
  const sturdyRoomDistance1 = 23.75; // 왼쪽 구간 간격
  const sturdyRoomDistance2 = 23.6; // 오른쪽 구간 간격

  // === 스터디룸 벽 (흰색 벽) ===
  const wallGeo = new THREE.PlaneGeometry(insideWallWidth, height2f);
  const wallTex = new THREE.TextureLoader().load("/imgs/white-wall.jpg");
  wallTex.wrapS = THREE.RepeatWrapping;
  wallTex.wrapT = THREE.RepeatWrapping;
  wallTex.magFilter = THREE.NearestFilter;
  wallTex.repeat.set(1, height2f / 4);

  const wallMat = new THREE.MeshPhongMaterial({
    map: wallTex,
    side: THREE.DoubleSide,
  });

  const wallMeshBase = new THREE.Mesh(wallGeo, wallMat);
  wallMeshBase.receiveShadow = true;

  const makeVerticalWall = () => {
    const obj = new THREE.Object3D();
    const mesh = wallMeshBase.clone();
    mesh.position.set(0, height2f / 2, 0);
    obj.add(mesh);
    return obj;
  };

  // 왼쪽 스터디룸 벽 4개
  for (let i = 1; i < 5; i++) {
    const w = makeVerticalWall();
    w.position.set(
      -floorWidth / 2 + sturdyRoomDistance1 * i,
      0,
      floorHeight / 2 - insideWallWidth / 2
    );
    w.rotation.y = Math.PI * 0.5;
    group.add(w);
  }

  // 오른쪽 스터디룸 벽 3개
  for (let i = 1; i < 4; i++) {
    const w = makeVerticalWall();
    w.position.set(
      floorWidth / 2 - sturdyRoomDistance2 * i,
      0,
      floorHeight / 2 - insideWallWidth / 2
    );
    w.rotation.y = Math.PI * 0.5;
    group.add(w);
  }

  // === 스터디룸 창문(유리) ===
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    ior: 1.7,
    thickness: 0.5,
    transmission: 1,
    side: THREE.DoubleSide,
  });

  const windowGeo1 = new THREE.PlaneGeometry(sturdyRoomDistance1, height2f);
  const windowGeo2 = new THREE.PlaneGeometry(sturdyRoomDistance2, height2f);

  const windowObj1 = new THREE.Mesh(windowGeo1, glassMat);
  const windowObj2 = new THREE.Mesh(windowGeo2, glassMat);

  const windowGroup1 = new THREE.Object3D();
  const windowGroup2 = new THREE.Object3D();
  windowObj1.position.set(0, height2f / 2, 0);
  windowObj2.position.set(0, height2f / 2, 0);
  windowGroup1.add(windowObj1);
  windowGroup2.add(windowObj2);

  // === 스터디룸 나무 기둥 / 문틀 ===
  const woodTex = new THREE.TextureLoader().load("/imgs/wood1.jpg");
  const woodMat = new THREE.MeshPhongMaterial({ map: woodTex });

  const doorGeo = new THREE.BoxGeometry(0.5, height2f, 0.5);
  const doorMeshBase = new THREE.Mesh(doorGeo, woodMat);
  const makeDoorPost = () => {
    const obj = new THREE.Object3D();
    const mesh = doorMeshBase.clone();
    mesh.position.set(0, height2f / 2, 0);
    obj.add(mesh);
    return obj;
  };

  const sturdyRoomDoorDistance = sturdyRoomDistance1 / 3.5;

  // 왼쪽 스터디룸: 창문 + 나무 기둥 2개씩
  for (let i = 1; i < 5; i++) {
    // 유리
    const win = windowGroup1.clone(true);
    win.position.set(
      -floorWidth / 2 - sturdyRoomDistance1 / 2 + sturdyRoomDistance1 * i,
      0,
      floorHeight / 2 - insideWallWidth
    );
    group.add(win);

    // 기둥 1 (창문 좌측)
    const post1 = makeDoorPost();
    post1.position.set(
      -floorWidth / 2 + sturdyRoomDistance1 * i,
      0,
      floorHeight / 2 - insideWallWidth
    );
    group.add(post1);

    // 기둥 2 (살짝 왼쪽으로 오프셋)
    const post2 = makeDoorPost();
    post2.position.set(
      -floorWidth / 2 - sturdyRoomDoorDistance + sturdyRoomDistance1 * i,
      0,
      floorHeight / 2 - insideWallWidth
    );
    group.add(post2);
  }

  // 오른쪽 스터디룸: 창문 + 나무 기둥 2개씩
  for (let i = 1; i < 4; i++) {
    const win = windowGroup2.clone(true);
    win.position.set(
      floorWidth / 2 + sturdyRoomDistance2 / 2 - sturdyRoomDistance2 * i,
      0,
      floorHeight / 2 - insideWallWidth
    );
    group.add(win);

    const post1 = makeDoorPost();
    post1.position.set(
      floorWidth / 2 - sturdyRoomDistance2 * i,
      0,
      floorHeight / 2 - insideWallWidth
    );
    group.add(post1);

    const post2 = makeDoorPost();
    post2.position.set(
      floorWidth / 2 + sturdyRoomDoorDistance - sturdyRoomDistance1 * i,
      0,
      floorHeight / 2 - insideWallWidth
    );
    group.add(post2);
  }

  return group;
}
