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
