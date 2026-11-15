import test from 'node:test';import assert from 'node:assert/strict';import {statSync,readFileSync} from 'node:fs';import {PV_IMAGES,selectPvImage,imageCategory} from '../server/pv-images.js';
test('30 distinct photographic tiles, ten per category, backed by real PNG files',()=>{
 assert.equal(PV_IMAGES.length,30);assert.equal(new Set(PV_IMAGES.map(x=>x.id)).size,30);
 for(const category of ['viking','princeso','intermediate'])assert.equal(PV_IMAGES.filter(x=>x.category===category).length,10);
 for(const item of PV_IMAGES){const path=`public${item.src}`;assert.ok(statSync(path).size>100_000);assert.equal(readFileSync(path).subarray(1,4).toString(),'PNG');assert.ok(item.column<5&&item.row<2)}
});
test('category respects existing score boundaries',()=>{for(const [score,category] of [[0,'princeso'],[49,'princeso'],[50,'intermediate'],[74,'intermediate'],[75,'viking'],[100,'viking']])assert.equal(imageCategory({vikingPercent:score}),category)});
test('rotation excludes last five IDs for 1000 rounds per category',()=>{
 for(const score of [0,50,100]){let recent=[];const seen=new Set();for(let i=0;i<1000;i++){const item=selectPvImage({vikingPercent:score},recent);assert.ok(!recent.includes(item.id));assert.equal(item.category,imageCategory({vikingPercent:score}));seen.add(item.id);recent=[...recent,item.id].slice(-5)}assert.equal(seen.size,10)}
});
