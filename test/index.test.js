import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import htmlInclude from '../index.js'

const fixtures = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

describe('htmlInclude', () => {
  let plugin

  beforeEach(() => {
    plugin = htmlInclude()
    plugin.configResolved({ root: fixtures })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('replaces a valid include', async () => {
    const r = await plugin.transformIndexHtml(
      '<html><include src="header.html"></include></html>',
      {},
    )
    expect(r).toBe('<html><header>Hello</header>\n</html>')
  })

  it('replaces multiple includes', async () => {
    const r = await plugin.transformIndexHtml(
      '<include src="header.html"></include><main/><include src="footer.html"></include>',
      {},
    )
    expect(r).toBe('<header>Hello</header>\n<main/><footer>World</footer>\n')
  })

  it('handles single quotes and irregular spacing', async () => {
    const r = await plugin.transformIndexHtml(
      '<include  src  =  \'header.html\'  >  </include>',
      {},
    )
    expect(r).toBe('<header>Hello</header>\n')
  })

  it('warns and does not crash for missing files', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const r = await plugin.transformIndexHtml(
      '<include src="nope.html"></include>',
      {},
    )
    expect(r).toBe('')
    expect(warn).toHaveBeenCalledWith('[html-include] not found: nope.html')
  })

  it('returns html unchanged when no include tags', async () => {
    const r = await plugin.transformIndexHtml('<html></html>', {})
    expect(r).toBe('<html></html>')
  })
})
