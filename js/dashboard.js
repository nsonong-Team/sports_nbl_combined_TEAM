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
