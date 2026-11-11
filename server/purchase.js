'use strict';
const status=document.querySelector('#status'),output=document.querySelector('#license'),button=document.querySelector('#buy'),country=document.querySelector('#country'),price=document.querySelector('#price');
const names=new Intl.DisplayNames(['en'],{type:'region',fallback:'none'});
const countries=[];
for(const a of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')for(const b of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'){
  const code=a+b,name=names.of(code);
  if(name&&code!=='ZZ'&&code!=='EU'&&code!=='UN')countries.push({code,name});
}
countries.sort((a,b)=>a.name.localeCompare(b.name));
country.add(new Option('Choose your billing country',''));
for(const c of countries)country.add(new Option(c.name,c.code));
let quoteRequest=0;
country.onchange=async()=>{
  const request=++quoteRequest,selected=country.value;
  button.disabled=true;price.textContent='';status.textContent='';
  if(!selected)return;
  try{
    const r=await fetch('/pricing?country='+encodeURIComponent(selected)),data=await r.json();
    if(request!==quoteRequest)return;
    if(!r.ok)throw Error(data.error);
    const total=new Intl.NumberFormat(undefined,{style:'currency',currency:data.currency.toUpperCase()}).format(data.amount/100);
    price.textContent=total+' '+data.currency.toUpperCase()+' · one-time'+(data.offer==='launch'?' · launch offer':'');
    button.disabled=!data.sandbox;
    if(!data.sandbox)status.textContent='Checkout is not available yet.';
  }catch(e){if(request===quoteRequest)status.textContent=e.message;}
};
button.onclick=async()=>{
  button.disabled=true;country.disabled=true;
  try{
    const response=await fetch('/checkout?country='+encodeURIComponent(country.value),{method:'POST'}),data=await response.json();
    if(!response.ok)throw Error(data.error);
    localStorage.setItem('clario-claim-'+data.session,data.claimToken);location.assign(data.checkoutUrl);
  }catch(e){status.textContent=e.message;country.disabled=false;button.disabled=false;}
};
const session=new URL(location.href).searchParams.get('session_id');
if(session&&/^cs_test_[A-Za-z0-9_]+$/.test(session)){
  button.hidden=true;country.disabled=true;
  const token=localStorage.getItem('clario-claim-'+session);
  if(!token)status.textContent='Return using the same browser that started checkout. The private purchase claim is stored on that device.';
  else{
    let tries=0;
    async function check(){
      try{
        const r=await fetch('/licenses/'+session,{headers:{authorization:'Bearer '+token}}),data=await r.json();
        if(r.status===202&&tries++<30){status.textContent='Waiting for verified test payment…';setTimeout(check,2000);return;}
        if(!r.ok||!data.license)throw Error(data.error||'Payment confirmation is still pending. Refresh later.');
        output.value=data.license;status.textContent='Copy this test license and activate it in Clario Desktop → More tools → License status / activation. Keep a backup.';
      }catch(e){status.textContent=e.message;}
    }
    check();
  }
}
