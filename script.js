// ==============================
// Helpers
// ==============================
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// ==============================
// Custom Cursor
// ==============================
const cursor = $("cursor");
const cursorDot = $("cursorDot");
let mx = 0,
  my = 0,
  cx = 0,
  cy = 0;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  cursorDot.style.left = mx + "px";
  cursorDot.style.top = my + "px";
});
document.addEventListener("mousedown", () => cursor.classList.add("hovered"));
document.addEventListener("mouseup", () => cursor.classList.remove("hovered"));
document
  .querySelectorAll("a,button,.project-card,.skill-tab,.filter-btn")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hovered"));
  });
(function animCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursor.style.left = cx + "px";
  cursor.style.top = cy + "px";
  requestAnimationFrame(animCursor);
})();

// ==============================
// Particles
// ==============================
const canvas = $("particleCanvas");
const ctx = canvas.getContext("2d");
const resize = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
};
resize();
addEventListener("resize", resize);

const COLORS = ["#a78bfa", "#38bdf8", "#34d399", "#f472b6"];
const particles = Array.from({ length: 65 }, () => ({
  x: 0,
  y: 0,
  size: 0,
  sx: 0,
  sy: 0,
  color: "",
  op: 0,
  pulse: 0,
  init() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.4;
    this.sx = (Math.random() - 0.5) * 0.35;
    this.sy = (Math.random() - 0.5) * 0.35;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.op = Math.random() * 0.45 + 0.1;
    this.pulse = Math.random() * Math.PI * 2;
  },
}));
particles.forEach((p) => p.init());

(function animParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.sx;
    p.y += p.sy;
    p.pulse += 0.018;
    if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height)
      p.init();
    const op = p.op * (0.7 + 0.3 * Math.sin(p.pulse));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = op;
    ctx.fill();
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 90) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = (1 - d / 90) * 0.07;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(animParticles);
})();

// ==============================
// Progress Bar
// ==============================
const progressBar = $("progressBar");
addEventListener("scroll", () => {
  const scrolled = scrollY / (document.body.scrollHeight - innerHeight);
  progressBar.style.width = scrolled * 100 + "%";
});

// ==============================
// Navbar
// ==============================
const navbar = $("navbar");
addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", scrollY > 30);
  $("backToTop").classList.toggle("visible", scrollY > 400);
});

// ==============================
// Hamburger
// ==============================
const hamburger = $("hamburger");
const navLinks = $("navLinks");
hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
$$(".nav-link").forEach((l) =>
  l.addEventListener("click", () => navLinks.classList.remove("open")),
);

// ==============================
// Theme Toggle (dark/light)
// ==============================
const themeToggle = $("themeToggle");
const html = document.documentElement;
let isDark = true;
// Persist
const saved = localStorage.getItem("jk-theme");
if (saved) {
  html.setAttribute("data-theme", saved);
  isDark = saved === "dark";
}

themeToggle.addEventListener("click", () => {
  isDark = !isDark;
  const theme = isDark ? "dark" : "light";
  html.setAttribute("data-theme", theme);
  localStorage.setItem("jk-theme", theme);
});

// ==============================
// Back to Top
// ==============================
$("backToTop").addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

// ==============================
// Typed Text
// ==============================
const phrases = [
  "Full-Stack Developer",
  "CS Educator & Mentor",
  "Machine Learning Engineer",
  "Vue.js & React Specialist",
  "Open Source Contributor",
];
let pIdx = 0,
  cIdx = 0,
  deleting = false;
const typedEl = $("typedText");
function typeLoop() {
  const curr = phrases[pIdx];
  typedEl.textContent = deleting
    ? curr.substring(0, cIdx - 1)
    : curr.substring(0, cIdx + 1);
  deleting ? cIdx-- : cIdx++;
  if (!deleting && cIdx === curr.length) {
    deleting = true;
    setTimeout(typeLoop, 1800);
    return;
  }
  if (deleting && cIdx === 0) {
    deleting = false;
    pIdx = (pIdx + 1) % phrases.length;
  }
  setTimeout(typeLoop, deleting ? 55 : 75);
}
typeLoop();

// ==============================
// Counter Animation
// ==============================
const countered = new Set();
function animCounter(el, target) {
  let v = 0;
  const inc = target / 55;
  const t = setInterval(() => {
    v = Math.min(v + inc, target);
    el.textContent = Math.floor(v);
    if (v >= target) clearInterval(t);
  }, 20);
}

// ==============================
// Scroll Reveal
// ==============================
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("revealed");
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
$$(".reveal-up,.reveal-left,.reveal-right").forEach((el) =>
  revealObs.observe(el),
);

// Counter observer
const cntObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !countered.has(e.target)) {
        countered.add(e.target);
        animCounter(e.target, parseInt(e.target.dataset.target));
      }
    });
  },
  { threshold: 0.3 },
);
$$(".counter").forEach((el) => cntObs.observe(el));

// ==============================
// Hero entrance
// ==============================
window.addEventListener("load", () => {
  $$("#hero .reveal-up").forEach((el) => el.classList.add("revealed"));
});

// ==============================
// Project Cards – Glow + Tilt
// ==============================
$$(".project-card").forEach((card) => {
  const color = card.dataset.color || "#a78bfa";
  const glow = card.querySelector(".project-glow");
  if (glow)
    glow.style.background = `radial-gradient(circle at 30% 30%, ${color}22 0%, transparent 65%)`;

  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 10;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 10;
    card.style.transform = `translateY(-6px) rotateX(${-dy}deg) rotateY(${dx}deg)`;
    card.style.transition = "border-color 0.3s";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transition = "all 0.5s cubic-bezier(.34,1.56,.64,1)";
  });
});

