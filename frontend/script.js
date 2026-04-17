// ================= LOADER =================
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('hidden');
  }, 2200);
});

// ================= NAV =================
const nav = document.querySelector('nav');
const hero = document.getElementById('hero');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  if (!nav || !hero) return;

  const heroHeight = hero.offsetHeight;
  const scrollTop = window.scrollY;

  if (scrollTop > lastScrollTop && scrollTop > heroHeight) {
    nav.style.transform = 'translateY(-100%)';
  } else {
    nav.style.transform = 'translateY(0)';
  }

  lastScrollTop = Math.max(scrollTop, 0);
});

// ================= CURSOR =================
if (window.innerWidth > 768) {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');

  if (cursor && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    function animCursor() {
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';

      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;

      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';

      requestAnimationFrame(animCursor);
    }

    animCursor();

    document.querySelectorAll('a, button, .menu-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        ring.style.width = '60px';
        ring.style.height = '60px';
      });

      el.addEventListener('mouseleave', () => {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        ring.style.width = '40px';
        ring.style.height = '40px';
      });
    });
  }
}

// ================= CANVAS (UNCHANGED CORE) =================
(function () {
  const canvas = document.getElementById('scene-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 30 }, () => ({
    x: Math.random() * 1.2 - 0.1,
    y: Math.random(),
    size: Math.random() * 3 + 0.5,
    speed: Math.random() * 0.0006 + 0.0002,
    opacity: Math.random() * 0.5 + 0.1,
    drift: (Math.random() - 0.5) * 0.0003,
    hue: Math.random() > 0.5 ? 30 : 20,
    phase: Math.random() * Math.PI * 2
  }));

  let t = 0;
  let isVisible = true;
  
  const obs = new IntersectionObserver(e => {
    const wasVisible = isVisible;
    isVisible = e[0].isIntersecting;
    if (isVisible && !wasVisible) draw();
  });
  obs.observe(canvas);

  function draw() {
    if (!isVisible) return;
    
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.y -= p.speed;
      if (p.y < -0.05) {
        p.y = 1.05;
        p.x = Math.random();
      }

      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196,133,58,${p.opacity})`;
      ctx.fill();
    });

    t += 0.01;
    requestAnimationFrame(draw);
  }

  draw();
})();

// ================= PARALLAX WAVES =================
(function () {
  const pCanvas = document.getElementById('parallax-canvas');
  if (!pCanvas) return;
  const ctx = pCanvas.getContext('2d');
  let W, H;
  function resize() {
    W = pCanvas.width = pCanvas.offsetWidth;
    H = pCanvas.height = pCanvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  let t = 0;
  let isVisible = true;
  
  const obs = new IntersectionObserver(e => {
    const wasVisible = isVisible;
    isVisible = e[0].isIntersecting;
    if (isVisible && !wasVisible) draw();
  });
  obs.observe(pCanvas);

  function draw() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(196,133,58,0.05)';
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let i = 0; i <= W; i += 40) {
        ctx.lineTo(i, Math.sin(i * 0.005 + t) * 50 + H / 2);
    }
    ctx.lineTo(W, H);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(196,133,58,0.1)';
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let i = 0; i <= W; i += 40) {
        ctx.lineTo(i, Math.sin(i * 0.003 + t + 2) * 40 + H / 2 + 20);
    }
    ctx.lineTo(W, H);
    ctx.fill();

    t += 0.02;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ================= SCROLL REVEAL =================
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      if (e.target.classList.contains('about-card')) {
        e.target.classList.add('show');
      } else {
        e.target.classList.add('visible');
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .about-card').forEach(el => revealObs.observe(el));

// ================= SMOOTH SCROLL =================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();

    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;

    window.scrollTo({
      top: target.offsetTop - 100,
      behavior: 'smooth'
    });
  });
});

// ================= POPUP =================
function showPopup(message, type = "success") {
  const popup = document.getElementById("popup");
  const text = document.getElementById("popup-message");

  if (!popup || !text) return;

  text.textContent = message;

  popup.classList.remove("success", "error");
  popup.classList.add("show", type);

  setTimeout(() => popup.classList.remove("show"), 2500);
}

// ================= SANITIZE =================
const sanitize = (str) => str.replace(/[<>]/g, "").trim();

// ================= WHATSAPP BUTTON =================
window.addEventListener('DOMContentLoaded', () => {
  const waBtn = document.querySelector('.whatsapp-btn');
  const bookingSec = document.getElementById('booking');
  if (waBtn && bookingSec) {
    const waObs = new IntersectionObserver(e => {
      if(e[0].isIntersecting) {
        waBtn.style.opacity = '1';
        waBtn.style.pointerEvents = 'all';
      } else {
        waBtn.style.opacity = '0';
        waBtn.style.pointerEvents = 'none';
      }
    }, { threshold: 0.1 });
    waObs.observe(bookingSec);
  }
});

// ================= FORM =================
window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".booking-form");
  if (!form) return;

  const dateInput = form.querySelector('input[type="date"]');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split("T")[0];
  }

  const phoneInput = form.querySelector('[name="phone"]');

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, "");
      phoneInput.classList.remove("error");
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const button = form.querySelector("button");

    const nameInput = form.querySelector('input[type="text"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const dateInput = form.querySelector('input[type="date"]');
    const selects = form.querySelectorAll('select');
    const timeInput = selects[0];
    const guestsInput = selects[1];

    const data = {
      name: sanitize(nameInput.value),
      phone: sanitize(phoneInput.value),
      date: dateInput.value,
      time: timeInput.value,
      guests: parseInt(guestsInput.value) || 1
    };

    let valid = true;

    form.querySelectorAll("input, select").forEach(el => el.classList.remove("error"));

    if (!data.name || data.name.length < 2) {
      nameInput.classList.add("error");
      valid = false;
    }

    if (!/^[0-9]{10}$/.test(data.phone)) {
      phoneInput.classList.add("error");
      valid = false;
    }

    const offsetDate = new Date();
    offsetDate.setMinutes(offsetDate.getMinutes() - offsetDate.getTimezoneOffset());
    const todayLocal = offsetDate.toISOString().split("T")[0];

    if (!data.date || data.date < todayLocal) {
      dateInput.classList.add("error");
      valid = false;
    }

    if (!data.time || !data.guests) {
      timeInput.classList.add("error");
      guestsInput.classList.add("error");
      valid = false;
    }

    if (!valid) {
      showPopup("Fill the fields ⚠️", "error");
      return;
    }

    button.disabled = true;
    button.innerHTML = "<span class='spinner'></span> Booking...";

    try {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:";
      const API_URL = isLocal ? "http://localhost:10000" : "https://cafe-website-1qvi.onrender.com";

      const res = await fetch(`${API_URL}/api/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      let result;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      } else {
        result = { error: await res.text() || "Unexpected server response" };
      }

      if (!res.ok) {
        showPopup(result.error || "Failed ❌", "error");
      } else {
        showPopup("Reservation Confirmed ☕");
        form.reset();
      }

    } catch (err) {
      if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
        showPopup("Is the backend server running? 🚫", "error");
      } else {
        showPopup("Server error 🚫", "error");
      }
      console.error(err);
    }

    button.disabled = false;
    button.innerHTML = "Confirm Reservation";
  });
});