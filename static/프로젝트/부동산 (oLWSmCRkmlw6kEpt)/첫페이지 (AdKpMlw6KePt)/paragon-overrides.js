(function () {
  "use strict";

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  function fixSpecializedMenuLabels() {
    toArray(document.querySelectorAll("a")).forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href.indexOf("tab=concierge") !== -1) {
        link.setAttribute("href", href.replace("tab=concierge", "tab=specialized"));
      }

      toArray(link.querySelectorAll("span")).forEach(function (span) {
        if (span.textContent.trim() === "컨시어지") {
          span.textContent = "특화설계";
        }
      });
    });
  }

  function watchSpecializedMenuLabels() {
    fixSpecializedMenuLabels();
    window.setTimeout(fixSpecializedMenuLabels, 80);
    window.setTimeout(fixSpecializedMenuLabels, 300);
    window.setTimeout(fixSpecializedMenuLabels, 1000);

    if (!window.MutationObserver || !document.body) return;
    var pending = false;
    var observer = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(function () {
        pending = false;
        fixSpecializedMenuLabels();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function initUnitTypes() {
    var root = document.querySelector("[data-unit-types]");
    if (!root || root.dataset.paragonReady === "true") return;
    root.dataset.paragonReady = "true";

    var stage = root.querySelector(".unit-types-swiper");
    var tabs = toArray(root.querySelectorAll(".unit-types-tab"));
    var slides = toArray(root.querySelectorAll(".unit-types-panel")).filter(function (s) {
      return !s.classList.contains("swiper-slide-duplicate");
    });
    var current = root.querySelector(".unit-types-current");
    var progressBars = toArray(root.querySelectorAll(".unit-types-progress-bar"));
    var prevButton = root.querySelector(".unit-types-prev");
    var nextButton = root.querySelector(".unit-types-next");

    if (!stage || !slides.length) return;

    var count = slides.length; // 3
    var wrapper = stage.querySelector(".swiper-wrapper");
    if (!wrapper) return;

    /* ── Swiper 완전 비활성화 ── */
    if (stage.swiper && !stage.swiper.destroyed) stage.swiper.destroy(true, true);
    // 혹시 나중에 style.js 가 재초기화하더라도 무력화
    Object.defineProperty(stage, "swiper", { get: function(){ return null; }, set: function(){}, configurable: true });

    /* ── 기존 클론 제거 및 래퍼 초기화 ── */
    toArray(wrapper.querySelectorAll(".swiper-slide-duplicate")).forEach(function (el) { el.parentNode.removeChild(el); });
    slides.forEach(function (s) {
      s.removeAttribute("style");
      ["swiper-slide-active","swiper-slide-prev","swiper-slide-next","is-active"].forEach(function(c){ s.classList.remove(c); });
    });
    wrapper.removeAttribute("style");
    stage.removeAttribute("style");
    ["swiper-initialized","swiper-horizontal","swiper-vertical","swiper-pointer-events"].forEach(function(c){ stage.classList.remove(c); });

    /* ── 클론 슬라이드 추가 (무한루프용) ──
       순서: [84B-clone] [72] [84A] [84B] [72-clone]
       인덱스:    0         1    2    3      4
       실제 인덱스:  0→realIdx  1   2   (0)
    */
    var clonePrev = slides[count - 1].cloneNode(true); // 84B clone (맨 앞)
    var cloneNext = slides[0].cloneNode(true);          // 72  clone (맨 뒤)
    clonePrev.classList.add("swiper-slide-duplicate");
    cloneNext.classList.add("swiper-slide-duplicate");
    wrapper.insertBefore(clonePrev, wrapper.firstChild);
    wrapper.appendChild(cloneNext);

    /* ── 레이아웃 ── */
    stage.classList.add("swiper-initialized"); // display:none 규칙 해제
    stage.style.overflow = "hidden";
    stage.style.position = "relative";
    stage.style.cursor = "grab";
    wrapper.style.display = "flex";
    wrapper.style.willChange = "transform";

    // 모든 슬라이드(클론 포함): 표시 + opacity/scale 고정 (CSS transition 무력화)
    toArray(wrapper.children).forEach(function (s) {
      s.style.display = "block";
      s.style.opacity = "1";
      s.style.transform = "scale(1)";
      s.style.transition = "none";
    });

    function setSlideWidth() {
      var w = stage.offsetWidth;
      toArray(wrapper.children).forEach(function (s) {
        s.style.flex = "0 0 " + w + "px";
        s.style.width = w + "px";
      });
      return w;
    }
    var slideW = setSlideWidth();
    window.addEventListener("resize", function () { slideW = setSlideWidth(); moveTo(realIdx, false); });

    /* ── 상태 ── */
    var realIdx = 0; // 0: 72, 1: 84A, 2: 84B
    var transitioning = false;

    function wrapperIdx(real) { return real + 1; } // 클론 오프셋

    function setTransform(x, animate) {
      wrapper.style.transition = animate ? "transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)" : "none";
      wrapper.style.transform = "translateX(" + x + "px)";
    }

    function moveTo(real, animate) {
      if (animate === undefined) animate = true;
      realIdx = ((real % count) + count) % count;
      setTransform(-wrapperIdx(realIdx) * slideW, animate);
      syncUI(realIdx);
    }

    function syncUI(idx) {
      var a = ((idx % count) + count) % count;
      tabs.forEach(function (t, i) {
        t.classList.toggle("is-active", i === a);
        t.setAttribute("aria-selected", i === a ? "true" : "false");
        if (i === a) t.removeAttribute("tabindex"); else t.setAttribute("tabindex", "-1");
      });
      slides.forEach(function (s, i) { s.classList.toggle("is-active", i === a); });
      progressBars.forEach(function (b, i) { b.classList.toggle("is-active", i === a); });
      if (current && tabs[a]) current.textContent = tabs[a].dataset.type || tabs[a].textContent.trim();
    }

    /* transitionend: 클론에서 실제 슬라이드로 순간이동 */
    wrapper.addEventListener("transitionend", function () {
      transitioning = false;
      // 맨 앞 클론(인덱스 0 = 84B 클론)에 있으면 실제 84B(인덱스 count)로
      // 맨 뒤 클론(인덱스 count+1 = 72 클론)에 있으면 실제 72(인덱스 1)로
      var pos = -Math.round(parseFloat(wrapper.style.transform.replace("translateX(","")) / slideW);
      if (pos === 0) {
        // 84B 클론 → 실제 84B
        setTransform(-count * slideW, false);
      } else if (pos === count + 1) {
        // 72 클론 → 실제 72
        setTransform(-slideW, false);
      }
    });

    function goTo(target) {
      if (transitioning) return;
      transitioning = true;
      var next = ((target % count) + count) % count;
      realIdx = next;
      setTransform(-wrapperIdx(next) * slideW, true);
      syncUI(next);
    }

    /* ── 탭/버튼 ── */
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function (e) {
        e.preventDefault(); e.stopImmediatePropagation();
        goTo(i);
      }, true);
    });
    if (prevButton) prevButton.addEventListener("click", function (e) {
      e.preventDefault(); e.stopImmediatePropagation();
      goTo(realIdx - 1);
    }, true);
    if (nextButton) nextButton.addEventListener("click", function (e) {
      e.preventDefault(); e.stopImmediatePropagation();
      goTo(realIdx + 1);
    }, true);

    /* ── 터치 / 마우스 스와이프 ── */
    var dragStartX = null, dragStartY = null, dragging = false, startOffset = 0;

    function onStart(x, y) {
      if (transitioning) return;
      dragStartX = x; dragStartY = y; dragging = false;
      startOffset = -wrapperIdx(realIdx) * slideW;
      wrapper.style.transition = "none";
    }

    function onMove(x, y) {
      if (dragStartX === null) return;
      var dx = x - dragStartX, dy = y - dragStartY;
      if (!dragging) {
        if (Math.abs(dx) < 5) return;
        if (Math.abs(dy) > Math.abs(dx)) { dragStartX = null; return; } // 세로 스크롤
        dragging = true;
      }
      wrapper.style.transform = "translateX(" + (startOffset + dx) + "px)";
    }

    function onEnd(x) {
      if (dragStartX === null) return;
      var dx = x - dragStartX;
      dragStartX = null;
      stage.style.cursor = "grab";
      if (!dragging || Math.abs(dx) < 30) {
        // 스냅백
        wrapper.style.transition = "transform 0.3s ease";
        wrapper.style.transform = "translateX(" + startOffset + "px)";
        return;
      }
      transitioning = true;
      if (dx < 0) {
        // 다음 슬라이드 (무한: 84B 다음은 72 클론)
        var nextPos = realIdx + 1; // 1~count 범위 클론 포함
        var nextReal = ((realIdx + 1) % count + count) % count;
        syncUI(nextReal);
        wrapper.style.transition = "transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)";
        wrapper.style.transform = "translateX(" + (-(wrapperIdx(realIdx) + 1) * slideW) + "px)";
        realIdx = nextReal;
      } else {
        var prevReal = ((realIdx - 1) % count + count) % count;
        syncUI(prevReal);
        wrapper.style.transition = "transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)";
        wrapper.style.transform = "translateX(" + (-(wrapperIdx(realIdx) - 1) * slideW) + "px)";
        realIdx = prevReal;
      }
    }

    stage.addEventListener("touchstart", function (e) { onStart(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    stage.addEventListener("touchmove", function (e) { onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    stage.addEventListener("touchend", function (e) { onEnd(e.changedTouches[0].clientX); }, { passive: true });

    stage.addEventListener("mousedown", function (e) {
      e.preventDefault();
      stage.style.cursor = "grabbing";
      onStart(e.clientX, e.clientY);
    });
    window.addEventListener("mousemove", function (e) { onMove(e.clientX, e.clientY); });
    window.addEventListener("mouseup", function (e) { onEnd(e.clientX); });

    /* 초기 위치 */
    moveTo(0, false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      watchSpecializedMenuLabels();
      initUnitTypes();
    });
  } else {
    watchSpecializedMenuLabels();
    initUnitTypes();
  }
})();
