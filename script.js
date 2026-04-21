const URL_GAS = 'https://script.google.com/macros/s/AKfycbxoucwYX2kFyC7lHQBZ8WhNi0GroJ_o84L5bG2GyDAuqAtqTda6GKVgLgNAbvSHUxSc/exec';
const MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const PAL = ['#2563eb','#4f46e5','#7c3aed','#0891b2','#059669'];
const COMPARE_COLORS = ['#2563eb','#059669','#d97706','#dc2626','#7c3aed','#0891b2'];
const DISTRICTS = ['เมืองหนองบัวลำภู','นากลาง','ศรีบุญเรือง','สุวรรณคูหา','โนนสัง','นาวัง'];
const fmt = n => Number(n).toLocaleString('th-TH');

const ACTS = [
  {id:1, name:'จัดประชุมคณะกรรมการกีฬาประจำจังหวัดตามโครงการฯ', unit:'ครั้ง/คน'},
  {id:2, name:'จัดทำโครงการส่งเสริมกีฬาของจังหวัดโดยของบประมาณจากจังหวัด กลุ่มจังหวัด กองทุนพัฒนาการกีฬาแห่งชาติต้นสังกัดและองค์กรปกครองส่วนท้องถิ่นหรือหน่วยงานอื่นๆ', unit:'โครงการ'},
  {id:3, name:'แต่งตั้งคณะทำงานเพื่อสนับสนุนการดำเนินงานของโครงการฯ', unit:'ชุด/คน'},
  {id:4, name:'จัดเตรียมและพัฒนาสถานที่ออกกำลังกายและเล่นกีฬาของนักเรียนในโรงเรียน', unit:'แห่ง'},
  {id:5, name:'จัดตั้งชมรมกีฬาในสถานศึกษา ระดับตำบลและอำเภอ', unit:'ชมรม'},
  {id:6, name:'จัดตั้งจิตอาสาด้านกีฬาเพื่อส่งเสริมและสนับสนุนกิจกรรม กีฬาในระดับตำบลและอำเภอ', unit:'คน'},
  {id:7, name:'จัดทำทะเบียนอาสาสมัครด้านกีฬาและการออกกำลังภายในจังหวัด', unit:'ครั้ง/คน'},
  {id:8, name:'ส่งเสริมให้จิตอาสาด้านกีฬาเข้ามาสนับสนุนการดำเนินงาน ของโรงเรียนกีฬา ห้องเรียนกีฬา ในสังกัดหน่วยงานต่างๆ ที่ตั้งอยู่ในพื้นที่', unit:'ครั้ง/คน'},
  {id:9, name:'อาสาสมัครกีฬาและการออกกำลังกาย (อสก.) จัดอบรมและถ่ายทอดความรู้เรื่องการออกกำลังกายและเล่นกีฬา แก่กลุ่มเป้าหมายในพื้นที่', unit:'ครั้ง/คน'},
  {id:10, name:'อาสาสมัครกีฬาและการออกกำลังกาย (อสก.) ส่งเสริมให้ ยุวชน เยาวชนและประชาชนทั่วไปในพื้นที่ออกกำลังกายและเล่นกีฬา', unit:'ครั้ง/คน'},
  {id:11, name:'จัดแข่งขันกีฬาระดับยุวชน เยาวชนและประชาชน ในระดับสถานศึกษา ตำบล อำเภอ จังหวัด และอื่นๆ (ระดับชาติ นานาชาติ)', unit:'ครั้ง/คน'},
  {id:12, name:'สนับสนุนการดำเนินงานของโรงเรียนกีฬา ห้องเรียนกีฬาในสังกัดหน่วยงานต่างๆที่ตั้งอยู่ในพื้นที่', unit:'ครั้ง/คน'},
  {id:13, name:'พัฒนาโครงสร้างพื้นฐานและสิ่งอำนวยความสะดวกในการเล่นกีฬาและการออกกำลังกาย', unit:'ครั้ง'},
  {id:14, name:'นำเข้าข้อมูลโครงสร้างพื้นฐานกีฬาของจังหวัด ผ่านโปรแกรม Thailand Sports Almanac', unit:'ครั้ง'},
];

