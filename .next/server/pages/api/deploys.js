"use strict";(()=>{var e={};e.id=13,e.ids=[13],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},8048:e=>{e.exports=import("@neondatabase/serverless")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},887:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{config:()=>c,default:()=>u,routeModule:()=>l});var s=r(1802),n=r(7153),o=r(6249),d=r(9109),i=e([d]);d=(i.then?(await i)():i)[0];let u=(0,o.l)(d,"default"),c=(0,o.l)(d,"config"),l=new s.PagesAPIRouteModule({definition:{kind:n.x.PAGES_API,page:"/api/deploys",pathname:"/api/deploys",bundlePath:"",filename:""},userland:d});a()}catch(e){a(e)}})},1004:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.d(t,{Z:()=>d});var s=r(8048),n=e([s]);s=(n.then?(await n)():n)[0];let o=null;process.env.DATABASE_URL&&(o=(0,s.neon)(process.env.DATABASE_URL));let d=o;a()}catch(e){a(e)}})},9109:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{default:()=>o});var s=r(1004),n=e([s]);s=(n.then?(await n)():n)[0];let d=e=>"string"==typeof e?e.replace(/[<>]/g,""):e;async function o(e,t){if(!s.Z)return"GET"===e.method?t.status(200).json([]):t.status(200).json({success:!0,message:"Offline mode"});if("POST"===e.method){let{contract_address:r,owner_address:a,network:n,tx_hash:o,status:i,token_name:u,token_symbol:c}=e.body;if(!r?.match(/^0x[a-fA-F0-9]{40}$/))return t.status(400).json({error:"Invalid contract address format"});if(!a?.match(/^0x[a-fA-F0-9]{40}$/))return t.status(400).json({error:"Invalid owner address format"});if(!o?.match(/^0x[a-fA-F0-9]{64}$/))return t.status(400).json({error:"Invalid transaction hash format"});try{return await (0,s.Z)`
        INSERT INTO deploys (
          contract_address, 
          owner_address, 
          network, 
          tx_hash, 
          status, 
          token_name, 
          token_symbol, 
          deployed_at
        )
        VALUES (
          ${r.toLowerCase()}, 
          ${a.toLowerCase()}, 
          ${d(n)}, 
          ${o.toLowerCase()}, 
          ${d(i||"success")}, 
          ${d(u)}, 
          ${d(c)}, 
          NOW()
        )
      `,t.status(201).json({success:!0})}catch(e){return console.error("[DATABASE_ERROR] deploys.js POST:",e),t.status(500).json({error:"Critical database failure"})}}if("GET"===e.method)try{let e=await (0,s.Z)`
        SELECT id, contract_address, network, token_name, token_symbol, deployed_at 
        FROM deploys 
        ORDER BY deployed_at DESC 
        LIMIT 50
      `;return t.status(200).json(e)}catch(e){return console.error("[DATABASE_ERROR] deploys.js GET:",e),t.status(500).json({error:"Failed to synchronize history"})}return t.status(405).json({error:"Method not allowed"})}a()}catch(e){a(e)}})},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var r=t(t.s=887);module.exports=r})();