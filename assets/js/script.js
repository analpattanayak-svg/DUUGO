/* DUUGO – demo frontend. All data below is SAMPLE data; nothing is sent to any server. */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

/* ---------- Sample data ---------- */
const DOCTORS=[
{id:1,name:"Dr. Ananya Sen",spec:"Cardiologist",city:"Kolkata",fee:800,exp:14,rating:4.8,hospital:"Salt Lake Heart Care",lang:"English, Bengali, Hindi",about:"Focuses on preventive cardiology, hypertension and heart-failure management."},
{id:2,name:"Dr. Rohit Mehra",spec:"Dermatologist",city:"Delhi",fee:600,exp:9,rating:4.6,hospital:"Skin & Glow Clinic",lang:"English, Hindi",about:"Treats acne, eczema, hair and nail disorders with evidence-based care."},
{id:3,name:"Dr. Priya Nair",spec:"Pediatrician",city:"Bengaluru",fee:500,exp:11,rating:4.9,hospital:"Little Steps Children's Hospital",lang:"English, Kannada, Malayalam",about:"Child health, vaccinations, growth and nutrition guidance for newborns to teens."},
{id:4,name:"Dr. Sourav Ghosh",spec:"Orthopedic",city:"Kolkata",fee:900,exp:16,rating:4.7,hospital:"BoneCare Institute",lang:"English, Bengali",about:"Joint pain, sports injuries and fracture care with a rehabilitation-first approach."},
{id:5,name:"Dr. Meera Iyer",spec:"Neurologist",city:"Mumbai",fee:1200,exp:18,rating:4.8,hospital:"NeuroLife Centre",lang:"English, Hindi, Tamil",about:"Migraine, epilepsy and stroke recovery specialist."},
{id:6,name:"Dr. Farah Khan",spec:"Gynecologist",city:"Siliguri",fee:700,exp:12,rating:4.7,hospital:"Himalaya Women's Clinic",lang:"English, Hindi, Nepali",about:"Pregnancy care, PCOS and women's wellness consultations."},
{id:7,name:"Dr. Amit Banerjee",spec:"General Physician",city:"Kolkata",fee:400,exp:8,rating:4.5,hospital:"CityCare Polyclinic",lang:"English, Bengali, Hindi",about:"Fever, infections, diabetes and routine health check-ups."},
{id:8,name:"Dr. Kavita Rao",spec:"ENT Specialist",city:"Mumbai",fee:650,exp:10,rating:4.6,hospital:"ClearSound ENT Centre",lang:"English, Hindi, Marathi",about:"Ear, nose and throat conditions, sinus and hearing evaluation."}];
const SPECS=[["Cardiologist","heart-pulse"],["Dermatologist","droplet-half"],["Pediatrician","emoji-smile"],["Orthopedic","bandaid"],["Neurologist","activity"],["Gynecologist","gender-female"],["General Physician","clipboard2-pulse"],["ENT Specialist","ear"]];
const AMB=[
{k:"Basic Life Support",i:"truck-front",d:"Non-critical transfers with trained attendant and oxygen.",p:"from ₹1,200"},
{k:"Advanced Life Support",i:"heart-pulse",d:"Cardiac monitor, defibrillator and paramedic on board.",p:"from ₹2,500"},
{k:"ICU Ambulance",i:"hospital",d:"Ventilator-equipped mobile ICU for critical patients.",p:"from ₹4,500"},
{k:"Patient Transport Ambulance",i:"person-wheelchair",d:"Comfortable scheduled transport for stable patients.",p:"from ₹900"}];
const DRIVER={name:"Ramesh Kumar (sample)",vehicle:"WB 02 XX 0000 (sample)",phone:"+91 90000 00000 (sample)",eta:"8 minutes (sample)"};
const SLOTS=["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","02:00 PM","02:30 PM","03:00 PM","04:00 PM","04:30 PM","05:00 PM"];
const FAQS=[["Is DUUGO a real booking service?","No. This is a frontend demo. Bookings are stored only in your browser and no real appointment or ambulance is arranged."],["What should I do in a real emergency?","Call 112 (India's emergency number) immediately. Do not rely on this website."],["Where is my data saved?","In your browser's localStorage on this device. Clear it any time from the dashboard settings."],["Are payments supported?","No. Consultation fees are shown for display only; there is no payment integration."]];

