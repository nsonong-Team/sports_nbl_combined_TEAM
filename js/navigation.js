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
