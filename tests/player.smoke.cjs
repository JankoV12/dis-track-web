// Run with a built frontend served at http://127.0.0.1:4173 and Playwright available.
const { chromium } = require('playwright')
const assert = require('node:assert/strict')
;(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' })
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1050 } })
    await context.addInitScript(() => localStorage.setItem('auth_token', 'test-fixture-token'))
    const page = await context.newPage()
    const failures = []
    page.on('pageerror', (e) => failures.push(e.message))
    const art =
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"><rect width="500" height="500" fill="#536a51"/><circle cx="250" cy="250" r="170" fill="#243b36"/><circle cx="250" cy="250" r="115" fill="#96aa79"/><circle cx="250" cy="250" r="52" fill="#d5f58a"/><circle cx="250" cy="250" r="8" fill="#243b36"/></svg>',
      )
    let tracks = Array.from({ length: 1000 }, (_, i) => ({
      id: String(i),
      position: i + 1,
      url: `https://example.com/song/${i}`,
      title: `Song ${String(i + 1).padStart(4, '0')}`,
      author: ['Khruangbin', 'The Marías', 'Tame Impala', 'Jungle'][i % 4],
      duration: '3:42',
      requester: 'Alex',
      thumbnail: i % 3 === 0 ? art : null,
      metadataPending: false,
    }))
    let playback = 'playing'
    let unavailable = false
    let shuffled = false
    await page.route('**/api/**', async (route) => {
      const u = new URL(route.request().url())
      const pathname = u.pathname
      const json = (data) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) })
      if (u.hostname === 'discord.com') {
        if (pathname.endsWith('/guilds'))
          return json([
            { id: 'room', name: 'The Listening Room', icon: null },
            { id: 'other', name: 'After Hours', icon: null },
          ])
        return json({ id: 'user', username: 'Alex', global_name: 'Alex', avatar: null })
      }
      if (pathname === '/api/bot/guilds')
        return json([
          { id: 'room', name: 'The Listening Room' },
          { id: 'other', name: 'After Hours' },
        ])
      if (pathname === '/api/status')
        return json({
          player: { status: { room: playback, other: 'idle' }, connections: ['room'] },
        })
      if (pathname.includes('/now-playing/'))
        return pathname.endsWith('/other')
          ? route.fulfill({ status: 404, body: '{}' })
          : json({
              url: 'https://example.com/current',
              title: 'A Calf Born in Winter',
              artist: 'Khruangbin',
              duration: '3:29',
              requester: 'Alex',
              thumbnail: art,
            })
      if (pathname.includes('/controls/')) {
        const action = pathname.split('/').pop()
        if (action === 'shuffle') {
          tracks.reverse()
          shuffled = true
        }
        if (action === 'pause') playback = 'paused'
        if (action === 'resume') playback = 'playing'
        return json({
          success: true,
          message: action === 'shuffle' ? 'Shuffled 1000 upcoming tracks' : 'Playback updated',
        })
      }
      if (pathname.endsWith('/add'))
        return route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Requester is not in a voice channel' }),
        })
      if (pathname.includes('/queue/')) {
        if (unavailable) return route.fulfill({ status: 503, body: '{}' })
        const filtered = tracks.filter((t) =>
          (t.title + ' ' + t.author)
            .toLowerCase()
            .includes((u.searchParams.get('search') || '').toLowerCase()),
        )
        const offset = Number(u.searchParams.get('offset') || 0),
          limit = Number(u.searchParams.get('limit') || 50)
        return json({
          count: tracks.length,
          filteredCount: filtered.length,
          offset,
          limit,
          hasMore: offset + limit < filtered.length,
          tracks: filtered.slice(offset, offset + limit),
        })
      }
      return route.fulfill({ status: 404, body: '{}' })
    })
    await page.goto('http://127.0.0.1:4173/player/room')
    await page.getByRole('heading', { name: 'The Listening Room', exact: true }).waitFor()
    await page.getByRole('link', { name: 'Song 0001', exact: true }).waitFor()
    assert.equal(await page.locator('tbody tr').count(), 50)
    await page.screenshot({ path: '/tmp/dis-track-player-desktop.png', fullPage: true })
    await page.getByRole('button', { name: 'Next page', exact: true }).click()
    await page.getByRole('link', { name: 'Song 0051', exact: true }).waitFor()
    await page.getByLabel('Search queue', { exact: true }).fill('Song 1000')
    await page.getByRole('link', { name: 'Song 1000', exact: true }).waitFor()
    assert.equal(await page.locator('tbody tr').count(), 1)
    await page.getByRole('button', { name: 'Clear', exact: true }).click()
    await page.getByRole('link', { name: 'Song 0001', exact: true }).waitFor()
    await page.getByRole('button', { name: 'Shuffle', exact: true }).click()
    await page.getByRole('status').filter({ hasText: 'Shuffled 1000' }).waitFor()
    assert.equal(shuffled, true)
    assert.equal(
      await page.locator('tbody tr').first().getByRole('link').textContent(),
      'Song 1000',
    )
    await page.getByRole('heading', { name: 'A Calf Born in Winter' }).waitFor()
    await page.getByRole('button', { name: 'Pause playback', exact: true }).click()
    await page.getByRole('button', { name: 'Resume playback', exact: true }).waitFor()
    await page
      .getByLabel('YouTube or Spotify link', { exact: true })
      .fill('https://example.com/track')
    await page.getByRole('button', { name: 'Add music', exact: true }).click()
    await page
      .getByRole('alert')
      .filter({ hasText: 'Requester is not in a voice channel' })
      .waitFor()
    await page.setViewportSize({ width: 390, height: 844 })
    await page.screenshot({ path: '/tmp/dis-track-player-mobile.png', fullPage: true })
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      true,
      'mobile must not overflow horizontally',
    )
    unavailable = true
    await page.waitForFunction(
      () => document.body.textContent.includes('Live updates are unavailable'),
      {},
      { timeout: 12000 },
    )
    assert.equal(
      await page.locator('tbody tr').count(),
      50,
      'keep last known queue on refresh failure',
    )
    unavailable = false
    await page.getByRole('button', { name: 'Retry', exact: true }).click()
    await page.getByRole('alert').waitFor({ state: 'hidden' })
    await page.setViewportSize({ width: 1440, height: 1050 })
    await page.getByRole('link', { name: /After Hours/ }).click()
    await page.getByRole('heading', { name: 'After Hours', exact: true }).waitFor()
    await page.getByRole('heading', { name: 'The room is yours.', exact: true }).waitFor()
    assert.deepEqual(failures, [])
    console.log(
      '1000-track queue, pagination, search, shuffle, pause, add errors, stale-data recovery, server switching and mobile layout passed.',
    )
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