/* ---------- Helpers ---------- */
const store={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const bookings=()=>store.get("duugo_bookings",[]);
const addBooking=b=>store.set("duugo_bookings",[b,...bookings()]);
const refNo=p=>`DEMO-${p}-${Math.floor(1000+Math.random()*9000)}`;
const initials=n=>n.replace("Dr. ","").split(" ").map(w=>w[0]).join("").slice(0,2);
const getDoc=id=>DOCTORS.find(d=>d.id==id);
const user=()=>store.get("duugo_user",{name:"Demo User",email:"demo@example.com",mobile:"9876543210",city:"Kolkata"});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function toast(msg,type="success"){let c=$("#toasts");if(!c){c=document.createElement("div");c.id="toasts";c.className="toast-container position-fixed bottom-0 end-0 p-3";document.body.append(c)}
const t=document.createElement("div");t.className=`toast align-items-center text-bg-${type} border-0`;
t.innerHTML=`<div class="d-flex"><div class="toast-body">${msg}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
c.append(t);new bootstrap.Toast(t,{delay:3500}).show();t.addEventListener("hidden.bs.toast",()=>t.remove())}

function confirmModal(title,body,onOk){const m=document.createElement("div");m.className="modal fade";
m.innerHTML=`<div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">${title}</h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body">${body}</div><div class="modal-footer"><button class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-duugo" id="mok">Confirm</button></div></div></div>`;
document.body.append(m);const bm=new bootstrap.Modal(m);bm.show();$("#mok",m).onclick=()=>{bm.hide();onOk()};m.addEventListener("hidden.bs.modal",()=>m.remove())}

/* Form validation: inputs carry data-rule="required mobile email pass match" */
const RULES={required:v=>v.trim()!=="",mobile:v=>/^[6-9]\d{9}$/.test(v),email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),pass:v=>v.length>=6,match:(v,el,f)=>v===$(el.dataset.match,f).value};
function validateForm(f){let ok=true;$$("[data-rule]",f).forEach(el=>{const good=el.dataset.rule.split(" ").every(r=>RULES[r](el.value,el,f));el.classList.toggle("is-invalid",!good);if(!good)ok=false});
if(!ok)toast("Please fix the highlighted fields.","danger");return ok}

