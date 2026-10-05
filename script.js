const D=window.SILK_DATA;
const app=document.getElementById('app');
app.innerHTML='<h1>Silk Cocoon Market Information Portal</h1>';
if(D?.date) app.innerHTML += '<p>Market date: '+D.date+'</p>';
