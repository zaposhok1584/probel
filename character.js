(function () {
  const container = document.getElementById('characterViewport');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // ---------- СЦЕНА, КАМЕРА, СВЕТ ----------
  const scene = new THREE.Scene();
  scene.background = null; // прозрачно — виден фон самой .left-column

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.set(0, 1.2, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(3, 5, 4);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x888888);
  scene.add(ambient);

  // ---------- УПРАВЛЕНИЕ МЫШКОЙ ----------
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false; // чтобы колесо мыши листало страницу, а не зумило фигурку

  // ---------- СБОРКА ПЕРСОНАЖА ИЗ ПРИМИТИВОВ ----------
  const character = new THREE.Group();

  const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
  const shirtMaterial = new THREE.MeshStandardMaterial({ color: 0x2255aa });
  const pantsMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), skinMaterial);
  head.position.set(0, 1.8, 0);
  character.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.74, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    hairMaterial
  );
  hair.position.set(0, 2.15, 0);
  character.add(hair);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 1.1, 12), shirtMaterial);
  body.position.set(0, 0.9, 0);
  character.add(body);

  const legGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.9, 10);
  const legLeft = new THREE.Mesh(legGeometry, pantsMaterial);
  legLeft.position.set(-0.22, 0, 0);
  character.add(legLeft);
  const legRight = new THREE.Mesh(legGeometry, pantsMaterial);
  legRight.position.set(0.22, 0, 0);
  character.add(legRight);

  const armGeometry = new THREE.CylinderGeometry(0.13, 0.13, 0.9, 10);
  const armLeft = new THREE.Mesh(armGeometry, skinMaterial);
  armLeft.position.set(-0.68, 0.95, 0);
  armLeft.rotation.z = Math.PI / 10;
  character.add(armLeft);
  const armRight = new THREE.Mesh(armGeometry, skinMaterial);
  armRight.position.set(0.68, 0.95, 0);
  armRight.rotation.z = -Math.PI / 10;
  character.add(armRight);

  scene.add(character);

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.2, 0.1, 24),
    new THREE.MeshStandardMaterial({ color: 0x444466 })
  );
  platform.position.set(0, -0.5, 0);
  scene.add(platform);

  // ---------- ЦИКЛ АНИМАЦИИ ----------
  // Проверка document.body.contains(container) — если блок с персонажем
  // убрали со страницы (например, ушли на "Вестник" через наш роутер),
  // цикл сам себя останавливает вместо того, чтобы крутиться вхолостую вечно
  function animate() {
    if (!document.body.contains(container)) return;
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // ---------- АДАПТАЦИЯ ПОД РАЗМЕР КОЛОНКИ ----------
  window.addEventListener('resize', function () {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
    // ---------- СМЕНА НАРЯДА ПО КНОПКАМ ----------
  const outfits = [
    { shirt: 0x2255aa, pants: 0x333333, hair: 0x1a1a1a }, // обычный
    { shirt: 0x7a2e2e, pants: 0x1a1a1a, hair: 0x3a1216 }, // гвардия (тёмно-красный)
    { shirt: 0xa67c3d, pants: 0x15100e, hair: 0x4a3223 }, // архивариус (бронзовый)
  ];

  const controlsPanel = document.querySelector('.character-controls');
  if (controlsPanel) {
    controlsPanel.querySelectorAll('.outfit-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const outfit = outfits[parseInt(btn.dataset.outfit, 10)];
        if (!outfit) return;
        shirtMaterial.color.set(outfit.shirt);
        pantsMaterial.color.set(outfit.pants);
        hairMaterial.color.set(outfit.hair);
      });
    });
  }
})();