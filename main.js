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
    tag: 'PREMIUM ANTI-AGING',
    title: '전신 항노화 케어',
    subtitle: 'Cellular Rejuvenation',
    concept: '피부 겉면만 일시적으로 당겨주는 시술이 아닙니다. 노화로 저하된 내 몸속 세포를 젊고 건강한 상태로 되돌려, 피부 탄력은 물론 전신의 활력을 함께 되찾아주는 근본적인 안티에이징 치료입니다.',
    conceptImage: '/detail1-concept.webp',
    mechanisms: [
      {
        title: '잠든 재생 세포 깨우기 (파라크라인 효과)',
        desc: '우리 몸에 들어간 줄기세포는 노화로 인해 활동을 멈춘 피부와 조직의 세포들에게 신호를 보내 다시 일하도록 만듭니다. 잠들어 있던 세포들이 스스로 깨어나 손상된 부위를 복구하기 시작합니다.',
        image: '/detail1-mechanism1.webp'
      },
      {
        title: '천연 콜라겐 자가 생성',
        desc: '외부에서 인공 물질(필러 등)을 억지로 주입하지 않습니다. 내 몸의 세포가 스스로 양질의 콜라겐과 엘라스틴을 대량으로 만들어내도록 유도하여, 탄력을 잃고 무너진 피부 속 지지대를 튼튼하게 다시 세웁니다.',
        image: '/detail1-mechanism2.webp'
      }
    ],
    effects: [
      '처진 얼굴선의 자연스러운 리프팅 및 꺼진 볼륨 복원',
      '피부 속 두께가 증가하며 깊게 패인 주름(진성 주름) 완화',
      '화장품으로 채울 수 없는 피부 속부터 우러나오는 윤기(광채)',
      '전반적인 신체 컨디션 회복 및 노화로 인한 무기력함 개선'
    ]
  },
  {
    tag: 'PAIN & JOINT REGENERATION',
    title: '비수술 관절·통증 재생',
    subtitle: 'Deep Tissue Healing',
    concept: '수술에 대한 두려움과 오랜 회복 기간 없이, 내 몸이 가진 본연의 치유력으로 손상된 조직을 다시 세웁니다. 닳고 찢겨 통증을 유발하는 관절과 인대에 줄기세포를 직접 투여하여, 염증을 잠재우고 조직 자체를 건강하게 재생시키는 근본적인 비수술 치료입니다.',
    conceptImage: '/detail2-concept.webp',
    mechanisms: [
      {
        title: '통증의 뿌리를 찾아가는 스마트 추적 시스템',
        desc: '우리 몸에 투여된 줄기세포는 염증이 있거나 손상된 부위가 보내는 \'구조 신호\'를 스스로 감지하여 정확하게 찾아갑니다. 통증의 근원지에 도달하여 강력한 항염증 성분을 뿜어내어 지긋지긋한 만성 통증과 붓기를 빠르게 가라앉힙니다.',
        image: '/detail2-mechanism1.webp'
      },
      {
        title: '손상된 연골과 인대의 직접 재생',
        desc: '단순히 통증만 일시적으로 가리는 진통제나 스테로이드가 아닙니다. 손상된 부위에 자리 잡은 줄기세포는 연골과 인대 세포로 직접 변환되어, 닳아 없어진 빈 공간을 튼튼하고 쫀쫀한 새 조직으로 채워 넣습니다.',
        image: '/detail2-mechanism2.webp'
      }
    ],
    effects: [
      '무릎 골관절염 등 퇴행성 관절염으로 인한 무릎·어깨 통증의 획기적 완화',
      '스포츠 손상, 테니스 엘보 등 찢어진 인대 및 힘줄의 빠른 복구',
      '수술 및 마취에 대한 부담 없이 시술 후 빠른 일상생활 복귀',
      '진통제 의존도를 낮추고 자유롭고 편안한 움직임 회복'
    ]
  },
  {
    tag: 'IMMUNITY & VITALITY',
    title: '면역력 강화 및 만성피로 회복',
    subtitle: 'Systemic Revitalization',
    concept: '아무리 쉬어도 풀리지 않는 무거운 몸, 수액이나 영양제로는 닿을 수 없는 피로의 근본 원인을 해결합니다. 체내에 주입된 줄기세포가 전신을 순환하며 노화되고 손상된 장기 세포를 깨우고, 무너진 신체 방어벽을 견고하게 재건하여 당신의 일상에 가볍고 맑은 활력을 되찾아 드립니다.',
    conceptImage: '/detail3-concept.webp',
    mechanisms: [
      {
        title: '전신 산소망 복구 (미세 혈관 신생)',
        desc: '줄기세포는 몸속 구석구석 혈액이 통하지 않는 막히고 좁아진 미세 혈관들을 새로 뚫고 연결합니다. 뇌와 척수, 전신 장기에 맑은 산소와 영양분이 폭발적으로 공급되면서 머리가 맑아지고 묵은 피로가 씻겨 내려갑니다.',
        image: '/detail3-mechanism1.webp'
      },
      {
        title: '무너진 방어 체계의 정상화',
        desc: '스트레스와 노화로 밸런스가 깨진 면역 세포들을 찾아내어 최적의 상태로 조율합니다. 외부 바이러스에 대한 강력한 방어막을 형성할 뿐만 아니라, 잦은 잔병치레와 자가면역 질환의 고통으로부터 내 몸을 든든하게 지켜냅니다.',
        image: '/detail3-mechanism2.webp'
      }
    ],
    effects: [
      '수면이나 휴식으로도 해결되지 않던 극심한 만성피로 증후군 개선',
      '심뇌혈관 및 고지혈증 등 꽉 막힌 전신 혈관 염증 정화',
      '아토피, 건선, 대상포진 등 비정상적 면역 반응 제어 및 회복',
      '질병이나 수술 후 급격히 떨어진 기력의 빠른 정상화'
    ]
  },
  {
    tag: 'PREMIUM SKIN AESTHETICS',
    title: '줄기세포 피부 재생술',
    subtitle: 'Ultimate Skin Rejuvenation',
    concept: '화장으로 가릴 수 없는 깊은 세월의 흔적과 피부 칙칙함, 이제 겉이 아닌 속부터 완벽하게 채웁니다. 줄기세포에 담긴 수백 가지의 강력한 성장인자가 피부 가장 깊은 곳까지 스며들어 무너진 탄력 기둥을 바로 세우고, 당신의 피부 본연이 가진 가장 맑고 눈부신 귀족적 광채를 깨워냅니다.',
    conceptImage: '/detail4-concept.webp',
    mechanisms: [
      {
        title: '진피층 탄력 기둥줄기 재건',
        desc: '단순히 수분을 채우는 것을 넘어섭니다. 줄기세포 성장인자는 피부의 뼈대 역할을 하는 진피층의 콜라겐과 엘라스틴 섬유망을 젊은 시절의 상태로 촘촘하고 단단하게 재조립하여, 처진 피부를 쫀쫀하게 끌어올립니다.',
        image: '/detail4-mechanism1.webp'
      },
      {
        title: '맑은 유리알 피부를 위한 색소 리셋',
        desc: '칙칙한 안색과 기미, 잡티의 원인이 되는 검은 색소(멜라닌)가 퍼지는 것을 강력하게 차단합니다. 피부 세포의 교체 주기를 10대 때처럼 빠르게 앞당겨, 묵은 각질과 색소가 자연스럽게 탈락하고 티 없이 맑고 투명한 새 피부가 차오르게 합니다.',
        image: '/detail4-mechanism2.webp'
      }
    ],
    effects: [
      '자연스럽게 차오르는 얼굴 볼륨 및 안면 리프팅 효과',
      '상피재생인자가 농축된 자가혈청 프리미엄 안약을 통한 난치성 안구건조증 완화',
      '오랜 시간 자리 잡은 기미, 깊은 주름, 색소 침착의 근본적 지우개 효과',
      '얇고 예민해진 피부 장벽을 튼튼하고 건강하게 복구'
    ]
  }
];

