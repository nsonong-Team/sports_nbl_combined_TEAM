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
