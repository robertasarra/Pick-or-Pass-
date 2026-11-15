import test from 'node:test';import assert from 'node:assert/strict';
process.env.NODE_ENV='test';delete process.env.GEMINI_API_KEY;
const {app}=await import('../server/index.js');
const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
const url=`http://127.0.0.1:${server.address().port}`;
const get=path=>fetch(url+path);const post=(path,data)=>fetch(url+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});
test.after(()=>server.close());
test('health, config and real local image have correct content types',async()=>{assert.equal((await get('/api/health')).status,200);assert.equal((await(await get('/api/config')).json()).ga4MeasurementId,null);const image=await get('/assets/pv/viking-atlas.png');assert.match(image.headers.get('content-type'),/image\/png/);assert.ok((await image.arrayBuffer()).byteLength>100000)});
test('PV completes without Gemini, retains deterministic title, returns image and rejects replay',async()=>{
 const response=await post('/api/pv/round',{});assert.match(response.headers.get('cache-control'),/no-store/);const round=await response.json();assert.equal(round.questions.length,10);
 const answers=Object.fromEntries(round.questions.map(q=>[q.id,q.alternatives[0].id]));const result=await post('/api/pv/result',{sessionId:round.sessionId,answers});assert.equal(result.status,200);const data=await result.json();assert.equal(data.vikingPercent+data.princesoPercent,100);assert.ok(data.title&&data.cardImage.id);assert.equal((await post('/api/pv/result',{sessionId:round.sessionId,answers})).status,400);
});
test('Oracle completes in local mode',async()=>{const round=await(await get('/api/oracle/questions')).json();assert.equal(round.questions.length,10);const answers=Object.fromEntries(round.questions.map(q=>[q.id,q.options[0].id]));const response=await post('/api/oracle/result',{sessionId:round.sessionId,answers});assert.equal(response.status,200);assert.ok((await response.json()).diagnosis)});
test('Daily starts with zero actual votes',async()=>{const d=await(await get('/api/daily')).json();assert.deepEqual(d.votes,{a:0,b:0});assert.deepEqual(await(await post('/api/daily/vote',{choice:'a'})).json(),{a:100,b:0})});