const kbeautyDetailsData = [
  {
    tag: 'SKIN AESTHETICS',
    title: '피부미용 (스킨부스터·리프팅)',
    subtitle: 'Premium Skin Care',
    concept: '프리미엄 스킨부스터, 리프팅, 타이트닝 등 가장 진보된 K-Beauty 시술을 통해 피부 깊은 곳의 코어 탄력을 세우고 압도적인 광채를 선사합니다. 단순한 표면 관리를 넘어 피부 본연의 힘을 길러 투명하게 빛나는 글래스 스킨(Glass Skin)을 완성합니다.',
    conceptImage: '/kbeauty_skin.webp',
    checklist: ['원하는 개선 포인트 (탄력, 미백, 모공 등)', '선호하는 시술 방식 (레이저, 스킨부스터)', '최근 피부과 시술 이력 및 반응', '평소 피부 타입 및 화장품 사용 패턴', '회복 기간에 대한 기대치 (다운타임)'],
    mechanisms: [
      {
        title: '매선 & 조선침법(정안침) 근본 리프팅',
        desc: '녹는 실(매선)과 전통 침법을 결합하여 표면적 관리를 넘어 피부 속 진피층의 탄력 기둥을 세우고, 처진 근육을 쫀쫀하게 끌어올리는 비수술 윤곽 타이트닝입니다.',
        image: '/kbeauty_skin_mech1.webp'
      },
      {
        title: 'TMS 뇌기능 순환 & 하이엔드 광채 부여',
        desc: '자기장으로 뇌 신경을 안정시키는 TMS 치료를 병행하여, 수면 중 피부 재생력을 극대화하고 피부 깊은 곳부터 투명하게 빛나는 압도적인 광채(물광)를 연출합니다.',
        image: '/kbeauty_skin_mech2.webp'
      }
    ],
    effects: [
      '화장품으로 구현할 수 없는 피부 속부터 우러나는 고급스러운 물광',
      '늘어진 얼굴 라인의 즉각적인 타이트닝 및 V라인 정돈',
      '피부결 개선, 모공 축소 및 맑고 투명한 안색 회복',
      '콜라겐 밀도 증가를 통한 근본적인 코어 탄력 강화'
    ]
  },
  {
    tag: 'FACIAL SYMMETRY',
    title: '안면비대칭·윤곽 교정',
    subtitle: 'Balance & Alignment',
    concept: '미세하게 틀어진 안면 비대칭과 무너진 윤곽 라인을 정교하게 교정하여, 어느 각도에서나 완벽한 비율과 자연스러운 미소를 되찾아드립니다. 인위적인 시술이 아닌 코어 근육과 근막의 밸런스를 회복하는 프리미엄 윤곽 교정입니다.',
    conceptImage: '/kbeauty_symmetry.webp',
    checklist: ['얼굴 좌우 대칭 및 라인 비대칭 정도', '턱관절 소리 또는 뻐근함 여부', '사진 촬영 시 신경 쓰이는 얼굴 각도', '과거 윤곽 시술 및 교정 이력', '원하는 최종 페이스 라인'],
    mechanisms: [
      {
        title: '두개천골요법(CST) 코어 근막 이완',
        desc: '비대칭을 유발하는 뭉친 안면 근육과 하관의 근막을 두개천골요법으로 부드럽게 이완시켜, 뇌신경 흐름을 원활하게 하고 턱선과 목선으로 이어지는 림프 순환을 돕습니다.',
        image: '/kbeauty_sym_mech1.webp'
      },
      {
        title: '턱관절·경추 추나요법 대칭 정렬',
        desc: '우리 몸의 중심축인 턱관절과 경추 1, 2번의 미세한 틀어짐을 교정하여 뼈를 깎지 않고도 얼굴의 구조적 대칭과 가장 자연스러운 V라인 윤곽을 완성합니다.',
        image: '/kbeauty_sym_mech2.webp'
      }
    ],
    effects: [
      '좌우 대칭이 맞는 조화롭고 입체적인 얼굴 라인',
      '사진 보정이 필요 없는 매끄러운 안면 윤곽',
      '부자연스러운 턱선 및 목선의 우아한 실루엣 완성',
      '인위적이지 않고 편안한 본연의 미소 회복'
    ]
  },
  {
    tag: 'POST-SURGERY CARE',
    title: '성형수술 후 프리미엄 회복',
    subtitle: 'Fast Recovery',
    concept: '성형수술 후 민감해진 피부와 조직의 빠른 회복을 돕는 하이엔드 사후 관리 시스템입니다. 정체된 붓기와 멍을 효과적으로 배출하고, 수술로 디자인된 아름다운 라인이 가장 완벽하게 자리 잡을 수 있도록 섬세하게 케어합니다.',
    conceptImage: '/kbeauty_rec_modal_concept.webp',
    checklist: ['최근 수술 종류 및 부위', '수술 후 경과 시간', '붓기, 멍, 바이오본드(뭉침) 정도', '일상 및 직장 복귀 희망 일정', '기대하는 최종 회복 목표'],
    mechanisms: [
      {
        title: '프리미엄 림프 순환 및 붓기·멍 배출',
        desc: '최고급 에스테틱 디바이스와 전문 테라피를 결합하여 수술 후 정체된 림프의 순환을 촉진, 잔붓기와 멍을 신속하고 편안하게 배출합니다.',
        image: '/kbeauty_rec_mech1.webp'
      },
      {
        title: '바이오본드 예방 및 매끄러운 라인 안착',
        desc: '수술 부위 조직이 단단하게 뭉치는 현상을 예방하고 손상된 피부의 재생을 유도하여, 디자인된 수술 라인이 완벽하게 안착되도록 돕습니다.',
        image: '/kbeauty_rec_mech2.webp'
      }
    ],
    effects: [
      '잔붓기와 멍의 신속한 제거로 빠르고 편안한 일상 복귀',
      '수술 부위 뭉침(바이오본드) 방지 및 매끄러운 라인 완성',
      '피부 재생 촉진을 통한 자극 완화 및 코어 탄력 회복',
      '수술 만족도를 최상으로 끌어올리는 하이엔드 애프터 케어'
    ]
  },
  {
    tag: 'PREMIUM DIET',
    title: '프리미엄 바디 컨투어링',
    subtitle: 'Body Silhouette',
    concept: '단순한 체중 감량을 넘어, 불필요한 군살을 정돈하고 무너진 바디 라인을 매끄럽게 조각하는 하이엔드 바디 컨투어링입니다. 정체된 순환을 일깨우고 코어 탄력을 더해 품격 있고 완벽한 실루엣을 완성합니다.',
    conceptImage: '/kbeauty_diet_modal_concept.webp',
    checklist: ['목표 체중 및 희망하는 옷 사이즈', '집중적으로 관리하고 싶은 바디 부위 (복부, 팔뚝 등)', '평소 식습관, 수면 패턴 및 라이프스타일', '만성적인 부종(붓기) 및 순환 저하 여부', '과거 다이어트 경험 및 요요 발생 여부'],
    mechanisms: [
      {
        title: '산삼비만약침 국소 부위 실루엣 조각',
        desc: '운동만으로는 빼기 힘든 복부, 팔뚝 등 국소 부위의 군살을 산삼비만약침으로 섬세하게 분해하고, 처짐 없는 쫀쫀하고 매끄러운 바디 라인을 디자인합니다.',
        image: '/kbeauty_diet_mech1.webp'
      },
      {
        title: '대사 기능 정상화 및 요요 방지 환약',
        desc: '단순 체중 감량이 아닌 정체된 림프와 혈액 순환을 촉진하여 만성 부종을 제거하고, 체질 맞춤 환약 처방으로 기초 대사량을 높여 요요 없는 건강한 체질로 개선합니다.',
        image: '/kbeauty_diet_mech2.webp'
      }
    ],
    effects: [
      '국소 부위 군살 정리를 통한 완벽한 비율의 바디 실루엣',
      '셀룰라이트 완화 및 쫀쫀하고 매끄러운 바디 피부결 완성',
      '만성적인 붓기 및 부종의 근본적인 해소',
      '건강한 대사 사이클 회복으로 요요 없는 체질 개선'
    ]
  }
];

