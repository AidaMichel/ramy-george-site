/**
 * Shared horizontal carousel: native scroll-snap (touch swipe), mouse drag, arrow buttons,
 * ←/→ keys, counter and progress bar. Buttons disable at the ends. Reduced motion = instant jumps.
 */
export function initCarousels() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    if (root.dataset.ready) return
    root.dataset.ready = '1'
    const track = root.querySelector<HTMLElement>('[data-track]')!
    const prev = root.querySelector<HTMLButtonElement>('[data-prev]')
    const next = root.querySelector<HTMLButtonElement>('[data-next]')
    const count = root.querySelector<HTMLElement>('[data-count]')
    const total = root.querySelector<HTMLElement>('[data-total]')
    const bar = root.querySelector<HTMLElement>('[data-bar]')
    const items = () => [...track.children].filter((c) => !(c as HTMLElement).hidden) as HTMLElement[]
    const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth'
    const index = () => {
      const its = items(); const left = track.scrollLeft
      let best = 0
      its.forEach((it, i) => { if (Math.abs(it.offsetLeft - track.offsetLeft - left) < Math.abs(its[best].offsetLeft - track.offsetLeft - left)) best = i })
      return best
    }
    const update = () => {
      const its = items(); const max = track.scrollWidth - track.clientWidth
      const i = index(); const atEnd = track.scrollLeft >= max - 4
      if (prev) prev.disabled = track.scrollLeft <= 4
      if (next) next.disabled = atEnd || its.length <= 1
      if (count) count.textContent = String(atEnd ? its.length : i + 1).padStart(2, '0')
      if (total) total.textContent = String(its.length).padStart(2, '0')
      if (bar) bar.style.width = (max > 0 ? Math.max(8, ((track.scrollLeft + track.clientWidth) / track.scrollWidth) * 100) : 100) + '%'
      its.forEach((it, k) => it.toggleAttribute('data-active', k === i))
    }
    const go = (d: number) => {
      const its = items(); const i = Math.max(0, Math.min(its.length - 1, index() + d))
      track.scrollTo({left: its[i].offsetLeft - track.offsetLeft, behavior})
    }
    prev?.addEventListener('click', () => go(-1))
    next?.addEventListener('click', () => go(1))
    track.addEventListener('scroll', () => requestAnimationFrame(update), {passive: true})
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
    })
    // Mouse drag (touch uses native scrolling). A drag never triggers the link underneath.
    let startX = 0, startLeft = 0, dragging = false, moved = false
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      dragging = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft
      track.classList.add('grabbing')
    })
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 6) moved = true
      track.scrollLeft = startLeft - dx
    })
    window.addEventListener('pointerup', (e) => {
      if (!dragging) return
      dragging = false
      const max = track.scrollWidth - track.clientWidth
      if (moved && track.scrollLeft < max - 4) {
        // settle on the next item in the direction of the drag
        const its = items(), left = track.scrollLeft, dir = e.clientX < startX ? 1 : -1
        const offs = its.map((it) => it.offsetLeft - track.offsetLeft)
        const target = dir > 0 ? offs.find((o) => o > left + 2) ?? max : [...offs].reverse().find((o) => o < left - 2) ?? 0
        track.scrollTo({left: Math.min(target, max), behavior})
      }
      requestAnimationFrame(() => track.classList.remove('grabbing'))
    })
    track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false } }, true)
    track.addEventListener('dragstart', (e) => e.preventDefault())
    root.addEventListener('carousel:refresh', () => { track.scrollTo({left: 0}); update() })
    new ResizeObserver(update).observe(track)
    update()
    // Muted loops play only while visible, and never with reduced motion
    const vids = track.querySelectorAll<HTMLVideoElement>('video[data-autoplay]')
    if (vids.length && !reduce && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => es.forEach((en) => { const v = en.target as HTMLVideoElement; en.isIntersecting ? v.play().catch(() => {}) : v.pause() }), {threshold: 0.4})
      vids.forEach((v) => io.observe(v))
    }
  })
}
