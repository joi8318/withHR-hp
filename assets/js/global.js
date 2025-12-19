document.addEventListener("DOMContentLoaded", () => {
  // ====================== HEADER ======================
  (function () {
    const header = document.getElementById("header");
    const headerHeight = header.offsetHeight;
    const BREAKPOINT = 1024;

    const handleHeaderFixed = () => {
      // 태블릿 이하에서는 작동 안 함
      if (window.innerWidth <= BREAKPOINT) {
        header.classList.remove("is-fixed");
        document.body.classList.remove("is-header-fixed");
        return;
      }

      if (window.scrollY > headerHeight) {
        header.classList.add("is-fixed");
        document.body.classList.add("is-header-fixed");
      } else {
        header.classList.remove("is-fixed");
        document.body.classList.remove("is-header-fixed");
      }
    };

    window.addEventListener("scroll", handleHeaderFixed);
    window.addEventListener("resize", handleHeaderFixed); // ⭐ 필수
  })();

  // ====================== TOP ======================
  (function () {
    const btnTop = document.querySelector(".btn-top");
    const footer = document.getElementById("footer");

    const btnDefaultBottom = 10;
    const footerMargin = 10;

    const handleTopButton = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const footerTop = footer.offsetTop;

      if (scrollY > 300) {
        btnTop.classList.add("is-show");
      } else {
        btnTop.classList.remove("is-show");
      }

      const overlap = scrollY + windowH - footerTop + footerMargin;

      if (overlap > 0) {
        btnTop.style.bottom = `${btnDefaultBottom + overlap}px`;
      } else {
        btnTop.style.bottom = `${btnDefaultBottom}px`;
      }
    };

    window.addEventListener("scroll", handleTopButton);

    btnTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  })();

  // ====================== 레이어 팝업 ======================
  const openPopupBtns = document.querySelectorAll(".btn-pop-open");

  const openLayerPopup = (pop) => {
    if (!pop) return;

    let dim = pop._dim;
    if (!dim) {
      dim = document.createElement("div");
      dim.className = "dimmed";
      document.body.appendChild(dim);
      pop._dim = dim;
    }

    const activePopCount = document.querySelectorAll(".pop-wrap.active").length;
    const zBase = 100;
    dim.style.zIndex = zBase + activePopCount * 2;
    pop.style.zIndex = zBase + activePopCount * 2 + 1;

    dim.style.display = "block";
    pop.style.display = "block";

    requestAnimationFrame(() => {
      dim.classList.add("active");
      pop.classList.add("active");
    });

    const closeHandler = () => closeLayerPopup(pop);

    // 닫기 버튼
    pop.querySelectorAll(".btn-pop-close").forEach((btn) => {
      if (!btn.dataset.listenerAdded) {
        btn.addEventListener("click", closeHandler);
        btn.dataset.listenerAdded = "true";
      }
    });

    // dim 클릭 시 해당 팝업만 닫기
    dim.addEventListener("click", closeHandler);
  };

  const closeLayerPopup = (pop) => {
    if (!pop || !pop._dim || !pop.classList.contains("active")) return;

    const dim = pop._dim;

    pop.classList.remove("active");
    dim.classList.remove("active");

    dim.addEventListener(
      "transitionend",
      () => {
        pop.style.display = "none";
        if (dim.parentNode) dim.remove();
        delete pop._dim;
      },
      { once: true }
    );
  };

  // 팝업 열기 버튼 클릭
  openPopupBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(btn.dataset.target);
      openLayerPopup(target);
    });
  });

  // ====================== 애니메이션 ======================
  const targets = document.querySelectorAll(".ani");
  let observer = null;

  const createObserver = () => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
          } else {
            entry.target.classList.remove("is-active");
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    targets.forEach((el) => observer.observe(el));
  };

  const destroyObserver = () => {
    if (!observer) return;
    targets.forEach((el) => {
      observer.unobserve(el);
      el.classList.remove("is-active");
    });
    observer.disconnect();
    observer = null;
  };

  const checkWidth = () => {
    if (window.innerWidth >= 1280) {
      if (!observer) createObserver();
    } else {
      destroyObserver();
    }
  };

  checkWidth();
  window.addEventListener("resize", checkWidth);

  // ====================== 모바일메뉴 ======================
  const btnMobileMenu = document.querySelector(".btn-mobile-menu");
  const gnb = document.querySelector(".gnb");
  const gnbLinks = document.querySelectorAll(".gnb a");

  btnMobileMenu.addEventListener("click", () => {
    gnb.classList.toggle("gnb-mobile-open");
    btnMobileMenu.classList.toggle("active");
    document.body.classList.toggle("is-locked");
  });

  // 👉 메뉴 안 링크 클릭 시
  gnbLinks.forEach((link) => {
    link.addEventListener("click", () => {
      gnb.classList.remove("gnb-mobile-open");
      btnMobileMenu.classList.remove("active");
      document.body.classList.remove("is-locked");
    });
  });
});
