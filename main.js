/* 
  =========================================
  THE WELLSAM STEM CELL - INTERACTIVE ENGINE
  =========================================
*/

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
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
    title: '전신 항노화 상담',
    subtitle: 'Cellular Rejuvenation',
    concept: '단순히 겉보기를 젊게 만드는 것이 아닙니다. 노화로 인해 기능이 저하된 내 몸속 전신의 세포를 깨워, 신체 내부의 활력과 건강한 컨디션을 근본적으로 되찾아주는 전신 안티에이징 치료입니다.',
    conceptImage: '/detail1-concept.webp',
    checklist: ['피로 지속 기간', '수면 상태', '전신 컨디션 변화', '기존 질환 및 복용 약물', '상담 목적'],
    mechanisms: [
      {
        title: '잠든 재생 세포 깨우기 (파라크라인 효과)',
        desc: '우리 몸에 들어간 줄기세포는 노화로 인해 활동을 멈춘 전신 장기와 조직의 세포들에게 신호를 보내 다시 일하도록 만듭니다. 잠들어 있던 세포들이 스스로 깨어나 저하된 신체 기능을 복구하기 시작합니다.',
        image: '/detail1-mechanism1.webp'
      },
      {
        title: '신체 밸런스 및 대사 정상화',
        desc: '저하된 호르몬 밸런스와 에너지 대사를 정상 수준으로 끌어올립니다. 세포 단위에서부터 에너지가 다시 차오르게 만들어, 예전과 같은 생기와 활력을 되찾아 줍니다.',
        image: '/detail1-mechanism2.webp'
      }
    ],
    effects: [
      '만성적인 무기력함 및 피로감의 획기적 개선',
      '전반적인 신체 활력 회복 및 에너지 레벨 상승',
      '세포 기능 활성화를 통한 노화 진행의 지연',
      '수면의 질 개선 및 상쾌한 아침 컨디션 회복'
    ]
  },
  {
    tag: 'PAIN & JOINT REGENERATION',
    title: '관절·통증 상담',
    subtitle: 'Deep Tissue Healing',
    concept: '수술에 대한 두려움과 오랜 회복 기간 없이, 내 몸이 가진 본연의 치유력으로 손상된 조직을 다시 세웁니다. 닳고 찢겨 통증을 유발하는 관절과 인대에 줄기세포를 직접 투여하여, 염증을 잠재우고 조직 자체를 건강하게 재생시키는 근본적인 비수술 치료입니다.',
    conceptImage: '/detail2-concept.webp',
    checklist: ['불편한 부위', '통증 지속 기간', '기존 검사 또는 치료 이력', '움직일 때 불편 정도', '수술 또는 시술 경험'],
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
      '퇴행성 관절염으로 인한 무릎·어깨 통증의 획기적 완화',
      '스포츠 손상, 테니스 엘보 등 찢어진 인대 및 힘줄의 빠른 복구',
      '수술 및 마취에 대한 부담 없이 시술 후 빠른 일상생활 복귀',
      '진통제 의존도를 낮추고 자유롭고 편안한 움직임 회복'
    ]
  },
  {
    tag: 'IMMUNITY & VITALITY',
    title: '면역·피로 상담',
    subtitle: 'Systemic Revitalization',
    concept: '아무리 쉬어도 풀리지 않는 무거운 몸, 수액이나 영양제로는 닿을 수 없는 피로의 근본 원인을 해결합니다. 체내에 주입된 줄기세포가 전신을 순환하며 노화되고 손상된 장기 세포를 깨우고, 무너진 신체 방어벽을 견고하게 재건하여 당신의 일상에 가볍고 맑은 활력을 되찾아 드립니다.',
    conceptImage: '/detail3-concept.webp',
    checklist: ['피로가 심해지는 시간대', '수면의 질', '스트레스 정도', '잦은 감기 또는 염증 경험', '기존 건강검진 결과'],
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
      '면역력 저하로 인한 잦은 감기, 대상포진 등 감염성 질환 예방',
      '전반적인 신체 에너지 레벨 상승 및 뇌 안개(Brain Fog) 현상 완화',
      '질병이나 수술 후 급격히 떨어진 기력의 빠른 정상화'
    ]
  },
  {
    tag: 'PREMIUM SKIN AESTHETICS',
    title: '피부·항노화 상담',
    subtitle: 'Ultimate Skin Rejuvenation',
    concept: '화장으로 가릴 수 없는 깊은 세월의 흔적과 피부 칙칙함, 이제 겉이 아닌 속부터 완벽하게 채웁니다. 줄기세포에 담긴 수백 가지의 강력한 성장인자가 피부 가장 깊은 곳까지 스며들어 무너진 탄력 기둥을 바로 세우고, 당신의 피부 본연이 가진 가장 맑고 눈부신 귀족적 광채를 깨워냅니다.',
    conceptImage: '/detail4-concept.webp',
    checklist: ['피부 탄력 저하', '주름 또는 피부 톤 변화', '피부 시술 이력', '생활습관과 수면', '원하는 변화의 방향'],
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
      '화장품으로 구현할 수 없는 피부 속부터 우러나는 고급스러운 물광',
      '오랜 시간 자리 잡은 기미, 깊은 주름, 색소 침착의 근본적 지우개 효과',
      '얇고 예민해진 피부 장벽을 튼튼하고 건강하게 복구'
    ]
  }
];

