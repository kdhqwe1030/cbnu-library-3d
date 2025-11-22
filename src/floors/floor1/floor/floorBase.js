import * as THREE from "three";

export function createFloor1Base({ floor1Width, floor1Height }) {
  // 1층 바닥 평면
  const geo = new THREE.PlaneGeometry(floor1Width, floor1Height);

  // 텍스처는 원하는 걸로 바꿔도 됨 (지금은 2층이랑 같은 이름만 예시로)
  const tex = new THREE.TextureLoader().load("/imgs/2f_floor_texture.jpg");
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.repeat.set(floor1Width / 5, floor1Height / 5);

  const mat = new THREE.MeshPhongMaterial({
    map: tex,
    side: THREE.DoubleSide,
  });

  const plane = new THREE.Mesh(geo, mat);
  // 위에서 내려다보는 바닥
  plane.rotation.x = 1.5 * Math.PI;
  plane.receiveShadow = true;

  return plane;
}
