"""Mobile browser emulation, not physical-device installation evidence."""
import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
BASE=os.environ.get('POP_TEST_BASE_URL','http://127.0.0.1:3000')
async def main():
 reports=[]
 async with async_playwright() as p:
  devices={'chromium':'Pixel 5','webkit':'iPhone 13'}
  for engine in os.environ.get('POP_TEST_ENGINES','chromium').split(','):
   device=devices[engine]
   browser_type=getattr(p,engine)
   options={'headless':True}
   if engine=='chromium':
    options.update(args=['--no-sandbox'])
    if os.environ.get('POP_BROWSER_EXECUTABLE'):options['executable_path']=os.environ['POP_BROWSER_EXECUTABLE']
   browser=await browser_type.launch(**options)
   context=await browser.new_context(**p.devices[device],accept_downloads=True)
   await context.add_init_script("""Object.defineProperty(navigator,'canShare',{value:data=>Boolean(data.files?.length)});Object.defineProperty(navigator,'share',{value:async data=>{window.testShare={files:data.files?.map(f=>({type:f.type,size:f.size})),url:data.url}}});""")
   page=await context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   await page.goto(BASE+'/');await page.get_by_text('Recusar métricas',exact=True).click()
   await page.click('[data-open="pvIntro"]');await page.click('#pvStart')
   for _ in range(10):await page.locator('#pvAnswers button').first.click()
   await page.wait_for_selector('#pvResult.active #pvScene');await page.wait_for_function('document.querySelector("#pvScene").naturalWidth>0')
   await page.click('#pvShare');await page.wait_for_function('window.testShare?.files?.[0]?.size>0')
   shared=await page.evaluate('window.testShare');assert shared['files'][0]['type']=='image/png'
   async with page.expect_download() as info:await page.click('#pvDownload')
   downloaded=await info.value;assert await downloaded.failure() is None
   screen=await page.evaluate('({overflow:document.documentElement.scrollWidth>innerWidth,fit:getComputedStyle(document.querySelector("#pvScene")).objectFit})');assert not screen['overflow'];assert screen['fit']=='contain'
   await page.screenshot(path=f'evidence/{engine}-mobile.png',full_page=True)
   # Load every real sprite through the same extraction function used by the game.
   tiles=await page.evaluate("""async()=>{let checked=0;for(const category of ['viking','princeso','intermediate'])for(let index=0;index<10;index++){const result={cardImage:{id:`test-${category}-${index}`,src:`/assets/pv/${category}-atlas.png`,columns:5,rows:2,column:index%5,row:Math.floor(index/5)}};await preparePvImage(result);if(!result.cardImageDataUrl.startsWith('data:image/png;base64,'))throw Error('Missing PNG');checked++;}return checked}""")
   await page.wait_for_function('navigator.serviceWorker.controller!==null')
   cached=await page.evaluate("""async()=>{const result=[];for(const key of await caches.keys())for(const request of await (await caches.open(key)).keys())result.push(new URL(request.url).pathname);return result}""")
   assert not any(path.startswith('/api/') for path in cached)
   assert not errors
   reports.append({'engine':engine,'emulated_device':device,'shared_file':shared,'download':downloaded.suggested_filename,'screen':screen,'tiles_rendered':tiles,'api_not_cached':True,'errors':errors,'physical_installation_tested':False,'native_share_sheet_tested':False})
   Path('evidence/mobile-results.json').write_text(json.dumps(reports,indent=2))
   await browser.close()
 Path('evidence/mobile-results.json').write_text(json.dumps(reports,indent=2))
 print(json.dumps(reports))
asyncio.run(main())
