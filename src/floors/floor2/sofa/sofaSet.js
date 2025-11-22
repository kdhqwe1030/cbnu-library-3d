//2층 중앙 소파
import * as THREE from "three";
import { loadGLTF } from "../../../utils/modelLoader.js";

export async function createSofaSet() {
  const sofaSet = new THREE.Object3D();

  const floorSize = 24;

  const baseSofa = await loadGLTF("/models/mini_sofa/scene.gltf");
  baseSofa.scale.set(1, 1, 1);

  // 2) 3 × 2 × 2 × 2 반복 배치
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        for (let z = 0; z < 2; z++) {
          const sofa = baseSofa.clone(true);
          sofa.position.set(
            (-1) ** k * (floorSize / 4) + (-1) ** j * 1.5,
            1.3,
            -2 + 1.5 * i - 6 * z
          );
          sofaSet.add(sofa);
        }
      }
    }
  }

  return sofaSet;
}