function initDetailPages() {
  const overlay = document.getElementById('detail-overlay');
  if (!overlay) return;

  const closeBtn = document.getElementById('detail-close-btn');
  const overlayBg = overlay.querySelector('.detail-overlay-bg');
  const dynamicContent = document.getElementById('detail-dynamic-content');

  const cards = document.querySelectorAll('.essence-card');

  // Open details
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const index = parseInt(card.getAttribute('data-card-index'), 10);
      if (isNaN(index)) return;

      let data;
      if (index < 4) {
        data = cardDetailsData[index];
      } else {
        data = kbeautyDetailsData[index - 4];
      }
      if (!data) return;

      // Check if it's the new landing page format (has conceptImage)
      if (data.conceptImage) {
        dynamicContent.classList.add('scroll-mode');
        
        let mechanismsHtml = '';
        data.mechanisms.forEach(mech => {
          mechanismsHtml += `
            <div class="mechanism-item">
              <span class="mechanism-item-title">${mech.title}</span>
              <p class="mechanism-item-desc">${mech.desc}</p>
              ${mech.image ? `<img src="${mech.image}" class="detail-section-img" alt="${mech.title}">` : ''}
            </div>
          `;
        });

        let effectsHtml = '';
        data.effects.forEach(eff => {
          effectsHtml += `<li class="effect-item">${eff}</li>`;
        });

        dynamicContent.innerHTML = `
          <div class="detail-scroll-inner">
            <span class="detail-tag">${data.tag}</span>
            <h2 class="detail-title text-serif">${data.title}</h2>
            <span class="detail-subtitle">${data.subtitle}</span>
            
            <div class="detail-concept-box">
              <span class="concept-label">TREATMENT CONCEPT</span>
              <p class="detail-concept">${data.concept}</p>
            </div>
            
            <img src="${data.conceptImage}" class="detail-hero-img" alt="Treatment Concept">

            <div class="detail-sections">
              <div class="detail-section">
                <h4 class="section-title text-serif">치료 메커니즘 (The Science)</h4>
                <div class="mechanism-list">
                  ${mechanismsHtml}
                </div>
              </div>

              <div class="detail-section">
                <h4 class="section-title text-serif">전문적 기대 효과</h4>
                <ul class="effect-list">
                  ${effectsHtml}
                </ul>
              </div>
            </div>

            <div class="sanctuary-cta-box" style="margin-top: 50px; padding-bottom: 40px; text-align: center;">
              <button class="btn btn-luxury consultation-btn" onclick="openModal()">
                상담 신청하기 <span class="arrow">→</span>
              </button>
            </div>
          </div>
        `;
      } else {
        // Legacy Split Layout
        dynamicContent.classList.remove('scroll-mode');
        
        let mechanismsHtml = '';
        data.mechanisms.forEach(mech => {
          mechanismsHtml += `
            <div class="mechanism-item">
              <span class="mechanism-item-title">${mech.title}</span>
              <p class="mechanism-item-desc">${mech.desc}</p>
            </div>
          `;
        });

        let effectsHtml = '';
        data.effects.forEach(eff => {
          effectsHtml += `<li class="effect-item">${eff}</li>`;
        });

        dynamicContent.innerHTML = `
          <div class="detail-content-side">
            <span class="detail-tag">${data.tag}</span>
            <h2 class="detail-title text-serif">${data.title}</h2>
            <span class="detail-subtitle">${data.subtitle}</span>

            <div class="detail-concept-box">
              <span class="concept-label">TREATMENT CONCEPT</span>
              <p class="detail-concept">${data.concept}</p>
            </div>

            <div class="detail-sections">
              <div class="detail-section">
                <h4 class="section-title text-serif">치료 메커니즘 (The Science)</h4>
                <div class="mechanism-list">
                  ${mechanismsHtml}
                </div>
              </div>

              <div class="detail-section">
                <h4 class="section-title text-serif">전문적 기대 효과</h4>
                <ul class="effect-list">
                  ${effectsHtml}
                </ul>
              </div>
            </div>
            
            <div class="sanctuary-cta-box" style="margin-top: 50px; text-align: center;">
              <button class="btn btn-luxury consultation-btn" onclick="openModal()">
                상담 신청하기 <span class="arrow">→</span>
              </button>
            </div>
          </div>

          <div class="detail-visual-side">
            <div class="visual-canvas-container">
              ${data.visualSvg}
            </div>
          </div>
        `;
      }

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
    
    // Clear dynamic content after transition to save resources
    setTimeout(() => {
      if (!overlay.classList.contains('active')) {
        dynamicContent.innerHTML = '';
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
