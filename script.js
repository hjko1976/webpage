/* =========================
   個人網頁互動腳本
   功能：
   1. Hero 圖片輪播自動播放
   2. 左右切換按鈕
   3. 小圓點切換
   4. 手機版選單開關
   5. 導覽列卷動效果
   6. 區塊淡入顯示
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  // ===== 導覽列滾動陰影效果 =====
  const header = document.querySelector(".site-header");

  function updateHeaderState() {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState);

  // ===== 手機版選單開關 =====
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-menu a");

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // ===== Hero 圖片輪播 =====
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentSlide = 0;
  let autoPlay;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");
    currentSlide = index;
  }

  function nextSlide() {
    let nextIndex = currentSlide + 1;
    if (nextIndex >= slides.length) nextIndex = 0;
    showSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = currentSlide - 1;
    if (prevIndex < 0) prevIndex = slides.length - 1;
    showSlide(prevIndex);
  }

  function startAutoPlay() {
    autoPlay = setInterval(nextSlide, 4500);
  }

  function resetAutoPlay() {
    clearInterval(autoPlay);
    startAutoPlay();
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoPlay();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      resetAutoPlay();
    });
  });

  startAutoPlay();

  // ===== 區塊淡入動畫 =====
  const fadeItems = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  fadeItems.forEach((item) => observer.observe(item));
});
/* =========================
   語言切換（中文 / English）
   - 預設英文
   - 記住使用者上次選擇（localStorage）
   - 英文內容取自 HTML 原文，中文取自 data-zh 屬性
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "site-lang";
  const TITLES = {
    en: "Hsien-Ju Ko | Academic Homepage",
    zh: "柯賢儒 | 學術個人網頁",
  };

  // 所有需要翻譯的元素（帶有 data-zh 屬性）
  const i18nNodes = document.querySelectorAll("[data-zh]");

  // 載入時先把目前的英文內容記起來，之後切回英文用
  const enCache = new WeakMap();
  i18nNodes.forEach((el) => enCache.set(el, el.innerHTML));

  const langButtons = document.querySelectorAll(".lang-btn");

  function setLanguage(lang) {
    const isZh = lang === "zh";

    document.documentElement.lang = isZh ? "zh-Hant" : "en";
    document.title = isZh ? TITLES.zh : TITLES.en;

    i18nNodes.forEach((el) => {
      el.innerHTML = isZh ? el.getAttribute("data-zh") : enCache.get(el);
    });

    langButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage 不可用時略過（例如隱私模式） */
    }
  }

  // 決定初始語言：有記錄且為中文才用中文，否則預設英文
  let initialLang = "en";
  try {
    if (localStorage.getItem(STORAGE_KEY) === "zh") initialLang = "zh";
  } catch (e) {
    /* 忽略讀取錯誤 */
  }
  setLanguage(initialLang);

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });
});
