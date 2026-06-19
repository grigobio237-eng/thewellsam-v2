/* 
  =========================================
  THE WELLSAM STEM CELL - INTERACTIVE ENGINE
  =========================================
*/

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCanvasParticles();
  initScrollReveal();
  initDetailPages();
});

/* 1. Header Navigation Scroll State */
function initNavigation() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.padding = '0';
      header.style.backgroundColor = 'rgba(12, 12, 13, 0.95)';
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.padding = '0';
      header.style.backgroundColor = 'rgba(12, 12, 13, 0.85)';
      header.style.boxShadow = 'none';
    }
  });
}

/* 2. Interactive Canvas Particles (Stem Cells) */
function initCanvasParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Particle Settings
  const particlesArray = [];
  const numberOfParticles = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 18000));
  
  // Mouse & Scroll interaction state
  const mouse = {
    x: null,
    y: null,
    radius: 120, // Interaction radius
  };

  let lastScrollY = window.scrollY;
  let scrollDelta = 0;

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollDelta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.radius = Math.random() * 6 + 2; // Particle size
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + this.radius + 10;
      
      // Floating speed (slow and drift-like)
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1); // Always float upwards slightly
      
      this.baseAlpha = Math.random() * 0.4 + 0.15;
      this.alpha = this.baseAlpha;
      
      // Light gold or pearl white color hues
      const isGold = Math.random() > 0.7;
      this.color = isGold ? '212, 175, 55' : '246, 245, 242';
      
      // Floating amplitude and frequency
      this.amplitude = Math.random() * 0.5 + 0.2;
      this.waveSpeed = Math.random() * 0.02 + 0.005;
      this.angle = Math.random() * Math.PI * 2;
    }

    draw() {
      ctx.beginPath();
      
      // Outer glow gradient
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0, 
        this.x, this.y, this.radius * 3
      );
      gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
      gradient.addColorStop(0.3, `rgba(${this.color}, ${this.alpha * 0.5})`);
      gradient.addColorStop(1, `rgba(${this.color}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    update() {
      // 1. Natural floating wave motion
      this.angle += this.waveSpeed;
      this.x += Math.sin(this.angle) * this.amplitude * 0.1 + this.vx;
      this.y += this.vy;

      // 2. Scroll interaction - rise faster when scrolling down (Anti-gravity effect)
      if (scrollDelta > 0) {
        this.y -= scrollDelta * 0.05;
      }

      // 3. Mouse interaction (Repulsion)
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          // Gently push particle away
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
          
          // Light up near mouse
          this.alpha = Math.min(0.8, this.baseAlpha + force * 0.4);
        } else {
          // Fade back to normal
          if (this.alpha > this.baseAlpha) {
            this.alpha -= 0.01;
          }
        }
      } else {
        // Fade back to normal
        if (this.alpha > this.baseAlpha) {
          this.alpha -= 0.01;
        }
      }

      // 4. Out of bounds boundary check
      if (this.y < -this.radius * 3 || this.x < -this.radius * 3 || this.x > canvas.width + this.radius * 3) {
        this.reset(false);
      }
    }
  }

  // Handle Resize
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Clear and reinitialize if size changes significantly
    particlesArray.length = 0;
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Decay scrollDelta decay slowly
    scrollDelta *= 0.95;
    if (Math.abs(scrollDelta) < 0.1) scrollDelta = 0;

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

/* 3. Intersection Observer for Scroll Reveals */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up');
  
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of element is visible
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once visible, we can stop observing this element
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
}

/* 4. Full-Screen Detail Overlay & Dynamic SVG Infographic Animations */

const cardDetailsData = [
  {
    tag: 'DEEP ANTI-AGING',
    title: '근본적인 젊음의 재건',
    subtitle: 'Cellular Rejuvenation',
    concept: '이 치료는 피부 겉면의 처리가 아닌, 진피층 깊은 곳의 구조적 복원에 초점을 맞춥니다.',
    mechanisms: [
      {
        title: '파라크라인 효과 (주변분비 작용)',
        desc: '투여된 줄기세포는 노화로 인해 활동을 멈춘 진피층의 \'섬유아세포(Fibroblast)\'를 깨우는 강력한 성장인자(TGF-β, FGF 등)를 분비합니다.'
      },
      {
        title: '자가 단백질 합성',
        desc: '외부에서 인공 물질을 주입하는 것이 아니라, 내 몸의 세포가 스스로 최고급 콜라겐과 엘라스틴을 폭발적으로 생산하도록 유도하여 무너진 피부의 지지대를 근본적으로 재건합니다.'
      }
    ],
    effects: [
      '안면 구조의 자연스러운 리프팅 및 볼륨 복원',
      '피부 진피층 두께 증가 및 진성 주름 개선'
    ],
    visualSvg: `
      <svg class="visual-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="200" r="180" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
        <circle cx="200" cy="200" r="120" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
        
        <g class="cell-pulse">
          <circle cx="200" cy="200" r="30" fill="rgba(212, 175, 55, 0.1)" stroke="var(--color-gold)" stroke-width="1.5" class="glowing-node"/>
          <circle cx="200" cy="200" r="10" fill="var(--color-gold)"/>
        </g>
        
        <circle cx="200" cy="200" r="4" fill="var(--color-gold)" class="growth-factor" style="--dx: 110px; --dy: -70px; animation-delay: 0s;"/>
        <circle cx="200" cy="200" r="3" fill="var(--color-gold)" class="growth-factor" style="--dx: -120px; --dy: -90px; animation-delay: 1.2s;"/>
        <circle cx="200" cy="200" r="5" fill="var(--color-gold)" class="growth-factor" style="--dx: 90px; --dy: 100px; animation-delay: 2.4s;"/>
        <circle cx="200" cy="200" r="4" fill="var(--color-gold)" class="growth-factor" style="--dx: -80px; --dy: 120px; animation-delay: 3.6s;"/>
        
        <path d="M 70 120 Q 90 90 120 110 Q 100 130 70 120 Z" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.15)" stroke-width="1" class="fibroblast-awaken" style="animation-delay: 1s;"/>
        <path d="M 290 100 Q 320 120 310 150 Q 280 130 290 100 Z" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.15)" stroke-width="1" class="fibroblast-awaken" style="animation-delay: 0s;"/>
        <path d="M 280 280 Q 290 310 260 320 Q 250 290 280 280 Z" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.15)" stroke-width="1" class="fibroblast-awaken" style="animation-delay: 2s;"/>
        <path d="M 100 300 Q 120 280 130 310 Q 110 320 100 300 Z" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.15)" stroke-width="1" class="fibroblast-awaken" style="animation-delay: 3s;"/>
        
        <path d="M 120 110 Q 200 150 290 130" stroke="var(--color-gold)" stroke-width="1.2" fill="none" class="collagen-line" style="animation-delay: 1.5s;"/>
        <path d="M 310 150 Q 270 220 280 280" stroke="var(--color-gold)" stroke-width="1.2" fill="none" class="collagen-line" style="animation-delay: 0.5s;"/>
        <path d="M 260 320 Q 180 280 130 310" stroke="var(--color-gold)" stroke-width="1.2" fill="none" class="collagen-line" style="animation-delay: 2.5s;"/>
        <path d="M 100 300 Q 110 200 70 120" stroke="var(--color-gold)" stroke-width="1.2" fill="none" class="collagen-line" style="animation-delay: 3.5s;"/>
      </svg>
    `
  },
  {
    tag: 'SMART REGENERATION',
    title: '손상된 조직의 치유',
    subtitle: 'Deep Tissue Healing',
    concept: '만성 통증과 관절 질환에 대한 비수술적이고 근본적인 해결책을 과학적으로 제시합니다.',
    mechanisms: [
      {
        title: '호밍 효과 (Homing Effect)',
        desc: '줄기세포는 체내에 주입되었을 때, 염증이나 손상이 발생한 부위에서 보내는 조난 신호(Chemokine)를 스스로 감지하고 해당 부위로 정확하게 이동하는 스마트한 추적 능력을 가지고 있습니다.'
      },
      {
        title: '조직 분화 및 염증 차단',
        desc: '손상된 연골이나 인대에 도달한 줄기세포는 해당 조직의 세포로 직접 분화(Differentiation)하여 결손 부위를 메우고, 강력한 항염증성 사이토카인을 방출하여 통증의 원인인 염증 연쇄 반응을 차단합니다.'
      }
    ],
    effects: [
      '퇴행성 관절염 연골 마모 지연 및 재생 촉진',
      '만성 염증 수치 저하 및 인대/건 조직의 근본적 강화'
    ],
    visualSvg: `
      <svg class="visual-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 80 300 C 100 210, 200 280, 250 180" stroke="rgba(255,255,255,0.06)" stroke-width="1.2" stroke-dasharray="6 4" fill="none"/>
        
        <g transform="translate(250, 180)">
          <circle cx="0" cy="0" r="45" fill="none" stroke="rgba(235, 94, 85, 0.12)" stroke-width="1" class="injury-pulse" style="animation-delay: 0s;"/>
          <circle cx="0" cy="0" r="28" fill="none" stroke="rgba(235, 94, 85, 0.22)" stroke-width="1.2" class="injury-pulse" style="animation-delay: 0.8s;"/>
          <circle cx="0" cy="0" r="14" fill="rgba(235, 94, 85, 0.08)" class="glowing-node-red"/>
          <circle cx="0" cy="0" r="4" fill="rgba(235, 94, 85, 0.8)"/>
        </g>
        
        <g transform="translate(250, 180)">
          <circle cx="0" cy="0" r="18" fill="none" stroke="var(--color-gold)" stroke-width="1.2" class="anti-inflammatory-wave" style="animation-delay: 2.2s;"/>
          <circle cx="0" cy="0" r="18" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1" class="anti-inflammatory-wave" style="animation-delay: 4.2s;"/>
        </g>

        <g class="homing-cell">
          <circle cx="250" cy="180" r="16" fill="rgba(212, 175, 55, 0.12)" stroke="var(--color-gold)" stroke-width="1.2" class="glowing-node"/>
          <circle cx="250" cy="180" r="5" fill="var(--color-gold)"/>
        </g>
      </svg>
    `
  },
  {
    tag: 'SYSTEMIC REVITALIZATION',
    title: '신체 에너지 리마스터링',
    subtitle: 'Immunity & Vitality',
    concept: '단순한 피로 회복을 넘어, 신체 전반의 생체 나이를 낮추는 전신 케어 메커니즘을 설명합니다.',
    mechanisms: [
      {
        title: '미세 혈관 신생 (Angiogenesis)',
        desc: '줄기세포는 혈관 내피 성장인자(VEGF)를 분비하여 막히거나 노화된 미세 혈관망을 새로 구축합니다. 이를 통해 뇌와 전신 장기에 산소와 영양분이 폭발적으로 공급됩니다.'
      },
      {
        title: '면역 조절 (Immunomodulation)',
        desc: '과각성된 자가면역 반응은 가라앉히고, 저하된 방어력(NK세포 및 T세포 기능)은 끌어올려 신체의 면역 밸런스를 완벽한 상태로 재조정합니다. 활성산소(스트레스 물질)를 효과적으로 제거하여 세포 산화를 방지합니다.'
      }
    ],
    effects: [
      '만성 피로 증후군 개선 및 뇌 브레인 포그(Brain Fog) 해소',
      '수술 및 중증 질환 후 전신 컨디션의 급진적 회복'
    ],
    visualSvg: `
      <svg class="visual-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 40 200 L 220 200" stroke="rgba(255,255,255,0.06)" stroke-width="4" stroke-linecap="round"/>
        
        <path d="M 100 200 C 110 170, 130 150, 160 140" stroke="var(--color-gold)" stroke-width="1.2" stroke-linecap="round" fill="none" class="vessel-path"/>
        <path d="M 140 140 C 150 120, 180 110, 200 110" stroke="var(--color-gold)" stroke-width="1" stroke-linecap="round" fill="none" class="vessel-path" style="animation-delay: 1.8s;"/>
        
        <path d="M 170 200 C 180 230, 200 250, 220 260" stroke="var(--color-gold)" stroke-width="1.2" stroke-linecap="round" fill="none" class="vessel-path" style="animation-delay: 0.8s;"/>
        <path d="M 200 250 C 210 270, 230 280, 260 285" stroke="var(--color-gold)" stroke-width="1" stroke-linecap="round" fill="none" class="vessel-path" style="animation-delay: 2.6s;"/>
        
        <g transform="translate(290, 180)" class="nk-cell">
          <circle cx="0" cy="0" r="22" fill="rgba(100, 180, 240, 0.05)" stroke="rgba(100, 180, 240, 0.3)" stroke-width="1" stroke-dasharray="4 2"/>
          <polygon points="0,-15 4,-4 15,-4 6,2 9,13 0,6 -9,13 -6,2 -15,-4 -4,-4" fill="rgba(100, 180, 240, 0.12)" stroke="rgba(100, 180, 240, 0.7)" stroke-width="1.2" class="glowing-node-blue"/>
          <circle cx="0" cy="0" r="3" fill="rgba(100, 180, 240, 0.95)"/>
        </g>
        
        <circle cx="160" cy="140" r="2.5" fill="var(--color-gold)" class="vitality-bubble" style="--bx: -20px; animation-delay: 0.5s;"/>
        <circle cx="200" cy="110" r="2" fill="var(--color-gold)" class="vitality-bubble" style="--bx: 30px; animation-delay: 2.3s;"/>
        <circle cx="220" cy="260" r="3" fill="var(--color-gold)" class="vitality-bubble" style="--bx: -35px; animation-delay: 1.3s;"/>
        <circle cx="260" cy="285" r="2.5" fill="var(--color-gold)" class="vitality-bubble" style="--bx: 10px; animation-delay: 3.2s;"/>
      </svg>
    `
  },
  {
    tag: 'PREMIUM SKIN BEAUTY',
    title: '고품격 피부 미학의 완성',
    subtitle: 'Premium Skin Aesthetics',
    concept: '피부 표면의 즉각적인 빛과 결 개선에 초점을 맞추어, 기미와 색소 침착을 근본적으로 케어하고 투명한 귀족적 광채를 선사합니다.',
    mechanisms: [
      {
        title: '엑소좀(Exosome) 침투 기술',
        desc: '줄기세포 배양액의 핵심 유효 성분인 \'엑소좀(나노 크기의 세포 간 신호 전달 물질)\'을 피부 깊숙이 침투시킵니다. 이는 세포 간의 소통을 원활하게 하여 무너진 피부 장벽을 빠르게 복구합니다.'
      },
      {
        title: '색소 침착 억제',
        desc: '자외선과 노화로 인해 과다 생성되는 멜라닌 색소의 합성 경로(Tyrosinase 활성)를 차단하고, 표피의 턴오버(Turn-over) 주기를 정상화하여 이미 침착된 기미와 잡티를 빠르게 탈락시킵니다.'
      }
    ],
    effects: [
      '기미, 난치성 색소 침착 개선 및 균일한 화이트닝 효과',
      '넓어진 모공 축소 및 매끄러운 도자기 피부결 완성'
    ],
    visualSvg: `
      <svg class="visual-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="50" y1="120" x2="350" y2="120" stroke="rgba(255,255,255,0.15)" stroke-width="1.2" class="skin-barrier-line" stroke-linecap="round"/>
        <line x1="50" y1="200" x2="350" y2="200" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="5 3"/>
        <line x1="50" y1="280" x2="350" y2="280" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="5 3"/>
        
        <text x="60" y="105" fill="rgba(255,255,255,0.25)" font-size="8" font-family="sans-serif" letter-spacing="1">EPIDERMIS (표피)</text>
        <text x="60" y="185" fill="rgba(255,255,255,0.25)" font-size="8" font-family="sans-serif" letter-spacing="1">DERMIS (진피)</text>

        <g class="exosome-node" style="animation-delay: 0s; --dx: 120px;">
          <circle cx="120" cy="100" r="6" fill="rgba(255,255,255,0.12)" stroke="var(--color-gold)" stroke-width="1" class="glowing-node"/>
          <circle cx="120" cy="100" r="2" fill="var(--color-gold)"/>
        </g>
        <g class="exosome-node" style="animation-delay: 1.4s; --dx: 220px;">
          <circle cx="220" cy="100" r="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.5)" stroke-width="1" style="filter: drop-shadow(0 0 5px rgba(255,255,255,0.4));"/>
          <circle cx="220" cy="100" r="2.5" fill="#fff"/>
        </g>
        <g class="exosome-node" style="animation-delay: 2.6s; --dx: 280px;">
          <circle cx="280" cy="100" r="6" fill="rgba(255,255,255,0.12)" stroke="var(--color-gold)" stroke-width="1" class="glowing-node"/>
          <circle cx="280" cy="100" r="2" fill="var(--color-gold)"/>
        </g>

        <g class="melanin-target" style="animation-delay: 0s;">
          <circle cx="120" cy="260" r="10" fill="none" stroke="rgba(212,175,55,0.12)" stroke-width="1" stroke-dasharray="2 2"/>
          <circle cx="120" cy="260" r="4" fill="rgba(130, 95, 45, 0.35)" stroke="rgba(130, 95, 45, 0.7)" stroke-width="1"/>
        </g>
        <g class="melanin-target" style="animation-delay: 1.4s;">
          <circle cx="220" cy="260" r="14" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="2 2"/>
          <circle cx="220" cy="260" r="5" fill="rgba(130, 95, 45, 0.35)" stroke="rgba(130, 95, 45, 0.7)" stroke-width="1"/>
        </g>
        <g class="melanin-target" style="animation-delay: 2.6s;">
          <circle cx="280" cy="260" r="10" fill="none" stroke="rgba(212,175,55,0.12)" stroke-width="1" stroke-dasharray="2 2"/>
          <circle cx="280" cy="260" r="4" fill="rgba(130, 95, 45, 0.35)" stroke="rgba(130, 95, 45, 0.7)" stroke-width="1"/>
        </g>
      </svg>
    `
  }
];

function initDetailPages() {
  const overlay = document.getElementById('detail-overlay');
  if (!overlay) return;

  const closeBtn = document.getElementById('detail-close-btn');
  const overlayBg = overlay.querySelector('.detail-overlay-bg');
  
  const tagEl = document.getElementById('detail-tag');
  const titleEl = document.getElementById('detail-title');
  const subtitleEl = document.getElementById('detail-subtitle');
  const conceptEl = document.getElementById('detail-concept');
  const mechanismsEl = document.getElementById('detail-mechanisms');
  const effectsEl = document.getElementById('detail-effects');
  const visualContainer = document.getElementById('detail-visual-container');

  const cards = document.querySelectorAll('.essence-card');

  // Open details
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const index = parseInt(card.getAttribute('data-card-index'), 10);
      if (isNaN(index) || !cardDetailsData[index]) return;

      const data = cardDetailsData[index];

      // Inject Content
      tagEl.textContent = data.tag;
      titleEl.textContent = data.title;
      subtitleEl.textContent = data.subtitle;
      conceptEl.textContent = data.concept;

      // Inject Mechanisms
      mechanismsEl.innerHTML = '';
      data.mechanisms.forEach(mech => {
        const item = document.createElement('div');
        item.className = 'mechanism-item';
        item.innerHTML = `
          <span class="mechanism-item-title">${mech.title}</span>
          <p class="mechanism-item-desc">${mech.desc}</p>
        `;
        mechanismsEl.appendChild(item);
      });

      // Inject Expected Effects
      effectsEl.innerHTML = '';
      data.effects.forEach(eff => {
        const item = document.createElement('li');
        item.className = 'effect-item';
        item.textContent = eff;
        effectsEl.appendChild(item);
      });

      // Inject SVG Infographic
      visualContainer.innerHTML = data.visualSvg;

      // Show Overlay
      overlay.classList.add('active');
      
      // Lock background scroll without jumping
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.setAttribute('data-scroll-y', scrollY);
    });
  });

  // Close details
  function closeOverlay() {
    overlay.classList.remove('active');
    
    // Unlock background scroll and restore position
    const scrollY = parseInt(document.body.getAttribute('data-scroll-y') || '0', 10);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
    
    // Clear SVG after transition to save resources
    setTimeout(() => {
      if (!overlay.classList.contains('active')) {
        visualContainer.innerHTML = '';
      }
    }, 500);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeOverlay);
  }

  if (overlayBg) {
    overlayBg.addEventListener('click', closeOverlay);
  }

  // Handle ESC key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeOverlay();
    }
  });
}
