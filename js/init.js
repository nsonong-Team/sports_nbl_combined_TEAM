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
