const pages=[["home","Главная"],["lesson","Урок"],["rating","Рейтинг"],["review","Работа над ошибками"],["theory","Теория"],["practice","Практика"],["courses","Дополнительные курсы"],["homework","Домашнее задание"],["chat","Чат с преподавателем"],["motivation","Мотивация"],["gifts","Подарочки"],["favs","Избранное"],["sep"],["settings","Настройки"],["profile","Профиль"]];
const nav=document.getElementById('nav');
function buildNav(role){const p=pages.slice();if(role=='teacher')p.splice(1,0,["students","Ученики"]);
nav.innerHTML='<div class="logo">Вектор успеха</div>'+p.map(x=>x[0]=="sep"?'<div class="sep"></div>':`<button data-go="${x[0]}">${x[1]}</button>`).join('')+'<div class="sep"></div><button data-act="out">Выйти</button>'}
function go(id){document.querySelectorAll('section').forEach(s=>s.classList.toggle('on',s.id==id));nav.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.go==id));scrollTo(0,0);if(cur&&cur.r=='teacher'){if(id=='rating'){rsel.value=curCls;renderRating()}if(id=='homework'){hwsel.value=curCls}}if(id=='homework')renderHW()}
document.addEventListener('click',e=>{const t=e.target.closest('[data-go]');if(t)go(t.dataset.go)});
const Q=[["Сколько будет 50% от 80?",["20","40","60"],1],["Как записать 0,3 в процентах?",["3%","30%","0,3%"],1],["Чему равна 1/4 от 100?",["25","40","75"],0]];
let qi=0,sc=0;
function showQ(){const q=Q[qi];qn.textContent=(qi+1)+' / '+Q.length;qt.textContent=q[0];qr.textContent='';qnext.hidden=true;
qo.innerHTML=q[1].map((o,i)=>`<button class="opt" data-i="${i}">${o}</button>`).join('')}
qo.addEventListener('click',e=>{const b=e.target.closest('.opt');if(!b||qnext.hidden==false)return;const i=+b.dataset.i,c=Q[qi][2];
b.classList.add(i==c?'ok':'bad');qo.children[c].classList.add('ok');if(i==c)sc++;qr.textContent=i==c?'Верно':'Не совсем. Верный ответ выделен.';qnext.hidden=false;qnext.textContent=qi==Q.length-1?'Завершить':'Дальше'});
qnext.onclick=()=>{if(qi<Q.length-1){qi++;showQ()}else{qo.innerHTML='';qt.textContent='Результат: '+sc+' из '+Q.length;qr.textContent='';qnext.textContent='Пройти заново';qnext.onclick=()=>{qi=0;sc=0;showQ();qnext.onclick=arguments.callee}}};
showQ();
const T=[
["Алгебра","Найдите значение выражения (3,6 − 1,2) · 2,5 : 0,4.","15","Сначала скобки: 2,4 · 2,5 = 6, затем 6 : 0,4 = 15."],
["Алгебра","Решите уравнение x² − 5x + 6 = 0. В ответе запишите больший корень.","3","Корни 2 и 3 (по теореме Виета: сумма 5, произведение 6)."],
["Алгебра","Товар стоил 2400 руб. Цену снизили на 15%. Сколько рублей стоит товар теперь?","2040","2400 · 0,85 = 2040."],
["Алгебра","Найдите значение выражения 2⁻³ · 16.","2","2⁻³ · 2⁴ = 2¹ = 2."],
["Алгебра","Тариф: 350 руб. в месяц за 300 минут, каждая минута сверх пакета стоит 2 руб. Абонент проговорил 345 минут. Сколько рублей он заплатил?","440","Сверх пакета 45 минут: 350 + 45 · 2 = 440."],
["Геометрия","Катеты прямоугольного треугольника равны 6 и 8. Найдите гипотенузу.","10","По теореме Пифагора: √(36 + 64) = 10."],
["Геометрия","Площадь прямоугольника равна 48, одна из сторон равна 6. Найдите периметр.","28","Другая сторона 48 : 6 = 8, периметр 2 · (6 + 8) = 28."],
["Геометрия","Угол при вершине равнобедренного треугольника равен 40°. Найдите угол при основании (в градусах).","70","(180 − 40) : 2 = 70."],
["Геометрия","Радиус круга равен 7. Чему равна его площадь, делённая на π?","49","S = πr², значит S : π = 49."]];
let topic="Все",ti=0;
const list=()=>T.filter(t=>topic=="Все"||t[0]==topic);
function showT(){const l=list(),t=l[ti];ptitle.textContent=t[0];pcount.textContent=(ti+1)+" / "+l.length;ptext.textContent=t[1];pin.value="";pres.textContent="";
chips.innerHTML=["Все","Алгебра","Геометрия"].map(c=>`<button class="btn ${c==topic?"":"alt"}" data-t="${c}">${c}</button>`).join("")}
chips.addEventListener("click",e=>{const b=e.target.closest("[data-t]");if(b){topic=b.dataset.t;ti=0;showT()}});
pchk.onclick=()=>{const t=list()[ti],v=pin.value.replace(",",".").trim();pres.textContent=v==t[2]?"Верно. "+t[3]:"Пока не то. Подсказка: "+t[3].split(/[.:]/)[0]+"."};
pnext.onclick=()=>{ti=(ti+1)%list().length;showT()};
pprev.onclick=()=>{ti=(ti-1+list().length)%list().length;showT()};
showT();
function send(){const t=cin.value.trim();if(!t)return;msgs.insertAdjacentHTML('beforeend','<div class="msg me"></div>');msgs.lastChild.textContent=t;cin.value='';msgs.scrollTop=1e5}
csend.onclick=send;cin.onkeydown=e=>{if(e.key=='Enter')send()};
dk.onchange=()=>document.documentElement.dataset.theme=dk.checked?'dark':'light';