// ==============================
// Project Filter
// ==============================
$$(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    $$(".project-card").forEach((card) => {
      const cats = (card.dataset.cats || "").split(" ");
      const show = f === "all" || cats.includes(f);
      card.classList.toggle("filtered-out", !show);
      card.style.display = show ? "" : "none";
    });
  });
});

// ==============================
// Skill Tabs + Progress Bars
// ==============================
const skillBarsAnimated = new Set();

function animateBarsIn(panel) {
  panel.querySelectorAll(".skill-fill").forEach((bar) => {
    if (!skillBarsAnimated.has(bar)) {
      skillBarsAnimated.add(bar);
      const w = bar.dataset.w;
      requestAnimationFrame(() => {
        setTimeout(() => {
          bar.style.width = w + "%";
        }, 60);
      });
    } else {
      bar.style.width = bar.dataset.w + "%";
    }
  });
}

$$(".skill-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    $$(".skill-tab").forEach((t) => t.classList.remove("active"));
    $$(".skill-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    const panel = $("tab-" + tab.dataset.tab);
    panel.classList.add("active");
    animateBarsIn(panel);
  });
});

// Animate bars on scroll for active panel
const skillSectionObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const activePanel = document.querySelector(".skill-panel.active");
        if (activePanel) animateBarsIn(activePanel);
      }
    });
  },
  { threshold: 0.2 },
);
const skillSection = document.querySelector("#skills");
if (skillSection) skillSectionObs.observe(skillSection);

// ==============================
// Ripple Effect on Buttons
// ==============================
$$(".ripple-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const r = btn.getBoundingClientRect();
    const size = Math.max(btn.offsetWidth, btn.offsetHeight) * 2;
    const ripple = document.createElement("span");
    ripple.className = "ripple-fx";
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// ==============================
// Fun Ticker
// ==============================
const facts = [
  "Solved 450+ DSA problems across platforms",
  "Teaches AI & Web to Polytechnic students",
  "Built apps used by international clients",
  "IELTS Band 7 certified",
  "Active in Women Who Code community",
  "Department Rank 2 across 4 semesters",
  "Certified by IIT Bombay in C & C++",
];
let factIdx = 0;
const tickerText = $("tickerText");
if (tickerText) {
  setInterval(() => {
    factIdx = (factIdx + 1) % facts.length;
    tickerText.style.opacity = "0";
    tickerText.style.transform = "translateY(8px)";
    setTimeout(() => {
      tickerText.textContent = facts[factIdx];
      tickerText.style.transition = "opacity 0.4s, transform 0.4s";
      tickerText.style.opacity = "1";
      tickerText.style.transform = "translateY(0)";
    }, 350);
  }, 3500);
}

// ==============================
// Contact Form Validation
// ==============================
const form = $("contactForm");
if (form) {
  function setError(id, msg) {
    const el = $(id);
    if (el) {
      el.textContent = msg;
    }
    const input = el ? el.previousElementSibling : null;
    if (input) {
      input.classList.toggle("error", !!msg);
    }
  }
  function validate() {
    let ok = true;
    const name = $("fname").value.trim();
    const email = $("femail").value.trim();
    const subject = $("fsubject").value.trim();
    const msg = $("fmsg").value.trim();
    setError("fnameErr", name.length < 2 ? "Please enter your name." : "");
    if (!name || name.length < 2) ok = false;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setError(
      "femailErr",
      !emailRe.test(email) ? "Please enter a valid email." : "",
    );
    if (!emailRe.test(email)) ok = false;
    setError(
      "fsubjectErr",
      subject.length < 3 ? "Please enter a subject." : "",
    );
    if (!subject || subject.length < 3) ok = false;
    setError(
      "fmsgErr",
      msg.length < 10 ? "Message must be at least 10 characters." : "",
    );
    if (!msg || msg.length < 10) ok = false;
    return ok;
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;
    const btn = $("formSubmit");
    const text = btn.querySelector(".submit-text");
    const spinner = btn.querySelector(".submit-spinner");
    text.classList.add("hidden");
    spinner.classList.remove("hidden");
    btn.disabled = true;
    setTimeout(() => {
      text.classList.remove("hidden");
      spinner.classList.add("hidden");
      btn.disabled = false;
      form.reset();
      const success = $("formSuccess");
      success.classList.remove("hidden");
      setTimeout(() => success.classList.add("hidden"), 5000);
    }, 1800);
  });
  // Live validation on blur
  ["fname", "femail", "fsubject", "fmsg"].forEach((id) => {
    $(id)?.addEventListener("blur", validate);
  });
}

// ==============================
// Active Nav Highlight on Scroll
// ==============================
const sectObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        $$(".nav-link").forEach((a) => {
          const active = a.getAttribute("href") === "#" + e.target.id;
          a.style.color = active ? "var(--text)" : "";
        });
      }
    });
  },
  { threshold: 0.45 },
);
$$("section[id]").forEach((s) => sectObs.observe(s));

// ==============================
// Smooth anchor scroll offset fix
// ==============================
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + scrollY - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  });
});

// ==============================
// Fake resume download toast
// ==============================
const dlResume = $("dlResume");
if (dlResume) {
  dlResume.addEventListener("click", (e) => {
    e.preventDefault();
    const toast = document.createElement("div");
    toast.textContent = "📄 Resume download will be available soon!";
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "5rem",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#1e1b4b",
      color: "#c4b5fd",
      padding: "12px 22px",
      borderRadius: "50px",
      fontSize: "13px",
      zIndex: "9999",
      border: "1px solid #a78bfa44",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 20px rgba(167,139,250,0.2)",
      animation: "fadeInUp2 0.4s ease",
    });
    const style = document.createElement("style");
    style.textContent =
      "@keyframes fadeInUp2{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}";
    document.head.appendChild(style);
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  });
}
