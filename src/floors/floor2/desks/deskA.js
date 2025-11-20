import * as THREE from "three";
import { loadGLTF } from "../../../utils/modelLoader.js";

export async function createDeskA() {
  const desk_2f_A = new THREE.Object3D();

  const table_size = 1;
  const table_lenth = 5 * table_size;
  const radius = table_lenth / 2;
  const Angle = 120 * (Math.PI / 180);
  const Angle_sub = 60 * (Math.PI / 180);
  const table_leg_height = 3;
  const table_leg_size = 0.3;

  // --- 공용 재질/지오메트리 (원본 동일) --- //
  const table_texture = new THREE.TextureLoader().load("imgs/wood1.jpg");
  table_texture.wrapS = THREE.RepeatWrapping;
  table_texture.wrapT = THREE.RepeatWrapping;
  table_texture.magFilter = THREE.NearestFilter;
  table_texture.repeat.set(5, 1);

  const table_mat = new THREE.MeshPhongMaterial({ map: table_texture });

  const table_geo = new THREE.BoxGeometry(
    table_lenth * 0.5,
    0.3,
    (table_lenth * 4) / 5
  );
  const table_leg_geo = new THREE.BoxGeometry(
    table_leg_size,
    table_leg_height,
    table_leg_size
  );
  const table_leg_geo3 = new THREE.BoxGeometry(
    table_leg_size,
    table_leg_size,
    table_lenth * 0.5
  );
  const table_leg_mat = new THREE.MeshPhongMaterial({ color: 0x000000 });
  const table_leg_plane_geo = new THREE.PlaneGeometry(
    table_lenth * 0.5 - 0.5,
    table_leg_height / 2
  );
  const table_leg_plane_mat = new THREE.MeshPhongMaterial({
    color: 0xd89bd8,
  });

  // --- GLTF 기본 모델 1회 로드 후 clone --- //
  const baseChair = await loadGLTF("models/muskonge_n24t6n23s2001/scene.gltf");
  const baseSocket = await loadGLTF("models/black_power_socket/scene.gltf");

  for (let i = 0; i < 3; i++) {
    // 테이블 한 세트
    const table = new THREE.Mesh(table_geo, table_mat);
    table.castShadow = true;
    table.position.set(
      radius * Math.sin(Angle * i),
      table_leg_height,
      radius * Math.cos(Angle * i)
    );
    table.rotation.y = Angle * i;

    const table_leg = new THREE.Mesh(table_leg_geo, table_leg_mat);
    table_leg.castShadow = true;
    table_leg.position.set(
      (table_lenth * 0.5) / 2 - table_leg_size / 1.8,
      -table_leg_height / 2,
      0
    );
    table.add(table_leg);

    const table_leg2 = new THREE.Mesh(table_leg_geo, table_leg_mat);
    table_leg2.castShadow = true;
    table_leg2.position.set(
      -((table_lenth * 0.5) / 2 - table_leg_size / 1.8),
      -table_leg_height / 2,
      0
    );
    table.add(table_leg2);

    const table_leg3 = new THREE.Mesh(table_leg_geo3, table_leg_mat);
    table_leg3.castShadow = true;
    table_leg3.position.set(0, -table_leg_height / 2, 0);
    table_leg3.rotation.y = Math.PI * 0.5;
    table.add(table_leg3);

    const table4 = new THREE.Mesh(table_geo, table_mat);
    table4.castShadow = true;
    table4.position.set(0, 0, -0.5);
    table.add(table4);

    const table_leg_plane = new THREE.Mesh(
      table_leg_plane_geo,
      table_leg_plane_mat
    );
    table_leg_plane.position.set(0, -table_leg_height / 4, 0);
    table.add(table_leg_plane);

    desk_2f_A.add(table);

    // ---- 원본 loadModel_desk_2f_A(i, 3) 로직 ---- //
    // 의자
    const chair = baseChair.clone(true);
    chair.position.set(
      radius * Math.sin(Angle * i + Angle_sub),
      0,
      radius * Math.cos(Angle * i + Angle_sub)
    );
    chair.rotation.y = Angle * i + Angle_sub * 4;
    chair.scale.set(3, 3, 3);
    desk_2f_A.add(chair);

    // 콘센트
    const power_socket = baseSocket.clone(true);
    power_socket.position.set(
      (radius * Math.sin(Angle * i + Angle_sub)) / 5,
      3.16,
      (radius * Math.cos(Angle * i + Angle_sub)) / 5
    );
    power_socket.rotation.z = Angle * i + Angle_sub * 4;
    power_socket.rotation.x = (-3 * Math.PI) / 2;
    power_socket.scale.set(1, 1, 1);
    desk_2f_A.add(power_socket);
  }

  return desk_2f_A;
}