const mem={};
const st={get(k){try{return localStorage.getItem(k)}catch(e){return mem[k]??null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){mem[k]=v}},del(k){try{localStorage.removeItem(k)}catch(e){delete mem[k]}}};
const users=()=>{try{return JSON.parse(st.get('ts_users')||'[]')}catch(e){return[]}};
async function hash(p){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('ts:'+p));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return btoa(unescape(encodeURIComponent(p)))}}
let role='student',mode='login';
const F={student:[["surname","Фамилия","text"],["name","Имя","text"],["cls","Класс (например, 9Б)","text"],["pw","Пароль","password"]],teacher:[["login","Логин","text"],["pw","Пароль","password"]]};
function drawForm(){afields.innerHTML=F[role].map(f=>`<label>${f[1]}<input id="f_${f[0]}" type="${f[2]}" autocomplete="${f[2]=='password'?(mode=='reg'?'new-password':'current-password'):'off'}"></label>`).join('');
aerr.textContent='';asub.textContent=mode=='login'?'Войти':'Создать аккаунт';
arole.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.r==role));amode.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.m==mode))}
arole.onclick=e=>{const b=e.target.closest('[data-r]');if(b){role=b.dataset.r;drawForm()}};
amode.onclick=e=>{const b=e.target.closest('[data-m]');if(b){mode=b.dataset.m;drawForm()}};
const val=id=>document.getElementById('f_'+id).value.trim();
const norm=x=>x.toLowerCase().replace(/\s+/g,' ');
asub.onclick=async()=>{
const d={};F[role].forEach(f=>d[f[0]]=val(f[0]));
if(F[role].some(f=>!d[f[0]])){aerr.textContent='Заполните все поля.';return}
const key=role=='teacher'?norm(d.login):norm(d.surname+'|'+d.name+'|'+d.cls);
const h=await hash(d.pw),all=users(),u=all.find(x=>x.role==role&&x.key==key);
if(mode=='reg'){if(d.pw.length<4){aerr.textContent='Пароль должен быть не короче 4 символов.';return}
if(u){aerr.textContent='Такой аккаунт уже есть. Перейдите во вкладку «Вход».';return}
all.push({role,key,h,d:role=='teacher'?{login:d.login}:{surname:d.surname,name:d.name,cls:d.cls}});st.set('ts_users',JSON.stringify(all));enter(role,key)}
else{if(!u||u.h!=h){aerr.textContent='Неверные данные или аккаунт не создан.';return}enter(role,key)}};
let cur=null,curCls='10А';
const CLASSES=['10А','10Б','10В','10Г','11А','11Б','11В','11Г'];
[rsel,hwsel].forEach(el=>el.innerHTML=CLASSES.map(c=>`<option>${c}</option>`).join(''));
const hws=()=>{try{return JSON.parse(st.get('ts_hw')||'{}')}catch(e){return{}}};
function renderRating(){rtitle.textContent='Рейтинг класса '+curCls;rlist.innerHTML=rankHTML(ranking(curCls),null)}
rsel.onchange=()=>{curCls=rsel.value;renderRating()};
hwsel.onchange=()=>{curCls=hwsel.value;renderHW()};
const fmtD=d=>d?d.split('-').reverse().join('.'):'';
let customT=[];
const bankItems=()=>T.map(t=>({tag:t[0],q:t[1],a:t[2],s:t[3]})).concat(customT);
function renderBank(){const on=new Set([...hwbank.querySelectorAll('input:checked')].map(i=>+i.dataset.b));
hwbank.innerHTML=bankItems().map((t,i)=>`<label style="display:flex;gap:10px;align-items:flex-start;margin:8px 0;color:var(--ink)"><input type="checkbox" data-b="${i}" ${on.has(i)||i>=T.length&&i==T.length+customT.length-1&&hwbank.dataset.new?'checked':''}><span><span class="tag" style="margin-right:6px">${esc(t.tag)}</span>${esc(t.q)}</span></label>`).join('');hwbank.dataset.new=''}
hwcadd.onclick=()=>{const q=hwcq.value.trim(),a=hwca.value.trim();if(!q||!a){hwerr.textContent='Для своего задания нужны текст и ответ.';return}hwerr.textContent='';
customT.push({tag:'ФИПИ',q,a,s:''});hwcq.value=hwca.value='';hwbank.dataset.new='1';renderBank()};
renderBank();
function renderProgress(){const c=curCls,hl=(hws()[clsOf(c)]||[]).filter(h=>(h.tasks||[]).length),sl=ranking(c).slice().sort((a,b)=>a.d.surname.localeCompare(b.d.surname,'ru'));
if(!hl.length){hwprog.innerHTML='';return}
hwprog.innerHTML=`<h2 style="margin-top:24px">Выполнение, ${esc(c)}</h2><p style="color:var(--mute);margin-top:0">Решено заданий из выданных каждым учеником.</p><div class="card" style="overflow-x:auto">`+(sl.length?`<table><tr><th>Ученик</th>${hl.map(h=>`<th>${esc(h.title)}</th>`).join('')}<th>Всего</th></tr>`+sl.map(u=>{let d=0,n=0;const cells=hl.map(h=>{const k=h.tasks.filter((_,i)=>(u.done||[]).includes('h'+h.id+'_'+i)).length;d+=k;n+=h.tasks.length;return `<td><span class="tag" style="background:${k==h.tasks.length?'var(--ok);color:#fff':k?'var(--sand)':'var(--rose)'}">${k}/${h.tasks.length}</span></td>`}).join('');return `<tr><td>${esc(u.d.surname+' '+u.d.name)}</td>${cells}<td><b>${Math.round(d/n*100)}%</b></td></tr>`}).join('')+'</table>':'<p>В этом классе пока нет учеников.</p>')+'</div>'}
function renderHW(){if(!cur)return;if(cur.r=='teacher')renderProgress();const t=cur.r=='teacher';let c=curCls;
if(!t){const u=users().find(x=>x.role=='student'&&x.key==cur.key);c=u?u.d.cls:''}
const l=(hws()[clsOf(c)]||[]);
hwlist.innerHTML=l.length?l.slice().reverse().map(h=>`<div class="card" style="margin-bottom:12px"><div class="row"><h3 style="margin:0">${esc(h.title)}</h3>${t?`<button class="btn alt" data-del="${h.id}" aria-label="Удалить задание">Удалить</button>`:''}</div>${h.text?`<p style="white-space:pre-wrap;color:var(--ink)">${esc(h.text)}</p>`:''}${(h.tasks||[]).map((k,i)=>`<div style="border-top:1px solid var(--line);padding:10px 0"><div style="color:var(--ink)">${i+1}. ${esc(k.q)}</div>${t?`<div style="color:var(--mute);font-size:14px;margin-top:4px">Ответ: ${esc(k.a)}</div>`:`<div class="row" style="margin-top:8px"><input type="text" class="fld" style="margin:0" id="a_${h.id}_${i}" placeholder="Ваш ответ" aria-label="Ответ на задание ${i+1}"><button class="btn" data-chk="${h.id}:${i}">Проверить</button></div><p id="r_${h.id}_${i}" style="margin:6px 0 0"></p>`}</div>`).join('')}<span class="tag">${h.due?'Сдать до '+fmtD(h.due):'Без срока'}</span></div>`).join(''):`<div class="card"><p>${t?'Для класса '+esc(c)+' заданий пока нет.':'Домашних заданий для вашего класса пока нет.'}</p></div>`}
hwadd.onclick=()=>{const title=hwt.value.trim(),items=bankItems(),tasks=[...hwbank.querySelectorAll('input:checked')].map(i=>{const k=items[+i.dataset.b];return{q:k.q,a:k.a,s:k.s}});
if(!title){hwerr.textContent='Введите название задания.';return}
if(!tasks.length&&!hwx.value.trim()){hwerr.textContent='Отметьте задания из банка или напишите описание.';return}hwerr.textContent='';
const all=hws(),k=clsOf(hwsel.value);(all[k]=all[k]||[]).push({id:Date.now(),title,text:hwx.value.trim(),due:hwd.value,tasks});st.set('ts_hw',JSON.stringify(all));hwt.value=hwx.value=hwd.value='';hwbank.querySelectorAll('input').forEach(i=>i.checked=false);renderHW()};
hwlist.addEventListener('click',e=>{const d=e.target.closest('[data-del]');if(d){const all=hws(),k=clsOf(hwsel.value);all[k]=(all[k]||[]).filter(h=>h.id!=d.dataset.del);st.set('ts_hw',JSON.stringify(all));renderHW();return}
const b=e.target.closest('[data-chk]');if(!b||!cur||cur.r!='student')return;const[id,i]=b.dataset.chk.split(':'),u=users().find(x=>x.role=='student'&&x.key==cur.key),h=(hws()[clsOf(u.d.cls)]||[]).find(x=>x.id==id);if(!h)return;
const k=h.tasks[+i],v=document.getElementById('a_'+id+'_'+i).value.replace(',','.').trim(),r=document.getElementById('r_'+id+'_'+i);
if(v==k.a){const p=hwPts(h.due);r.textContent='Верно.'+(k.s?' '+k.s:'')+((u.done||[]).includes('h'+id+'_'+i)?'':(p?' +'+p+' баллов':' Срок сдачи прошёл больше 24 часов назад, баллы не начислены.'));award('h'+id+'_'+i,p)}else r.textContent=k.s?'Пока не то. Подсказка: '+k.s.split(/[.:]/)[0]+'.':'Пока не то. Проверьте вычисления.'});
// Кнопка «Оплатить курс»: в макете оплата не подключена, просто показываем сообщение под карточкой
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-pay]');                // нажали ли на кнопку оплаты
  if(!b)return;                                           // если нет — ничего не делаем
  b.parentElement.querySelector('.paymsg').textContent='Здесь откроется страница оплаты картой. В макете оплата не подключена.';
});
// Баллы за одно задание ДЗ: вовремя — 10, опоздание до 24 часов — 5, больше — 0.
// Дедлайн — конец дня, указанного в поле «Срок сдачи» (23:59:59).
function hwPts(due){
  if(!due)return 10;                              // срок не указан — полные баллы
  const deadline=new Date(due+'T23:59:59');       // момент дедлайна
  const late=Date.now()-deadline.getTime();       // на сколько миллисекунд опоздал
  if(late<=0)return 10;                           // сдал вовремя
  if(late<=24*60*60*1000)return 5;                // опоздал не больше чем на 24 часа
  return 0;                                       // опоздал больше чем на 24 часа
}
const clsOf=c=>norm(c).replace(/\s/g,'').replace(/[abvg]/g,m=>({a:'а',b:'б',v:'в',g:'г'})[m]);
function ranking(c){return users().filter(x=>x.role=='student'&&clsOf(x.d.cls)==clsOf(c)).sort((a,b)=>(b.pts||0)-(a.pts||0)||a.d.surname.localeCompare(b.d.surname,'ru'))}
function rankHTML(list,me){return list.length?list.map((x,i)=>`<div class="rank"${i==list.length-1?' style="border:0"':''}><b>${i+1}</b><span style="flex:1">${esc(x.d.surname+' '+x.d.name)}${x.key==me?' (вы)':''}</span><span class="tag">Баллы: ${x.pts||0}</span></div>`).join(''):'<p>В этом классе пока нет учеников.</p>'}
function award(id,p){if(!cur||cur.r!='student')return;const all=users(),u=all.find(x=>x.role=='student'&&x.key==cur.key);if(!u)return;u.done=u.done||[];if(u.done.includes(id))return;u.done.push(id);u.pts=(u.pts||0)+p;st.set('ts_users',JSON.stringify(all));studentView(u)}
function studentView(u){const list=ranking(u.d.cls),place=list.findIndex(x=>x.key==u.key)+1,pts=u.pts||0;
hello.textContent='Добрый день, '+u.d.name;hsub.textContent='Спокойно и по шагам: сегодня один урок и немного практики.';
hgrid.innerHTML=`<div class="card go" data-go="lesson"><h3>Урок дня</h3><p>Тема 13: Дроби и проценты</p><div class="bar"><i style="width:35%"></i></div><span class="tag">1 из 3 шагов</span></div><div class="card go" data-go="practice"><h3>Практика</h3><p>Задачи в формате ОГЭ</p></div><div class="card go" data-go="review"><h3>Работа над ошибками</h3><p>3 задания на повтор</p></div><div class="card go" data-go="homework"><h3>Домашнее задание</h3><p>${(hws()[clsOf(u.d.cls)]||[]).length} в списке</p></div><div class="card go" data-go="rating"><h3>Рейтинг ${esc(u.d.cls)}</h3><p>Вы на ${place} месте из ${list.length}</p></div>`;
pcard.innerHTML=`<div class="row" style="justify-content:flex-start"><div style="width:64px;height:64px;border-radius:50%;background:var(--sky);display:grid;place-items:center;font:600 24px Lora,serif">${esc(u.d.name[0].toUpperCase())}</div><div><h3 style="margin:0">${esc(u.d.surname+' '+u.d.name)}</h3><span style="color:var(--mute)">Класс ${esc(u.d.cls)}</span></div></div><p>Верно решено заданий: <b>${(u.done||[]).length}</b><br>Баллы: <b>${pts}</b><br>Место в классе: <b>${place}</b></p>`;
rtitle.textContent='Рейтинг класса '+u.d.cls;rlist.innerHTML=rankHTML(list,u.key);
gpts.textContent=pts;document.querySelectorAll('.gift').forEach(g=>{const ok=pts>=+g.dataset.need;g.classList.toggle('lock',!ok);g.querySelector('.tag').textContent=ok?'Открыто':'Ещё '+(g.dataset.need-pts)})}
function esc(t){const p=document.createElement('p');p.textContent=t;return p.innerHTML}
function enter(r,key){const u=users().find(x=>x.role==r&&x.key==key);if(!u)return;st.set('ts_session',JSON.stringify({r,key}));cur={r,key};
document.body.classList.remove('auth');buildNav(r);
if(r=='teacher'){hello.textContent='Добрый день, '+u.d.login;hsub.textContent='Выберите класс, чтобы перейти к его уроку.';rsw.hidden=false;hwform.hidden=false;
hgrid.innerHTML=[10,11].map(n=>['А','Б','В','Г'].map(l=>`<div class="card go" tabindex="0" role="button" data-cls="${n}${l}"><h3>${n}${l}</h3><p>Перейти к уроку</p></div>`).join('')).join('');
pcard.innerHTML=`<h3 style="margin:0">${esc(u.d.login)}</h3><span style="color:var(--mute)">Учитель</span>`;
const st2=users().filter(x=>x.role=='student');
slist.innerHTML=st2.length?'<table><tr><th>Фамилия</th><th>Имя</th><th>Класс</th></tr>'+st2.map(x=>`<tr><td>${esc(x.d.surname)}</td><td>${esc(x.d.name)}</td><td>${esc(x.d.cls)}</td></tr>`).join('')+'</table>':'<p>Пока никто не зарегистрировался в этом браузере.</p>'}
else{rsw.hidden=true;hwform.hidden=true;studentView(u)}
go('home')}
function openClass(c){cptitle.textContent='Урок: '+c;curCls=c;cphw.textContent=((hws()[clsOf(c)]||[]).length)+' заданий выдано';
cplist.innerHTML=rankHTML(ranking(c),null);go('classpage')}
document.addEventListener('click',e=>{const c=e.target.closest('[data-cls]');if(c)openClass(c.dataset.cls)});
document.addEventListener('keydown',e=>{const c=e.target.closest&&e.target.closest('[data-cls]');if(c&&(e.key=='Enter'||e.key==' ')){e.preventDefault();openClass(c.dataset.cls)}});
document.addEventListener('click',e=>{if(e.target.closest('[data-act=out]')){st.del('ts_session');cur=null;document.body.classList.add('auth');drawForm()}});
drawForm();
try{const ss=JSON.parse(st.get('ts_session')||'null');if(ss)enter(ss.r,ss.key)}catch(e){}
