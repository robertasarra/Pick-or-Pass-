export const PV_IMAGES=Object.freeze(['viking','princeso','intermediate'].flatMap(category=>Array.from({length:10},(_,index)=>Object.freeze({id:`pv-${category}-${String(index+1).padStart(2,'0')}`,category,src:`/assets/pv/${category}-atlas.png`,column:index%5,row:Math.floor(index/5),columns:5,rows:2,alt:category==='viking'?'Personagem fictício com iniciativa e parceria':category==='princeso'?'Personagem fictício terceirizando responsabilidades':'Personagem fictício com iniciativa inconsistente'}))));
export const imageCategory=scores=>scores.vikingPercent>=75?'viking':scores.vikingPercent<50?'princeso':'intermediate';
export function selectPvImage(scores,recentIds=[],rng=Math.random){
 const category=imageCategory(scores),recent=new Set(Array.isArray(recentIds)?recentIds.filter(x=>typeof x==='string').slice(-5):[]);
 const eligible=PV_IMAGES.filter(image=>image.category===category&&!recent.has(image.id));
 return eligible[Math.min(eligible.length-1,Math.max(0,Math.floor(rng()*eligible.length)))];
}
