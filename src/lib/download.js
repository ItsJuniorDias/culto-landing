// Trigger a browser download for a same-origin file (the pack zips in /public).
export function downloadFile(url, filename) {
  const a = document.createElement('a')
  a.href = url
  if (filename) a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
}
