import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export function initJupiter() {
  const container = document.querySelector('.data-sphere');
  if (!container) return;

  container.innerHTML = '';
  const width = container.clientWidth;
  const height = container.clientHeight;

  // --- Theme Colors ---
  const THEME = {
    bg: 0x020617,
    text: 0xf1f5f9,
    accent: 0x14b8a6,
    muted: 0x94a3b8,
    slate200: 0xe2e8f0
  };

  // --- Scene Setup ---
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(THEME.bg, 0.02);

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(width, height);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';
  labelRenderer.domElement.style.pointerEvents = 'none';
  container.appendChild(labelRenderer.domElement);

  // --- Lighting ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(10, 10, 10);
  scene.add(dirLight);

  const tealLight = new THREE.PointLight(THEME.accent, 2, 20);
  tealLight.position.set(-5, -5, 5);
  scene.add(tealLight);

  const blueLight = new THREE.PointLight(0x38bdf8, 1, 20);
  blueLight.position.set(5, 5, -5);
  scene.add(blueLight);


  // --- Neural Network Group ---
  const networkGroup = new THREE.Group();
  scene.add(networkGroup);

  const nodes = [];
  const particleCount = 50;
  const connectionDistance = 6.5;

  // Background Node Geometry (Low Poly)
  const geometryNode = new THREE.IcosahedronGeometry(0.4, 0);
  const materialBase = new THREE.MeshPhysicalMaterial({
    color: THEME.slate200,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
    opacity: 0.5,
  });

  // Highlight Material
  const materialHighlight = new THREE.MeshPhysicalMaterial({
    color: THEME.accent,
    metalness: 0.2,
    roughness: 0.1,
    emissive: THEME.accent,
    emissiveIntensity: 0.5
  });


  // 1. Generate Random Background Nodes
  for (let i = 0; i < particleCount; i++) {
    const mesh = new THREE.Mesh(geometryNode, materialBase.clone());

    const r = 14;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const dist = r * (0.6 + Math.random() * 0.7);

    mesh.position.set(
      dist * Math.sin(phi) * Math.cos(theta),
      dist * Math.sin(phi) * Math.sin(theta),
      dist * Math.cos(phi)
    );

    mesh.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.0005,
        (Math.random() - 0.5) * 0.0005,
        (Math.random() - 0.5) * 0.0005
      ),
      originalPos: mesh.position.clone(),
      isSkill: false
    };

    const s = 0.2 + Math.random() * 0.4;
    mesh.scale.set(s, s, s);

    networkGroup.add(mesh);
    nodes.push(mesh);
  }

  // 2. Add "Major Skill" Nodes (SOLID VIBRANT COLORS)
  const skills = [
    { name: "Storytelling", color: 0xFFD700, pos: new THREE.Vector3(-6, -2, 6) },
    { name: "Data Modeling", color: THEME.accent, pos: new THREE.Vector3(6, -3, 4) },
    { name: "Leadership", color: 0xf472b6, pos: new THREE.Vector3(-4, 6, -2) },
    { name: "Big Data", color: 0x22c55e, pos: new THREE.Vector3(5, 5, -3) },
    { name: "Python", color: 0x3b82f6, pos: new THREE.Vector3(-7, 3, 2) },
    { name: "SQL", color: 0x6366f1, pos: new THREE.Vector3(0, -6, 3) },
    { name: "Machine Learning", color: 0xa855f7, pos: new THREE.Vector3(7, 2, 5) },
    { name: "Cloud Arch", color: 0xf97316, pos: new THREE.Vector3(2, 7, 0) }
  ];

  skills.forEach(skill => {
    // Solid Vibrant Sphere
    const mat = new THREE.MeshPhysicalMaterial({
      color: skill.color,
      metalness: 0.3,
      roughness: 0.4,
      transmission: 0, // Solid
      emissive: skill.color,
      emissiveIntensity: 0.8, // Vibrant self-illumination
      transparent: false,
      opacity: 1.0,
      clearcoat: 1.0 // Shiny coating
    });

    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), mat);
    mesh.position.copy(skill.pos);
    mesh.userData = {
      velocity: new THREE.Vector3(0, 0, 0),
      originalPos: skill.pos.clone(),
      isSkill: true,
      baseColor: new THREE.Color(skill.color)
    };

    // Label (No halo)
    const div = document.createElement('div');
    div.className = 'glass-label';
    div.innerHTML = `<span style="color:${new THREE.Color(skill.color).getStyle()}">●</span> ${skill.name}`;
    div.style.pointerEvents = 'auto';
    div.style.background = 'rgba(2, 6, 23, 0.7)'; // Slightly darker for legibility
    div.style.backdropFilter = 'blur(4px)';
    div.style.padding = '6px 14px';
    div.style.borderRadius = '20px';
    div.style.border = `1px solid rgba(255,255,255,0.1)`;
    div.style.color = '#f1f5f9';
    div.style.fontFamily = "'Inter', sans-serif";
    div.style.fontSize = '12px';
    div.style.fontWeight = '500';
    div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    div.style.transition = 'all 0.3s ease';
    div.style.cursor = 'pointer';
    div.style.marginTop = '-22px';
    div.style.userSelect = 'none';

    const label = new CSS2DObject(div);
    label.position.set(0, 1.2, 0);
    mesh.add(label);

    networkGroup.add(mesh);
    nodes.push(mesh);
  });


  // 3. Lines
  const maxConnections = nodes.length * 12;
  const lineGeo = new THREE.BufferGeometry();
  const linePos = new Float32Array(maxConnections * 3 * 2);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: THEME.muted,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending
  });
  const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
  networkGroup.add(linesMesh);


  // --- Interaction State ---
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-999, -999);
  const targetRotation = new THREE.Vector2();


  // --- Animation Loop ---
  function animate() {
    requestAnimationFrame(animate);

    // 1. Node Movement
    nodes.forEach(node => {
      node.position.add(node.userData.velocity);

      const dist = node.position.distanceTo(new THREE.Vector3(0, 0, 0));
      if (dist > 18) {
        const pull = node.position.clone().normalize().multiplyScalar(-0.005);
        node.userData.velocity.add(pull);
      }

      // Micro wander (Level 4)
      node.userData.velocity.x += (Math.random() - 0.5) * 0.0005;
      node.userData.velocity.y += (Math.random() - 0.5) * 0.0005;
      node.userData.velocity.z += (Math.random() - 0.5) * 0.0005;
      node.userData.velocity.multiplyScalar(0.995);

      node.rotation.x += 0.002;
      node.rotation.y += 0.002;
    });

    // 2. Global Rotation (Speed 4)
    targetRotation.x = mouse.x * 0.1;
    targetRotation.y = mouse.y * 0.1;

    // Faster constant drift
    networkGroup.rotation.y += 0.001;

    networkGroup.rotation.x = THREE.MathUtils.lerp(networkGroup.rotation.x, targetRotation.y * 0.5, 0.02);


    // 3. Connections
    let vertexIndex = 0;
    const positions = linesMesh.geometry.attributes.position.array;

    for (let i = 0; i < nodes.length; i++) {
      const nodeA = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeB = nodes[j];
        const dist = nodeA.position.distanceTo(nodeB.position);

        if (dist < connectionDistance) {
          positions[vertexIndex++] = nodeA.position.x;
          positions[vertexIndex++] = nodeA.position.y;
          positions[vertexIndex++] = nodeA.position.z;

          positions[vertexIndex++] = nodeB.position.x;
          positions[vertexIndex++] = nodeB.position.y;
          positions[vertexIndex++] = nodeB.position.z;
        }
      }
    }
    linesMesh.geometry.setDrawRange(0, vertexIndex / 3);
    linesMesh.geometry.attributes.position.needsUpdate = true;


    // 4. Raycasting
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodes);

    nodes.forEach(n => {
      if (n.userData.isSkill) {
        n.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        n.material.emissiveIntensity = 0.8;
      } else {
        if (n.material !== materialBase) n.material = materialBase;
      }
    });

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      hit.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);

      if (!hit.userData.isSkill) {
        hit.material = materialHighlight;
      } else {
        hit.material.emissiveIntensity = 1.5; // Brighter on highlight
      }
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }

  animate();

  window.addEventListener('mousemove', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });

  window.addEventListener('resize', () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    labelRenderer.setSize(w, h);
  });
}