// ══ Password map ══
const PW_MAP = {
  '909039': { name:'Admin (กกท.)',            group:'admin' },
  '901039': { name:'Admin (ท้องถิ่นจังหวัด)', group:'admin' },
  '900931': { name:'สพป. หนองบัวลำภู เขต 1',              group:'agency' },
  '900932': { name:'สพป. หนองบัวลำภู เขต 2',              group:'agency' },
  '900933': { name:'สพม. เลย-หนองบัวลำภู',                group:'agency' },
  '900934': { name:'องค์การบริหารส่วนจังหวัดหนองบัวลำภู',  group:'agency' },
  '900935': { name:'เทศบาลเมืองหนองบัวลำภู',               group:'agency' },
  '900936': { name:'ท่องเที่ยวและกีฬาจังหวัดหนองบัวลำภู',  group:'agency' },
  '090391': { name:'เมืองหนองบัวลำภู', group:'district' },
  '090392': { name:'นากลาง',           group:'district' },
  '090393': { name:'ศรีบุญเรือง',      group:'district' },
  '090394': { name:'สุวรรณคูหา',       group:'district' },
  '090395': { name:'โนนสัง',           group:'district' },
  '090396': { name:'นาวัง',            group:'district' },
};

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

// ═══ TAB ═══
let formBuilt=false;
function switchTab(t,skipCheck){
  if(t==='entry'&&!currentDistrict&&!skipCheck){ showLoginModal(); return; }
  _doSwitchTab(t);
  if(t==='entry'&&!formBuilt){ buildForm(); formBuilt=true; }
  if(t==='dash') loadData();
}
function _doSwitchTab(t){
  document.querySelectorAll('.pg').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(b=>b.classList.remove('on'));
  document.getElementById('pg-'+t).classList.add('on');
  document.getElementById('tab-'+t).classList.add('on');
}

// ═══ INNER TABS ═══
function switchInner(panel){
  document.getElementById('panel-overview').style.display=panel==='overview'?'':'none';
  document.getElementById('panel-compare').style.display=panel==='compare'?'':'none';
  document.querySelectorAll('.inner-tab').forEach(b=>b.classList.remove('on'));
  document.getElementById('itab-'+panel).classList.add('on');
  if(panel==='compare') loadCompare();
}

// ═══ PERIOD ═══
function getPeriod(){ return `${MONTHS[+document.getElementById('sel-month').value]} ปีงบประมาณ ${document.getElementById('sel-year').value}`; }
function getEntryPeriod(){ return `${MONTHS[+document.getElementById('e-sel-month').value]} ปีงบประมาณ ${document.getElementById('e-sel-year').value}`; }
function onPeriodChange(){
  document.getElementById('period-label').textContent=getPeriod();
  syncToEntry(); loadData();
}
function syncToEntry(){
  setVal('e-sel-month',document.getElementById('sel-month').value);
  setVal('e-sel-year',document.getElementById('sel-year').value);
  document.getElementById('entry-pdis').textContent=getEntryPeriod();
}
function syncFromEntry(){
  setVal('sel-month',document.getElementById('e-sel-month').value);
  setVal('sel-year',document.getElementById('e-sel-year').value);
  document.getElementById('period-label').textContent=getPeriod();
  document.getElementById('entry-pdis').textContent=getEntryPeriod();
}
function setVal(id,v){const s=document.getElementById(id);for(let i=0;i<s.options.length;i++)if(String(s.options[i].value)===String(v)){s.selectedIndex=i;return;}}

// ═══ DASHBOARD ═══
let curData=[],sk='id',sd='asc',chD=null;
function setLoad(on){document.getElementById('lov').style.display=on?'flex':'none';}
function showErr(m){const e=document.getElementById('errbanner');e.textContent=m;e.style.display=m?'block':'none';}

