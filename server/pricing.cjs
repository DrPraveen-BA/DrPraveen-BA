'use strict';
const PRICES=Object.freeze({
  IN:Object.freeze({currency:'inr',launch:99900,standard:149900,provider:'Razorpay'}),
  WORLD:Object.freeze({currency:'usd',launch:2900,standard:3900,provider:'Paddle'})
});
function quote(country,launchEndsAt,now=Date.now()){
  if(typeof country!=='string'||!/^([A-Z]{2})$/.test(country))throw Error('Choose a billing country');
  const region=country==='IN'?'IN':'WORLD',p=PRICES[region];
  const launch=Number.isFinite(launchEndsAt)&&now<launchEndsAt;
  return {country,region,currency:p.currency,amount:launch?p.launch:p.standard,offer:launch?'launch':'standard',provider:p.provider};
}
module.exports={PRICES,quote};
