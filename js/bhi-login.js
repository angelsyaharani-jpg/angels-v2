/* ============================================================
   BENDERANG — LOGIN MODULE (shared by admin.html & user.html)
   bhi-login.js
   ============================================================ */

let currentUser = null, isAdmin = false, pinBuffer = "";

function onPersonChange(){
  pinBuffer=""; updatePinDots(); document.getElementById("login-err").textContent="";
  const v=document.getElementById("login-person").value;
  document.getElementById("login-sub").textContent = v==="Admin"
    ? "Masukkan PIN admin (4 digit terakhir kode admin)"
    : "Masukkan PIN 4 digit kamu";
}

function populateLoginSelect(){
  const sel=document.getElementById("login-person");
  const cur=sel.value;
  sel.innerHTML='<option value="">-- Pilih nama --</option>';
  employees.forEach(e=>{const o=document.createElement("option");o.value=e.name;o.textContent=e.name;sel.appendChild(o);});
  const adm=document.createElement("option");adm.value="Admin";adm.textContent="Admin";sel.appendChild(adm);
  if(cur) sel.value=cur;
}

function updatePinDots(){
  for(let i=0;i<4;i++) document.getElementById("pd"+i).classList.toggle("filled",i<pinBuffer.length);
}
function pinPress(n){
  if(pinBuffer.length>=4) return;
  pinBuffer+=String(n); updatePinDots();
  if(pinBuffer.length===4) attemptLogin();
}
function pinDel(){pinBuffer=pinBuffer.slice(0,-1);updatePinDots();document.getElementById("login-err").textContent="";}

function attemptLogin(){
  const person=document.getElementById("login-person").value;
  if(!person){document.getElementById("login-err").textContent="Pilih nama dulu.";pinBuffer="";updatePinDots();return;}
  const ok=person==="Admin"?pinBuffer===ADMIN_CODE.slice(-4):pinBuffer===getPin(person);
  if(ok){
    currentUser=person; isAdmin=(person==="Admin");
    setSession({user:person,isAdmin});
    onLoginSuccess();
  } else {
    document.getElementById("login-err").textContent="PIN salah.";
    pinBuffer=""; updatePinDots();
  }
}

function logout(){
  clearSession();
  location.reload();
}

function showResetModal(){document.getElementById("reset-overlay").classList.remove("hidden");}
function closeModal(id){document.getElementById(id).classList.add("hidden");}

function doResetPin(){
  const person=document.getElementById("reset-person").value;
  const newPin=document.getElementById("reset-new-pin").value.trim();
  const code=document.getElementById("reset-admin-code").value.trim();
  const err=document.getElementById("reset-err");
  const ok=document.getElementById("reset-ok");
  err.textContent="";ok.textContent="";
  if(!person){err.textContent="Pilih karyawan.";return;}
  if(!/^\d{4}$/.test(newPin)){err.textContent="PIN harus 4 digit angka.";return;}
  if(code!==ADMIN_CODE){err.textContent="Kode admin salah.";return;}
  savePin(person,newPin);
  ok.textContent=`PIN ${person} berhasil direset ke ${newPin}.`;
}

function populateResetSelect(){
  const rsel=document.getElementById("reset-person");
  rsel.innerHTML='<option value="">-- Pilih --</option>';
  employees.forEach(e=>{const o=document.createElement("option");o.value=e.name;o.textContent=e.name;rsel.appendChild(o);});
}

// Check if already logged in from session
function checkExistingSession(){
  const s = getSession();
  if(s){
    currentUser = s.user;
    isAdmin = s.isAdmin;
    onLoginSuccess();
    return true;
  }
  return false;
}
