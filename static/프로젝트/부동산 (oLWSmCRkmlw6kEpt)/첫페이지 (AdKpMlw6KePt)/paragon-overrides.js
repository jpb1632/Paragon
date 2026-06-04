(function () {
  "use strict";

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  function initUnitTypes() {
    var root = document.querySelector("[data-unit-types]");
    if (!root || root.dataset.paragonReady === "true") return;

    var stage = root.querySelector(".unit-types-swiper");
    var tabs = toArray(root.querySelectorAll(".unit-types-tab"));
    var slides = toArray(root.querySelectorAll(".unit-types-panel")).filter(function (slide) {
      return !slide.classList.contains("swiper-slide-duplicate");
    });
    var current = root.querySelector(".unit-types-current");
    var progressBars = toArray(root.querySelectorAll(".unit-types-progress-bar"));
    var prevButton = root.querySelector(".unit-types-prev");
    var nextButton = root.querySelector(".unit-types-next");

    if (!stage || !tabs.length || !slides.length) return;

    var count = slides.length;
    var swiper = null;

    function normalize(index) {
      var value = Number(index);
      if (!Number.isFinite(value)) value = 0;
      return ((Math.round(value) % count) + count) % count;
    }

    function getSwiper() {
      swiper = stage.swiper || swiper;
      return swiper && !swiper.destroyed ? swiper : null;
    }

    function getActiveIndex() {
      var activeSwiper = getSwiper();
      if (activeSwiper && typeof activeSwiper.realIndex === "number") {
        return normalize(activeSwiper.realIndex);
      }

      var activeIndex = slides.findIndex(function (slide) {
        return slide.classList.contains("swiper-slide-active") || slide.classList.contains("is-active");
      });
      return normalize(activeIndex);
    }

    function sync(index) {
      var active = normalize(index);

      tabs.forEach(function (tab, tabIndex) {
        var selected = tabIndex === active;
        tab.classList.toggle("is-active", selected);
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        if (selected) {
          tab.removeAttribute("tabindex");
        } else {
          tab.setAttribute("tabindex", "-1");
        }
      });

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === active);
      });

      progressBars.forEach(function (bar, barIndex) {
        bar.classList.toggle("is-active", barIndex === active);
      });

      if (current && tabs[active]) {
        current.textContent = tabs[active].dataset.type || tabs[active].textContent.trim();
      }
    }

    function go(index) {
      var target = normalize(index);
      var activeSwiper = getSwiper();

      if (activeSwiper) {
        var speed = activeSwiper.params && activeSwiper.params.speed ? activeSwiper.params.speed : 650;
        if (typeof activeSwiper.slideToLoop === "function" && activeSwiper.params && activeSwiper.params.loop) {
          activeSwiper.slideToLoop(target, speed);
        } else if (typeof activeSwiper.slideTo === "function") {
          activeSwiper.slideTo(target, speed);
        }
      }

      sync(target);
    }

    function intercept(event, index) {
      event.preventDefault();
      event.stopImmediatePropagation();
      go(index);
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function (event) {
        intercept(event, index);
      }, true);
    });

    if (prevButton) {
      prevButton.addEventListener("click", function (event) {
        intercept(event, getActiveIndex() - 1);
      }, true);
    }

    if (nextButton) {
      nextButton.addEventListener("click", function (event) {
        intercept(event, getActiveIndex() + 1);
      }, true);
    }

    var bindSwiperEvents = window.setInterval(function () {
      var activeSwiper = getSwiper();
      if (!activeSwiper || activeSwiper.__paragonEventsReady) return;

      if (typeof activeSwiper.on === "function") {
        activeSwiper.on("slideChange", function () {
          sync(getActiveIndex());
        });
        activeSwiper.on("transitionEnd", function () {
          sync(getActiveIndex());
        });
      }

      activeSwiper.__paragonEventsReady = true;
      window.clearInterval(bindSwiperEvents);
      sync(getActiveIndex());
    }, 120);

    window.setTimeout(function () {
      window.clearInterval(bindSwiperEvents);
    }, 3000);

    root.dataset.paragonReady = "true";
    sync(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUnitTypes);
  } else {
    initUnitTypes();
  }
})();
