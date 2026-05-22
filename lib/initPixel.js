export function initPixel(pixelId, fbeventsUrl) {
  if (typeof window === 'undefined' || !pixelId || !fbeventsUrl) return

  if (!window.fbq) {
    const n = window.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    window._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []

    const t = document.createElement('script')
    t.async = true
    t.src = fbeventsUrl
    document.head.appendChild(t)
  }

  window.fbq('init', pixelId)
  window.fbq('track', 'PageView')
}
