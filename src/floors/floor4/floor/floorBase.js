import * as THREE from "three";

/**
 * 4층 옥상 바닥 (지붕 역할)
 */
export function createFloor4Base({ floorWidth, floorHeight }) {
  const geo = new THREE.PlaneGeometry(floorWidth, floorHeight);

  // 옥상 텍스처 (원하는 파일명으로 변경해도 됨)
  const tex = new THREE.TextureLoader().load("/imgs/roof_texture.jpg");
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.repeat.set(floorWidth / 20, floorHeight / 20);

  const mat = new THREE.MeshPhongMaterial({
    map: tex,
    side: THREE.DoubleSide,
  });

  const plane = new THREE.Mesh(geo, mat);
  plane.rotation.x = 1.5 * Math.PI; // 위를 바라보게
  plane.receiveShadow = true;
  return plane;
}
