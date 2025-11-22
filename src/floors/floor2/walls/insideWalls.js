import * as THREE from "three";

/**
 * 2층 내부 벽 (정면 유리 뒤쪽, 좌우 짧은 벽 포함)
 * 원본: floor_2f_insideWall, floor_2f_insideWall_2, floor_2f_insideWall_3 + 양 옆 짧은 벽
 */
export function createInsideWalls({
  floorSize, // floor_size
  floorWidth, // floor_width
  floorHeight, // floor_height
  height2f, // height_2f
  frontGlassSize = 50, // front_glass_size
}) {
  const group = new THREE.Object3D();

  const insideWidth = floorSize; // floor_2f_insideWall_size
  const geo = new THREE.PlaneGeometry(insideWidth, height2f);

  const tex = new THREE.TextureLoader().load("/imgs/2f_wall_inside.jpg");
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.repeat.set(insideWidth / 6, height2f / 5);

  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    side: THREE.DoubleSide,
  });

  const baseMesh = new THREE.Mesh(geo, mat);
  baseMesh.receiveShadow = true;

  // 헬퍼: 기준 오브젝트 하나 생성
  const makeWallObject = () => {
    const obj = new THREE.Object3D();
    const mesh = baseMesh.clone();
    mesh.position.set(0, height2f / 2, 0);
    obj.add(mesh);
    return obj;
  };

  // 1) 정면 유리 뒤 가운데 벽 (원본: floor_2f_insideWall)
  const wall1 = makeWallObject();
  wall1.position.set(
    insideWidth / 2 + frontGlassSize / 2,
    0,
    floorHeight / 2 - insideWidth
  );
  wall1.rotation.y = Math.PI;
  group.add(wall1);

  // 2) 왼쪽
  const wall2 = wall1.clone(true);
  wall2.position.set(
    -insideWidth / 2 - frontGlassSize / 2,
    0,
    floorHeight / 2 - insideWidth
  );
  group.add(wall2);

  // 3) 오른쪽 끝
  const wall3 = wall1.clone(true);
  wall3.position.set(
    (insideWidth / 2) * 3 + frontGlassSize / 2,
    0,
    floorHeight / 2 - insideWidth
  );
  group.add(wall3);

  // 4) 정면 유리 양 옆 짧은 벽 2개
  for (let i = 0; i < 2; i++) {
    const side = makeWallObject();
    side.rotation.y = Math.PI * 0.5;
    side.position.set(
      Math.pow(-1, i) * (frontGlassSize / 2),
      0,
      floorHeight / 2 - insideWidth / 2
    );
    group.add(side);
  }

  return group;
}
