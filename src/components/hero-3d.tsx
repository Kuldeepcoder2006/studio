"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Hero3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);

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

    const geometry = new THREE.IcosahedronGeometry(1.5, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      metalness: 0.3,
      roughness: 0.6,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.5, 0);
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true, opacity: 0.1 });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    const particlesGeometry = new THREE.BufferGeometry;
    const particlesCnt = 5000;
    const posArray = new Float32Array(particlesCnt * 3);
    for(let i = 0; i < particlesCnt * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * (Math.random() * 5) * 5;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x000000
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const pointLight = new THREE.PointLight(0xffffff, 30);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
    document.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      mesh.rotation.y = .2 * elapsedTime;
      mesh.rotation.x = .2 * elapsedTime;
      wireframe.rotation.y = .2 * elapsedTime;
      wireframe.rotation.x = .2 * elapsedTime;
      
      particlesMesh.rotation.y = -0.02 * elapsedTime;
      
      if (mouseX > 0) {
        camera.position.x += ((mouseX / window.innerWidth * 2 - 1) * 1.5 - camera.position.x) * 0.05;
        camera.position.y += (-(mouseY / window.innerHeight * 2 - 1) * 1.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
      }

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
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-30 dark:opacity-20" />;
};

export default Hero3D;
