const grid = document.querySelector('#gallery-grid');
const status = document.querySelector('#gallery-status');
const retry = document.querySelector('#retry');
const dialog = document.querySelector('#lightbox');
const labels = {portrety:'PORTRET',podroze:'PODRÓŻE',chwile:'CHWILE'};
let photos = [], visible = [], filter = 'all', current = 0;
document.querySelector('#year').textContent = new Date().getFullYear();
function showPhoto(index) {
  current = (index + visible.length) % visible.length;
  const photo = visible[current];
  document.querySelector('#lightbox-image').src = photo.src;
  document.querySelector('#lightbox-image').alt = photo.alt;
  document.querySelector('#lightbox-caption').textContent = `${photo.title} · ${current+1} / ${visible.length}`;
  if (!dialog.open) { dialog.showModal(); document.body.classList.add('modal-open'); }
}
function render() {
  visible = photos.filter(p => filter === 'all' || p.category === filter);
  grid.replaceChildren();
  visible.forEach((p,index) => {
    const button = document.createElement('button'); button.className = 'photo'; button.setAttribute('aria-label',`Otwórz zdjęcie: ${p.title}`);
    const frame = document.createElement('div'); frame.className = 'photo-image';
    const img = document.createElement('img'); img.src = p.thumbnail; img.alt = p.alt; img.loading = 'lazy'; img.decoding = 'async'; img.width=560; img.height=700; frame.append(img);
    const meta = document.createElement('div'); meta.className = 'photo-meta';
    const title = document.createElement('strong'); title.textContent = p.title;
    const category = document.createElement('span'); category.textContent = labels[p.category] || '';
    meta.append(title,category);button.append(frame,meta);button.addEventListener('click',()=>showPhoto(index));grid.append(button);
  });
  document.querySelector('#photo-count').textContent = `${visible.length} kadrów`;
  status.hidden = visible.length > 0; status.textContent = 'W tej kategorii nie ma jeszcze zdjęć.';
}
function renderSocials(socials) {
  const container = document.querySelector('#social-links'); container.replaceChildren();
  const allowed = {instagram:['instagram.com','www.instagram.com'],tiktok:['tiktok.com','www.tiktok.com'],facebook:['facebook.com','www.facebook.com']};
  for (const social of socials) {
    try {
      const url = new URL(social.url);
      if (url.protocol !== 'https:' || !allowed[social.platform]?.includes(url.hostname)) continue;
      const a = document.createElement('a'); a.href = url.href; a.textContent = `${social.label} ↗`; a.target = '_blank'; a.rel='noopener noreferrer'; container.append(a);
    } catch { /* Ignore unconfigured profiles. */ }
  }
  document.querySelector('#socials').hidden = !container.children.length;
}
async function load() {
  retry.hidden=true;status.hidden=false;status.textContent='Wczytywanie zdjęć…';
  try {
    const response = await fetch('/api/content',{signal:AbortSignal.timeout(12000)});
    if (!response.ok) throw new Error('API unavailable');
    const data = await response.json();
    if (!Array.isArray(data.photos) || !Array.isArray(data.socials)) throw new Error('Invalid content');
    photos=data.photos;render();renderSocials(data.socials);
  } catch {
    status.textContent='Nie udało się wczytać galerii. Spróbuj ponownie za chwilę.';retry.hidden=false;
  }
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  filter=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  render();
}));
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
document.querySelector('.previous').addEventListener('click',()=>showPhoto(current-1));
document.querySelector('.next').addEventListener('click',()=>showPhoto(current+1));
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();showPhoto(current+1);}if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(current-1);}});
retry.addEventListener('click',load);load();
