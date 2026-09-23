// One-time import of the starter content into your Sanity dataset.
// Normally run by the GitHub button: Actions → "Set up dashboard" → Run workflow.
// Manual usage (from the studio/ folder):
//   SANITY_STUDIO_PROJECT_ID=xxxx SANITY_WRITE_TOKEN=sk... node seed/import.mjs
// The write token is only used on your machine for this import. Never put it in the website.
import {createClient} from '@sanity/client'
import {createReadStream, readFileSync} from 'node:fs'
import {basename, resolve, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repo = resolve(here, '../..')
const {SANITY_STUDIO_PROJECT_ID: projectId, SANITY_STUDIO_DATASET: dataset = 'production', SANITY_WRITE_TOKEN: token} = process.env
if (!projectId || !token) {
  console.error('Set SANITY_STUDIO_PROJECT_ID and SANITY_WRITE_TOKEN'); process.exit(1)
}
const client = createClient({projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false})
// Safety: never overwrite a dashboard that already has content, unless explicitly forced.
if (process.env.FORCE_IMPORT !== '1' && (await client.fetch('count(*[_id == "siteSettings"])')) > 0) {
  console.log('The dataset already has content — nothing imported (your edits are safe). Set FORCE_IMPORT=1 to overwrite with the starter content.')
  process.exit(0)
}
const docs = readFileSync(resolve(here, 'seed.ndjson'), 'utf8').trim().split('\n').map((l) => JSON.parse(l))
const cache = new Map()

async function upload(spec) {
  const [kind, path] = spec.split('@file://')
  if (cache.has(spec)) return cache.get(spec)
  const abs = resolve(repo, path)
  const asset = await client.assets.upload(kind === 'file' ? 'file' : 'image', createReadStream(abs), {filename: basename(abs)})
  cache.set(spec, asset._id)
  console.log('  uploaded', basename(abs))
  return asset._id
}
async function walk(node) {
  if (Array.isArray(node)) return Promise.all(node.map(walk))
  if (node && typeof node === 'object') {
    if (node._sanityAsset) {
      const id = await upload(node._sanityAsset)
      const {_sanityAsset, ...rest} = node
      return {...rest, asset: {_type: 'reference', _ref: id}}
    }
    const out = {}
    for (const [k, v] of Object.entries(node)) out[k] = await walk(v)
    return out
  }
  return node
}
const ready = []
for (const d of docs) ready.push(await walk(d))
let tx = client.transaction()
for (const d of ready) tx = tx.createOrReplace(d)
await tx.commit()
console.log(`Imported ${ready.length} documents into ${projectId}/${dataset}`)
