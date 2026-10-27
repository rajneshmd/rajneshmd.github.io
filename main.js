(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* Year + header state */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  var top = document.querySelector('.top');
  addEventListener('scroll', function () { top.classList.toggle('is-scrolled', scrollY > 8); }, { passive: true });

  /* Journey stations */
  var stations = [
    { id: 'iba', cc: 'PK', line: 'study', x: 110, y: 120, name: 'IBA Karachi', sub: 'BBA · 2015 to 2019', above: true,
      title: 'Institute of Business Administration, Karachi', meta: 'Bachelor of Business Administration · Aug 2015 to Dec 2019',
      text: 'Where the study line starts. Finance, operations management and economics: the business grounding that later made data work make sense to stakeholders.' },
    { id: 'ugrad', cc: 'US', line: 'study', x: 300, y: 52, star: true, name: 'Delta State University', sub: 'Global UGRAD · 2018', above: true,
      title: 'Global UGRAD exchange, Delta State University', meta: 'U.S. Department of State scholarship (IREX) · Aug to Dec 2018',
      text: 'A branch line across the Atlantic. Cultural Ambassador for Pakistan, forums in Washington D.C. and Salt Lake City, 100+ hours of community service, and 13+ US states explored.' },
    { id: 'hbl', cc: 'PK', line: 'work', x: 420, y: 260, name: 'HBL, Karachi', sub: 'Banking · 2019 to 2021',
      title: 'Habib Bank Limited, Karachi', meta: 'Process Manager · Jun 2019 to Oct 2021',
      text: 'First interchange: graduation to the work line. Cut regulatory sign-offs from 9 to 4 and made the Top 100 Depositors exercise 67% faster.' },
    { id: 'daraz', cc: 'PK', line: 'work', x: 590, y: 260, name: 'Alibaba, Karachi', sub: 'E-commerce · 2021 to 2022',
      title: 'Daraz, Alibaba Group, Karachi', meta: 'Regional Project Manager · Nov 2021 to Nov 2022',
      text: 'Launched Operations-as-a-Service fulfilment for third-party merchants and introduced a pricing model that brought in USD 120,000 in six months.' },
    { id: 'ovgu', cc: 'DE', line: 'study', x: 760, y: 120, name: 'OVGU Magdeburg', sub: 'MSc · 2022 to 2024', above: true,
      title: 'Otto-von-Guericke-University Magdeburg', meta: 'MSc Operations Research and Business Analytics · Oct 2022 to Sep 2024',
      text: 'Second interchange: studying and working in parallel. Thesis on simultaneous pick-up and delivery routing for e-grocery, plus Deutsche Bahn crew rostering.' },
    { id: 'allianz', cc: 'DE', line: 'work', x: 760, y: 260, name: 'Allianz, Munich', sub: 'Insurance IT · 2023 to 2024',
      title: 'Allianz, Munich', meta: 'IT Project Manager, Working Student · Mar 2023 to Nov 2024',
      text: 'Alongside the MSc: a global rollout for 150,000+ users in 70+ countries, with UAT analysis automated through SharePoint and Power Automate.' },
    { id: 'rosenxt', cc: 'DE', line: 'work', x: 980, y: 260, now: true, name: 'Rosenxt, Lingen', sub: 'Deep-tech · 2024 to now',
      title: 'Rosenxt Group, Lingen', meta: 'Data Manager, Strategy, AI & Engineering · Dec 2024 to present',
      text: 'Both lines meet here. Running enterprise data in Databricks, leading the Perplexity AI rollout and building RAG-based chatbots.' }
  ];
  var nimbusStory = {
    lineLabel: 'Easter egg · Flying Nimbus',
    title: 'You found the Flying Nimbus',
    meta: 'Data, my ride since 2019',
    text: 'In Dragon Ball, the Nimbus carries Goku anywhere he needs to go. In my career, data has done the same: from bank processes to e-commerce warehouses to AI platforms.'
  };

  var g = document.getElementById('stations');
  var card = document.getElementById('station-card');
  var map = document.getElementById('map');
  if (!g || !card || !map) return;

  function el(name, attrs, text) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = text;
    return n;
  }
  function star(cx, cy, r) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
      pts.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1));
    }
    return pts.join(' ');
  }

  var pills = [];
  stations.forEach(function (s, i) {
    var grp = el('g', { 'class': 'st st--' + s.line + (s.now ? ' st--now' : ''), tabindex: '0', role: 'button',
      'aria-label': s.name + ', ' + s.sub, 'data-id': s.id, style: '--i:' + i });
    grp.appendChild(el('circle', { 'class': 'st__hit', cx: s.x, cy: s.y, r: 24 }));
    if (s.now) grp.appendChild(el('circle', { 'class': 'st__pulse', cx: s.x, cy: s.y, r: 11 }));
    if (s.star) grp.appendChild(el('polygon', { 'class': 'st__star', points: star(s.x, s.y, 13) }));
    else grp.appendChild(el('circle', { 'class': 'st__dot', cx: s.x, cy: s.y, r: s.now ? 10 : 8 }));
    var ny = s.above ? s.y - (s.star ? 34 : 36) : s.y + 40;
    var anchor = s.x < 140 ? 'start' : (s.x > 960 ? 'end' : 'middle');
    var lx = anchor === 'start' ? s.x - 10 : (anchor === 'end' ? s.x + 12 : s.x);
    var nameEl = el('text', { 'class': 'st__name', x: lx, y: ny, 'text-anchor': anchor }, s.name);
    grp.appendChild(nameEl);
    if (s.cc) {
      var pill = el('g', { 'class': 'st__cc' });
      pill.appendChild(el('rect', { y: ny - 11.5, width: 24, height: 15, rx: 7.5 }));
      pill.appendChild(el('text', { y: ny - 0.5, 'text-anchor': 'middle' }, s.cc));
      grp.appendChild(pill);
      pills.push({ name: nameEl, pill: pill, lx: lx, anchor: anchor });
    }
    grp.appendChild(el('text', { 'class': 'st__sub', x: lx, y: ny + 17, 'text-anchor': anchor }, s.sub));
    g.appendChild(grp);
  });

  /* Country pills sit right after each station name; the pair stays centred */
  function layoutPills() {
    var W = 24, GAP = 6;
    pills.forEach(function (p) {
      var shift = p.anchor === 'middle' ? (W + GAP) / 2 : (p.anchor === 'end' ? W + GAP : 0);
      p.name.setAttribute('x', p.lx - shift);
      var b = p.name.getBBox();
      var px = b.x + b.width + GAP;
      p.pill.querySelector('rect').setAttribute('x', px);
      p.pill.querySelector('text').setAttribute('x', px + W / 2);
    });
  }
  layoutPills();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutPills);

  function show(data, lineLabel) {
    card.classList.remove('is-in');
    void card.offsetWidth;
    card.querySelector('.station-card__line').textContent = lineLabel;
    card.querySelector('.station-card__title').textContent = data.title;
    card.querySelector('.station-card__meta').textContent = data.meta;
    card.querySelector('.station-card__text').textContent = data.text;
    card.classList.toggle('is-nimbus', lineLabel === nimbusStory.lineLabel);
    card.classList.add('is-in');
  }
  function select(id) {
    var s = stations.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    g.querySelectorAll('.st').forEach(function (n) { n.classList.toggle('is-selected', n.getAttribute('data-id') === id); });
    show(s, (s.line === 'study' ? 'Study line' : 'Work line') + (s.now ? ' · Current' : ''));
  }
  g.addEventListener('click', function (e) {
    var t = e.target.closest('.st'); if (t) select(t.getAttribute('data-id'));
  });
  g.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = e.target.closest('.st'); if (t) { e.preventDefault(); select(t.getAttribute('data-id')); }
  });
  g.querySelector('[data-id="rosenxt"]').classList.add('is-selected');

  /* Filters */
  document.querySelectorAll('.chip-btn[data-filter]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      map.setAttribute('data-filter', f);
      document.querySelectorAll('.chip-btn[data-filter]').forEach(function (o) {
        var on = o === b; o.classList.toggle('is-active', on); o.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
  });

  /* Nimbus */
  var nimbus = document.getElementById('nimbus');
  var svg = map.querySelector('svg');
  function nimbusHit() {
    g.querySelectorAll('.st').forEach(function (n) { n.classList.remove('is-selected'); });
    show(nimbusStory, nimbusStory.lineLabel);
  }
  if (nimbus) {
    nimbus.addEventListener('click', nimbusHit);
    nimbus.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nimbusHit(); } });
    nimbus.addEventListener('mouseenter', function () { svg.pauseAnimations && svg.pauseAnimations(); });
    nimbus.addEventListener('mouseleave', function () { if (!reduce && svg.unpauseAnimations) svg.unpauseAnimations(); });
    nimbus.addEventListener('focus', function () { svg.pauseAnimations && svg.pauseAnimations(); });
    nimbus.addEventListener('blur', function () { if (!reduce && svg.unpauseAnimations) svg.unpauseAnimations(); });
  }
  if (reduce && svg.pauseAnimations) { svg.pauseAnimations(); svg.setCurrentTime && svg.setCurrentTime(9); }

  /* Reveal: draw lines and count up numbers once visible */
  if ('IntersectionObserver' in window && !reduce) {
    map.classList.add('is-pre');
    var mo = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { map.classList.remove('is-pre'); map.classList.add('is-drawn'); mo.disconnect(); } });
    }, { threshold: 0.3 });
    mo.observe(map);

    var nums = document.querySelectorAll('[data-count]');
    nums.forEach(function (n) { n.textContent = '0'; });
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var n = en.target, end = +n.getAttribute('data-count'), t0 = performance.now(), d = 1200;
        (function step(t) {
          var p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - p, 3);
          n.textContent = Math.round(end * e);
          if (p < 1) requestAnimationFrame(step);
        })(t0);
        co.unobserve(n);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { co.observe(n); });
  }
})();