/* ---------- Shared layout (navbar + footer) ---------- */
function layout(){
const cur=location.pathname.split("/").pop()||"index.html",logged=sessionStorage.getItem("duugo_session");
const links=[["index.html","Home"],["doctors.html","Find Doctors"],["ambulance.html","Ambulance"],["about.html","About Us"],["contact.html","Contact"]];
$("#site-nav").innerHTML=`<nav class="navbar navbar-expand-lg fixed-top"><div class="container">
<a class="navbar-brand brand" href="index.html"><i class="bi bi-heart-pulse-fill"></i> DUUGO</a>
<button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav"><i class="bi bi-list fs-2"></i></button>
<div class="collapse navbar-collapse" id="nav"><ul class="navbar-nav mx-auto">${links.map(([h,t])=>`<li class="nav-item"><a class="nav-link ${cur===h?"active":""}" href="${h}">${t}</a></li>`).join("")}</ul>
<div class="d-flex gap-2">${logged?`<a class="btn btn-outline-duugo" href="dashboard.html">Dashboard</a><button class="btn btn-duugo" id="logout">Logout</button>`:`<a class="btn btn-outline-duugo" href="login.html">Login</a><a class="btn btn-duugo" href="register.html">Register</a>`}</div></div></div></nav>`;
$("#site-footer").innerHTML=`<footer><div class="container"><div class="row g-4"><div class="col-lg-4"><div class="brand fs-4 text-white"><i class="bi bi-heart-pulse-fill"></i> DUUGO</div><p class="mt-2">Healthcare, Just a Tap Away.</p><span class="demo-badge">DEMO PROJECT – NOT A REAL SERVICE</span></div>
<div class="col-6 col-lg-2"><h6 class="text-white">Explore</h6>${links.map(([h,t])=>`<div><a href="${h}">${t}</a></div>`).join("")}</div>
<div class="col-6 col-lg-3"><h6 class="text-white">Account</h6><div><a href="login.html">Login</a></div><div><a href="register.html">Register</a></div><div><a href="dashboard.html">Dashboard</a></div></div>
<div class="col-lg-3"><h6 class="text-white">Emergency</h6><p>In an emergency, call <strong class="text-white">112</strong> right away.</p></div></div>
<hr><p class="small mb-0">© 2026 DUUGO. Frontend demo built with HTML, CSS, JavaScript and Bootstrap 5. No real bookings are made.</p></div></footer>`;
$("#logout")?.addEventListener("click",()=>{sessionStorage.removeItem("duugo_session");toast("Logged out (demo).");setTimeout(()=>location.href="index.html",700)});
if(store.get("duugo_prefs",{}).dark)document.body.classList.add("dark");
}

/* ---------- Doctor card ---------- */
const card=(d,col="col-md-6 col-xl-3")=>`<div class="${col}"><div class="card lift h-100"><div class="card-body text-center"><div class="avatar">${initials(d.name)}</div><h5 class="mb-0">${d.name}</h5><div class="text-teal fw-semibold small">${d.spec}</div>
<div class="small text-muted my-2"><i class="bi bi-geo-alt"></i> ${d.city} | ${d.exp} yrs | <i class="bi bi-star-fill text-warning"></i> ${d.rating}</div><div class="fee">₹${d.fee} <small>consultation fee</small></div></div>
<div class="card-footer bg-transparent border-0 d-flex gap-2 pb-3"><a href="doctor-details.html?id=${d.id}" class="btn btn-outline-duugo btn-sm flex-fill">View profile</a><a href="appointment.html?id=${d.id}" class="btn btn-duugo btn-sm flex-fill">Book now</a></div></div></div>`;

/* ---------- Page: Home ---------- */
function initHome(){
$("#featured").innerHTML=DOCTORS.slice(0,4).map(d=>card(d)).join("");
$("#specs").innerHTML=SPECS.map(([s,i])=>`<div class="col-6 col-md-3"><a href="doctors.html?spec=${encodeURIComponent(s)}" class="card lift text-center text-decoration-none h-100"><div class="card-body"><div class="icon-box mx-auto"><i class="bi bi-${i}"></i></div><h6 class="mb-0" style="color:var(--navy)">${s}</h6></div></a></div>`).join("");
$("#faq").innerHTML=FAQS.map(([q,a])=>`<div class="faq-item"><button class="faq-q">${q}<i class="bi bi-chevron-down"></i></button><div class="faq-a">${a}</div></div>`).join("");
$$(".faq-q").forEach(b=>b.onclick=()=>{const it=b.parentElement,o=it.classList.contains("open");$$(".faq-item").forEach(x=>x.classList.remove("open"));if(!o)it.classList.add("open")});
}

