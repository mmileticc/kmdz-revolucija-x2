 /* ─── CONFETTI ─── */
  (function(){
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let pieces = [];
    const COLORS = ['#f5c842','#ff3d7f','#00e5ff','#ff9e2c','#ffffff'];

    function resize(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function spawn(n){
      for(let i = 0; i < n; i++){
        pieces.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          w: Math.random() * 8 + 4,
          h: Math.random() * 4 + 2,
          color: COLORS[Math.floor(Math.random()*COLORS.length)],
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random()-0.5)*0.2,
          vy: Math.random() * 2 + 1.5,
          vx: (Math.random()-0.5) * 1.5,
          life: 1,
          decay: Math.random() * 0.003 + 0.002
        });
      }
    }

    function draw(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces = pieces.filter(p => p.life > 0);
      pieces.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        p.angle += p.spin;
        p.life -= p.decay;
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      requestAnimationFrame(draw);
    }

    spawn(120);
    setInterval(() => spawn(8), 600);
    draw();
  })();

  /* ─── FLOATING EMOJIS ─── */
  (function(){
    const emojis = ['🎉','🎂','🥂','🎊','✨','🔥','💃','🕺','🎈','🪩','⭐','💥'];
    const container = document.getElementById('floaters');

    function addFloater(){
      const el = document.createElement('span');
      el.classList.add('floater');
      el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      el.style.left = Math.random()*100 + 'vw';
      const dur = Math.random()*8 + 10;
      el.style.animationDuration = dur + 's';
      el.style.animationDelay = Math.random()*3 + 's';
      container.appendChild(el);
      setTimeout(() => el.remove(), (dur+3)*1000);
    }

    for(let i = 0; i < 12; i++) setTimeout(addFloater, i*600);
    setInterval(addFloater, 1800);
  })();

  /* ─── SCROLL REVEAL ─── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* Also observe hosts-intro */
  document.querySelectorAll('.hosts-intro').forEach(el => observer.observe(el));

  /* ─── COUNTDOWN ─── */
  const eventDate = new Date('2026-04-04T21:00:00');

  function updateCountdown(){
    const now = new Date();
    const diff = eventDate - now;
    if(diff < 0){
      document.getElementById('cd-days').textContent = '0';
      document.getElementById('cd-hours').textContent = '0';
      document.getElementById('cd-mins').textContent = '0';
      document.getElementById('cd-secs').textContent = '0';
      return;
    }
    const d = Math.floor(diff/(1000*60*60*24));
    const h = Math.floor((diff/(1000*60*60))%24);
    const m = Math.floor((diff/(1000*60))%60);
    const s = Math.floor((diff/1000)%60);
    document.getElementById('cd-days').textContent = d;
    document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
    document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ─── LEAFLET MAP ─── */
  // Kružna 2a, Voždovac, Beograd
  const LAT = 44.74647222222223;
  const LNG = 20.50166666666667;

  const map = L.map('map', { zoomControl: true, scrollWheelZoom: false }).setView([LAT, LNG], 15);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    maxZoom: 19
  }).addTo(map);

  const markerIcon = L.divIcon({
    html: `<div style="
      width:40px;height:40px;
      background:linear-gradient(135deg,#f5c842,#ff9e2c);
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 0 16px rgba(245,200,66,0.7);
      border:2px solid rgba(255,255,255,0.3);
    ">
      <span style="transform:rotate(45deg);font-size:18px;">🎉</span>
    </div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  L.marker([LAT, LNG], { icon: markerIcon })
    .addTo(map)
    .bindPopup('<b style="font-family:Syne,sans-serif">🎂 Ovde je žurka!</b><br><small>Klikni za navigaciju</small>')
    .openPopup();