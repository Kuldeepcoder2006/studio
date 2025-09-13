"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Hero3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseY = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Use a simpler geometry for better performance
    const geometry = new THREE.IcosahedronGeometry(1.2, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4f46e5, // A nice indigo color
      metalness: 0.5,
      roughness: 0.1,
      emissive: 0x1f1f1f,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.2, 0);
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.1 });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    mesh.add(wireframe);

    const particlesGeometry = new THREE.BufferGeometry();
    // Reduce particle count for better performance
    const particlesCnt = 2000;
    const posArray = new Float32Array(particlesCnt * 3);
    for(let i = 0; i < particlesCnt * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.01,
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const pointLight = new THREE.PointLight(0xffffff, 500);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    let mouseX = 0;
    const handleMouseMove = (event: MouseEvent) => {
        mouseX = event.clientX;
        mouseY.current = event.clientY;
    }
    document.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow down particle rotation
      particlesMesh.rotation.y = -0.02 * elapsedTime;
      if (mouseX > 0) {
        particlesMesh.rotation.x = -0.02 * (mouseY.current - (window.innerHeight / 2)) / 200;
        particlesMesh.rotation.y = -0.02 * (mouseX - (window.innerWidth / 2)) / 200;
      }
      
      controls.update();

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      controls.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-50" />;
};

export default Hero3D;
