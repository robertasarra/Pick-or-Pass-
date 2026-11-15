import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
BASE=os.environ.get('POP_TEST_BASE_URL','http://127.0.0.1:3000')
async def main():
 async with async_playwright() as p:
  context=await p.chromium.launch_persistent_context('/tmp/pop-profile',accept_downloads=True,executable_path=os.environ.get('POP_BROWSER_EXECUTABLE',p.chromium.executable_path),headless=True,args=['--no-sandbox'])
  page=await context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto(BASE+'/');
  if await page.get_by_text('Recusar métricas',exact=True).count():await page.get_by_text('Recusar métricas',exact=True).click()
  await page.click('[data-open="pvIntro"]');await page.click('#pvStart')
  for i in range(10):await page.locator('#pvAnswers button').first.click()
  await page.wait_for_selector('#pvResult.active #pvScene');await page.wait_for_function('document.querySelector("#pvScene").naturalWidth>0')
  Path('evidence').mkdir(exist_ok=True)
  results=[]
  for w,h in [(320,568),(390,844),(844,390),(1366,768)]:
   await page.set_viewport_size({'width':w,'height':h});await page.screenshot(path=f'evidence/pv-{w}x{h}.png',full_page=True)
   data=await page.evaluate('''()=>({overflow:document.documentElement.scrollWidth>innerWidth,loaded:document.querySelector('#pvScene').naturalWidth>0,emojiCount:document.querySelectorAll('#pvMeme span').length})''');assert not data['overflow'];assert data['loaded'];assert data['emojiCount']==0;results.append({'viewport':[w,h],**data})
  async with page.expect_download() as download_info:await page.click('#pvDownload')
  download=await download_info.value;await download.save_as('evidence/download-card.png')
  manifest=await (await context.request.get(BASE+'/manifest.webmanifest')).json()
  await page.wait_for_function('navigator.serviceWorker.controller!==null')
  session=await context.new_cdp_session(page)
  install=await session.send('Page.getInstallabilityErrors')
  await page.click('.screen.active [data-open="home"]');await page.click('[data-open="oracleIntro"]');await page.click('#oracleStart')
  for i in range(10):await page.locator('#oracleAnswers button').first.click()
  await page.wait_for_selector('#oracleResult.active');await page.screenshot(path='evidence/oracle.png',full_page=True)
  report={'viewports':results,'errors':errors,'installability':install,'manifest':manifest,'download':download.suggested_filename}
  Path('evidence/browser-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
  print(json.dumps(report,ensure_ascii=False))
  await page.click('.screen.active [data-open="home"]');await page.click('[data-open="fortuneIntro"]');await page.click('#fortuneStart')
  for i in range(10):
   if await page.locator('#fortuneResult.active').count():break
   await page.wait_for_function("document.querySelector('#fortuneResult').classList.contains('active') || (document.querySelector('#fortuneQuiz').classList.contains('active') && document.querySelector('#fortuneAnswers button:not([disabled])'))",timeout=15000)
   if await page.locator('#fortuneResult.active').count():break
   await page.locator('#fortuneAnswers button').first.click();await page.wait_for_timeout(600)
  await page.wait_for_selector('#fortuneResult.active',timeout=15000)
  await page.screenshot(path='evidence/vidente.png',full_page=True)
  await page.click('.screen.active [data-open="home"]');await page.click('[data-open="daily"]');await page.locator('#dailyChoices button').first.click();await page.wait_for_selector('#dailyResult:not([hidden])')
  report['four_experiences_passed']=True
  Path('evidence/browser-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
  print('FOUR_EXPERIENCES_PASSED',flush=True)
  assert not errors
  await context.close()
asyncio.run(main())
