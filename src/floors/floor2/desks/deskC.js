import * as THREE from "three";
import { loadGLTF } from "../../../utils/modelLoader.js";

export async function createDeskC() {
  const desk_2f_C = new THREE.Object3D();

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

  const table_C_size = table_lenth * 1.5;

  // 책상 윗판 조망형
  const table_C_geo = new THREE.BoxGeometry(
    table_C_size,
    0.3,
    table_C_size / 2
  );
  const table_C = new THREE.Mesh(table_C_geo, table_mat);
  table_C.castShadow = true;
  table_C.position.set(0, table_leg_height, 0);
  desk_2f_C.add(table_C);

  // 책상 다리 4개
  const table_C_leg_geo = new THREE.BoxGeometry(
    table_leg_size,
    table_leg_height,
    table_leg_size
  );

  const leg1 = new THREE.Mesh(table_C_leg_geo, table_leg_mat);
  leg1.position.set(
    -table_C_size / 2 + table_leg_size / 2,
    table_leg_height / 2,
    table_C_size / 4 - table_leg_size / 2
  );
  desk_2f_C.add(leg1);

  const leg2 = new THREE.Mesh(table_C_leg_geo, table_leg_mat);
  leg2.position.set(
    table_C_size / 2 - table_leg_size / 2,
    table_leg_height / 2,
    table_C_size / 4 - table_leg_size / 2
  );
  desk_2f_C.add(leg2);

  const leg3 = new THREE.Mesh(table_C_leg_geo, table_leg_mat);
  leg3.position.set(
    -table_C_size / 2 + table_leg_size / 2,
    table_leg_height / 2,
    -table_C_size / 4 + table_leg_size / 2
  );
  desk_2f_C.add(leg3);

  const leg4 = new THREE.Mesh(table_C_leg_geo, table_leg_mat);
  leg4.position.set(
    table_C_size / 2 - table_leg_size / 2,
    table_leg_height / 2,
    -table_C_size / 4 + table_leg_size / 2
  );
  desk_2f_C.add(leg4);

  // ---- loadModel_desk_2f_C(3) 로직 ---- //
  const baseChair = await loadGLTF("models/muskonge_n24t6n23s2001/scene.gltf");
  const baseLamp = await loadGLTF("models/stand_lamp/scene.gltf");

  // 의자 2개
  const chair1 = baseChair.clone(true);
  chair1.position.set(table_C_size / 4, 0, table_C_size / 3);
  chair1.rotation.y = Math.PI;
  chair1.scale.set(3, 3, 3);
  desk_2f_C.add(chair1);

  const chair2 = baseChair.clone(true);
  chair2.position.set(-table_C_size / 4, 0, table_C_size / 3);
  chair2.rotation.y = Math.PI;
  chair2.scale.set(3, 3, 3);
  desk_2f_C.add(chair2);

  // 스탠드 2개
  const lamp1 = baseLamp.clone(true);
  lamp1.position.set(
    table_C_size / 4 + table_C_size / 6,
    table_leg_height + 0.15,
    -table_C_size / 8
  );
  lamp1.rotation.y = Math.PI;
  lamp1.scale.set(3, 3, 3);
  desk_2f_C.add(lamp1);

  const lamp2 = baseLamp.clone(true);
  lamp2.position.set(
    -table_C_size / 4 + table_C_size / 6,
    table_leg_height + 0.15,
    -table_C_size / 8
  );
  lamp2.rotation.y = Math.PI;
  lamp2.scale.set(3, 3, 3);
  desk_2f_C.add(lamp2);

  return desk_2f_C;
}