let viewMode='monthly';
function setViewMode(mode){
  viewMode=mode;
  const iy=mode==='yearly';
  document.getElementById('btn-monthly').style.background=iy?'#1e293b':'#2563eb';
  document.getElementById('btn-monthly').style.color=iy?'#64748b':'#fff';
  document.getElementById('btn-yearly').style.background=iy?'#2563eb':'#1e293b';
  document.getElementById('btn-yearly').style.color=iy?'#fff':'#64748b';
  document.getElementById('sel-month').style.display=iy?'none':'';
  document.getElementById('kpi-active-badge').textContent=iy?'ทั้งปี':'เดือนนี้';
  document.getElementById('kpi-active-lbl').textContent=iy?'ดำเนินการทั้งปี':'ดำเนินการเดือนนี้';
  document.getElementById('kpi-monthly-badge').textContent=iy?'รวมทั้งปี':'ประจำเดือน';
  document.getElementById('kpi-monthly-lbl').textContent=iy?'ผลงานรวมทั้งปี':'ผลงานประจำเดือน';
  loadData();
}

function onDistrictChange(){ loadData(); }

// ── JSONP helper ──
function jsonp(url){
  return new Promise((resolve,reject)=>{
    const cb='_cb'+Date.now()+'_'+Math.floor(Math.random()*9999);
    const s=document.createElement('script');
    const timer=setTimeout(()=>{
      cleanup(); reject(new Error('timeout'));
    },15000);
    function cleanup(){ clearTimeout(timer); delete window[cb]; if(s.parentNode) s.parentNode.removeChild(s); }
    window[cb]=function(data){ cleanup(); resolve(data); };
    s.onerror=()=>{ cleanup(); reject(new Error('network error')); };
    s.src=url+(url.includes('?')?'&':'?')+'callback='+cb;
    document.head.appendChild(s);
  });
}

async function loadData(){
  setLoad(true); showErr('');
  const year=document.getElementById('sel-year').value;
  const iy=viewMode==='yearly';
  const selVal=document.getElementById('sel-district')?.value||'district:';
  const [scope,districtVal]=selVal.split(':');
  const district=districtVal||'';
  let url;
  if(iy){
    url=`${URL_GAS}?fiscalYear=${encodeURIComponent(year)}&scope=${scope}`;
    document.getElementById('period-label').textContent=`ปีงบประมาณ ${year}`;
  } else {
    url=`${URL_GAS}?period=${encodeURIComponent(getPeriod())}&scope=${scope}`;
    document.getElementById('period-label').textContent=getPeriod();
  }
  if(district) url+=`&district=${encodeURIComponent(district)}`;
  try{
    const j=await jsonp(url);
    if(j.success&&j.activities&&j.activities.length){
      curData=j.activities.map(a=>({
        ...a,
        id:Number(a.id)||0,
        monthly:Number(a.monthly)||0,
        cumulative:Number(a.cumulative)||0,
        name:a.name||ACTS.find(x=>x.id===Number(a.id))?.name||'',
        unit:a.unit||ACTS.find(x=>x.id===Number(a.id))?.unit||'',
      }));
      showErr('');
    } else {
      curData=[];
      const label=iy?`ปีงบประมาณ ${year}`:getPeriod();
      const scopeLabel=scope==='province'?'ทั้งจังหวัด':(district?`อ.${district}`:'ทุกอำเภอ');
      showErr(`ไม่พบข้อมูล ${label} — ${scopeLabel}`);
    }
  } catch(e){ curData=[]; showErr('เชื่อมต่อ Google Sheets ไม่ได้ — '+e.message); }
  renderAll(); setLoad(false);
  if(document.getElementById('panel-compare').style.display!=='none') loadCompare();
}

function renderAll(){ renderKPI(); renderDonut(); renderBars(); renderTable(); }

