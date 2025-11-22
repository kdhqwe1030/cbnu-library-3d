import * as THREE from "three";
import { loadGLTF } from "../../../utils/modelLoader.js";

export async function createDeskD() {
  const desk_2f_D = new THREE.Object3D();

  const table_size = 1;
  const table_lenth = 5 * table_size;
  const table_leg_height = 3;
  const table_leg_size = 0.3;

  const table_texture = new THREE.TextureLoader().load("imgs/wood1.jpg");
  table_texture.wrapS = THREE.RepeatWrapping;
  table_texture.wrapT = THREE.RepeatWrapping;
  table_texture.magFilter = THREE.NearestFilter;
  table_texture.repeat.set(5, 1);
  const table_mat = new THREE.MeshPhongMaterial({ map: table_texture });

  const table_leg_geo = new THREE.BoxGeometry(
    table_leg_size,
    table_leg_height,
    table_leg_size
  );
  const table_leg_mat = new THREE.MeshPhongMaterial({ color: 0x000000 });

  const table_D_size = 1.8;

  // 기본 넓은 desk
  const table_D_geo = new THREE.BoxGeometry(
    table_lenth * table_D_size * 2,
    0.3,
    table_lenth * table_D_size * 0.6
  );
  const table_D = new THREE.Mesh(table_D_geo, table_mat);
  table_D.castShadow = true;
  table_D.position.set(0, table_leg_height, 0);
  desk_2f_D.add(table_D);

  // 다리 배치 (원본 for문 그대로)
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const table_leg = new THREE.Mesh(table_leg_geo, table_leg_mat);
      table_leg.position.set(
        (-1) ** i * (table_lenth * table_D_size - table_leg_size / 1.8),
        -table_leg_height / 2,
        (-1) ** j * (table_lenth * table_D_size * 0.3)
      );
      table_D.add(table_leg);
    }
  }

  // ---- 의자 8개 (원본 loadModel_desk_2f_D) ---- //
  const baseChair = await loadGLTF("models/muskonge_n24t6n23s2001/scene.gltf");

  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 4; i++) {
      const chair = baseChair.clone(true);
      chair.position.set(
        table_lenth * table_D_size * 0.8 -
          (i * (table_lenth * table_D_size)) / 2,
        0,
        (-1) ** j * (table_lenth * table_D_size * 0.4) // 원본 .4
      );
      if (!j) chair.rotation.y = Math.PI;
      chair.scale.set(3, 3, 3);
      desk_2f_D.add(chair);
    }
  }

  // 원본: desk_2f_D.rotation.y = Math.PI * .5;
  desk_2f_D.rotation.y = Math.PI * 0.5;

  return desk_2f_D;
}
