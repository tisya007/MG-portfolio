const filter_btns = document.querySelectorAll(".filter-btn");
const skills_wrap = document.querySelector(".skills");
const skills_bars = document.querySelectorAll(".skill-progress");
const records_wrap = document.querySelector(".records");
const records_numbers = document.querySelectorAll(".number");
const footer_input = document.querySelector(".footer-input");
const hamburger_menu = document.querySelector(".hamburger-menu");
const navbar = document.querySelector("header nav");
const links = document.querySelectorAll(".links a");

footer_input.addEventListener("focus", () => {
  footer_input.classList.add("focus");
});

footer_input.addEventListener("blur", () => {
  if (footer_input.value != "") return;
  footer_input.classList.remove("focus");
});

function closeMenu() {
  navbar.classList.remove("open");
  document.body.classList.remove("stop-scrolling");
}

hamburger_menu.addEventListener("click", () => {
  if (!navbar.classList.contains("open")) {
    navbar.classList.add("open");
    document.body.classList.add("stop-scrolling");
  } else {
    closeMenu();
  }
});

links.forEach((link) => link.addEventListener("click", () => closeMenu()));

filter_btns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filter_btns.forEach((button) => button.classList.remove("active"));
    btn.classList.add("active");

    let filterValue = btn.dataset.filter;

    $(".grid").isotope({ filter: filterValue });
  })
);

$(".grid").isotope({
  itemSelector: ".grid-item",
  layoutMode: "fitRows",
  transitionDuration: "0.6s",
});

window.addEventListener("scroll", () => {
  skillsEffect();
  countUp();
});

function checkScroll(el) {
  let rect = el.getBoundingClientRect();
  if (window.innerHeight >= rect.top + el.offsetHeight) return true;
  return false;
}

function skillsEffect() {
  if (!checkScroll(skills_wrap)) return;
  skills_bars.forEach((skill) => (skill.style.width = skill.dataset.progress));
}

function countUp() {
  if (!checkScroll(records_wrap)) return;
  records_numbers.forEach((numb) => {
    const updateCount = () => {
      let currentNum = +numb.innerText;
      let maxNum = +numb.dataset.num;
      let speed = 100;
      const increment = Math.ceil(maxNum / speed);

      if (currentNum < maxNum) {
        numb.innerText = currentNum + increment;
        setTimeout(updateCount, 1);
      } else {
        numb.innerText = maxNum;
      }
    };

    setTimeout(updateCount, 400);
  });
}

var mySwiper = new Swiper(".swiper-container", {
  speed: 1100,
  slidesPerView: 1,
  loop: true,
  autoplay: {
    delay: 5000,
  },
  navigation: {
    prevEl: ".swiper-button-prev",
    nextEl: ".swiper-button-next",
  },
});

const contactForm = document.querySelector("#contact-form-el");

if (contactForm) {
  const formStatus = document.querySelector("#form-status");
  const submitBtn = contactForm.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.textContent;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    formStatus.textContent = "";
    formStatus.className = "form-status";

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        formStatus.textContent = "Thanks! Your message has been sent.";
        formStatus.classList.add("success");
        contactForm.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      formStatus.textContent =
        "Something went wrong. Please try again or email me directly.";
      formStatus.classList.add("error");
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

/* =========================================================
   Landing page animations
   ========================================================= */

// ---- 1 & 2: Scroll reveal (fade + rise) with staggered groups ----
const revealTargets = document.querySelectorAll(
  [
    ".section-header",
    ".card-wrap",
    ".grid-item .gallery-image",
    ".about .column-1",
    ".about .column-2",
    ".records .wrap",
    ".blog-wrap",
    ".contact-box",
  ].join(",")
);

revealTargets.forEach((el) => el.classList.add("reveal"));

function applyStagger(containerSelector, itemSelector, step = 120) {
  document.querySelectorAll(containerSelector).forEach((container) => {
    const items = container.querySelectorAll(itemSelector);
    items.forEach((item, i) => {
      item.style.transitionDelay = `${i * step}ms`;
    });
  });
}

applyStagger(".cards", ".card-wrap");
applyStagger(".grid", ".grid-item .gallery-image", 90);
applyStagger(".blog-wrapper", ".blog-wrap");
applyStagger(".records .container", ".wrap");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  // Fallback: no IntersectionObserver support, just show everything
  revealTargets.forEach((el) => el.classList.add("in-view"));
}

// ---- 3: Portfolio image wipe reveal ----
document.querySelectorAll(".grid-item .gallery-image").forEach((gallery) => {
  const mask = document.createElement("div");
  mask.className = "reveal-mask";
  gallery.appendChild(mask);
});

// ---- 4: Subtle parallax on hero decorative shapes ----
const parallaxShapes = document.querySelectorAll(
  "header .points1, header .points2, header .triangle, header .xshape, header .square, header .half-circle1, header .half-circle2, header .wave2, header .letters"
);

if (parallaxShapes.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let ticking = false;

  function updateParallax() {
    const scrolled = window.scrollY;
    parallaxShapes.forEach((el, i) => {
      const speed = 0.1 + (i % 4) * 0.06;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

// ---- 6: Cursor-following glow in the hero ----
const heroGlow = document.querySelector(".cursor-glow");
const heroSection = document.querySelector("header");

if (heroGlow && heroSection && window.matchMedia("(pointer: fine)").matches) {
  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    heroGlow.style.left = `${e.clientX - rect.left}px`;
    heroGlow.style.top = `${e.clientY - rect.top}px`;
    heroGlow.classList.add("active");
  });

  heroSection.addEventListener("mouseleave", () => {
    heroGlow.classList.remove("active");
  });
}