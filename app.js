(() => {
  "use strict";
  const source = window.UCRANGELANDS_DATA;
  const directory = new Map(source.directory.map(item => [item.county, item]));
  const select = document.getElementById("county-select");
  const clearBtn = document.getElementById("clear-selection");
  const group = document.getElementById("county-polygons");
  let underlay = document.getElementById("county-seam-underlay");
  // Backward-compatible: older index.html files do not contain the seam group.
  // Create it automatically so replacing only app.js/styles.css cannot break the map.
  if (!underlay && group && group.parentNode) {
    underlay = document.createElementNS("http://www.w3.org/2000/svg", "g");
    underlay.setAttribute("id", "county-seam-underlay");
    underlay.setAttribute("aria-hidden", "true");
    group.parentNode.insertBefore(underlay, group);
  }
  const details = document.getElementById("county-details");
  const status = document.getElementById("map-status");
  const tooltip = document.getElementById("tooltip");
  const mapWrap = document.getElementById("map-wrap");
  let selectedCounty = "";
  const polygonByCounty = new Map();

  [...directory.keys()].sort((a,b)=>a.localeCompare(b)).forEach(county => {
    const option=document.createElement("option"); option.value=county; option.textContent=`${county} County`; select.appendChild(option);
  });

  source.polygons.forEach(item => {
    // A slightly wider, non-interactive copy sits beneath the clickable county.
    // It closes tiny sub-pixel/legacy-coordinate cracks while the foreground
    // polygon keeps a crisp single county boundary.
    const seam=document.createElementNS("http://www.w3.org/2000/svg","polygon");
    seam.setAttribute("points",item.points);
    seam.setAttribute("class","county-seam");
    if (underlay) underlay.appendChild(seam);

    const p=document.createElementNS("http://www.w3.org/2000/svg","polygon");
    p.setAttribute("points",item.points); p.setAttribute("class","county"); p.setAttribute("tabindex","0"); p.setAttribute("role","button"); p.setAttribute("aria-label",`${item.county} County`); p.setAttribute("aria-pressed","false");
    p.addEventListener("mouseenter",e=>showHover(item.county,e)); p.addEventListener("mousemove",positionTooltip); p.addEventListener("mouseleave",hideHover);
    p.addEventListener("focus",()=>showKeyboardHover(item.county,p)); p.addEventListener("blur",hideHover); p.addEventListener("click",()=>chooseCounty(item.county,true));
    p.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();chooseCounty(item.county,true);}});
    group.appendChild(p); polygonByCounty.set(item.county,p);
  });

  select.addEventListener("change",()=>select.value?chooseCounty(select.value,true):clearSelection());
  clearBtn.addEventListener("click",clearSelection);

  function chooseCounty(county,moveFocus=false){
    if(!directory.has(county))return; selectedCounty=county; select.value=county; clearBtn.disabled=false; status.textContent=`${county} County selected`;
    polygonByCounty.forEach((p,name)=>{p.classList.toggle("is-selected",name===county);p.setAttribute("aria-pressed",name===county?"true":"false");});
    renderDetails(directory.get(county)); hideTooltip();
    if(moveFocus&&window.matchMedia("(max-width: 760px)").matches)details.scrollIntoView({behavior:"smooth",block:"start"});
  }
  function clearSelection(){selectedCounty="";select.value="";clearBtn.disabled=true;status.textContent="Select a county";polygonByCounty.forEach(p=>{p.classList.remove("is-selected");p.setAttribute("aria-pressed","false");});details.innerHTML='<div class="empty-state"><p class="eyebrow">County directory</p><h2>Select a county</h2><p>Advisor and county office information also found at ucanr.edu</p></div>';hideTooltip();}
  function renderDetails(item){
    const advisors=[]; if(item.advisor)advisors.push({name:item.advisor,url:item.advisorUrl}); if(item.advisor2)advisors.push({name:item.advisor2,url:item.advisor2Url});
    const advisorHtml=advisors.length?`<div class="advisor-list">${advisors.map((a,i)=>`<div class="advisor"><h3>${escapeHtml(a.name)}</h3><p>${advisors.length>1?`Advisor ${i+1}`:"local UCCE advisor"}</p>${a.url?`<a class="action-link" href="${escapeAttr(toHttps(a.url))}" target="_blank" rel="noopener noreferrer">View advisor profile <span aria-hidden="true">↗</span></a>`:""}</div>`).join("")}</div>`:'<div class="no-advisor"><strong>No advisor is listed for this county in the supplied workbook.</strong></div>';
    const links=[]; if(item.countyPage)links.push(`<a class="action-link" href="${escapeAttr(toHttps(item.countyPage))}" target="_blank" rel="noopener noreferrer">County UC Cooperative Extension page <span aria-hidden="true">↗</span></a>`);
    details.innerHTML=`<p class="eyebrow">County directory</p><h2 class="county-title">${escapeHtml(item.county)} County</h2><p class="county-subtitle">local UCCE contact information</p>${advisorHtml}${links.length?`<div class="link-list">${links.join("")}</div>`:""}`;
  }
  function showHover(county,e){status.textContent=`${county} County — click to select`;const p=polygonByCounty.get(county);if(p&&county!==selectedCounty)p.classList.add("is-hovered");tooltip.textContent=`${county} County`;tooltip.hidden=false;positionTooltip(e);}
  function showKeyboardHover(county,p){status.textContent=`${county} County — press Enter to select`;if(county!==selectedCounty)p.classList.add("is-hovered");tooltip.textContent=`${county} County`;const mr=mapWrap.getBoundingClientRect(),r=p.getBoundingClientRect();tooltip.style.left=`${r.left-mr.left+r.width/2}px`;tooltip.style.top=`${r.top-mr.top+r.height/2}px`;tooltip.hidden=false;}
  function hideHover(e){const t=e?.currentTarget;if(t)t.classList.remove("is-hovered");status.textContent=selectedCounty?`${selectedCounty} County selected`:"Select a county";hideTooltip();}
  function positionTooltip(e){if(tooltip.hidden||!e||typeof e.clientX!=="number")return;const r=mapWrap.getBoundingClientRect();tooltip.style.left=`${e.clientX-r.left}px`;tooltip.style.top=`${e.clientY-r.top}px`;}
  function hideTooltip(){tooltip.hidden=true;} function toHttps(url){return url?url.replace(/^http:\/\//i,"https://"):"";}
  function escapeHtml(v){return String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]);} function escapeAttr(v){return escapeHtml(v);}
})();