function renderKPI(){
  const d=curData;
  document.getElementById('kpi-total').textContent=d.length||'-';
  document.getElementById('kpi-active').textContent=d.length?d.filter(a=>a.monthly>0).length:'-';
  document.getElementById('kpi-monthly').textContent=d.length?fmt(d.reduce((s,a)=>s+a.monthly,0)):'-';
  document.getElementById('kpi-cumul').textContent=d.length?fmt(d.reduce((s,a)=>s+a.cumulative,0)):'-';
}

function renderDonut(){
  const top5=[...curData].sort((a,b)=>b.cumulative-a.cumulative).slice(0,5);
  const tot=top5.reduce((s,a)=>s+a.cumulative,0);
  document.getElementById('donut-total').textContent=fmt(tot);
  if(chD) chD.destroy();
  chD=new Chart(document.getElementById('chartDonut'),{
    type:'doughnut',
    data:{labels:top5.map(a=>a.name?a.name.substring(0,18)+'…':a.id),datasets:[{data:top5.map(a=>a.cumulative),backgroundColor:PAL,borderWidth:0,hoverOffset:5}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'72%',plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${fmt(ctx.raw)}`}}}}
  });
  document.getElementById('donut-legend').innerHTML=top5.map((a,i)=>{
    const p=tot>0?((a.cumulative/tot)*100).toFixed(1):'0.0';
    const label=a.name?a.name.substring(0,20)+(a.name.length>20?'…':''):('กิจกรรม '+a.id);
    return `<div class="dl-item"><span class="dl-dot" style="background:${PAL[i]}"></span><span class="dl-name">${label}</span><span class="dl-pct">${p}%</span></div>`;
  }).join('');
}

function renderBars(){
  const regular=curData.filter(a=>a.id<=14);
  const extras=curData.filter(a=>a.id>=15);
  const allRows=[...regular];
  if(extras.length>0){
    const totalM=extras.reduce((s,a)=>s+a.monthly,0);
    const totalC=extras.reduce((s,a)=>s+a.cumulative,0);
    allRows.push({id:15,_extras:extras,monthly:totalM,cumulative:totalC,name:'กิจกรรมอื่นๆ',unit:'ครั้ง'});
  }
  const mx=Math.max(...allRows.map(a=>a.monthly),1);
  document.getElementById('bar-list').innerHTML=allRows.length
    ? allRows.map((a,i)=>{
        const pct=(a.monthly/mx*100).toFixed(1);
        const actDef=ACTS.find(x=>x.id===+a.id);
        const name=a._extras?'กิจกรรมอื่นๆ':(actDef?.name||a.name||('กิจกรรมที่ '+(a.id||i+1)));
        const val=a.monthly>0?fmt(a.monthly):'—';
        const noData=a.monthly===0;
        const subHtml=a._extras?`<div style="grid-column:2;font-size:10px;color:#64748b;margin-top:3px;line-height:1.6;">${
          a._extras.map(e=>`• ${e.name||'กิจกรรมอื่นๆ'} <span style="color:#1e40af;font-weight:600;">(${fmt(e.monthly)})</span>`).join('<br>')
        }</div>`:'';
        return `<div class="brow">
          <div class="bnum">${a.id}</div>
          <div class="bname" style="${a._extras?'font-weight:600;':''}">${name}</div>
          <div class="btrack"><div class="bfill" style="width:${pct}%;${noData?'background:#e2e8f0;':''}"></div></div>
          <div class="bval" style="${noData?'color:#cbd5e1;font-weight:400;':''}">${val}</div>
          ${subHtml}
        </div>`;
      }).join('')
    : '<p style="color:#94a3b8;font-size:12px;padding:12px 0;">ไม่มีข้อมูล</p>';
}

function renderTable(){
  const regular=[...curData].filter(a=>+a.id<=14).sort((a,b)=>{
    const va=a[sk],vb=b[sk];
    const c=typeof va==='number'?va-vb:String(va).localeCompare(String(vb),'th');
    return sd==='asc'?c:-c;
  });
  const extras=curData.filter(a=>+a.id>=15);
  const extraTotalM=extras.reduce((s,a)=>s+a.monthly,0);
  const extraTotalC=extras.reduce((s,a)=>s+a.cumulative,0);
  const regularHtml=regular.map(a=>{
    const actDef=ACTS.find(x=>x.id===+a.id);
    const name=actDef?.name||a.name||('กิจกรรมที่ '+a.id);
    const unit=actDef?.unit||a.unit||'';
    return `<tr>
      <td style="color:#94a3b8;font-size:11px;white-space:nowrap;vertical-align:top;padding-top:11px">${a.id}</td>
      <td style="font-size:11px;line-height:1.5;word-break:break-word;">${name}</td>
      <td style="color:#64748b;font-size:10px;white-space:nowrap;vertical-align:top;padding-top:11px">${unit}</td>
      <td class="nr" style="vertical-align:top;padding-top:11px">${fmt(a.monthly)}</td>
      <td class="nr" style="color:#4f46e5;font-weight:700;vertical-align:top;padding-top:11px">${fmt(a.cumulative)}</td>
      <td style="vertical-align:top;padding-top:9px">${a.monthly>0?'<span class="bdg bdg-on"><span class="bdg-d"></span>ดำเนินการ</span>':'<span class="bdg bdg-off"><span class="bdg-d"></span>ไม่มีข้อมูล</span>'}</td>
    </tr>`;
  }).join('');
  const extraHtml=extras.length>0?`<tr>
    <td style="color:#94a3b8;font-size:11px;white-space:nowrap;vertical-align:top;padding-top:11px">15</td>
    <td style="font-size:11px;line-height:1.7;word-break:break-word;">
      <span style="font-weight:600;color:#0f172a;">กิจกรรมอื่นๆ</span><br>
      ${extras.map(e=>`<span style="color:#64748b;">• ${e.name||'กิจกรรมอื่นๆ'} <span style="color:#1e40af;font-weight:600;">(${fmt(e.monthly)})</span></span>`).join('<br>')}
    </td>
    <td style="color:#64748b;font-size:10px;white-space:nowrap;vertical-align:top;padding-top:11px">ครั้ง</td>
    <td class="nr" style="vertical-align:top;padding-top:11px">${fmt(extraTotalM)}</td>
    <td class="nr" style="color:#4f46e5;font-weight:700;vertical-align:top;padding-top:11px">${fmt(extraTotalC)}</td>
    <td style="vertical-align:top;padding-top:9px">${extraTotalM>0?'<span class="bdg bdg-on"><span class="bdg-d"></span>ดำเนินการ</span>':'<span class="bdg bdg-off"><span class="bdg-d"></span>ไม่มีข้อมูล</span>'}</td>
  </tr>`:'';
  const total=regular.length+(extras.length>0?1:0);
  document.getElementById('tbl-body').innerHTML=(regularHtml||extraHtml)
    ? regularHtml+extraHtml
    : '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:20px;font-size:12px;">ไม่พบข้อมูลในเดือนนี้</td></tr>';
  document.getElementById('row-count').textContent=`(${total} รายการ)`;
  document.getElementById('ft-m').textContent=fmt(curData.reduce((s,a)=>s+a.monthly,0));
  document.getElementById('ft-c').textContent=fmt(curData.reduce((s,a)=>s+a.cumulative,0));
  document.querySelectorAll('#pg-dash thead th').forEach(t=>t.classList.remove('sa','sd'));
  const keys=['id','name','unit','monthly','cumulative',''];
  const i=keys.indexOf(sk);
  if(i>=0){const ths=document.querySelectorAll('#pg-dash thead th');if(ths[i])ths[i].classList.add(sd==='asc'?'sa':'sd');}
}
function srt(k){
  if(sk===k) sd=sd==='asc'?'desc':'asc'; else {sk=k;sd='asc';}
  renderTable();
}

// ═══ COMPARE ═══
let chCompare=null;
async function loadCompare(){
  const year=document.getElementById('sel-year').value;
  const iy=viewMode==='yearly';
  const periodLabel=iy?`ปีงบประมาณ ${year}`:getPeriod();
  document.getElementById('compare-period-lbl').textContent=periodLabel;
  document.getElementById('compare-loading').style.display='block';
  document.getElementById('compare-content').style.display='none';

  const results=[];
  for(const d of DISTRICTS){
    let url;
    if(iy){
      url=`${URL_GAS}?fiscalYear=${encodeURIComponent(year)}&scope=district&district=${encodeURIComponent(d)}`;
    } else {
      url=`${URL_GAS}?period=${encodeURIComponent(getPeriod())}&scope=district&district=${encodeURIComponent(d)}`;
    }
    try{
      const j=await jsonp(url);
      const acts=j.success&&j.activities?j.activities:[];
      results.push({
        district:d,
        monthly:acts.reduce((s,a)=>s+Number(a.monthly||0),0),
        cumulative:acts.reduce((s,a)=>s+Number(a.cumulative||0),0),
        active:acts.filter(a=>Number(a.monthly||0)>0).length,
      });
    } catch(e){
      results.push({district:d,monthly:0,cumulative:0,active:0});
    }
  }

  document.getElementById('compare-loading').style.display='none';
  document.getElementById('compare-content').style.display='block';

  if(chCompare) chCompare.destroy();
  chCompare=new Chart(document.getElementById('chartCompare'),{
    type:'bar',
    data:{
      labels:results.map(r=>r.district),
      datasets:[
        {label:'ผลงานเดือนนี้',data:results.map(r=>r.monthly),backgroundColor:COMPARE_COLORS.map(c=>c+'cc'),borderColor:COMPARE_COLORS,borderWidth:1.5,borderRadius:6},
        {label:'ผลงานสะสม',data:results.map(r=>r.cumulative),backgroundColor:COMPARE_COLORS.map(c=>c+'44'),borderColor:COMPARE_COLORS,borderWidth:1.5,borderRadius:6,borderDash:[4,4]},
      ]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{position:'top',labels:{font:{family:'Sarabun',size:11},boxWidth:10}},
        tooltip:{callbacks:{label:ctx=>`${ctx.dataset.label}: ${fmt(ctx.raw)}`}}},
      scales:{
        x:{ticks:{font:{family:'Sarabun',size:11}},grid:{display:false}},
        y:{ticks:{font:{family:'Sarabun',size:10},callback:v=>fmt(v)},grid:{color:'#f1f5f9'}}
      }
    }
  });

  document.getElementById('compare-tbl-body').innerHTML=results
    .sort((a,b)=>b.monthly-a.monthly)
    .map((r,i)=>`<tr>
      <td style="font-size:12px;font-weight:600;">${i===0?'🥇 ':''}${r.district}</td>
      <td class="nr">${fmt(r.monthly)}</td>
      <td class="nr" style="color:#4f46e5;font-weight:700;">${fmt(r.cumulative)}</td>
      <td class="nr">${r.active} รายการ</td>
    </tr>`).join('');
}

// ═══ EXPORT CSV ═══
function exportCSV(){
  if(!curData.length){ toast('ไม่มีข้อมูลให้ส่งออก','er'); return; }
  const period=viewMode==='yearly'?`ปีงบประมาณ ${document.getElementById('sel-year').value}`:getPeriod();
  const selVal=document.getElementById('sel-district').value;
  const [,dv]=selVal.split(':');
  const scope=dv||'ทั้งจังหวัด';
  const rows=[['#','กิจกรรม','หน่วยนับ','ผลงานเดือนนี้','ผลงานสะสม','สถานะ']];
  curData.forEach(a=>{
    const actDef=ACTS.find(x=>x.id===+a.id);
    rows.push([a.id,actDef?.name||a.name||'',actDef?.unit||a.unit||'',a.monthly,a.cumulative,a.monthly>0?'ดำเนินการ':'ไม่มีข้อมูล']);
  });
  rows.push(['','รวม','',curData.reduce((s,a)=>s+a.monthly,0),curData.reduce((s,a)=>s+a.cumulative,0),'']);
  const bom='\uFEFF';
  const csv=bom+rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=`กีฬา_${scope}_${period}.csv`;a.click();
  URL.revokeObjectURL(url);
  toast('✅ ดาวน์โหลด CSV สำเร็จ','ok');
}

// ═══ ENTRY FORM ═══
function buildForm(){
  document.getElementById('form-body').innerHTML=ACTS.map(a=>`
    <tr>
      <td class="nc">${a.id}</td>
      <td><div class="aname">${a.name}</div><div class="aunit">${a.unit}</div></td>
      <td class="ic"><input type="number" min="0" class="ni" id="m_${a.id}" placeholder="0" oninput="onI(this)"/></td>
      <td class="ic"><input type="number" min="0" class="ni cv" id="c_${a.id}" placeholder="0" oninput="onI(this)"/></td>
    </tr>`).join('');
  addExtra();
}
function onI(el){el.classList.toggle('hv',el.value!==''&&+el.value>0);calcTot();}

let extraCount=0;
function addExtra(){
  extraCount++;
  const id=`ex_${extraCount}`;
  const div=document.createElement('div');
  div.className='extra-item';
  div.id='extra-row-'+id;
  div.innerHTML=`
    <input type="text" id="exn_${id}" placeholder="ชื่อกิจกรรมอื่นๆ" oninput="this.classList.toggle('hv',this.value.trim()!=='');calcTot()"/>
    <input type="number" min="0" class="ni" id="exm_${id}" placeholder="0" oninput="onI(this)"/>
    <input type="number" min="0" class="ni cv" id="exc_${id}" placeholder="0" oninput="onI(this)"/>
    <button class="extra-del" onclick="removeExtra('${id}')" title="ลบ">✕</button>`;
  document.getElementById('extra-list').appendChild(div);
  calcTot();
}
function removeExtra(id){
  const row=document.getElementById('extra-row-'+id);
  if(row) row.remove();
  calcTot();
}
function getExtras(){
  return Array.from(document.getElementById('extra-list').querySelectorAll('.extra-item')).map(row=>{
    const id=row.id.replace('extra-row-ex_','');
    return {
      name:(document.getElementById(`exn_ex_${id}`)?.value||'').trim()||'กิจกรรมอื่นๆ',
      monthly:+document.getElementById(`exm_ex_${id}`)?.value||0,
      cumulative:+document.getElementById(`exc_ex_${id}`)?.value||0,
    };
  }).filter(e=>e.name||e.monthly||e.cumulative);
}
function calcTot(){
  let sm=0,sc=0,f=0;
  ACTS.forEach(a=>{
    const m=+document.getElementById(`m_${a.id}`)?.value||0;
    const c=+document.getElementById(`c_${a.id}`)?.value||0;
    sm+=m;sc+=c;if(m>0||c>0)f++;
  });
  document.getElementById('ef-m').textContent=sm.toLocaleString('th-TH');
  document.getElementById('ef-c').textContent=sc.toLocaleString('th-TH');
  document.getElementById('filled-count').textContent=`กรอกแล้ว ${f} / ${ACTS.length} รายการ`;
}

// ═══ CONFIRM RESET ═══
function confirmReset(){
  document.getElementById('confirm-modal').classList.add('open');
}
function closeConfirm(){
  document.getElementById('confirm-modal').classList.remove('open');
}
document.getElementById('confirm-modal').addEventListener('click',function(e){
  if(e.target===this) closeConfirm();
});
function doReset(){
  closeConfirm();
  ACTS.forEach(a=>{
    const m=document.getElementById(`m_${a.id}`),c=document.getElementById(`c_${a.id}`);
    if(m){m.value='';m.classList.remove('hv');}
    if(c){c.value='';c.classList.remove('hv');}
  });
  document.getElementById('extra-list').innerHTML='';
  extraCount=0; addExtra();
  calcTot();
  hideSaveStatus();
  toast('ล้างข้อมูลเรียบร้อยแล้ว','');
}

// ═══ SUBMIT — แก้ no-cors + แสดงสถานะจริง ═══
function showSaveStatus(ok,msg){
  const el=document.getElementById('save-status');
  el.textContent=msg;
  el.className='save-status '+(ok?'ok':'er');
}
function hideSaveStatus(){
  document.getElementById('save-status').className='save-status';
}

async function submitData(){
  const district=getActiveDistrict();
  if(isAdmin&&!district){
    toast('กรุณาเลือกหน่วยงานก่อนบันทึกข้อมูล','er'); return;
  }
  if(!district){
    toast('ไม่พบข้อมูลหน่วยงาน กรุณาเข้าสู่ระบบใหม่','er'); return;
  }
  const acts=ACTS.map(a=>({
    id:a.id,name:a.name,unit:a.unit,
    monthly:+document.getElementById(`m_${a.id}`)?.value||0,
    cumulative:+document.getElementById(`c_${a.id}`)?.value||0,
  }));
  const extras=getExtras().map((e,i)=>({id:15+i,name:e.name,unit:'ครั้ง',monthly:e.monthly,cumulative:e.cumulative}));
  const all=[...acts,...extras];
  if(!all.some(a=>a.monthly>0||a.cumulative>0)){
    toast('กรุณากรอกข้อมูลอย่างน้อย 1 รายการ','er'); return;
  }
  const btn=document.getElementById('btn-sub');
  btn.disabled=true;
  document.getElementById('spin').style.display='block';
  document.getElementById('btn-lbl').textContent='กำลังบันทึก...';
  hideSaveStatus();
  prog(40);
  try{
    prog(70);
    const payload=encodeURIComponent(JSON.stringify({period:getEntryPeriod(),district,activities:all}));
    const j=await jsonp(`${URL_GAS}?action=save&data=${payload}`);
    prog(100);
    if(j.success){
      showSaveStatus(true,`✅ บันทึกสำเร็จ ${j.saved||all.length} รายการ`);
      toast(`✅ บันทึกข้อมูล ${getEntryPeriod()} สำเร็จ`,'ok');
    } else {
      showSaveStatus(false,`❌ ${j.error||'เกิดข้อผิดพลาด'}`);
      toast(`❌ ${j.error||'เกิดข้อผิดพลาด'}`,'er');
    }
    setTimeout(progHide,800);
  } catch(e){
    showSaveStatus(false,'❌ เชื่อมต่อไม่ได้');
    toast(`❌ เกิดข้อผิดพลาด: ${e.message}`,'er');
    progHide();
  }
  finally{
    btn.disabled=false;
    document.getElementById('spin').style.display='none';
    document.getElementById('btn-lbl').textContent='📤 บันทึกลง Google Sheets';
  }
}

function prog(p){const b=document.getElementById('pbar');b.style.display='block';setTimeout(()=>document.getElementById('pfill').style.width=p+'%',30);}
function progHide(){document.getElementById('pfill').style.width='0%';setTimeout(()=>document.getElementById('pbar').style.display='none',400);}

// ═══ TOAST ═══
let tt;
function toast(msg,type){
  const el=document.getElementById('toast');
  document.getElementById('tmsg').textContent=msg;
  document.getElementById('tico').textContent='';
  el.className='toast'+(type?' '+type:'');
  void el.offsetWidth;el.classList.add('on');
  clearTimeout(tt);tt=setTimeout(()=>el.classList.remove('on'),3800);
}

// ═══ INIT ═══
(function init(){
  const now=new Date();
  const m=now.getMonth();
  const y=now.getFullYear()+543;
  const fy=m>=9?y+1:y;
  setVal('sel-month',m);setVal('sel-year',fy);
  setVal('e-sel-month',m);setVal('e-sel-year',fy);
  document.getElementById('period-label').textContent=getPeriod();
  document.getElementById('entry-pdis').textContent=getEntryPeriod();
  loadData();
})();