import './mcage.css'

interface Manifest {
  latest: {
    release: string
    snapshot: string
  }
  versions: {
    id: string
    type: string
    url: string
    time: string
    releaseTime: string
  }[]
}

async function getManifest(): Promise<Manifest> {
  try {
    const res = await fetch('https://launchermeta.mojang.com/mc/game/version_manifest.json')
    return await res.json()
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert(`Error: ${e}`)
    throw e
  }
}

class TimeDelta {
  years: number
  months: number
  days: number

  constructor(time: number) {
    time /= 24 * 60 * 60 * 1000
    this.years = Math.floor(time / 365.25)

    time %= 365.25
    this.months = Math.floor(time / 30.5)

    time %= 30.5
    this.days = Math.floor(time)
  }

  toString() {
    const parts = [];
    ['years', 'months', 'days'].forEach((p) => {
      const value = this[p]
      const key = p.substring(0, p.length - 1)
      if (value) {
        parts.push(`${value} ${key}${value > 1 ? 's' : ''}`)
      }
    })
    return parts.join(', ') || '0 days'
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search)

  const filterableProperties = ['id', 'type']

  if (filterableProperties.filter(p => params.has(p)).length === 0) {
    params.set('type', 'release')
  }

  let { versions } = await getManifest()

  for (const p of filterableProperties) {
    if (params.get(p)) {
      versions = versions.filter(v => params.get(p) === v[p])
    }
  }
  versions.forEach((version) => {
    const delta = Date.now() - Date.parse(version.releaseTime)

    const age = `Minecraft ${version.id} is ${new TimeDelta(delta)} old.`
    const link = `?id=${version.id}`

    const a = document.createElement('a')
    a.href = link
    a.textContent = age

    const p = document.createElement('p')
    p.classList.add('version')
    p.append(a)

    document.body.append(p)
  })
  if (versions.length > 1) {
    document.getElementById('intro').style.display = 'initial'
  }
})
