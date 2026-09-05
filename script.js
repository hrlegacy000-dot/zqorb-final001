(() => {
  // Fallback mirrors projects.json so the page still works if opened
  // directly from disk (file://) instead of through a server, where
  // fetch() is blocked by the browser's local-file CORS policy.
  const FALLBACK_PROJECTS = [
    {"id":"detention","number":"01","title":"DETENTION","subtitle":"THE NEGATIVITY CURSE","category":"GAME / ACTIVE DEVELOPMENT","status":"IN DEVELOPMENT","description":"A psychological action-horror game set inside Astraeon High, where a supernatural curse turns negativity into a threat.","tags":["GAME","HORROR","UE5","STORY"],"folder":"projects/detention/","image":"projects/detention/images/hero.jpg"},
    {"id":"build-mode","number":"02","title":"BUILD MODE","subtitle":"AI × CODE × AUTOMATION × SAAS","category":"EDUCATION / COURSE","status":"BUILDING","description":"A practical learning system designed to move students from understanding technology to actually building with it.","tags":["AI","CODE","SAAS","AUTOMATION"],"folder":"projects/build-mode/","image":"projects/build-mode/images/hero.jpg"},
    {"id":"neuronix","number":"03","title":"NEURONIX","subtitle":"PERSONAL AI / TECHNOLOGY","category":"TECHNOLOGY / R&D","status":"EXPLORATION","description":"A personal AI concept focused on a compact, synchronized intelligence layer across phone and computer.","tags":["AI","SYSTEMS","R&D","PRODUCT"],"folder":"projects/neuronix/","image":"projects/neuronix/images/hero.jpg"}
  ];

  const grid = document.getElementById("projectGrid");
  const tabs = document.getElementById("workspaceTabs");
  const title = document.getElementById("workspaceTitle");
  const status = document.getElementById("workspaceStatus");
  const description = document.getElementById("workspaceDescription");
  const tagsEl = document.getElementById("workspaceTags");
  const media = document.getElementById("workspaceMedia");
  const openPage = document.getElementById("workspaceOpenPage");
  const docList = document.getElementById("docList");
  const imageList = document.getElementById("imageList");

  // Hand-built visual identity per project — one composition each, not
  // a shared gradient template. Kept as inline SVG so the site stays
  // dependency-free and fast.
  const ART = {
    detention: `
      <svg viewBox="0 0 400 540" preserveAspectRatio="xMidYMid slice" role="img" aria-label="">
        <defs>
          <linearGradient id="detSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#232226"/><stop offset="1" stop-color="#141315"/>
          </linearGradient>
        </defs>
        <rect width="400" height="540" fill="url(#detSky)"/>
        <g opacity=".8" fill="none" stroke="#57545E" stroke-width="1.1">
          <path d="M40 380 L40 260 L110 260 L110 210 L160 210 L160 150 L230 150 L230 240 L300 240 L300 200 L360 200 L360 380 Z"/>
          <path d="M75 300 L75 340 M95 300 L95 340 M180 190 L180 230 M200 190 L200 230 M255 270 L255 310 M320 240 L320 320"/>
        </g>
        <line x1="0" y1="380" x2="400" y2="380" stroke="#3A383D" stroke-width="1"/>
        <circle cx="182" cy="199" r="3.4" fill="#A6423C"><animate attributeName="opacity" values="0.25;1;0.25" dur="3.4s" repeatCount="indefinite"/></circle>
        <g opacity=".5" stroke="#3A383D" stroke-width="1">
          <line x1="0" y1="420" x2="400" y2="420"/><line x1="0" y1="460" x2="400" y2="460"/><line x1="0" y1="500" x2="400" y2="500"/>
        </g>
      </svg>`,
    "build-mode": `
      <svg viewBox="0 0 400 540" preserveAspectRatio="xMidYMid slice" role="img" aria-label="">
        <rect width="400" height="540" fill="#D9D2E8"/>
        <g fill="none" stroke="#6a5fa0" stroke-width="1.3" opacity=".85">
          <path d="M200 150 L280 195 L280 285 L200 330 L120 285 L120 195 Z"/>
          <path d="M200 150 L200 240 M120 195 L200 240 M280 195 L200 240 M120 285 L200 240 M280 285 L200 240 M200 240 L200 330"/>
        </g>
        <g fill="#6a5fa0">
          <circle cx="200" cy="150" r="3"/><circle cx="280" cy="195" r="3"/><circle cx="280" cy="285" r="3"/>
          <circle cx="200" cy="330" r="3"/><circle cx="120" cy="285" r="3"/><circle cx="120" cy="195" r="3"/><circle cx="200" cy="240" r="3.4"/>
        </g>
        <g opacity=".35" stroke="#6a5fa0" stroke-width="1">
          <line x1="40" y1="430" x2="360" y2="430"/><line x1="40" y1="460" x2="360" y2="460"/>
        </g>
      </svg>`,
    neuronix: `
      <svg viewBox="0 0 400 540" preserveAspectRatio="xMidYMid slice" role="img" aria-label="">
        <rect width="400" height="540" fill="#18171A"/>
        <g fill="none" stroke="#4A4750">
          <ellipse cx="200" cy="250" rx="150" ry="52" stroke-width="1" opacity=".55"/>
          <ellipse cx="200" cy="250" rx="150" ry="52" stroke-width="1" opacity=".4" transform="rotate(55 200 250)"/>
          <ellipse cx="200" cy="250" rx="150" ry="52" stroke-width="1" opacity=".4" transform="rotate(-55 200 250)"/>
        </g>
        <circle cx="200" cy="250" r="34" fill="#232226" stroke="#57545E" stroke-width="1"/>
        <circle cx="200" cy="250" r="5" fill="#C7BBFF"><animate attributeName="r" values="4;6;4" dur="2.6s" repeatCount="indefinite"/></circle>
        <circle cx="320" cy="200" r="3" fill="#C7BBFF" opacity=".8"/>
        <circle cx="95" cy="300" r="2.4" fill="#C7BBFF" opacity=".6"/>
      </svg>`
  };

  let projects = [];

  function renderProjects(){
    // Cards are real links to each project's own page — selecting one
    // navigates there directly, it does not open an in-page panel.
    grid.innerHTML = projects.map((p, i) => `
      <a class="project-card reveal ${p.id==='build-mode' ? 'lav pc-2' : (i===0?'pc-1':'pc-3')}" href="/projects/${p.id}/" style="--delay:${i*90}ms">
        <div class="project-visual">
  ${p.id === "detention"
    ? `<img class="detention-logo" src="/projects/detention/images/detention-logo.png" alt="DETENTION logo">
    : ART[p.id] || ""}
</div>
        <div class="project-overlay">
          <div class="project-index">${p.number} / ${p.category}</div>
          <div>
            <h3>${p.title}<span>${p.subtitle}</span></h3>
            <p>${p.description}</p>
            <div class="project-tags">${p.tags.map(t=>`<span>${t}</span>`).join("")}</div>
          </div>
        </div>
        <div class="project-arrow">↗</div>
      </a>
    `).join("");
    grid.querySelectorAll(".project-card").forEach(card => window.ZQORB.observe(card));
  }

  function renderTabs(){
    tabs.innerHTML = projects.map((p,i) => `<button class="ws-tab${i===0?' active':''}" data-id="${p.id}">${p.number} ${p.title}</button>`).join("");
    tabs.querySelectorAll(".ws-tab").forEach(btn=>{
      btn.addEventListener("click", () => {
        tabs.querySelectorAll(".ws-tab").forEach(b=>b.classList.toggle("active", b===btn));
        showProject(btn.dataset.id);
      });
    });
  }

  function showProject(id){
    const p = projects.find(x=>x.id===id);
    if(!p) return;
    title.innerHTML = `${p.title}<span>${p.subtitle}</span>`;
    status.textContent = `${p.status} · ${p.category}`;
    description.textContent = p.description;
    tagsEl.innerHTML = p.tags.map(t=>`<span>${t}</span>`).join("");
    openPage.href = `/projects/${p.id}/#workspace`;
    media.innerHTML = `<div class="media-placeholder"><span>PROJECT MEDIA</span><small>Add hero.jpg to ${p.folder}images/</small></div>`;
    const img = new Image();
    img.onload = () => { media.innerHTML = ""; img.alt = `${p.title} project`; media.appendChild(img); };
    img.src = p.image;
    docList.innerHTML = `<span class="empty">Preview only — permanent files belong in ${p.folder}documents/</span>`;
    imageList.innerHTML = `<span class="empty">Preview only — permanent images belong in ${p.folder}images/</span>`;
  }

  async function loadProjects(){
    try{
      const res = await fetch("/projects.json", {cache:"no-store"});
      if(!res.ok) throw new Error("bad response");
      projects = await res.json();
    }catch(err){
      // file:// or offline preview — fall back to the same data inline.
      projects = FALLBACK_PROJECTS;
    }
    renderProjects();
    renderTabs();
    if(projects.length) showProject(projects[0].id);
    window.ZQORB.initWorkspaceUploads();
  }

  loadProjects();
})();
