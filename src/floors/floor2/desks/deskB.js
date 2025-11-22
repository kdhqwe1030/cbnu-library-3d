import * as THREE from "three";
import { loadGLTF } from "../../../utils/modelLoader.js";

export async function createDeskB() {
  const desk_2f_B = new THREE.Object3D();
  const desk_2f_B_frame = new THREE.Object3D();

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

  const table_leg_mat = new THREE.MeshPhongMaterial({ color: 0x000000 });

  // 사이즈 조절용 변수
  const table_B_size = 1.8;

  // 기본 넓은 desk
  const table_B_geo = new THREE.BoxGeometry(
    table_lenth * table_B_size * 2,
    0.3,
    table_lenth * table_B_size * 1.2
  );
  const table_B = new THREE.Mesh(table_B_geo, table_mat);
  table_B.castShadow = true;
  table_B.position.set(0, table_leg_height, 0);
  desk_2f_B.add(table_B);

  // 세로 기둥 2개
  const table_B_frame_height = 10;
  const table_B_frame_geo = new THREE.BoxGeometry(
    table_leg_size * table_B_size,
    table_B_frame_height,
    table_leg_size * table_B_size
  );
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 8; i++) {
      const tmp_table_B_frame = new THREE.Mesh(
        table_B_frame_geo,
        table_leg_mat
      );
      tmp_table_B_frame.castShadow = true;
      tmp_table_B_frame.position.set(
        (-1) ** j *
          (table_lenth * table_B_size + (table_leg_size * table_B_size) / 2),
        table_B_frame_height / 2,
        table_leg_size * table_B_size * 10 -
          i * table_leg_size * table_B_size * 2.8
      );
      desk_2f_B_frame.add(tmp_table_B_frame);
    }
  }

  // 천장쪽 누운기둥 8개
  const table_B_frame_geo2 = new THREE.BoxGeometry(
    table_leg_size * table_B_size,
    table_lenth * table_B_size * 2,
    table_leg_size * table_B_size
  );
  for (let i = 0; i < 8; i++) {
    const tmp_table_B_frame = new THREE.Mesh(table_B_frame_geo2, table_leg_mat);
    tmp_table_B_frame.castShadow = true;
    tmp_table_B_frame.rotation.z = Math.PI * 0.5;
    tmp_table_B_frame.position.set(
      0,
      table_B_frame_height,
      table_leg_size * table_B_size * 10 -
        i * table_leg_size * table_B_size * 2.8
    );
    desk_2f_B_frame.add(tmp_table_B_frame);
  }

  // 테두리 4개 위에 맨사이드 2개 아래 맨사이드 2개
  const table_B_frame_geo3 = new THREE.BoxGeometry(
    table_leg_size * table_B_size,
    table_leg_size * table_B_size * 20 + 0.3,
    table_leg_size * table_B_size
  );
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const tmp_table_B_frame = new THREE.Mesh(
        table_B_frame_geo3,
        table_leg_mat
      );
      tmp_table_B_frame.rotation.x = Math.PI * 0.5;
      tmp_table_B_frame.position.set(
        (-1) ** i *
          (table_lenth * table_B_size + (table_leg_size * table_B_size) / 2),
        j * table_B_frame_height,
        0.1
      );
      desk_2f_B_frame.add(tmp_table_B_frame);
    }
  }

  // ---- 의자 (원본 loadModel_desk_2f_B) ---- //
  const baseChair = await loadGLTF("models/muskonge_n24t6n23s2001/scene.gltf");

  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 4; i++) {
      const chair = baseChair.clone(true);
      chair.position.set(
        table_lenth * table_B_size * 0.8 -
          (i * (table_lenth * table_B_size)) / 2,
        0,
        (-1) ** j * (table_lenth * table_B_size * 0.7)
      );
      if (!j) chair.rotation.y = Math.PI;
      chair.scale.set(3, 3, 3);
      desk_2f_B.add(chair);
    }
  }

  desk_2f_B.add(desk_2f_B_frame);

  return desk_2f_B;
}
