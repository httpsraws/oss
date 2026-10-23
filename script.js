// Troque "url" pelo link de incorporação (YouTube embed) ou arquivo .mp4.
const V=[
{n:"Arm drag (Drill)",c:"Drill",url:""},
{n:"Ippon Seoi Nage (Drill)",c:"Drill",url:""},
{n:"Uchi Mata",c:"Projeção",url:""},
{n:"Seoi Nage ajoelhando",c:"Projeção",url:""},
{n:"Arm Lock (drill)",c:"Drill",url:""},
{n:"Guada-aranha",c:"Guarda",url:""},
{n:"Guarda laço",c:"Guarda",url:""},
{n:"Triângulo da guarda laço (rolamento de ombro)",c:["Finalização","Guarda"],url:""}];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const categories=v=>Array.isArray(v.c)?v.c:[v.c];
let cat="Todas";
function render(){
 const cs=["Todas",...new Set(V.flatMap(categories))];
 $("#filters").innerHTML=cs.map(c=>`<button class="fc ${c===cat?"on":""}" data-c="${c}">${c}</button>`).join("");
 $("#grid").innerHTML=V.map((v,i)=>({v,i})).filter(o=>cat==="Todas"||categories(o.v).includes(cat)).map(({v,i})=>`<button class="vc" data-i="${i}"><div class="th"><span class="play"></span></div><div class="b"><h3>${v.n}</h3><div class="meta">${categories(v).map(c=>`<span>${c}</span>`).join("")}</div></div></button>`).join("");
}
$("#filters").addEventListener("click",e=>{const b=e.target.closest(".fc");if(b){cat=b.dataset.c;render()}});
$("#grid").addEventListener("click",e=>{
 const b=e.target.closest(".vc");if(!b)return;const v=V[b.dataset.i];
 $("#mt").textContent=v.n;$("#mm").innerHTML=categories(v).map(c=>`<span>${c}</span>`).join("");
 $("#mv").innerHTML=!v.url?"Vídeo em breve. Adicione o link no campo url desta posição.":/\.(mp4|webm)$/i.test(v.url)?`<video src="${v.url}" controls></video>`:`<iframe src="${v.url}" allowfullscreen title="${v.n}"></iframe>`;
 $("#modal").classList.add("on");$("#close").focus();
});
function closeM(){$("#modal").classList.remove("on");$("#mv").innerHTML=""}
$("#close").onclick=closeM;
$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")closeM()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeM()});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.1});
function observe(){$$(".page.on .rv").forEach(el=>{if(!el.classList.contains("in"))io.observe(el)})}
function normalizePage(p){
 try{p=decodeURIComponent(p)}catch{}
 p=p.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 return p==="posicoes"?"posicoes":p==="projeto"?"home":p;
}
function go(p){
 p=normalizePage(p);
 if(!$("#"+p))p="home";
 $$(".page").forEach(x=>x.classList.toggle("on",x.id===p));
 $$("header [data-p]").forEach(a=>a.classList.toggle("on",a.dataset.p===p));
 window.scrollTo({top:0,behavior:"auto"});observe();
}
document.addEventListener("click",e=>{const a=e.target.closest("[data-p]");if(a){e.preventDefault();const p=normalizePage(a.dataset.p);history.pushState(null,"","#"+p);go(p)}});
window.addEventListener("hashchange",()=>go(location.hash.slice(1)));
window.addEventListener("popstate",()=>go(location.hash.slice(1)||"home"));
// Formulário: confirmação local. Conecte a um serviço (ex.: Formspree) para receber os envios.
$("#form").addEventListener("submit",e=>{
 e.preventDefault();const f=e.target;
 if(!f.nome.value.trim()||!f.email.value.includes("@")||!f.pos.value.trim()){$("#err").textContent="Preencha nome, e-mail válido e o nome da posição.";return}
 f.style.display="none";$("#ok").classList.add("on");
});
render();go(location.hash.slice(1)||"home");