/* ---------- Page: Find Doctors ---------- */
function initDoctors(){
const p=new URLSearchParams(location.search),q=$("#q"),c=$("#city"),s=$("#spec");
q.value=p.get("q")||"";c.value=p.get("city")||"";
$("#cities").innerHTML=[...new Set(DOCTORS.map(d=>d.city))].map(x=>`<option value="${x}">`).join("");
s.innerHTML='<option value="">All specializations</option>'+SPECS.map(([x])=>`<option>${x}</option>`).join("");s.value=p.get("spec")||"";
const render=()=>{const t=q.value.toLowerCase(),l=c.value.toLowerCase();
const r=DOCTORS.filter(d=>(!t||d.name.toLowerCase().includes(t)||d.spec.toLowerCase().includes(t))&&(!l||d.city.toLowerCase().includes(l))&&(!s.value||d.spec===s.value));
$("#count").textContent=`${r.length} doctor(s) found`;
$("#list").innerHTML=r.length?r.map(d=>card(d,"col-md-6 col-lg-4")).join(""):'<div class="col-12 text-center text-muted py-5"><i class="bi bi-search fs-1"></i><p>No doctors match. Try clearing a filter.</p></div>'};
[q,c,s].forEach(e=>e.addEventListener("input",render));
$("#reset").onclick=()=>{q.value=c.value=s.value="";render()};render();
}

/* ---------- Page: Doctor details ---------- */
function initDetails(){
const d=getDoc(new URLSearchParams(location.search).get("id"))||DOCTORS[0];document.title=`${d.name} | DUUGO`;
$("#profile").innerHTML=`<div class="row g-4"><div class="col-lg-4"><div class="card text-center p-4"><div class="avatar lg">${initials(d.name)}</div><h4>${d.name}</h4><div class="text-teal fw-semibold">${d.spec}</div>
<div class="fee my-2">₹${d.fee} <small>consultation fee</small></div><a href="appointment.html?id=${d.id}" class="btn btn-duugo w-100">Book appointment</a></div></div>
<div class="col-lg-8"><div class="card p-4"><h5>About</h5><p>${d.about}</p><div class="row g-3 small">
<div class="col-sm-6"><i class="bi bi-hospital text-teal"></i> <strong>Hospital:</strong> ${d.hospital}</div><div class="col-sm-6"><i class="bi bi-geo-alt text-teal"></i> <strong>City:</strong> ${d.city}</div>
<div class="col-sm-6"><i class="bi bi-award text-teal"></i> <strong>Experience:</strong> ${d.exp} years</div><div class="col-sm-6"><i class="bi bi-translate text-teal"></i> <strong>Languages:</strong> ${d.lang}</div>
<div class="col-sm-6"><i class="bi bi-star-fill text-warning"></i> <strong>Rating:</strong> ${d.rating}/5 (sample)</div><div class="col-sm-6"><i class="bi bi-calendar-check text-teal"></i> <strong>Available:</strong> Mon–Sat (sample)</div></div>
<p class="small text-muted mt-3 mb-0">All doctor details are fictional sample data.</p></div></div></div>`;
}

/* ---------- Page: Appointment ---------- */
function initAppointment(){
const sel=$("#doctor"),date=$("#date"),f=$("#apptForm");let slot="";
sel.innerHTML=DOCTORS.map(d=>`<option value="${d.id}">${d.name} – ${d.spec}</option>`).join("");
sel.value=new URLSearchParams(location.search).get("id")||1;
const today=new Date().toISOString().split("T")[0];date.min=today;date.value=today;
const drawSlots=()=>{slot="";$("#slot").value="";const d=getDoc(sel.value),n=+date.value.slice(-2);
$("#feeShow").textContent=`₹${d.fee}`;
$("#slots").innerHTML=SLOTS.map((t,i)=>`<button type="button" class="slot" ${(d.id+n+i)%5===0?"disabled":""}>${t}</button>`).join("");
$$(".slot:not(:disabled)").forEach(b=>b.onclick=()=>{$$(".slot").forEach(x=>x.classList.remove("active"));b.classList.add("active");slot=b.textContent;$("#slot").value=slot;$("#slot").classList.remove("is-invalid")})};
sel.onchange=date.onchange=drawSlots;drawSlots();
f.onsubmit=e=>{e.preventDefault();if(!validateForm(f))return;const d=getDoc(sel.value);
const b={type:"appointment",ref:refNo("APT"),title:d.name,detail:`${d.spec}, ${d.hospital}`,when:`${date.value} at ${slot}`,patient:$("#pname").value,fee:d.fee,status:"Demo confirmed",demo:true};
addBooking(b);f.classList.add("d-none");$("#confirm").classList.remove("d-none");
$("#confirmBody").innerHTML=`<p class="mb-1"><strong>Reference:</strong> ${b.ref}</p><p class="mb-1"><strong>Doctor:</strong> ${b.title}</p><p class="mb-1"><strong>When:</strong> ${b.when}</p><p class="mb-1"><strong>Patient:</strong> ${esc(b.patient)}</p><p><strong>Fee (display only):</strong> ₹${b.fee}</p>`;
toast("Demo booking saved in your browser.");window.scrollTo({top:0,behavior:"smooth"})};
}

