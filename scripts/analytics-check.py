import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
BASE=os.environ.get('POP_TEST_BASE_URL','http://127.0.0.1:3000')
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ.get('POP_BROWSER_EXECUTABLE',p.chromium.executable_path),args=['--no-sandbox'])
  page=await browser.new_page();requests=[]
  page.on('request',lambda r:requests.append(r.url))
  await page.route('**/api/config',lambda route:route.fulfill(json={'ga4MeasurementId':'G-TESTONLY'}))
  await page.route('https://www.googletagmanager.com/**',lambda route:route.fulfill(body='/* SDK stub: no data transmitted */',content_type='application/javascript'))
  await page.goto(BASE+'/');await page.get_by_text('Recusar métricas',exact=True).click()
  await page.evaluate("window.popTrack('game_start',{game:'pv'})")
  assert not any('googletagmanager' in u or 'google-analytics' in u for u in requests)
  await page.get_by_text('Privacidade e métricas',exact=True).click();await page.get_by_text('Aceitar métricas',exact=True).click();await page.wait_for_function('window.gtag!==undefined')
  await page.click('[data-open="pvIntro"]');await page.click('#pvStart')
  for i in range(10):await page.locator('#pvAnswers button').first.click()
  await page.wait_for_selector('#pvResult.active');await page.click('#pvDownload')
  await page.evaluate("window.popTrack('share_action',{game:'pv'});window.dispatchEvent(new Event('appinstalled'))")
  events=await page.evaluate("dataLayer.map(x=>Array.from(x)).filter(x=>x[0]==='event')")
  names=[x[1] for x in events];assert all(x in names for x in ['page_view','game_start','game_complete','pv_result','card_download','share_action','pwa_install'])
  assert all('answers' not in json.dumps(e) and 'sessionId' not in json.dumps(e) for e in events)
  count=len(events);await page.get_by_text('Privacidade e métricas',exact=True).click();await page.get_by_text('Recusar métricas',exact=True).click();await page.evaluate("window.popTrack('game_start',{game:'pv'})")
  after=await page.evaluate("dataLayer.map(x=>Array.from(x)).filter(x=>x[0]==='event').length");assert count==after
  report={'consent_denied_no_google_requests':True,'events_checked':names,'revocation_stops_events':True,'external_transmission':'none; SDK stubbed; test-only ID; not real usage'}
  Path('evidence/analytics-results.json').write_text(json.dumps(report,indent=2))
  print(json.dumps(report))
  await browser.close()
asyncio.run(main())
