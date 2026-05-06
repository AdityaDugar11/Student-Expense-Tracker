// ====================================
// Landing Page - Three.js + GSAP Animations
// Student Expense Tracker
// ====================================

// ====================================
// THREE.JS - 3D Floating Expense Card
// ====================================

// we'll create a 3D scene with floating cards that look like expense entries
function init3DScene() {
    const canvas = document.getElementById('three-canvas');
    const container = document.getElementById('hero-3d');

    // create the scene, camera, and renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        50,                                           // field of view
        container.clientWidth / container.clientHeight, // aspect ratio
        0.1,                                           // near plane
        1000                                           // far plane
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,       // transparent background
        antialias: true    // smooth edges
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ---- LIGHTS ----
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00d4ff, 1.5, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x7c3aed, 1, 100);
    pointLight2.position.set(-5, -3, 3);
    scene.add(pointLight2);

    // ---- CREATE FLOATING CARDS ----
    // these represent expense cards floating in 3D space

    const cards = [];

    // card data - each card is like an expense entry
    const cardData = [
        { color: 0x00d4ff, x: 0, y: 0, z: 0, scale: 1.2 },       // main card (cyan)
        { color: 0x7c3aed, x: -2.5, y: 1.5, z: -1, scale: 0.8 },  // purple card
        { color: 0xff6bcb, x: 2.3, y: -1.2, z: -0.5, scale: 0.9 }, // pink card
        { color: 0x00d4ff, x: -1.8, y: -1.8, z: -1.5, scale: 0.6 }, // small cyan
        { color: 0x7c3aed, x: 2.8, y: 1.8, z: -2, scale: 0.5 },    // small purple
    ];

    cardData.forEach((data, index) => {
        // create a rounded box (using regular box since three.js r128 doesn't have RoundedBox)
        const geometry = new THREE.BoxGeometry(2.2, 1.3, 0.08);
        const material = new THREE.MeshPhysicalMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.15,
            roughness: 0.2,
            metalness: 0.8,
            side: THREE.DoubleSide,
        });

        const card = new THREE.Mesh(geometry, material);
        card.position.set(data.x, data.y, data.z);
        card.scale.setScalar(data.scale);

        // slight random rotation so they don't all face the same way
        card.rotation.x = Math.random() * 0.3 - 0.15;
        card.rotation.y = Math.random() * 0.4 - 0.2;

        scene.add(card);
        cards.push(card);

        // add glowing edges to main card
        if (index === 0) {
            const edgeGeometry = new THREE.EdgesGeometry(geometry);
            const edgeMaterial = new THREE.LineBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.6
            });
            const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
            card.add(edges);
        }
    });

    // ---- PARTICLES ----
    // floating dots in the background for atmosphere
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        particlePositions[i] = (Math.random() - 0.5) * 20;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00d4ff,
        size: 0.03,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ---- MOUSE INTERACTION ----
    // cards follow the mouse slightly
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // ---- ANIMATION LOOP ----
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // float the cards up and down
        cards.forEach((card, i) => {
            card.rotation.y += 0.003;
            card.position.y += Math.sin(time * 0.8 + i * 1.5) * 0.002;

            // subtle mouse follow
            card.rotation.x += (mouseY * 0.1 - card.rotation.x) * 0.02;
            card.rotation.y += (mouseX * 0.1 - card.rotation.y) * 0.02;
        });

        // rotate particles slowly
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;

        renderer.render(scene, camera);
    }

    animate();

    // ---- HANDLE RESIZE ----
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// ====================================
// GSAP - Scroll Animations
// ====================================

function initScrollAnimations() {
    // register the ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // ---- HERO ANIMATIONS (on page load) ----
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTimeline
        .to('.hero-tag', { opacity: 1, y: 0, duration: 0.8 }, 0.2)
        .to('.hero-title', { opacity: 1, y: 0, duration: 0.8 }, 0.4)
        .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8 }, 0.6)
        .to('.hero-btn', { opacity: 1, y: 0, duration: 0.8 }, 0.8);

    // ---- FEATURE CARDS ----
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.15,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // ---- STEPS (How it works) ----
    gsap.utils.toArray('.step').forEach((step, i) => {
        gsap.to(step, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: step,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // ---- TECH ITEMS ----
    gsap.utils.toArray('.tech-item').forEach((item, i) => {
        gsap.to(item, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // ---- CTA CONTENT ----
    gsap.to('.cta-content', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.cta-content',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });

    // ---- NAVBAR background on scroll ----
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'navbar-scrolled', targets: '.navbar' }
    });
}

// ====================================
// START EVERYTHING
// ====================================

// wait for page to load then start
window.addEventListener('DOMContentLoaded', () => {
    init3DScene();
    initScrollAnimations();
});
