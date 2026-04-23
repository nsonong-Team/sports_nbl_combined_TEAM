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
