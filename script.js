(() => {
  const dataEl = document.getElementById("projectData");
  const projects = JSON.parse(dataEl.textContent || "[]");
  const grid = document.getElementById("projectGrid");
  const workspace = document.getElementById("workspace");
  const title = document.getElementById("workspaceTitle");
  const status = document.getElementById("workspaceStatus");
  const description = document.getElementById("workspaceDescription");
  const tags = document.getElementById("workspaceTags");
  const media = document.getElementById("workspaceMedia");
  const folder = document.getElementById("workspaceFolder");
  const docList = document.getElementById("docList");
  const imageList = document.getElementById("imageList");

  document.getElementById("year").textContent = new Date().getFullYear();

  function renderProjects(){
    grid.innerHTML = projects.map((p, i) => `
      <article class="project-card reveal" data-id="${p.id}" style="--delay:${i*80}ms">
        <div class="project-visual" data-image="${p.image}">
          <div class="project-visual-label">${String(p.number).padStart(2,"0")}</div>
        </div>
        <div class="project-overlay">
          <div class="project-index">${p.number} / ${p.category}</div>
          <div>
            <h3>${p.title}<br><span>${p.subtitle}</span></h3>
            <p>${p.description}</p>
            <div class="project-tags">${p.tags.map(t=>`<span>${t}</span>`).join("")}</div>
          </div>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll(".project-card").forEach(card => {
      card.addEventListener("click", () => openProject(card.dataset.id));
    });

    // Use a real hero image automatically if the file exists in the deployed project.
    grid.querySelectorAll(".project-visual").forEach(v => {
      const src = v.dataset.image;
      const img = new Image();
      img.onload = () => {
        v.style.background = "none";
        v.innerHTML = "";
        img.alt = "";
        v.appendChild(img);
        img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
      };
      img.src = src;
    });
  }

  function openProject(id){
    const p = projects.find(x=>x.id===id);
    if(!p) return;
    title.innerHTML = `${p.title}<br><span style="color:var(--violet)">${p.subtitle}</span>`;
    status.textContent = `${p.status} · ${p.category}`;
    description.textContent = p.description;
    tags.innerHTML = p.tags.map(t=>`<span>${t}</span>`).join("");
    folder.href = p.folder;
    media.innerHTML = "";
    const img = new Image();
    img.onload = () => { img.alt = `${p.title} project`; media.appendChild(img); };
    img.onerror = () => {
      media.innerHTML = `<div class="media-placeholder"><span>PROJECT MEDIA</span><small>Add <b>hero.jpg</b> to ${p.folder}images/</small></div>`;
    };
    img.src = p.image;
    workspace.classList.add("open");
    workspace.scrollIntoView({behavior:"smooth",block:"start"});
    currentProject = p;
    docList.innerHTML = `<span class="empty">Local preview area — permanent files belong in ${p.folder}documents/</span>`;
    imageList.innerHTML = `<span class="empty">Local preview area — permanent images belong in ${p.folder}images/</span>`;
  }

  let currentProject = null;

  document.getElementById("closeWorkspace").addEventListener("click",()=>{
    workspace.classList.remove("open");
  });

  document.querySelectorAll(".file-input").forEach(input=>{
    input.addEventListener("change",()=>{
      const files = [...input.files];
      const target = input.dataset.kind === "docs" ? docList : imageList;
      if(!files.length) return;
      target.innerHTML = "";
      files.forEach(file=>{
        if(input.dataset.kind === "images" && file.type.startsWith("image/")){
          const url = URL.createObjectURL(file);
          const img = document.createElement("img");
          img.src=url; img.className="image-thumb"; img.alt=file.name;
          const row=document.createElement("div"); row.className="file-item";
          row.append(img, document.createTextNode(file.name));
          target.appendChild(row);
        }else{
          const row=document.createElement("div"); row.className="file-item";
          row.textContent=file.name;
          target.appendChild(row);
        }
      });
    });
  });

  renderProjects();

  const nav = document.getElementById("nav");
  window.addEventListener("scroll",()=>nav.classList.toggle("scrolled",window.scrollY>40),{passive:true});

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("visible"); });
  },{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

  const menu = document.getElementById("menu");
  const mobile = document.getElementById("mobileMenu");
  menu.addEventListener("click",()=>mobile.classList.toggle("open"));
  mobile.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>mobile.classList.remove("open")));

  // Subtle pointer interaction — disabled on touch devices.
  if (matchMedia("(pointer:fine)").matches){
    const dot=document.querySelector(".cursor-dot");
    window.addEventListener("pointermove",e=>{
      dot.style.left=e.clientX+"px"; dot.style.top=e.clientY+"px";
    });
    document.querySelectorAll(".magnetic").forEach(el=>{
      el.addEventListener("pointermove",e=>{
        const r=el.getBoundingClientRect(), x=(e.clientX-r.left-r.width/2)*.12, y=(e.clientY-r.top-r.height/2)*.12;
        el.style.transform=`translate(${x}px,${y}px)`;
      });
      el.addEventListener("pointerleave",()=>el.style.transform="");
    });
  }
})();