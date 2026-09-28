(() => {
  const gallery = document.getElementById('project-gallery');
  const status = document.getElementById('gallery-status');
  const dialog = document.getElementById('project-dialog');
  const media = document.getElementById('project-media');
  let fingerprint = '';
  let openedBy;
  let loading = false;
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('visible', entry.isIntersecting));
  }, {threshold:0}) : null;
  const fallback = [
    {path:'/work/ESPRIT-EDGE-PDF-to-3D.mp4', name:'ESPRIT EDGE PDF to 3D', extension:'.mp4'},
    {path:'/work/VISI-Electrode-Workflow.mp4', name:'VISI Electrode Workflow', extension:'.mp4'}
  ];
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const isVideo = item => ['.mp4', '.webm'].includes(item.extension);
  const safePath = path => typeof path === 'string' && path.startsWith('/work/') && !path.includes('..');
  const fileUrl = item => item.path.split('/').map(encodeURIComponent).join('/');
  function openProject(item, trigger) {
    openedBy = trigger;
    document.getElementById('project-title').textContent = item.title;
    document.getElementById('project-category').textContent = item.category;
    document.getElementById('project-description').textContent = item.description;
    const steps = document.getElementById('project-steps');
    steps.replaceChildren(...(item.steps || []).map(step => el('li', '', step)));
    steps.hidden = !item.steps?.length;
    const original = document.getElementById('project-file');
    original.href = fileUrl(item);
    const content = document.createElement(isVideo(item) ? 'video' : 'img');
    if (isVideo(item)) {
      content.controls = true;
      content.playsInline = true;
      content.preload = 'metadata';
      if (item.poster) content.poster = item.poster;
      content.setAttribute('aria-label', item.title);
    } else content.alt = item.title;
    content.src = fileUrl(item);
    content.addEventListener('error', () => {
      const notice = el('p', 'media-error', 'This file could not load. Please try the original file link below.');
      media.append(notice);
    }, {once:true});
    media.replaceChildren(content);
    dialog.showModal();
    document.body.classList.add('viewer-open');
    if (isVideo(item)) content.play().catch(() => { /* Native play remains available. */ });
  }
  dialog.querySelector('.close-viewer').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    const video = media.querySelector('video');
    if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
    media.replaceChildren();
    document.body.classList.remove('viewer-open');
    openedBy?.focus();
  });
  function render(items) {
    const nodes = items.map((item, index) => {
      const card = el('article', 'project media-project reveal');
      if (!observer) card.classList.add('visible');
      const trigger = el('button', 'project-trigger');
      trigger.type = 'button';
      trigger.setAttribute('aria-label', `${isVideo(item) ? 'Play' : 'View'} ${item.title}`);
      const preview = el('span', 'project-preview');
      let thumb;
      if (item.poster || !isVideo(item)) {
        thumb = el('img'); thumb.src = item.poster || fileUrl(item); thumb.alt = ''; thumb.loading = 'lazy';
      } else {
        thumb = el('video'); thumb.src = fileUrl(item) + '#t=0.1'; thumb.preload = 'metadata'; thumb.muted = true; thumb.playsInline = true;
        thumb.setAttribute('aria-hidden', 'true');
      }
      preview.append(thumb, el('span', 'play-badge', isVideo(item) ? '▶' : '↗'));
      if (item.duration) preview.append(el('span', 'duration', item.duration));
      const copy = el('span', 'project-card-copy');
      copy.append(el('span', 'category', item.category), el('h3', '', item.title), el('span', 'project-summary', item.description));
      const bottom = el('span', 'project-bottom');
      bottom.append(el('span', 'watch-label', isVideo(item) ? 'Watch workflow' : 'View screenshot'), el('span', 'index', String(index+1).padStart(2,'0')));
      copy.append(bottom); trigger.append(preview,copy);
      trigger.addEventListener('click', () => openProject(item, trigger));
      card.append(trigger); return card;
    });
    observer?.disconnect();
    gallery.replaceChildren(...nodes);
    nodes.forEach(node => observer?.observe(node));
    status.textContent = items.length ? '' : 'New projects will appear here soon.';
  }
  async function refresh() {
    if (loading || dialog.open || document.hidden) return;
    loading = true;
    try {
      const [listing, metadata] = await Promise.all([
        fetch('gallery.json', {cache:'no-store'}).then(r => {if(!r.ok) throw Error(); return r.json();}).catch(() => fallback),
        fetch('projects.json', {cache:'no-store'}).then(r => r.ok ? r.json() : {}).catch(() => ({}))
      ]);
      if (!Array.isArray(listing)) throw Error('Invalid gallery');
      const items = listing.filter(item => safePath(item.path)).map(item => {
        const info = metadata[item.path] || {};
        return {...item, title:item.name.replace(/[-_]+/g, ' '), category:isVideo(item) ? 'WORKFLOW / VIDEO' : 'PROJECT / SCREENSHOT', description:isVideo(item) ? 'Watch the project demonstration.' : 'Explore the project in detail.', ...info};
      }).sort((a,b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));
      const next = JSON.stringify(items);
      if (fingerprint !== next) { render(items); fingerprint = next; }
    } catch (_) {
      if (!fingerprint) status.textContent = 'The gallery could not load. Please refresh the page.';
    } finally { loading = false; }
  }
  refresh();
  setInterval(refresh, 60000);
  document.addEventListener('visibilitychange', refresh);
})();