/* ---------- Page: Ambulance ---------- */
function initAmbulance(){
const f=$("#ambForm");let type=AMB[0].k;
$("#types").innerHTML=AMB.map((a,i)=>`<div class="col-sm-6"><div class="amb-type ${i?"":"active"}" data-k="${a.k}"><i class="bi bi-${a.i} fs-3 text-blue"></i><h6 class="mb-1 mt-1">${a.k}</h6><div class="small text-muted">${a.d}</div><div class="small fw-bold text-teal mt-1">${a.p} (sample)</div></div></div>`).join("");
$$(".amb-type").forEach(t=>t.onclick=()=>{$$(".amb-type").forEach(x=>x.classList.remove("active"));t.classList.add("active");type=t.dataset.k});
const steps=[["inbox","Request received"],["person-check","Driver assigned"],["truck-front","On the way"],["geo-alt-fill","Arrived"]];
$("#driver").innerHTML=Object.entries({Driver:DRIVER.name,Vehicle:DRIVER.vehicle,Phone:DRIVER.phone,"Estimated arrival":DRIVER.eta}).map(([k,v])=>`<div class="col-6"><div class="small text-muted">${k}</div><strong>${v}</strong></div>`).join("");
let timer;const run=()=>{clearInterval(timer);let n=0;const draw=()=>{$("#stepper").innerHTML=steps.map(([i,t],x)=>`<div class="step ${x<=n?"done":""}"><i class="bi bi-${i}"></i>${t}</div>`).join("")};draw();
timer=setInterval(()=>{if(n>=3)return clearInterval(timer);n++;draw()},2000)};
$("#runDemo").onclick=run;run();
f.onsubmit=e=>{e.preventDefault();if(!validateForm(f))return;
const b={type:"ambulance",ref:refNo("AMB"),title:type,detail:`${$("#pickup").value} → ${$("#hospital").value}`,when:new Date().toLocaleString(),patient:$("#aname").value,status:"Demo requested",demo:true};
addBooking(b);run();toast("Demo request saved. No real ambulance has been dispatched.","danger");$("#status").scrollIntoView({behavior:"smooth"})};
}

/* ---------- Pages: Contact / Login / Register ---------- */
function initContact(){const f=$("#contactForm");f.onsubmit=e=>{e.preventDefault();if(validateForm(f)){f.reset();toast("Message noted (demo – nothing was sent).")}}}
function initLogin(){const f=$("#loginForm");f.onsubmit=e=>{e.preventDefault();if(!validateForm(f))return;sessionStorage.setItem("duugo_session","1");toast("Demo login successful.");setTimeout(()=>location.href="dashboard.html",800)}}
function initRegister(){const f=$("#regForm");f.onsubmit=e=>{e.preventDefault();if(!validateForm(f))return;
store.set("duugo_user",{name:$("#rname").value,email:$("#remail").value,mobile:$("#rmobile").value,city:"Kolkata"});sessionStorage.setItem("duugo_session","1");toast("Demo account created in this browser.");setTimeout(()=>location.href="dashboard.html",900)}}

