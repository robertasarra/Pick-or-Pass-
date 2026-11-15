import test from 'node:test';
import assert from 'node:assert/strict';
import {createGeminiClient} from '../server/gemini.js';
const body={contents:[{parts:[{text:'test'}]}]};
function fixture(statuses,overrides={}){
 const calls=[],logs=[];let clock=1000;
 const client=createGeminiClient({env:{GEMINI_API_KEY:'secret-test',GEMINI_MODEL:'primary',GEMINI_FALLBACK_MODELS:'alternative'},now:()=>clock,sleep:async()=>{},log:x=>logs.push(x),fetcher:async(url,options)=>{
  calls.push({url,options});if(options.method==='GET')return {ok:true,json:async()=>({models:['primary','alternative'].map(x=>({name:`models/${x}`,supportedGenerationMethods:['generateContent']}))})};
  const status=statuses.shift()||200;return {ok:status===200,status,json:async()=>({ok:true})};
 },...overrides});return {client,calls,logs,advance:ms=>clock+=ms};
}
test('404 uses a distinct configured model and remembers unavailable primary',async()=>{
 const f=fixture([404,200,200]);await f.client.generate(body);await f.client.generate(body);
 assert.deepEqual(f.calls.filter(x=>x.options.method==='POST').map(x=>x.url.split('/').at(-1)),['primary:generateContent','alternative:generateContent','alternative:generateContent']);
 assert.ok(!JSON.stringify(f.logs).includes('secret-test'));assert.ok(f.calls.every(x=>!x.url.includes('secret-test')));
});
test('429 opens project circuit, makes no retry and recovers after cooldown',async()=>{
 const f=fixture([429,200]);await assert.rejects(f.client.generate(body),/quota_unavailable/);const count=f.calls.length;
 await assert.rejects(f.client.generate(body),/circuit_open/);assert.equal(f.calls.length,count);f.advance(300_001);await f.client.generate(body);
});
for(const status of [400,401,403])test(`${status} is not retried or hidden by model switching`,async()=>{
 const f=fixture([status]);await assert.rejects(f.client.generate(body));assert.equal(f.calls.filter(x=>x.options.method==='POST').length,1);
});
test('5xx retries once then opens circuit',async()=>{const f=fixture([503,503]);await assert.rejects(f.client.generate(body));assert.equal(f.calls.length,3);await assert.rejects(f.client.generate(body),/circuit_open/)});
test('no key and dynamic image default make zero external calls',async()=>{
 let calls=0;const f=createGeminiClient({env:{},fetcher:async()=>{calls++}});await assert.rejects(f.generate(body),/not_configured/);assert.equal(calls,0);
 const g=fixture([]);await assert.rejects(g.client.generate(body,{image:true}),/dynamic_images_disabled/);assert.equal(g.calls.length,0);
});
test('catalogue does not authorize arbitrary models',async()=>{const f=fixture([],{env:{GEMINI_API_KEY:'test',GEMINI_MODEL:'absent'}});await assert.rejects(f.client.generate(body),/no_available_configured_model/);assert.equal(f.calls.length,1)});
test('catalogue discovery follows pagination and uses capability validation',async()=>{
 const calls=[];const f=createGeminiClient({env:{GEMINI_API_KEY:'test',GEMINI_MODEL:'ready'},log:()=>{},fetcher:async(url,options)=>{calls.push(url);return {ok:true,json:async()=>options.method==='POST'?{ok:true}:url.includes('pageToken=')?{models:[{name:'models/ready',supportedGenerationMethods:['generateContent']}]}:{models:[{name:'models/ready',supportedGenerationMethods:['embedContent']}],nextPageToken:'second'}}}});
 assert.deepEqual(await f.generate(body),{ok:true});assert.equal(calls.length,3);assert.ok(calls[1].includes('pageToken=second'));
});
test('deadline aborts a stuck model catalogue',async()=>{const f=createGeminiClient({env:{GEMINI_API_KEY:'test'},log:()=>{},fetcher:async(_url,{signal})=>new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(new Error('aborted'))))});await assert.rejects(f.generate(body,{timeout:15}),/timeout/)});