const kbeautyDetailsData = [
  {
    tag: 'SKIN AESTHETICS',
    title: '피부미용',
    subtitle: 'Premium Skin Care',
    concept: '피부 탄력, 피부 톤, 광채, 주름 관리 등 보이지 않는 피부 균형을 맞춰 화사하고 생기 있는 본연의 아름다움을 찾아드립니다. 겉면의 피부결 개선뿐만 아니라 근본적인 밸런스를 바로잡아 건강한 윤기를 되찾습니다.',
    conceptImage: '/kbeauty_skin.webp',
    checklist: ['피부 탄력 저하 정도', '주름 및 피부 톤 변화', '최근 피부과 시술 이력', '사용 중인 화장품 및 트러블 여부', '가장 기대하는 개선 효과'],
    mechanisms: [
      {
        title: '맞춤형 피부 장벽 재건',
        desc: '건조하고 예민해진 피부 장벽을 튼튼하게 복구시켜 외부 자극으로부터 피부를 보호하고, 수분을 꽉 잡아주는 힘을 길러줍니다.',
        image: '/detail4-mechanism1.webp'
      },
      {
        title: '맑고 투명한 피부결 디자인',
        desc: '기미, 잡티 등 색소 침착을 완화하고 피부 속부터 우러나오는 자연스러운 광채와 맑은 피부 톤을 연출합니다.',
        image: '/detail4-mechanism2.webp'
      }
    ],
    effects: [
      '피부 속부터 차오르는 맑고 투명한 광채',
      '탄력 있고 매끄러운 피부결 회복',
      '피부 장벽 강화를 통한 건강한 피부 유지',
      '주름 및 잔주름의 자연스러운 완화'
    ]
  },
  {
    tag: 'FACIAL SYMMETRY',
    title: '안면비대칭·안면마비',
    subtitle: 'Balance & Alignment',
    concept: '얼굴 균형, 턱선과 목선 정렬, 마비 후 회복 등 섬세한 안면 근육의 밸런스를 바로잡아 편안하고 자연스러운 미소를 복원합니다. 틀어진 근육과 골격의 조화를 되찾아줍니다.',
    conceptImage: '/kbeauty_symmetry.webp',
    checklist: ['얼굴 양측의 불균형 정도', '턱관절 소리 및 통증 여부', '목과 어깨의 뭉침 상태', '과거 교정 치료 이력', '원하는 얼굴 라인의 변화'],
    mechanisms: [
      {
        title: '섬세한 근육 및 근막 이완',
        desc: '긴장하고 뭉친 안면 및 목 주변의 근막을 부드럽게 이완시켜, 비대칭의 원인이 되는 근육 불균형을 해소합니다.',
        image: '/detail2-mechanism1.webp'
      },
      {
        title: '자연스러운 라인 정렬',
        desc: '인위적인 시술 없이 근육의 본래 위치와 움직임을 되찾아, 가장 자연스럽고 편안한 인상과 V라인을 완성합니다.',
        image: '/detail2-mechanism2.webp'
      }
    ],
    effects: [
      '좌우 대칭이 맞는 조화로운 얼굴 라인',
      '자연스럽고 편안한 표정과 미소 회복',
      '턱선 및 목선의 아름다운 실루엣 완성',
      '안면 마비 후유증의 효과적인 개선'
    ]
  },
  {
    tag: 'POST-SURGERY CARE',
    title: '성형수술 후 프로그램',
    subtitle: 'Fast Recovery',
    concept: '수술 후 붓기, 멍, 회복 관리를 통해 신속한 일상 복귀를 돕고 수술 본연의 아름다운 라인이 부작용 없이 완성되도록 정교하게 지원합니다.',
    conceptImage: '/kbeauty_recovery.webp',
    checklist: ['최근 수술 종류 및 부위', '수술 후 경과 시간', '현재 가장 불편한 증상(붓기, 멍, 통증)', '복용 중인 약물 여부', '일상 복귀 희망 일정'],
    mechanisms: [
      {
        title: '급성 붓기 및 멍 집중 배출',
        desc: '정체된 림프 순환을 촉진하여 수술 부위의 붓기와 어혈(멍)을 빠르고 안전하게 배출시킵니다.',
        image: '/detail3-mechanism1.webp'
      },
      {
        title: '조직 유착 방지 및 라인 고정',
        desc: '수술 부위가 단단하게 뭉치거나 유착되는 것을 방지하고, 수술 본연의 매끄럽고 아름다운 라인이 자리 잡도록 돕습니다.',
        image: '/detail3-mechanism2.webp'
      }
    ],
    effects: [
      '수술 후 붓기 및 멍의 빠른 감소',
      '수술 부위의 조직 안정화 및 유착 방지',
      '통증 완화 및 빠르고 편안한 일상 복귀',
      '수술 만족도를 극대화하는 자연스러운 라인 완성'
    ]
  },
  {
    tag: 'PREMIUM DIET',
    title: '다이어트',
    subtitle: 'Body Silhouette',
    concept: '체형 변화, 붓기, 대사 관리 등 신체 리듬을 깨워 품격 있는 바디 실루엣과 건강한 활력을 디자인합니다. 단순한 체중 감량이 아닌 건강한 대사 사이클을 되찾습니다.',
    conceptImage: '/kbeauty_diet.webp',
    checklist: ['체중 감량 목표', '평소 식습관 및 수면 패턴', '만성적인 붓기 또는 소화 불량 여부', '과거 다이어트 경험 및 요요 여부', '집중적으로 개선하고 싶은 신체 부위'],
    mechanisms: [
      {
        title: '신진대사 사이클 리셋',
        desc: '저하된 기초 대사량을 끌어올리고 체내 노폐물 배출을 촉진하여, 살이 쉽게 찌지 않는 건강한 체질로 개선합니다.',
        image: '/detail1-mechanism2.webp'
      },
      {
        title: '국소 부위 라인 집중 관리',
        desc: '잘 빠지지 않는 군살과 부종을 집중적으로 관리하여, 탄력 잃은 바디 라인을 매끄럽고 균형 있게 잡아줍니다.',
        image: '/detail1-mechanism1.webp'
      }
    ],
    effects: [
      '건강하고 무리 없는 자연스러운 체중 감량',
      '부종 감소 및 매끄러운 바디 실루엣 완성',
      '기초 대사량 증가로 인한 활력 넘치는 일상',
      '요요 현상을 최소화하는 체질 개선 효과'
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

        let checklistHtml = '';
        if (data.checklist) {
          checklistHtml = `
            <div class="detail-checklist">
              <h4 class="section-title text-serif">상담 점검 항목</h4>
              <ul class="checklist-items">
                ${data.checklist.map(item => `<li><span class="check-icon">✔</span> ${item}</li>`).join('')}
              </ul>
            </div>
          `;
        }

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

            ${checklistHtml}

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
            
            <div class="detail-action-container">
              <button class="detail-cta-btn" onclick="openConsultationForm('${index}')">내 상태 점검해보기 (상담 질문지)</button>
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


window.openConsultationForm = function(indexStr) {
  const detailModal = document.getElementById('detail-overlay');
  if (detailModal) {
    detailModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  const idx = parseInt(indexStr, 10);
  const isKBeauty = idx >= 4;
  const cats = ['STEM_1', 'STEM_2', 'STEM_3', 'STEM_4', 'KB_1', 'KB_2', 'KB_3', 'KB_4'];
  const subCat = cats[idx] || 'STEM_1';

  if (typeof formData !== 'undefined') {
    formData.mainCategory = isKBeauty ? 'KBEAUTY' : 'STEM';
    formData.subCategory = subCat;
  }

  if (typeof window.openModal === 'function') {
    window.openModal();
  }
};
