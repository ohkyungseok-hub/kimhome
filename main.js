// Apply saved data from localStorage to the page
(function () {
  const saved = localStorage.getItem('siteData');
  const data = saved ? Object.assign({}, SITE_DATA, JSON.parse(saved)) : SITE_DATA;

  // Apply logo image if set
  if (data.logoSrc) {
    const img = document.getElementById('logo-img');
    if (img) { img.src = data.logoSrc; img.style.display = 'block'; }
    const fallback = document.getElementById('logo-text');
    if (fallback) fallback.style.display = 'none';
  }

  // Apply text content
  for (const [key, elId] of Object.entries(FIELD_MAP)) {
    const el = document.getElementById(elId);
    if (el && data[key] !== undefined) {
      el.innerHTML = data[key].replace(/\n/g, '<br>');
    }
  }

  // Update page title from logo text
  if (data.logoText) document.title = data.logoText;
})();