/* ---------- Page: Dashboard ---------- */
function initDashboard(){
const u=user(),prefs=store.get("duugo_prefs",{});
$$("[data-go]").forEach(b=>b.onclick=()=>{$$("[data-go]").forEach(x=>x.classList.toggle("active",x===b));$$(".dash-sec").forEach(s=>s.classList.toggle("show",s.id===b.dataset.go))});
const row=(b,cancel)=>`<div class="card mb-3"><div class="card-body d-flex flex-wrap justify-content-between gap-2"><div><span class="demo-badge">DEMO</span> <strong>${esc(b.title)}</strong><div class="small text-muted">${esc(b.detail)}</div><div class="small">${esc(b.when)} | Ref ${b.ref}</div></div>
<div class="text-end"><span class="badge text-bg-${b.status==="Cancelled"?"secondary":"success"}">${b.status}</span>${cancel&&b.status!=="Cancelled"?`<div><button class="btn btn-sm btn-outline-danger mt-2" data-cancel="${b.ref}">Cancel</button></div>`:""}</div></div></div>`;
const render=()=>{const all=bookings(),empty=t=>`<p class="text-muted">No ${t} yet. This list only shows demo bookings made in this browser.</p>`;
$("#profileBox").innerHTML=`<div class="d-flex align-items-center gap-3"><div class="avatar m-0">${initials(u.name)}</div><div><h5 class="mb-0">${esc(u.name)}</h5><div class="small text-muted">${esc(u.email)} | ${esc(u.mobile)} | ${esc(u.city)}</div><span class="demo-badge">Demo profile</span></div></div><div class="row g-3 mt-3 text-center"><div class="col-6"><div class="card p-3"><h3>${all.filter(b=>b.type==="appointment").length}</h3>Appointments</div></div><div class="col-6"><div class="card p-3"><h3>${all.filter(b=>b.type==="ambulance").length}</h3>Ambulance requests</div></div></div>`;
const L=(t,c)=>{const r=all.filter(b=>!t||b.type===t);return r.length?r.map(b=>row(b,c)).join(""):empty(t||"history")};
$("#apptList").innerHTML=L("appointment",1);$("#ambList").innerHTML=L("ambulance",1);$("#histList").innerHTML=L("",0);
$$("[data-cancel]").forEach(b=>b.onclick=()=>confirmModal("Cancel booking?","This only updates your demo data.",()=>{store.set("duugo_bookings",bookings().map(x=>x.ref===b.dataset.cancel?{...x,status:"Cancelled"}:x));render();toast("Demo booking cancelled.","primary")}))};
render();
["name","email","mobile","city"].forEach(k=>$("#s_"+k).value=u[k]);$("#s_dark").checked=!!prefs.dark;$("#s_notify").checked=!!prefs.notify;
$("#setForm").onsubmit=e=>{e.preventDefault();if(!validateForm(e.target))return;store.set("duugo_user",Object.fromEntries(["name","email","mobile","city"].map(k=>[k,$("#s_"+k).value])));
store.set("duugo_prefs",{dark:$("#s_dark").checked,notify:$("#s_notify").checked});document.body.classList.toggle("dark",$("#s_dark").checked);render();toast("Settings saved.")};
$("#clearData").onclick=()=>confirmModal("Clear all demo data?","This removes demo bookings, profile and preferences from this browser.",()=>{["duugo_bookings","duugo_user","duugo_prefs"].forEach(k=>localStorage.removeItem(k));location.reload()});
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded",()=>{layout();
({home:initHome,doctors:initDoctors,details:initDetails,appointment:initAppointment,ambulance:initAmbulance,contact:initContact,login:initLogin,register:initRegister,dashboard:initDashboard})[document.body.dataset.page]?.()});
