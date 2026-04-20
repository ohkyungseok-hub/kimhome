// Admin panel logic

// All text field keys that map to form inputs
const TEXT_FIELDS = [
  'logoText','headerTagline',
  'nav1','nav2','nav3','nav4','nav5','nav6',
  'heroEyebrow','heroTitle','heroDesc','heroCta',
  'stat1Num','stat1Label','stat2Num','stat2Label',
  'stat3Num','stat3Label','stat4Num','stat4Label',
  'bizTitle','bizSub',
  'biz1Name','biz1Desc','biz2Name','biz2Desc',
  'biz3Name','biz3Desc','biz4Name','biz4Desc',
  'sustainEyebrow','sustainTitle','sustainDesc','sustainCta',
  'sustainBadge1Title','sustainBadge1Desc',
  'sustainBadge2Title','sustainBadge2Desc',
  'sustainBadge3Title','sustainBadge3Desc',
  'innovEyebrow','innovTitle','innovDesc','innovCta',
  'newsTitle',
  'news1Tag','news1Headline','news1Excerpt','news1Date',
  'news2Tag','news2Headline','news2Excerpt','news2Date',
  'news3Tag','news3Headline','news3Excerpt','news3Date',
  'cta1Title','cta1Desc','cta1Btn',
  'cta2Title','cta2Desc','cta2Btn',
  'footerLogoText','footerSlogan','footerCopy'
];

// Load saved data or defaults
function loadData() {
  const saved = localStorage.getItem('siteData');
  return saved ? Object.assign({}, SITE_DATA, JSON.parse(saved)) : Object.assign({}, SITE_DATA);
}

// Populate form fields from data
function populateForm(data) {
  for (const key of TEXT_FIELDS) {
    const el = document.getElementById('f-' + key);
    if (el) el.value = data[key] || '';
  }
  // Logo preview
  if (data.logoSrc) {
    const preview = document.getElementById('logo-preview');
    preview.src = data.logoSrc;
    preview.style.display = 'block';
    document.getElementById('logo-preview-placeholder').style.display = 'none';
  }
}

// Collect form values into data object
function collectForm() {
  const data = {};
  for (const key of TEXT_FIELDS) {
    const el = document.getElementById('f-' + key);
    if (el) data[key] = el.value;
  }
  // Preserve logo src from current saved data
  const saved = localStorage.getItem('siteData');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.logoSrc) data.logoSrc = parsed.logoSrc;
  }
  // If logo was updated this session, use it
  if (window._pendingLogoSrc !== undefined) {
    data.logoSrc = window._pendingLogoSrc;
  }
  return data;
}

// Save to localStorage
function saveData(data) {
  localStorage.setItem('siteData', JSON.stringify(data));
}

// Show toast
function showToast() {
  const t = document.getElementById('save-toast');
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2500);
}

// Sidebar active state on scroll
function initScrollSpy() {
  const sections = document.querySelectorAll('.form-section');
  const navItems = document.querySelectorAll('.snav-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(n => n.classList.remove('active'));
        const target = document.querySelector(`.snav-item[data-section="${entry.target.id}"]`);
        if (target) target.classList.add('active');
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => observer.observe(s));
}

// Logo file upload
function initLogoUpload() {
  const fileInput = document.getElementById('logo-file');
  const preview = document.getElementById('logo-preview');
  const placeholder = document.getElementById('logo-preview-placeholder');
  const dropArea = document.getElementById('logo-drop-area');

  function applyImage(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      preview.src = src;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
      window._pendingLogoSrc = src;
      // Also copy to logo.png equivalent by updating img tags
    };
    reader.readAsDataURL(file);
  }

  document.getElementById('btn-choose-logo').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => applyImage(fileInput.files[0]));

  document.getElementById('btn-remove-logo').addEventListener('click', () => {
    preview.src = '';
    preview.style.display = 'none';
    placeholder.style.display = 'block';
    window._pendingLogoSrc = '';
    fileInput.value = '';
  });

  dropArea.addEventListener('dragover', (e) => { e.preventDefault(); dropArea.classList.add('dragover'); });
  dropArea.addEventListener('dragleave', () => dropArea.classList.remove('dragover'));
  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    applyImage(e.dataTransfer.files[0]);
  });
}

// Save handler
function handleSave() {
  const data = collectForm();
  saveData(data);
  showToast();
}

// Reset handler
function handleReset() {
  if (!confirm('모든 내용을 기본값으로 초기화하시겠습니까?')) return;
  localStorage.removeItem('siteData');
  window._pendingLogoSrc = undefined;
  populateForm(SITE_DATA);
  const preview = document.getElementById('logo-preview');
  preview.src = '';
  preview.style.display = 'none';
  document.getElementById('logo-preview-placeholder').style.display = 'block';
  showToast();
}

// Sidebar smooth scroll
function initSidebarNav() {
  document.querySelectorAll('.snav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute('data-section');
      const section = document.getElementById(sectionId);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  populateForm(loadData());
  initLogoUpload();
  initScrollSpy();
  initSidebarNav();

  document.getElementById('btn-save').addEventListener('click', handleSave);
  document.getElementById('btn-save-bottom').addEventListener('click', handleSave);
  document.getElementById('btn-reset').addEventListener('click', handleReset);
  document.getElementById('btn-reset-bottom').addEventListener('click', handleReset);
});
