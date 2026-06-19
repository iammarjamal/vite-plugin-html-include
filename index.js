import path from 'node:path'
import fs from 'node:fs/promises'

const RE = /<include\s+src\s*=\s*["']([^"']+)["']\s*>\s*<\/include>/g

export default function htmlInclude(opts = {}) {
  let root = process.cwd()

  return {
    name: 'html-include',
    enforce: 'pre',

    configResolved(config) {
      root = opts.root || config.root || root
    },

    async transformIndexHtml(html, ctx) {
      const hits = [...html.matchAll(RE)]
      if (!hits.length) return html

      const items = await Promise.all(
        hits.map(async (m) => {
          const file = path.resolve(root, m[1])
          if (ctx.server) ctx.server.watcher.add(file)
          try {
            return { idx: m.index, old: m[0], content: await fs.readFile(file, 'utf-8') }
          } catch (e) {
            if (e.code === 'ENOENT')
              console.warn(`[html-include] not found: ${m[1]}`)
            else
              console.error(`[html-include] error reading "${m[1]}":`, e)
            return { idx: m.index, old: m[0], content: '' }
          }
        }),
      )

      let out = html
      for (let i = items.length - 1; i >= 0; i--) {
        const { idx, old, content } = items[i]
        out = out.slice(0, idx) + content + out.slice(idx + old.length)
      }
      return out
    },
  }
}
