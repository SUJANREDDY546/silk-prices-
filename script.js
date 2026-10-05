// script.js - renders the rates table, filters and sorting
const D=window.SILK_DATA; // loaded from data.js
const app=document.getElementById('app');
const S={q:'',st:'all',sort:'arr',edit:false};
const f=n=>Number(n).toLocaleString('en-IN');
const avg=r=>(r[3]+r[4])/2;
let sz=16;function fs(d){sz=d?Math.min(22,Math.max(13,sz+d*2)):16;document.documentElement.style.fontSize=sz+'px'}
function rows(){let a=D.rows.filter(r=>(S.st==='all'||r[1]===S.st)&&(r[0]+r[2]).toLowerCase().includes(S.q.toLowerCase()));
 const k={arr:(x,y)=>y[7]-x[7],hi:(x,y)=>y[4]-x[4],lo:(x,y)=>x[3]-y[3],name:(x,y)=>x[0].localeCompare(y[0]),area:(x,y)=>x[2].localeCompare(y[2])||x[0].localeCompare(y[0])};
 return a.sort(k[S.sort]);}
function render(){
 const a=rows(),all=D.rows,tot=a.reduce((s,r)=>s+r[7],0),top=[...a].sort((x,y)=>y[4]-x[4])[0];
 const wavg=a.length?Math.round(a.reduce((s,r)=>s+avg(r)*r[7],0)/(tot||1)):0;
 const d=new Date(D.date+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
 document.getElementById('upd').textContent='Rates last updated for: '+d+(D.sample?' (SAMPLE DATA)':'');
 const mx=Math.max(1,...a.map(r=>r[7]));
 const li=(arr,fn)=>arr.map((r,i)=>`<li><span>${i+1}. ${r[0]}</span><b>${fn(r)}</b></li>`).join('')||'<li>No data</li>';
 const byP=[...a].sort((x,y)=>y[4]-x[4]).slice(0,5),byA=[...a].sort((x,y)=>y[7]-x[7]).slice(0,5);
 const sts=[...new Set(a.map(r=>r[1]))].map(s=>{const g=a.filter(r=>r[1]===s),t=g.reduce((q,r)=>q+r[7],0);return `<li><span>${s} (${g.length})</span><b>${f(t)} kg</b></li>`}).join('')||'<li>No data</li>';
 const side=`<div class="box"><h3>Top 5 – Highest Rate</h3><ul class="rank">${li(byP,r=>'₹'+r[4])}</ul></div>
 <div class="box"><h3>Top 5 – Arrival</h3><ul class="rank">${li(byA,r=>f(r[7])+' kg')}</ul></div>
 <div class="box"><h3>State-wise Arrival</h3><ul class="rank">${sts}</ul></div>
 <div class="box"><h3>Contact / Help</h3><div class="b" style="font-size:.85rem">Rates wrong or missing? Contact the site administrator.<br><b>Phone:</b> add your number here<br><b>Email:</b> add your email here</div></div>`;

 let h=`<div class="tick"><b>LATEST</b><div>Rates for ${d}${D.sample?' (sample data)':''} · Total arrival ${f(tot)} kg across ${a.length} markets · Highest cross-breed rate ₹${top?top[4]:'–'}/kg at ${top?top[0]:'–'} · Please verify rates with the market office before sale</div></div>
 <div class="wrap" id="main"><aside><div class="box side"><h3>Quick Links</h3><a href="#rates">Today's Market Rates</a><a href="#arrivals">Cocoon Arrivals</a><a href="#markets">Market Directory</a><a href="#about">Disclaimer</a></div>
 <div class="box"><h3>Select Area</h3><div class="b"><select id="st" style="width:100%;padding:6px"><option value="all">All areas</option><option>Karnataka</option><option>Andhra Pradesh</option></select></div></div>${side}</aside>
 <main><div class="kp"><div><b>${d}</b><span>Rates date</span></div><div><b>${f(tot)} kg</b><span>Total cocoons arrived</span></div><div><b>₹${f(wavg)}/kg</b><span>Weighted avg (cross-breed)</span></div><div><b>${top?'₹'+top[4]:'–'}</b><span>Highest: ${top?top[0]:'–'}</span></div></div>
 <section class="box" id="rates"><h2>Daily Cocoon Market Rates (₹ per kg) &amp; Arrivals</h2>
 <div class="bar"><input id="q" placeholder="Search market / district…" value="${S.q}"><select id="so"><option value="arr">Sort: Arrival (high–low)</option><option value="hi">Sort: Highest price</option><option value="lo">Sort: Lowest price</option><option value="name">Sort: Market A–Z</option><option value="area">Sort: District</option></select><button id="ed" style="display:none">Update today's rates</button></div>
 <div class="tw"><table><thead><tr><th>S.No</th><th>Market</th><th>District</th><th>State</th><th>Cross-breed (Min–Max)</th><th>Bivoltine (Min–Max)</th><th>Arrival (kg)</th><th>Change vs yesterday</th></tr></thead><tbody>`;
 a.forEach((r,n)=>{const i=all.indexOf(r),df=avg(r)-r[8],p=Math.round(df/r[8]*1000)/10;
  const cells=`<td>${r[3]} – ${r[4]}</td><td>${r[5]} – ${r[6]}</td><td>${f(r[7])}</td><td class="${df>=0?'up':'dn'}">${df>=0?'▲':'▼'} ${Math.abs(p)}%</td>`;
  h+=`<tr><td style="text-align:left">${n+1}</td><td><b>${r[0]}</b></td><td>${r[2]}</td><td>${r[1]}</td>${cells}</tr>`});
 if(!a.length)h+='<tr><td colspan="8" style="text-align:center">No markets match.</td></tr>';
 h+=`</tbody></table></div>`;
  h+=`<div class="note">Cross-breed (CB) and bivoltine (BV) cocoon rates are per kg. Rates are indicative.</div></section>
 <section class="box" id="arrivals"><h2>Cocoon Arrivals by Market (kg)</h2><div class="b">${a.map(r=>`<div class="bw"><span>${r[0]}</span><i style="width:${Math.round(r[7]/mx*100)}%"></i><b style="text-align:right">${f(r[7])}</b></div>`).join('')||'No data'}</div></section>
 <section class="box" id="markets"><h2>Market Directory (by District)</h2><div class="b dir">${Object.entries(a.reduce((o,r)=>((o[r[2]+', '+r[1]]??=[]).push(r[0]),o),{})).map(([k,v])=>`<div><b>${k}</b><ul>${v.map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('')}</div></section>
 <section class="box" id="about"><h2>About / Disclaimer</h2><div class="b" style="font-size:.9rem">This portal gathers daily silk cocoon rates and arrivals from the cocoon markets of Chittoor region (Andhra Pradesh) and neighbouring Karnataka districts so that reelers and farmers can compare markets in one place. Figures are entered daily by the site administrator. This is not an official government website; always confirm with the concerned Government Cocoon Market / Department of Sericulture before buying or selling.</div></section></main></div>`;
 app.innerHTML=h;
 q.oninput=e=>{S.q=e.target.value;const p=e.target.selectionStart;render();q.focus();q.setSelectionRange(p,p)};
 st.value=S.st;so.value=S.sort;st.onchange=e=>{S.st=e.target.value;render()};so.onchange=e=>{S.sort=e.target.value;render()};
  
}
render();