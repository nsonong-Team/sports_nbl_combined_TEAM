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
