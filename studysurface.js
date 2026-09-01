function toggleGroup(btn){
  const g = btn.closest('.group');
  g.dataset.open = g.dataset.open === 'true' ? 'false' : 'true';
}
function toggleTask(btn){
  btn.closest('.task').classList.toggle('checked');
  refreshDay();
}
function refreshDay(){
  const all  = document.querySelectorAll('.timeline .task').length;
  const done = document.querySelectorAll('.timeline .task.checked').length;
  // their Progress component moves in eighths, so the meter rounds to the
  // nearest 12.5% while the fraction stays exact
  const steps = Math.round((done/all)*8);
  document.querySelectorAll('#day-meter .pip').forEach((p,i) =>
    p.classList.toggle('filled', i < steps));
  document.getElementById('day-frac').textContent = done+' of '+all;
  document.querySelector('.hidden-count').textContent = '('+done+')';
  document.getElementById('day-done').hidden = done !== all;
}
const DAYS = ['Monday, Jul 13','Tuesday, Jul 14','Wednesday, Jul 15','Thursday, Jul 16','Friday, Jul 17'];
let dayIdx = 2;                       // 2 = today
function stepDay(delta){
  dayIdx = delta === 0 ? 2 : Math.max(0, Math.min(DAYS.length-1, dayIdx + delta));
  document.getElementById('date-pill').innerHTML =
    DAYS[dayIdx] + ' <span class="caret-sm">\u25be</span>';
  document.getElementById('back-today').hidden = dayIdx === 2;
}
function hideDone(btn){
  const on = btn.getAttribute('aria-pressed') !== 'true';
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  document.querySelector('.timeline').classList.toggle('hide-done', on);
}
function pickSection(btn, key){
  btn.parentNode.querySelectorAll('button').forEach(b =>
    b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
  ['lr','rc'].forEach(k => {
    document.getElementById('goal-'+k).hidden   = k !== key;
    document.getElementById('metric-'+k).hidden = k !== key;
  });
}
function bm(btn){
  const on   = btn.getAttribute('aria-pressed') !== 'true';
  const kind = btn.dataset.kind, name = btn.dataset.name;
  const list = document.getElementById(kind === 'workout' ? 'my-workouts' : 'my-routines');
  const empty= document.getElementById(kind === 'workout' ? 'empty-workouts' : 'empty-routines');
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  btn.textContent = on ? '★' : '☆';
  if (on){
    const li = document.createElement('div');
    li.className = 'saved'; li.dataset.name = name;
    li.innerHTML = name + '<span class="drop">★</span>';
    list.appendChild(li);
  } else {
    const li = list.querySelector('[data-name="'+name+'"]');
    if (li) li.remove();
  }
  empty.hidden = list.children.length > 0;
}
function feel(btn){
  btn.setAttribute('aria-pressed', btn.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
}
refreshDay();
