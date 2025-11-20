import * as THREE from "three";

export function createPillars({
  floorSize,
  floorWidth,
  floorHeight,
  height2f,
  distanceAdjust,
  stairGlassSize, // stare_glace_size
}) {
  const group = new THREE.Object3D();

  const pillarSize = 3;
  const pillarHeight = height2f;

  const tex = new THREE.TextureLoader().load("/imgs/white-wall.jpg");
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.repeat.set(1, pillarHeight / 4);

  const mat = new THREE.MeshStandardMaterial({ map: tex });

  const pillarGeo = new THREE.BoxGeometry(pillarSize, pillarHeight, pillarSize);

  const makePillar = () => {
    const obj = new THREE.Object3D();
    const mesh = new THREE.Mesh(pillarGeo, mat);
    mesh.position.set(0, pillarHeight / 2, 0);
    mesh.receiveShadow = true;
    obj.add(mesh);
    return obj;
  };

  // 원래 코드의 pillar_posi_1, pillar_posi_2
  const pillarPosZ1 = 0;
  const pillarPosZ2 = (-floorSize * 12) / 5 + stairGlassSize * 3;

  // 중간 기둥 2줄
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      const baseX =
        Math.pow(-1, j) *
        (floorSize / 2 + 2 + distanceAdjust + floorSize * 1.6 * i);

      const p1 = makePillar();
      p1.position.set(baseX, 0, pillarPosZ1);
      group.add(p1);

      const p2 = makePillar();
      p2.position.set(baseX, 0, pillarPosZ2);
      group.add(p2);
    }
  }

  // 기둥 사이 짧은 벽(miniwall) 2개
  const miniwallSize =
    -floorHeight / 2 + (floorSize * 12) / 5 - stairGlassSize * 3;
  const miniwallGeo = new THREE.BoxGeometry(
    miniwallSize,
    pillarHeight,
    pillarSize
  );

  const createMiniWall = (sign) => {
    const wall = new THREE.Mesh(miniwallGeo, mat);
    wall.rotation.y = Math.PI * 0.5;
    wall.position.set(
      sign * (floorSize / 2 + 2 + distanceAdjust),
      pillarHeight / 2,
      pillarPosZ2 + miniwallSize / 2
    );
    wall.receiveShadow = true;
    return wall;
  };

  group.add(createMiniWall(1));
  group.add(createMiniWall(-1));

  return group;
}
