(function () {
  const SITE_NAME = "Paragon";
  const FIXED_CONTENT_TITLE = "Paragon";
  const CONTENT_TITLE_LOGO_SRC = "../../../../new-assets/paragon/logo_on_p1.png";
  function initBasicContentGuard() {
    if (window.__basicContentGuardInitialized) return;
    window.__basicContentGuardInitialized = true;
    document.documentElement.classList.add("content-guard-on");

    const editableSelector = "input, textarea, [contenteditable='true']";
    const isEditable = function(target) {
      return !!(target && target.closest && target.closest(editableSelector));
    };

    document.addEventListener(
      "contextmenu",
      function (event) {
        if (isEditable(event.target)) return;
        event.preventDefault();
      },
      { capture: true }
    );

    document.addEventListener(
      "selectstart",
      function (event) {
        if (isEditable(event.target)) return;
        event.preventDefault();
      },
      { capture: true }
    );

    document.addEventListener(
      "copy",
      function (event) {
        if (isEditable(event.target)) return;
        event.preventDefault();
      },
      { capture: true }
    );

    document.addEventListener(
      "cut",
      function (event) {
        if (isEditable(event.target)) return;
        event.preventDefault();
      },
      { capture: true }
    );

    document.addEventListener(
      "dragstart",
      function (event) {
        const target = event.target;
        if (!target) return;
        if (target.tagName === "IMG" || target.closest("img")) {
          event.preventDefault();
        }
      },
      { capture: true }
    );

    document.addEventListener(
      "keydown",
      function (event) {
        const key = String(event.key || "").toLowerCase();
        const ctrlOrMeta = event.ctrlKey || event.metaKey;

        if (key === "f12" || event.keyCode === 123) {
          event.preventDefault();
          return;
        }

        if (ctrlOrMeta && event.shiftKey && (key === "i" || key === "j" || key === "c" || key === "k")) {
          event.preventDefault();
          return;
        }

        if (ctrlOrMeta && (key === "u" || key === "s")) {
          event.preventDefault();
        }
      },
      { capture: true }
    );
  }

  const MENU_CONFIG = {
    business: {
      label: "사업안내",
      topIndex: 0,
      tabs: [
        { key: "overview", label: "사업개요" },
        { key: "location", label: "입지환경" },
        { key: "premium", label: "프리미엄" },
      ],
    },
    complex: {
      label: "단지안내",
      topIndex: 1,
      tabs: [
        { key: "siteplan", label: "단지배치도" },
        { key: "unitplan", label: "동호수배치도" },
        { key: "community", label: "커뮤니티" },
        { key: "concierge", label: "컨시어지" },
      ],
    },
    type: {
      label: "타입안내",
      topIndex: 2,
      tabs: [
        { key: "type", label: "타입안내" },
        { key: "interior", label: "인테리어" },
      ],
    },
    route: {
      label: "공공지원 민간임대",
      topIndex: 3,
      tabs: [{ key: "directions", label: "공공지원 민간임대" }],
    },
  };

  const TYPE_VARIANTS = {
    type: {
      groups: [
        {
          key: "floorplan",
          label: "타입",
          hidePrimary: true,
          items: [
            { key: "72", label: "72", image: "../../../../new-assets/paragon/72.webp" },
            { key: "84a", label: "84A", image: "../../../../new-assets/paragon/84a.webp" },
            { key: "84b", label: "84B", image: "../../../../new-assets/paragon/84b.webp" },
          ],
        },
      ],
    },
    interior: {
      groups: [
        {
          key: "interior",
          label: "인테리어",
          hidePrimary: true,
          items: [
            {
              key: "living",
              label: "LIVING ROOM",
              images: [
                "../../../../new-assets/menu/living_room_1.webp",
                "../../../../new-assets/menu/living_room_2.webp",
              ],
            },
            {
              key: "bedroom",
              label: "BEDROOM",
              images: [
                "../../../../new-assets/menu/bedroom_1.webp",
                "../../../../new-assets/menu/bedroom_2.webp",
              ],
            },
            {
              key: "dining",
              label: "DINING ROOM",
              images: [
                "../../../../new-assets/menu/dining_room_1.webp",
                "../../../../new-assets/menu/dining_room_2.webp",
              ],
            },
            {
              key: "bathroom",
              label: "BATHROOM",
              images: [
                "../../../../new-assets/menu/bathroom_1.webp",
                "../../../../new-assets/menu/bathroom_2.webp",
              ],
            },
          ],
        },
      ],
    },
  };

  function getTypeVariantGroups(tab) {
    const config = TYPE_VARIANTS[tab];
    if (!config || !Array.isArray(config.groups)) return [];
    return config.groups;
  }

  function getTypeVariantItems(tab) {
    return getTypeVariantGroups(tab).flatMap((group) => group.items || []);
  }

  function getDefaultTypeVariant(tab) {
    const groups = getTypeVariantGroups(tab);
    if (!groups.length) return "";
    const firstGroup = groups[0];
    const firstItem = Array.isArray(firstGroup.items) ? firstGroup.items[0] : null;
    return firstItem ? firstItem.key : "";
  }

  function getSelectedTypeVariant(tab, variantKey) {
    const items = getTypeVariantItems(tab);
    return items.find((item) => item.key === variantKey) || items[0] || null;
  }

  function getSelectedTypeVariantGroup(tab, variantKey) {
    const groups = getTypeVariantGroups(tab);
    if (!groups.length) return null;
    return (
      groups.find((group) =>
        Array.isArray(group.items) && group.items.some((item) => item.key === variantKey)
      ) || groups[0]
    );
  }

  const ROUTE_ROUGHMAP = {
    timestamp: "1772015268708",
    key: "ibxtfyhijsi",
    desktopHeight: 460,
    mobileHeight: 360,
  };

  let roughmapLoaderPromise = null;
  let mobileLayoutGuardBound = false;

  const CONTENT_CONFIG = {
    business: {
      overview: {
        title: "Paragon 사업개요",
        subtitle: "새로운 중심의 Paragon",
        copy: "생활·교통·문화 인프라를 누리는 프리미엄 중심 입지",
        copySub: "",
        image: "",
        canvasLayout: [
          {
            type: "image",
            src: "../../../../new-assets/paragon/main2_p1.webp",
          },
        ],
        specs: [
          [
            "사업명칭",
            "Paragon 분양 프로젝트",
            "대지위치",
            "상세 주소 추후 입력",
          ],
          [
            "건축규모",
            "지하 2층 ~ 지상 47층 3개동",
            "대지면적",
            "9,076.90m² / 연면적 103,703.91m²",
          ],
          ["세대수", "총 556세대 / 아파트 400세대, 오피스텔 156실", "", ""],
        ],
        notes: [
          "본 홍보물에 사용된 CG 및 일러스트는 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다.",
          "상기 개발계획도, 지역도 상에 기재된 교통, 학교, 공원, 상업시설 등 각종 개발 계획은 사업 진행과정 및 관계기관의 사정에 따라 변동 또는 취소될 수 있으며 이는 당사와 무관합니다.",
          "단지 인근의 각종 개발계획 및 도로 등의 기반시설은 인·허가나 정부 시책에 따라 변경 및 취소 가능한 바, 해당 인·허가청 및 현장에서 확인하시기 바라며 시행사 및 시공사와 무관합니다.",
        ],
      },
      location: {
        title: "Paragon 입지환경",
        subtitle: "새로운 프리미엄 라이프",
        copy: "1호선 회천중앙역(예정)&GTX-C(예정) 연계 및 3번국도 대체우회·수도권제2순환도로로 서울 접근성 우수!",
        copySub: "양주 회천 新주거 중심축! 역·학·슬세권 완성의 결정판! 회천중앙역 파라곤",
        image: "",
        canvasLayout: [
          {
            type: "location-card",
            mainImage: "../../../../new-assets/paragon/Location environment_1_p1.webp",
          },
        ],
        specs: [],
        notes: [
          "본 홍보물에 사용된 CG 및 일러스트는 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다.",
          "상기 개발계획도, 지역도 상에 기재된 교통, 학교, 공원, 상업시설 등 각종 개발 계획은 사업 진행과정 및 관계기관의 사정에 따라 변동 또는 취소될 수 있으며 이는 당사와 무관합니다.",
          "단지 인근의 각종 개발계획 및 도로 등의 기반시설은 인·허가나 정부 시책에 따라 변경 및 취소 가능한 바, 해당 인·허가청 및 현장에서 확인하시기 바라며 시행사 및 시공사와 무관합니다.",
        ],
      },
      brand: {
        title: "Paragon 브랜드소개",
        subtitle: "한 차원 더 높은 생활의 가치와",
        copy: "남다른 일상을 제안하는 Paragon",
        copySub: "",
        image: "",
        canvasLayout: [
          { type: "image", src: "../../../../new-assets/menu/brand_h1.png" },
        ],
        specs: [],
        notes: [],
      },
      premium: {
        title: "Paragon 프리미엄",
        subtitle: "품격 있는 주거 브랜드 Paragon",
        copy: "초고층, 트리플 역세권, 최중심 인프라, 고품격 커뮤니티까지!",
        copySub: "",
        image: "",
        canvasLayout: [
          {
            type: "row",
            columns: 2,
            className: "menupage-premium-grid",
            images: [
              "../../../../new-assets/paragon/premium_p1%20(1).webp",
              "../../../../new-assets/paragon/premium_p1%20(2).webp",
              "../../../../new-assets/paragon/premium_p1%20(3).webp",
              "../../../../new-assets/paragon/premium_p1%20(4).webp",
              "../../../../new-assets/paragon/premium_p1%20(5).webp",
              "../../../../new-assets/paragon/premium_p2%20(6).webp",
              "../../../../new-assets/paragon/premium_p1%20(7).webp",
            ],
          },
        ],
        specs: [],
        notes: [
          "본 홍보물에 사용된 CG 및 일러스트는 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다.",
        ],
      },
      default: {
        title: "Paragon",
        subtitle: "프로젝트 정보",
        copy: "해당 메뉴의 상세 이미지를 이 영역에 배치합니다.",
        copySub: "",
        image: "",
        specs: [],
        notes: [],
      },
    },
    complex: {
      design: {
        subtitle: "단지설계",
        copy: "양주의 새로운 중심에서 만나는",
        copySub: "Paragon의 프리미엄 라이프!",
        image: "../resources/images/complex guide1.jpg",
      },
      community: {
        subtitle: "커뮤니티",
        copy: "골프장·피트니스·GX룸부터 북카페·키즈룸·단지 내 어린이집까지 원스톱 완비",
        copySub: "건강한 웰니스 라이프와 안심 보육을 한 번에 누리는 파라곤만의 차별화된 명품 커뮤니티",
        image: "",
        canvasLayout: [
          {
            type: "stack",
            className: "menupage-community-main menupage-community-stack",
            images: [
              "../../../../new-assets/paragon/community1_p1.webp",
              "../../../../new-assets/paragon/community2_p1.webp",
            ],
          },
          { type: "gap", size: "community" },
          {
            type: "row",
            columns: 6,
            className: "menupage-community-details-grid menupage-community-details-grid--paragon",
            images: [
              "../../../../new-assets/paragon/Community_Details_p1%20(1).webp",
              "../../../../new-assets/paragon/Community_Details_p1%20(2).webp",
              "../../../../new-assets/paragon/Community_Details_p2%20(3).webp",
              "../../../../new-assets/paragon/Community_Details_p2%20(4).webp",
              "../../../../new-assets/paragon/Community_Details_p2%20(5).webp",
              "../../../../new-assets/paragon/Community_Details_p2%20(6).webp",
              "../../../../new-assets/paragon/Community_Details_p2%20(7).webp",
              "../../../../new-assets/paragon/Community_Details_p2%20(8).webp",
            ],
          },
        ],
        notes: [
          "본 지면상의 단지배치도 및 CG 이미지는 소비자의 이해를 돕기 위해 제작한 것으로 실제와 차이가 있을 수 있으며, 향후 개발 계획 및 인·허가에 따라 변경될 수 있습니다.",
        ],
      },
      siteplan: {
        subtitle: "단지배치도",
        copy: "총 845세대 전세대 남향 위주 배치와 덕계천 수변공원으로 곧바로 연결되는 출입구",
        copySub: "널찍한 동간 거리 속 넉넉한 조경 공간과 청정 수변 라이프를 단지 안마당처럼 누리는 명품 웰빙 대단지",
        image: "",
        canvasLayout: [
          { type: "image", src: "../../../../new-assets/paragon/complex arrangement_p1.webp" },
        ],
        notes: [
          "본 지면상의 단지배치도 및 CG 이미지는 소비자의 이해를 돕기 위해 제작한 것으로 실제와 차이가 있을 수 있으며, 향후 개발 계획 및 인·허가에 따라 변경될 수 있습니다.",
        ],
      },
      unitplan: {
        subtitle: "내일의 심장부를 사는",
        copy: "도심 접근성을 높인 프리미엄 라이프",
        copySub: "",
        image: "",
        canvasLayout: [
          { type: "image", src: "../../../../new-assets/menu/number arrangement_i1.webp" },
        ],
        notes: [
          "본 지면 상의 동호 배치도 등은 소비자의 이해를 돕기 위한 이미지 컷으로 실제 시공 시 다소 차이가 있을 수 있으며, 향후 개발 계획 및 인·허가에 따라 변경될 수 있습니다.",
        ],
      },
      concierge: {
        subtitle: "간편하게 누리는 Paragon 라이프",
        copy: "사용자 편의를 생각한 생활 솔루션",
        copySub: "",
        image: "",
        canvasLayout: [
          { type: "image", src: "../../../../new-assets/menu/concierge_i1%20(1).png", className: "menupage-concierge-section" },
          { type: "gap", size: "concierge" },
          { type: "image", src: "../../../../new-assets/menu/concierge_i1%20(2).png", className: "menupage-concierge-section" },
          { type: "gap", size: "concierge" },
          { type: "image", src: "../../../../new-assets/menu/concierge_i1%20(3).png", className: "menupage-concierge-section" },
          { type: "gap", size: "concierge" },
          { type: "image", src: "../../../../new-assets/menu/concierge_i1%20(4).png", className: "menupage-concierge-section" },
        ],
        notes: [
          "상기 이미지는 서비스 예시 이미지이며, 실제 제공 서비스와 일부 다를 수 있습니다. 주거서비스는 전문 위탁업체를 통해 운영되며, 입주민 전용 APP으로 신청하는 유상 서비스입니다. 제공 서비스는 운영업체, 현장 여건, 이용률, 입주민 선호도 등에 따라 변경될 수 있습니다. 시공사는 준공 후 1년간 APP 플랫폼 구축 및 기본 유지 비용을 부담하며, 해당 계약 기간 중 입주자는 위탁업체 변경을 임의로 요구할 수 없습니다. 계약 종료 후 서비스 연장 또는 업체 재선정은 입주자대표회의를 통해 결정되며, 이후 발생하는 APP 유지보수비 등 유지 비용은 입주자가 부담합니다. 비대면진료서비스는 입주민 전용 APP을 통해 제공되며, 위탁계약 3년간 별도 유지보수 비용 부담 없이 이용할 수 있습니다. 계약 기간 중 입주자는 위탁업체 변경을 임의로 요구할 수 없습니다. 견본주택 및 홍보물의 서비스 내용은 이해를 돕기 위한 예시이며, 실제 운영 시 변경될 수 있습니다.",
        ],
      },
      hsystem: {
        subtitle: "트렌드를 리드하는 현대건설",
        copy: "고객이 가장 살고 싶은 집을 설계합니다.",
        copySub: "",
        image: "",
        canvasLayout: [
          {
            type: "stack",
            images: [
              "../../../../new-assets/inter-floor_noise_h2.png",
              "../../../../new-assets/mobile/Hservice_h1.jpg",
            ],
          },
        ],
      },
      default: {
        title: "Paragon",
        subtitle: "단지 안내",
        copy: "해당 메뉴의 상세 이미지를 이 영역에 배치합니다.",
        copySub: "",
        image: "",
        specs: [],
        notes: [],
      },
    },
    type: {
      type: {
        title: "Paragon",
        subtitle: "취향을 담은 혁신 평면에",
        copy: "트렌디한 라이프 스타일을 더하다!",
        copySub: "",
        image: "",
        specs: [],
        notes: [
          "본 평면도는 소비자의 이해를 돕기 위해 제작된 것으로 외곽라인, 내부 레이아웃, 인테리어 마감, 내부 디테일, 가구 디자인 등 세부사항은 변경될 수 있으니, 자세한 사항은 견본주택에 문의하시어 계약 등에 착오 없으시기 바랍니다.",
        ],
      },
      interior: {
        title: "Paragon",
        subtitle: "공간에 대한 깊이와 이해로 완성된 미학",
        copy: "Paragon만의 고품격 인테리어를 경험해 보세요",
        copySub: "",
        image: "",
        specs: [],
        notes: [
          "본 지면 상의 사진은 사이버 모델하우스 및 견본주택 오픈일 이전에 촬영한 것으로, 기본 마감재 이외의 옵션 및 견본주택 연출을 위한 상품이 포함되어 있으며, 마감재 색상 및 사항은 실제와 상이할 수 있으니 반드시 견본주택에서 확인하시기 바랍니다.",
        ],
      },
      default: {
        title: "Paragon",
        subtitle: "타입 안내",
        copy: "해당 메뉴의 상세 이미지를 이 영역에 배치합니다.",
        copySub: "",
        image: "",
        specs: [],
        notes: [],
      },
    },
    route: {
      default: {
        title: "Paragon",
        subtitle: "주거의 새로운 패러다임",
        copy: "합리적인 임대료로 10년까지 보장!",
        copySub: "",
        image: "../resources/images/m1.png",
        specs: [],
        notes: [],
      },
    },
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderSpecs(specs) {
    const wrapEl = document.getElementById("menupage-spec");
    const bodyEl = document.getElementById("menupage-spec-body");
    if (!wrapEl || !bodyEl) return;

    if (!Array.isArray(specs) || specs.length === 0) {
      bodyEl.innerHTML = "";
      wrapEl.hidden = true;
      return;
    }

    bodyEl.innerHTML = specs
      .map((item) => {
        const key = Array.isArray(item) ? item[0] : "";
        const value = Array.isArray(item) ? item[1] : "";
        const subKey = Array.isArray(item) ? item[2] : "";
        const subValue = Array.isArray(item) ? item[3] : "";

        if (subKey || subValue) {
          return `<tr><th scope="row">${escapeHtml(key)}</th><td>${escapeHtml(value)}</td><th scope="row">${escapeHtml(subKey)}</th><td>${escapeHtml(subValue)}</td></tr>`;
        }

        return `<tr><th scope="row">${escapeHtml(key)}</th><td colspan="3">${escapeHtml(value)}</td></tr>`;
      })
      .join("");
    wrapEl.hidden = false;
  }

  function renderNotes(notes) {
    const wrapEl = document.getElementById("menupage-notes");
    const listEl = document.getElementById("menupage-notes-list");
    if (!wrapEl || !listEl) return;

    if (!Array.isArray(notes) || notes.length === 0) {
      listEl.innerHTML = "";
      wrapEl.hidden = true;
      return;
    }

    listEl.innerHTML = notes
      .map((line) => `<li>${escapeHtml(line)}</li>`)
      .join("");
    wrapEl.hidden = false;
  }

  function getStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const group = params.get("group");
    const tab = params.get("tab");
    const variant = params.get("variant");

    if (!group || !MENU_CONFIG[group]) {
      return { group: "business", tab: "overview", variant: "" };
    }

    const hasTab = MENU_CONFIG[group].tabs.some((item) => item.key === tab);
    const resolvedTab = hasTab ? tab : MENU_CONFIG[group].tabs[0].key;
    const variants = getTypeVariantItems(resolvedTab);
    const defaultVariant = getDefaultTypeVariant(resolvedTab);
    const resolvedVariant =
      group === "type" && variants.some((item) => item.key === variant)
        ? variant
        : group === "type"
        ? defaultVariant
        : "";

    return {
      group,
      tab: resolvedTab,
      variant: resolvedVariant,
    };
  }

  function setHeaderActive(group) {
    const topIndex = MENU_CONFIG[group].topIndex;
    document
      .querySelectorAll(".properties-N1 .header-gnblist > .header-gnbitem")
      .forEach((item) => item.classList.remove("menu-current"));
    document
      .querySelectorAll(".properties-N1 .fullmenu-gnblist > .fullmenu-gnbitem")
      .forEach((item) => item.classList.remove("menu-current"));

    const headerItem = document.querySelectorAll(
      ".properties-N1 .header-gnblist > .header-gnbitem"
    )[topIndex];
    const fullMenuItem = document.querySelectorAll(
      ".properties-N1 .fullmenu-gnblist > .fullmenu-gnbitem"
    )[topIndex];

    if (headerItem) headerItem.classList.add("menu-current");
    if (fullMenuItem) fullMenuItem.classList.add("menu-current");
  }

  function renderTabs(group, tab, variant) {
    const wrap = document.getElementById("menupage-tabs");
    const tabs = MENU_CONFIG[group].tabs;

    wrap.innerHTML = tabs
      .map((item) => {
        const activeClass = item.key === tab ? "is-active" : "";
        const variants = getTypeVariantItems(item.key);
        const defaultVariant = getDefaultTypeVariant(item.key);
        const targetVariant =
          group === "type" && variants.some((entry) => entry.key === variant)
            ? variant
            : defaultVariant;
        const variantQuery =
          group === "type" && targetVariant
            ? `&variant=${encodeURIComponent(targetVariant)}`
            : "";
        return `<a class="menupage-tab ${activeClass}" href="./menu-page.html?group=${group}&tab=${item.key}${variantQuery}">${item.label}</a>`;
      })
      .join("");
  }

  function renderHero(group, tab) {
    const tabInfo = MENU_CONFIG[group].tabs.find((item) => item.key === tab);
    const title = tabInfo ? tabInfo.label : MENU_CONFIG[group].label;
    const kicker = MENU_CONFIG[group].label;

    const kickerEl = document.getElementById("menupage-kicker");
    const titleEl = document.getElementById("menupage-title");
    const subtitleEl = document.getElementById("menupage-subtitle");

    if (kickerEl) kickerEl.textContent = kicker;
    titleEl.textContent = title;
    subtitleEl.textContent = SITE_NAME;
  }

  function createCanvasImg(src, imageAlt) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = imageAlt;
    img.decoding = "async";
    img.loading = "lazy";
    img.addEventListener("error", function onError() {
      if (img.dataset.fallbackTried === "2") {
        img.removeEventListener("error", onError);
        img.remove();
        return;
      }
      if (/\.webp$/i.test(img.src)) {
        img.dataset.fallbackTried = "1";
        img.src = img.src.replace(/\.webp$/i, ".png");
        return;
      }
      if (img.dataset.fallbackTried === "1" && /\.png$/i.test(img.src)) {
        img.dataset.fallbackTried = "2";
        img.src = img.src.replace(/\.png$/i, ".jpg");
        return;
      }
      if (/\.png$/i.test(src)) {
        img.dataset.fallbackTried = "2";
        img.src = src.replace(/\.png$/i, ".jpg");
        return;
      }
      img.removeEventListener("error", onError);
      img.remove();
    });
    return img;
  }

  function createLayoutNode(entry, imageAlt) {
    if (!entry) return null;

    if (typeof entry === "string") {
      return createCanvasImg(entry, imageAlt);
    }

    if (entry.type === "image" && entry.src) {
      const block = document.createElement("div");
      block.className = "menupage-image-node";
      if (entry.className) entry.className.split(/\s+/).filter(Boolean).forEach(function(c) { block.classList.add(c); });
      block.appendChild(createCanvasImg(entry.src, imageAlt));
      return block;
    }

    if (entry.type === "stack") {
      const stack = document.createElement("div");
      stack.className = "menupage-image-stack-col";
      if (entry.className) entry.className.split(/\s+/).filter(Boolean).forEach(function(c) { stack.classList.add(c); });
      (Array.isArray(entry.images) ? entry.images : []).forEach((src) => {
        if (!src) return;
        stack.appendChild(createCanvasImg(src, imageAlt));
      });
      return stack;
    }

    return null;
  }

  function buildCanvasLayout(layout, imageAlt) {
    const wrap = document.createElement("div");
    wrap.className = "menupage-image-layout";

    layout.forEach((item) => {
      if (!item || typeof item !== "object") return;

      if (item.type === "gap") {
        const gap = document.createElement("div");
        gap.className = `menupage-layout-gap is-${item.size || "md"}`;
        wrap.appendChild(gap);
        return;
      }

      if (item.type === "row") {
        const row = document.createElement("div");
        row.className = "menupage-image-row";
        if (item.className) {
          item.className.split(/\s+/).filter(Boolean).forEach(function(c) { row.classList.add(c); });
        }
        if (item.columns) {
          row.style.setProperty("--row-columns", String(item.columns));
        }
        const rowItems = Array.isArray(item.items) ? item.items : (Array.isArray(item.images) ? item.images : []);
        rowItems.forEach((entry) => {
          const node = createLayoutNode(entry, imageAlt);
          if (node) row.appendChild(node);
        });
        wrap.appendChild(row);
        return;
      }

      if (item.type === "location-card") {
        const card = document.createElement("div");
        card.className = "menupage-location-card menupage-location-section";
        const main = document.createElement("div");
        main.className = "n6-location-main";
        if (item.mainImage) main.appendChild(createCanvasImg(item.mainImage, imageAlt));
        card.appendChild(main);
        if (item.subImage) {
          const sub = document.createElement("div");
          sub.className = "n6-location-sub-card";
          sub.appendChild(createCanvasImg(item.subImage, imageAlt));
          card.appendChild(sub);
        }
        wrap.appendChild(card);
        return;
      }

      if (item.type === "image" && item.src) {
        const node = createLayoutNode(item, imageAlt);
        if (node) wrap.appendChild(node);
        return;
      }

      if (item.type === "stack") {
        const node = createLayoutNode(item, imageAlt);
        if (node) wrap.appendChild(node);
      }
    });

    return wrap;
  }

  function setCanvasImage(canvasEl, imageEl, placeholderEl, imageSrc, imageAlt, imageSrcList, canvasLayout) {
    const oldStack = canvasEl.querySelector(".menupage-image-stack");
    if (oldStack) oldStack.remove();
    const oldLayout = canvasEl.querySelector(".menupage-image-layout");
    if (oldLayout) oldLayout.remove();

    const layoutItems = Array.isArray(canvasLayout) ? canvasLayout : [];
    if (layoutItems.length > 0) {
      imageEl.removeAttribute("src");
      imageEl.hidden = true;
      placeholderEl.hidden = true;
      canvasEl.classList.add("has-image");
      canvasEl.appendChild(buildCanvasLayout(layoutItems, imageAlt));
      return;
    }

    const stackSources = Array.isArray(imageSrcList)
      ? imageSrcList.filter((src) => typeof src === "string" && src.trim())
      : [];

    if (stackSources.length > 0) {
      imageEl.removeAttribute("src");
      imageEl.hidden = true;
      placeholderEl.hidden = true;
      canvasEl.classList.add("has-image");

      const stack = document.createElement("div");
      stack.className = "menupage-image-stack";
      stackSources.forEach((src) => {
        stack.appendChild(createCanvasImg(src, imageAlt));
      });
      canvasEl.appendChild(stack);
      return;
    }

    if (imageSrc) {
      imageEl.onerror = function onSingleError() {
        if (imageEl.dataset.fallbackTried === "1") {
          imageEl.onerror = null;
          return;
        }
        if (/\.png$/i.test(imageSrc)) {
          imageEl.dataset.fallbackTried = "1";
          imageEl.src = imageSrc.replace(/\.png$/i, ".jpg");
          return;
        }
        imageEl.onerror = null;
      };
      imageEl.dataset.fallbackTried = "0";
      imageEl.src = imageSrc;
      imageEl.alt = imageAlt;
      imageEl.hidden = false;
      placeholderEl.hidden = true;
      canvasEl.classList.add("has-image");
    } else {
      imageEl.removeAttribute("src");
      imageEl.hidden = true;
      placeholderEl.hidden = false;
      canvasEl.classList.remove("has-image");
    }
  }

  function ensureRoughmapLoader() {
    if (
      window.daum &&
      window.daum.roughmap &&
      typeof window.daum.roughmap.Lander === "function"
    ) {
      return Promise.resolve();
    }

    if (roughmapLoaderPromise) return roughmapLoaderPromise;

    roughmapLoaderPromise = new Promise((resolve, reject) => {
      const protocol = window.location.protocol === "https:" ? "https:" : "http:";
      const cdnDomain = "//t1.daumcdn.net";
      const phase = "prod";
      const cdn = "20250630";

      window.daum = window.daum || {};
      window.daum.roughmap = window.daum.roughmap || {
        phase,
        cdn,
        URL_KEY_DATA_LOAD_PRE: `${protocol}${cdnDomain}/roughmap/`,
        url_protocal: protocol,
        url_cdn_domain: cdnDomain,
      };

      const scriptSrc = `${protocol}//t1.daumcdn.net/kakaomapweb/roughmap/place/${phase}/${cdn}/roughmapLander.js`;
      const checkReady = () => {
        if (
          window.daum &&
          window.daum.roughmap &&
          typeof window.daum.roughmap.Lander === "function"
        ) {
          resolve();
        } else {
          reject(new Error("카카오 지도 스크립트 초기화에 실패했습니다."));
        }
      };

      let script = document.querySelector("script[data-roughmap-lander='true']");
      if (!script) {
        script = document.createElement("script");
        script.charset = "UTF-8";
        script.src = scriptSrc;
        script.setAttribute("data-roughmap-lander", "true");
        script.onload = () => checkReady();
        script.onerror = () =>
          reject(new Error("카카오 지도 스크립트를 불러오지 못했습니다."));
        document.head.appendChild(script);
      } else {
        // 이미 로드된 경우 즉시 상태 확인
        setTimeout(checkReady, 0);
      }
    });

    return roughmapLoaderPromise;
  }

  function teardownRouteMap(canvasEl) {
    if (!canvasEl) return;
    canvasEl.classList.remove("has-route-map");
    const mapWrap = canvasEl.querySelector(".menupage-route-map-wrap");
    if (mapWrap) mapWrap.remove();
  }

  function renderRouteRoughMap(canvasEl, imageEl, placeholderEl, imageAlt) {
    if (!canvasEl || !imageEl || !placeholderEl) return;

    imageEl.hidden = true;
    imageEl.removeAttribute("src");
    placeholderEl.hidden = true;
    canvasEl.classList.remove("has-image");
    canvasEl.classList.add("has-route-map");

    const existingWrap = canvasEl.querySelector(".menupage-route-map-wrap");
    if (existingWrap) existingWrap.remove();

    const mapWrap = document.createElement("div");
    mapWrap.className = "menupage-route-map-wrap";

    const mapNode = document.createElement("div");
    mapNode.id = `daumRoughmapContainer${ROUTE_ROUGHMAP.timestamp}`;
    mapNode.className = "root_daum_roughmap root_daum_roughmap_landing menupage-route-map-node";
    mapNode.setAttribute("aria-label", imageAlt || "공공지원 민간임대 안내 지도");
    mapWrap.appendChild(mapNode);

    const mapInfo = document.createElement("div");
    mapInfo.className = "menupage-route-map-info";

    const addressRow = document.createElement("p");
    addressRow.className = "menupage-route-map-info-row is-address";
    addressRow.innerHTML =
      '<span class="menupage-route-map-info-icon is-map" aria-hidden="true"></span><span class="menupage-route-map-info-text"><span class="menupage-route-map-info-label">현장 주소 :</span> 경기도 양주시 백석읍 복지리 279-1 일원(양주 복지지구 80BL)</span>';

    const showroomRow = document.createElement("p");
    showroomRow.className = "menupage-route-map-info-row is-showroom";
    showroomRow.innerHTML =
      '<span class="menupage-route-map-info-icon is-home" aria-hidden="true"></span><span class="menupage-route-map-info-text"><span class="menupage-route-map-info-label">모델하우스 :</span> 방문예약 또는 전화주시면 문자로 안내해 드립니다.</span>';

    const inquiryRow = document.createElement("p");
    inquiryRow.className = "menupage-route-map-info-row is-inquiry";
    inquiryRow.innerHTML =
      '<span class="menupage-route-map-info-icon is-phone" aria-hidden="true"></span><span class="menupage-route-map-info-text"><span class="menupage-route-map-info-label">분양문의 :</span> 1688-4008</span>';

    mapInfo.appendChild(addressRow);
    mapInfo.appendChild(showroomRow);
    mapInfo.appendChild(inquiryRow);
    mapWrap.appendChild(mapInfo);
    canvasEl.appendChild(mapWrap);

    const canvasWidth =
      Math.floor(canvasEl.getBoundingClientRect().width) || canvasEl.clientWidth || 640;
    const mapWidth = Math.max(320, canvasWidth);
    const mapHeight =
      window.innerWidth <= 992
        ? ROUTE_ROUGHMAP.mobileHeight
        : ROUTE_ROUGHMAP.desktopHeight;

    ensureRoughmapLoader()
      .then(() => {
        if (
          !window.daum ||
          !window.daum.roughmap ||
          typeof window.daum.roughmap.Lander !== "function"
        ) {
          throw new Error("카카오 지도 객체가 초기화되지 않았습니다.");
        }
        if (!document.getElementById(`daumRoughmapContainer${ROUTE_ROUGHMAP.timestamp}`)) {
          return;
        }

        new window.daum.roughmap.Lander({
          timestamp: ROUTE_ROUGHMAP.timestamp,
          key: ROUTE_ROUGHMAP.key,
          mapWidth: String(mapWidth),
          mapHeight: String(mapHeight),
        }).render();
      })
      .catch(() => {
        // 지도 로딩 실패 시 기본 플레이스홀더를 다시 보여준다.
        teardownRouteMap(canvasEl);
        placeholderEl.hidden = false;
        placeholderEl.querySelector("strong").textContent = "지도를 불러오지 못했습니다.";
      });
  }

  function playCanvasSwapAnimation(canvasEl) {
    if (!canvasEl) return;
    canvasEl.classList.remove("menupage-swap-up");
    void canvasEl.offsetWidth;
    canvasEl.classList.add("menupage-swap-up");
  }

  function initInteriorImageReveal(canvasEl) {
    if (!canvasEl || !canvasEl.classList.contains("is-interior-layout")) return;

    const images = Array.from(canvasEl.querySelectorAll(".menupage-image-stack img"));
    if (!images.length) return;

    images.forEach((img, index) => {
      img.classList.remove("is-visible");
      img.style.transitionDelay = `${Math.min(index * 180, 240)}ms`;
    });

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      images.forEach((img) => img.classList.add("is-visible"));
      return;
    }

    const reveal = (img) => {
      window.requestAnimationFrame(() => {
        img.classList.add("is-visible");
      });
    };

    if (!("IntersectionObserver" in window)) {
      images.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    images.forEach((img) => observer.observe(img));
  }

  function swapVariantCanvas(canvasEl, imageEl, placeholderEl, nextVariant, title) {
    if (!canvasEl) return;
    canvasEl.classList.remove("menupage-swap-up", "menupage-swap-out");
    setCanvasImage(
      canvasEl,
      imageEl,
      placeholderEl,
      nextVariant.image,
      title,
      nextVariant.images || [],
      nextVariant.canvasLayout || []
    );

    if (canvasEl.classList.contains("is-interior-layout")) {
      initInteriorImageReveal(canvasEl);
      return;
    }

    playCanvasSwapAnimation(canvasEl);
  }

  function renderTypeVariantTabs(group, tab, variant, onVariantChange) {
    const canvasEl = document.getElementById("menupage-canvas");
    if (!canvasEl || !canvasEl.parentNode) return null;

    let wrap = document.getElementById("menupage-variant-tabs");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "menupage-variant-tabs";
      wrap.className = "menupage-variant-tabs";
      canvasEl.parentNode.insertBefore(wrap, canvasEl);
    }

    if (group !== "type") {
      wrap.hidden = true;
      wrap.innerHTML = "";
      wrap.onclick = null;
      return null;
    }

    const groups = getTypeVariantGroups(tab);
    const variants = getTypeVariantItems(tab);
    if (variants.length === 0 || groups.length === 0) {
      wrap.hidden = true;
      wrap.innerHTML = "";
      wrap.onclick = null;
      return null;
    }

    let selected = getSelectedTypeVariant(tab, variant);
    let selectedGroup = getSelectedTypeVariantGroup(tab, selected ? selected.key : "");

    wrap.hidden = false;
    const renderMarkup = () => {
      const hidePrimary = groups.length === 1 && groups[0].hidePrimary;
      const primary = hidePrimary
        ? ""
        : groups
        .map((groupItem) => {
          const activeClass = groupItem.key === selectedGroup.key ? "is-active" : "";
          return `<button type="button" class="menupage-variant-tab menupage-variant-tab-primary ${activeClass}" data-variant-group="${escapeHtml(
            groupItem.key
          )}">${escapeHtml(groupItem.label)}</button>`;
        })
        .join("");

      const secondary = (selectedGroup.items || [])
        .map((item) => {
          const activeClass = item.key === selected.key ? "is-active" : "";
          return `<button type="button" class="menupage-variant-tab menupage-variant-tab-secondary ${activeClass}" data-variant-key="${escapeHtml(
            item.key
          )}">${escapeHtml(item.label)}</button>`;
        })
        .join("");

      wrap.innerHTML = `
        ${hidePrimary ? "" : `<div class="menupage-variant-row menupage-variant-row-primary">${primary}</div>`}
        <div class="menupage-variant-row menupage-variant-row-secondary ${hidePrimary ? "menupage-variant-row-flat" : ""}">${secondary}</div>
      `;
    };

    renderMarkup();

    wrap.onclick = (event) => {
      const groupBtn = event.target.closest("[data-variant-group]");
      if (groupBtn && wrap.contains(groupBtn)) {
        const nextGroupKey = groupBtn.getAttribute("data-variant-group");
        const nextGroup = groups.find((item) => item.key === nextGroupKey);
        if (!nextGroup || nextGroup.key === selectedGroup.key) return;
        selectedGroup = nextGroup;
        selected = (selectedGroup.items || [])[0] || selected;
        renderMarkup();
        if (selected && typeof onVariantChange === "function") {
          onVariantChange(selected);
        }
        const groupUrl = new URL(window.location.href);
        groupUrl.searchParams.set("group", "type");
        groupUrl.searchParams.set("tab", tab);
        if (selected) {
          groupUrl.searchParams.set("variant", selected.key);
        } else {
          groupUrl.searchParams.delete("variant");
        }
        window.history.replaceState({}, "", `${groupUrl.pathname}?${groupUrl.searchParams.toString()}`);
        return;
      }

      const btn = event.target.closest("[data-variant-key]");
      if (!btn || !wrap.contains(btn)) return;

      const nextKey = btn.getAttribute("data-variant-key");
      if (!nextKey || (selected && nextKey === selected.key)) return;

      const next = variants.find((item) => item.key === nextKey);
      if (!next) return;

      selected = next;
      selectedGroup = getSelectedTypeVariantGroup(tab, selected.key);
      renderMarkup();

      if (typeof onVariantChange === "function") {
        onVariantChange(selected);
      }

      const url = new URL(window.location.href);
      url.searchParams.set("group", "type");
      url.searchParams.set("tab", tab);
      url.searchParams.set("variant", selected.key);
      window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
    };

    return selected;
  }

  function initMenuLocationMagnifier() {
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var cards = document.querySelectorAll('#menupage-canvas .menupage-location-card');
    if (!cards.length) return;
    cards.forEach(function(card) {
      if (card.dataset.magnifierInit) return;
      card.dataset.magnifierInit = '1';
      var images = [].slice.call(card.querySelectorAll('.n6-location-main > img'));
      var excludedArea = card.querySelector('.n6-location-sub-card');
      if (!images.length) return;
      var lens = document.createElement('div');
      lens.className = 'n6-magnifier-lens';
      card.appendChild(lens);
      var zoom = 1.85;
      function getActiveImage(clientX, clientY) {
        for (var i = 0; i < images.length; i++) {
          var rect = images[i].getBoundingClientRect();
          if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) return images[i];
        }
        return images[0];
      }
      function syncLensImage(targetImg) {
        var src = targetImg.currentSrc || targetImg.src;
        if (src && lens.dataset.src !== src) {
          lens.style.backgroundImage = 'url("' + src + '")';
          lens.dataset.src = src;
        }
      }
      function moveLens(event) {
        if (excludedArea) {
          var er = excludedArea.getBoundingClientRect();
          if (event.clientX >= er.left && event.clientX <= er.right && event.clientY >= er.top && event.clientY <= er.bottom) {
            card.classList.remove('is-magnifying');
            return;
          }
        }
        var cardRect = card.getBoundingClientRect();
        var size = lens.offsetWidth || 190;
        var radius = size / 2;
        var x = event.clientX - cardRect.left;
        var y = event.clientY - cardRect.top;
        var clampedX = Math.max(radius, Math.min(cardRect.width - radius, x));
        var clampedY = Math.max(radius, Math.min(cardRect.height - radius, y));
        var activeImg = getActiveImage(event.clientX, event.clientY);
        var imgRect = activeImg.getBoundingClientRect();
        var imgX = Math.max(0, Math.min(imgRect.width, event.clientX - imgRect.left));
        var imgY = Math.max(0, Math.min(imgRect.height, event.clientY - imgRect.top));
        syncLensImage(activeImg);
        lens.style.left = clampedX + 'px';
        lens.style.top = clampedY + 'px';
        lens.style.backgroundSize = imgRect.width * zoom + 'px ' + imgRect.height * zoom + 'px';
        lens.style.backgroundPosition = (-imgX * zoom + radius) + 'px ' + (-imgY * zoom + radius) + 'px';
      }
      syncLensImage(images[0]);
      card.addEventListener('mouseenter', function(event) { card.classList.add('is-magnifying'); moveLens(event); });
      card.addEventListener('mousemove', function(event) { card.classList.add('is-magnifying'); moveLens(event); });
      card.addEventListener('mouseleave', function() { card.classList.remove('is-magnifying'); });
    });
  }

  function renderContent(group, tab, variant) {
    const groupContent = CONTENT_CONFIG[group] || {};
    const content = groupContent[tab] || groupContent.default || {};

    const title = FIXED_CONTENT_TITLE;
    const subtitle = content.subtitle || "상세 정보";
    const copy =
      content.copy || "해당 메뉴의 상세 이미지를 이 영역에 배치합니다.";
    const copySub = content.copySub || "";
    const specs = content.specs || [];
    const notes = content.notes || [];

    const titleEl = document.getElementById("menupage-content-title");
    const subtitleEl = document.getElementById("menupage-content-subtitle");
    const copyEl = document.getElementById("menupage-content-copy");
    const copySubEl = document.getElementById("menupage-content-copy-sub");
    const canvasEl = document.getElementById("menupage-canvas");
    const imageEl = document.getElementById("menupage-image");
    const placeholderEl = document.getElementById("menupage-placeholder");
    const selectedVariant = renderTypeVariantTabs(group, tab, variant, (nextVariant) => {
      swapVariantCanvas(canvasEl, imageEl, placeholderEl, nextVariant, title);
    });
    const resolvedImage =
      group === "type" && selectedVariant && selectedVariant.image
        ? selectedVariant.image
        : content.image || "";
    const resolvedImages =
      group === "type" && selectedVariant && Array.isArray(selectedVariant.images)
        ? selectedVariant.images
        : content.images || [];
    const resolvedCanvasLayout =
      group === "type" && selectedVariant && Array.isArray(selectedVariant.canvasLayout)
        ? selectedVariant.canvasLayout
        : content.canvasLayout || [];
    canvasEl.classList.toggle("has-variant-tabs", group === "type" && !!selectedVariant);
    canvasEl.classList.toggle("is-location-layout", group === "business" && tab === "location");
    canvasEl.classList.toggle("is-interior-layout", group === "type" && tab === "interior");

    titleEl.textContent = "";
    const logoImg = document.createElement("img");
    logoImg.className = "menupage-content-title-logo";
    logoImg.src = CONTENT_TITLE_LOGO_SRC;
    logoImg.alt = FIXED_CONTENT_TITLE;
    logoImg.decoding = "async";
    logoImg.loading = "eager";
    titleEl.appendChild(logoImg);
    subtitleEl.textContent = subtitle;
    copyEl.textContent = copy;
    if (copySubEl) {
      if (copySub) {
        copySubEl.hidden = false;
        copySubEl.textContent = copySub;
      } else {
        copySubEl.hidden = true;
        copySubEl.textContent = "";
      }
    }

    teardownRouteMap(canvasEl);
    setCanvasImage(
      canvasEl,
      imageEl,
      placeholderEl,
      resolvedImage,
      title,
      resolvedImages,
      resolvedCanvasLayout
    );

    if (canvasEl.classList.contains("is-interior-layout")) {
      initInteriorImageReveal(canvasEl);
    }

    renderSpecs(specs);
    renderNotes(notes);

    if (group === 'business' && tab === 'location') {
      initMenuLocationMagnifier();
    }
  }

  function initContentReveal() {
    const leftEl = document.querySelector(".menupage-content-title-wrap");
    const rightEl = document.querySelector(".menupage-content-lead");
    const upEl = document.querySelector(".menupage-canvas");
    const variantTabsEl = document.getElementById("menupage-variant-tabs");
    const triggerEl = document.querySelector(".menupage-content");

    if (!leftEl || !rightEl || !upEl || !triggerEl) return;

    const upTargets = [upEl];
    if (variantTabsEl && !variantTabsEl.hidden) {
      upTargets.push(variantTabsEl);
    }

    const revealClasses = ["menupage-reveal-left", "menupage-reveal-right", "menupage-reveal-up"];
    const prepClasses = ["menupage-pre-left", "menupage-pre-right", "menupage-pre-up"];
    const instantClass = "menupage-reveal-visible";

    leftEl.classList.remove(...revealClasses, ...prepClasses, instantClass);
    rightEl.classList.remove(...revealClasses, ...prepClasses, instantClass);
    upTargets.forEach((el) => el.classList.remove(...revealClasses, ...prepClasses, instantClass));

    leftEl.classList.add("menupage-pre-left");
    rightEl.classList.add("menupage-pre-right");
    upTargets.forEach((el) => el.classList.add("menupage-pre-up"));

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      leftEl.classList.remove("menupage-pre-left");
      rightEl.classList.remove("menupage-pre-right");
      upTargets.forEach((el) => el.classList.remove("menupage-pre-up"));
      [leftEl, rightEl, ...upTargets].forEach((el) => el.classList.add(instantClass));
      return;
    }

    const play = () => {
      leftEl.classList.remove("menupage-pre-left");
      rightEl.classList.remove("menupage-pre-right");
      upTargets.forEach((el) => el.classList.remove("menupage-pre-up"));
      leftEl.classList.add("menupage-reveal-left");
      rightEl.classList.add("menupage-reveal-right");
      upTargets.forEach((el) => el.classList.add("menupage-reveal-up"));
    };

    const replay = () => {
      void triggerEl.offsetHeight;
      play();
    };

    if (!("IntersectionObserver" in window)) {
      replay();
      return;
    }

    let played = false;
    let fallbackTimer = null;
    const playOnce = () => {
      if (played) return;
      played = true;
      replay();
      observer.disconnect();
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          playOnce();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -5% 0px",
      }
    );

    observer.observe(triggerEl);

    fallbackTimer = setTimeout(playOnce, 500);
  }

  function isMobileViewport() {
    return window.matchMedia("(max-width: 992px)").matches;
  }

  function hoistFixedConsultBar() {
    const fixedBar = document.querySelector(".menu-page-view .fixed-consult-bar.is-split");
    if (!fixedBar || fixedBar.dataset.fixedHoisted === "true") return;
    fixedBar.dataset.fixedHoisted = "true";
    document.body.appendChild(fixedBar);
  }

  function stabilizeMobileMenuLayout() {
    const header = document.querySelector(".menu-page-view .properties-N1");
    if (!header) return;

    hoistFixedConsultBar();

    const fixedBar = document.querySelector(".menu-page-view .fixed-consult-bar.is-split");

    // 메뉴 상세페이지 이동 후 남는 헤더/메뉴 상태를 정리한다.
    header.classList.remove("block-active");
    header.querySelectorAll(".header-gnbitem").forEach((item) => {
      item.classList.remove("item-active");
    });

    const fullMenu = header.querySelector(".header-fullmenu");
    if (fullMenu) {
      fullMenu.classList.remove("fullmenu-active");
    }

    header.querySelectorAll(".header-sublist").forEach((sublist) => {
      sublist.style.display = "";
      sublist.style.height = "";
      sublist.style.overflow = "";
    });

    if (isMobileViewport()) {
      document.documentElement.style.setProperty("overflow-x", "hidden");
      document.body.style.setProperty("overflow-x", "hidden");
    } else {
      document.documentElement.style.removeProperty("overflow-x");
      document.body.style.removeProperty("overflow-x");
    }

    if (fixedBar) {
      fixedBar.style.removeProperty("position");
      fixedBar.style.removeProperty("left");
      fixedBar.style.removeProperty("right");
      fixedBar.style.removeProperty("bottom");
      fixedBar.style.removeProperty("width");
      fixedBar.style.removeProperty("max-width");
      fixedBar.style.removeProperty("z-index");
      fixedBar.style.removeProperty("transform");
      fixedBar.style.removeProperty("-webkit-transform");
    }
  }

  function bindMobileLayoutGuard() {
    if (mobileLayoutGuardBound) return;
    mobileLayoutGuardBound = true;

    const run = () => {
      stabilizeMobileMenuLayout();
      window.requestAnimationFrame(stabilizeMobileMenuLayout);
      window.setTimeout(stabilizeMobileMenuLayout, 120);
    };

    window.addEventListener("pageshow", run);
    window.addEventListener("resize", run);
    window.addEventListener("orientationchange", run);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") run();
    });
  }

  function bindReserveLinkRouting() {
    document.querySelectorAll(".header-reserve-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        const isLocalPreview =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";

        if (!isLocalPreview) return;

        event.preventDefault();
        const localConsultationUrl = new URL(
          "./첫페이지 (AdKpMlw6KePt).html?consultation=1",
          window.location.href
        );
        window.top.location.href = localConsultationUrl.toString();
      });
    });
  }

  function closeMenuNavigationOverlay() {
    const header = document.querySelector(".menu-page-view .properties-N1");
    if (!header) return;

    header.classList.remove("block-active");
    header.querySelectorAll(".header-gnbitem").forEach((item) => {
      item.classList.remove("item-active");
    });

    const fullMenu = header.querySelector(".header-fullmenu");
    if (fullMenu) {
      fullMenu.classList.remove("fullmenu-active");
    }

    header.querySelectorAll(".header-sublist").forEach((sublist) => {
      sublist.style.display = "";
      sublist.style.height = "";
      sublist.style.overflow = "";
    });
  }

  function runPage(group, tab, variant) {
    setHeaderActive(group);
    renderHero(group, tab);
    renderTabs(group, tab, variant);
    renderContent(group, tab, variant);
    initContentReveal();
    bindReserveLinkRouting();
  }

  var NAV_FADE_MS = 160;

  function navigate(group, tab, variant) {
    var url = new URL(window.location.href);
    url.searchParams.set("group", group);
    url.searchParams.set("tab", tab);
    if (variant) {
      url.searchParams.set("variant", variant);
    } else {
      url.searchParams.delete("variant");
    }
    history.pushState({}, "", url.pathname + "?" + url.searchParams.toString());

    var main = document.querySelector(".menupage-main");
    if (main) main.classList.add("menupage-nav-fade");

    setTimeout(function () {
      runPage(group, tab, variant);
      if (main) {
        main.classList.remove("menupage-nav-fade");
      }
    }, NAV_FADE_MS);
  }

  function bindSpaNavigation() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest("a[href*=\"menu-page.html\"]");
      if (!link) return;
      if (e.defaultPrevented) return;
      e.preventDefault();
      var url = new URL(link.href, window.location.href);
      var g = url.searchParams.get("group") || "business";
      var t = url.searchParams.get("tab") || "overview";
      var v = url.searchParams.get("variant") || "";
      if (link.closest(".properties-N1")) {
        closeMenuNavigationOverlay();
      }
      navigate(g, t, v);
    });

    window.addEventListener("popstate", function () {
      var state = getStateFromUrl();
      var main = document.querySelector(".menupage-main");
      if (main) main.classList.add("menupage-nav-fade");
      setTimeout(function () {
        runPage(state.group, state.tab, state.variant);
        if (main) main.classList.remove("menupage-nav-fade");
      }, NAV_FADE_MS);
    });
  }

  function initMenuPage() {
    initBasicContentGuard();

    const { group, tab, variant } = getStateFromUrl();
    runPage(group, tab, variant);
    bindMobileLayoutGuard();
    stabilizeMobileMenuLayout();
    bindSpaNavigation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMenuPage);
  } else {
    initMenuPage();
  }
})();
