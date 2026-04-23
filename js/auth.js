let currentDistrict = '';
let currentGroup    = '';
let isAdmin         = false;
let selectedAdminDistrict = '';

// ═══ AUTH ═══
function showLoginModal(){
  document.getElementById('login-modal').classList.add('open');
  document.getElementById('login-err').textContent='';
  document.getElementById('login-pw').value='';
  setTimeout(()=>document.getElementById('login-pw').focus(),100);
}
function closeLoginModal(){
  document.getElementById('login-modal').classList.remove('open');
  if(!currentDistrict) switchTab('dash',true);
}
document.getElementById('login-modal').addEventListener('click',function(e){
  if(e.target===this) closeLoginModal();
});
function togglePw(){
  const i=document.getElementById('login-pw');
  i.type=i.type==='password'?'text':'password';
}
function doLogin(){
  const pw=document.getElementById('login-pw').value.trim();
  const err=document.getElementById('login-err');
  const entry=PW_MAP[pw];
  if(!entry){ err.textContent='รหัสผ่านไม่ถูกต้อง'; document.getElementById('login-pw').value=''; return; }
  err.textContent='';
  currentDistrict=entry.name;
  currentGroup=entry.group;
  isAdmin=(entry.group==='admin');
  selectedAdminDistrict='';

  const headerLabel={
    admin:    `⚙️ ${entry.name} — กรุณาเลือกหน่วยงานที่กรอก`,
    agency:   `🏢 ${entry.name}`,
    district: `🏛 อำเภอ${entry.name}`,
  }[entry.group];
  document.getElementById('entry-district-name').textContent=headerLabel;
  document.getElementById('admin-slicer-wrap').style.display=isAdmin?'block':'none';
  document.getElementById('lock-icon').textContent='🔓';
  document.getElementById('login-modal').classList.remove('open');
  _doSwitchTab('entry');
  if(!formBuilt){ buildForm(); formBuilt=true; }
}
function doLogout(){
  currentDistrict=''; currentGroup=''; isAdmin=false; selectedAdminDistrict='';
  document.querySelectorAll('.dist-btn').forEach(b=>b.classList.remove('sel','sel-province'));
  document.getElementById('admin-selected-district').textContent='';
  document.getElementById('lock-icon').textContent='🔒';
  switchTab('dash',true);
  toast('ออกจากระบบเรียบร้อยแล้ว','');
}

// ═══ FIX: getActiveDistrict — single definition ═══
function getActiveDistrict(){
  if(isAdmin) return selectedAdminDistrict||'';
  return currentDistrict;
}

// ═══ Admin slicer — รับ element โดยตรง ═══
function selectDistrict(btn){
  const d=btn.dataset.d;
  selectedAdminDistrict=d;
  const isProvince=(d==='จังหวัดหนองบัวลำภู');
  document.querySelectorAll('.dist-btn').forEach(b=>b.classList.remove('sel','sel-province'));
  btn.classList.add(isProvince?'sel-province':'sel');
  const label=isProvince?'✅ ภาพรวมจังหวัดหนองบัวลำภู':`✅ เลือก: ${d} — พร้อมกรอกข้อมูล`;
  document.getElementById('admin-selected-district').textContent=label;
}
