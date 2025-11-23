# CBNU Library 3D (Refactored 2025)

**THREE.js 기반 실사형 도서관 3D 시뮬레이션 프로젝트**  
충북대학교 중앙도서관 각 층(1F~4F)을 3D 공간으로 재구성한 프로젝트입니다.

2023 버전에서 발생했던 구조적 문제와 메모리 사용량 과다 문제를  
**2025년 전체 리팩터링을 통해 대규모로 개선**했습니다.

🔗 **배포 URL:** https://cbnu-3d.netlify.app/  


<br/>

## 프로젝트 개요

- **초기 개발기간:** 2023.09 ~ 2023.12  
- **리팩터링 기간:** 2025.11  
- **목적:** THREE.js 기반 3D 도서관 구현  
- **결과:**  
  - 최적화된 렌더링 구조
  - 모듈화 기반 유지보수성 극대화  
  - 실제 도서관을 기반으로 한 구조적 배치
 
<br/>

<br/>

# 2025 리팩터링 핵심 요약

### ✔ 전체 코드 구조 재정비
- floor1~floor4 *단위 모듈화*
- core(camera, controls, light, scene) 구조 도입
- components(desks, sofa, walls 등) 세분화

### ✔ THREE.js 구조 최적화
- three.js-master 직접 포함 → **CDN 기반 importmap**으로 변경  
  → 용량 대폭 감소  
- GLTFLoader 병목 제거  

### ✔ 캐릭터 조작 개선
- WASD 이동  
- Shift 달리기  
- 방향키로 카메라 시점 회전  

<br/>

<br/>

# Preview Images

### Overall

<img src="https://github.com/user-attachments/assets/148cd662-7099-47d4-bf1d-1548126fdf99" width="1000" />

### Focus_2F


![2F_view_map](https://github.com/kdhqwe1030/THREE.js-Sturdy/assets/115572203/eb8b6eb2-ff7d-4bb0-9d39-a686e157386c)


![2F_two_way](https://github.com/kdhqwe1030/THREE.js-Sturdy/assets/115572203/c05983f1-1ccc-4f4c-8783-9f13c59f8b17)


![2F_side](https://github.com/kdhqwe1030/THREE.js-Sturdy/assets/115572203/516f19c3-ae23-4be9-96a4-22db120946c7)


![2F_wall](https://github.com/kdhqwe1030/THREE.js-Sturdy/assets/115572203/40d86931-e64c-4d9c-bc55-3fd40b5fd53e)








