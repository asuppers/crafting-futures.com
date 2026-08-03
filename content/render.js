/* Crafting Futures – renders all page text/images from content/site.json
   so the site can be edited via the /admin CMS without touching code. */

function cfEsc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function cfEscAttr(str) {
  return cfEsc(str).replace(/"/g, '&quot;');
}
// Converts **bold** markers (like WhatsApp) into <strong> after escaping HTML.
function cfBold(str) {
  return cfEsc(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
function cfBankRow(label, value) {
  return '<div class="bank-row"><span class="bank-label">' + cfEsc(label) +
    '</span><span class="bank-value">' + cfEsc(value) + '</span></div>';
}

fetch('content/site.json', { cache: 'no-store' })
  .then(function (r) { return r.json(); })
  .then(renderSite)
  .catch(function (err) { console.error('Could not load content/site.json', err); });

function renderSite(c) {
  // HERO
  document.getElementById('hero-tag').textContent = c.hero.tag;
  document.getElementById('hero-subtitle').textContent = c.hero.subtitle;
  document.getElementById('hero-btn-primary').textContent = c.hero.primaryButton;
  document.getElementById('hero-btn-outline').textContent = c.hero.outlineButton;
  document.getElementById('hero-slideshow').innerHTML = c.hero.slideshowImages.map(function (src, i) {
    return '<div class="hero-slide' + (i === 0 ? ' active' : '') + '" style="background-image: url(\'' + src + '\');"></div>';
  }).join('');

  // ABOUT
  var aboutImage = document.getElementById('about-image');
  aboutImage.setAttribute('data-img', c.about.image);
  aboutImage.style.backgroundImage = "url('" + c.about.image + "')";
  document.getElementById('about-label').textContent = c.about.label;
  document.getElementById('about-heading').textContent = c.about.heading;
  document.getElementById('about-paragraphs').innerHTML = c.about.paragraphs.map(function (p) {
    return '<p>' + cfBold(p) + '</p>';
  }).join('');
  document.getElementById('about-team-names').textContent = c.about.teamNames;
  window.__cfTeamPhoto = c.about.teamPhoto;

  // PROGRAMS
  document.getElementById('programs-label').textContent = c.programs.label;
  document.getElementById('programs-heading').textContent = c.programs.heading;
  document.getElementById('programs-intro').textContent = c.programs.intro;
  document.getElementById('program-grid').innerHTML = c.programs.items.map(function (item) {
    return '<div class="program-card">' +
      '<button class="program-photo zoomable" data-img="' + cfEscAttr(item.photo) + '" style="background-image: url(\'' + item.photo + '\');" aria-label="Enlarge photo"></button>' +
      '<div class="program-body">' +
      '<h3>' + cfEsc(item.title) + '</h3>' +
      '<div class="program-trainer">' + cfEsc(item.trainer) + '</div>' +
      '<p>' + cfBold(item.text) + '</p>' +
      '<button class="workshop-tag" data-detail="' + cfEscAttr(item.detailText) + '" data-images="' + item.galleryImages.join(',') + '">📷 More photos</button>' +
      '</div></div>';
  }).join('');

  // MILESTONES ("How It Started")
  document.getElementById('milestones-label').textContent = c.milestones.label;
  document.getElementById('milestone-list').innerHTML = c.milestones.items.map(function (m) {
    return '<div class="milestone-item">' +
      '<button class="milestone-img zoomable" data-img="' + cfEscAttr(m.image) + '" style="background-image: url(\'' + m.image + '\');" aria-label="Enlarge photo"></button>' +
      '<div class="milestone-text"><div class="milestone-date">' + cfEsc(m.date) + '</div>' +
      '<h4>' + cfEsc(m.title) + '</h4><p>' + cfBold(m.text) + '</p></div></div>';
  }).join('');

  // WHAT'S NEXT
  document.getElementById('whatsnext-label').textContent = c.whatsNext.label;
  document.getElementById('whatsnext-card').innerHTML =
    '<button class="project-img zoomable" data-img="' + cfEscAttr(c.whatsNext.image) + '" style="background-image: url(\'' + c.whatsNext.image + '\');" aria-label="Enlarge photo"></button>' +
    '<div class="project-content">' +
    '<span class="upcoming-tag">' + cfEsc(c.whatsNext.upcomingTag) + '</span>' +
    '<div class="project-date">' + cfEsc(c.whatsNext.dateLabel) + '</div>' +
    '<h3>' + cfEsc(c.whatsNext.heading) + '</h3>' +
    '<p>' + cfBold(c.whatsNext.paragraph) + '</p>' +
    '<p style="font-size: 0.9rem; color: var(--text-light);">' + cfBold(c.whatsNext.thanksNote) + '</p>' +
    '<div class="workshop-list">' +
    c.whatsNext.tags.map(function (t) {
      return '<button class="workshop-tag" data-detail="' + cfEscAttr(t.detail) + '">' + cfEsc(t.label) + '</button>';
    }).join('') +
    '</div></div>';

  // TRAIN THE TRAINER
  document.getElementById('trainer-label').textContent = c.trainTheTrainer.label;
  document.getElementById('trainer-heading').textContent = c.trainTheTrainer.heading;
  document.getElementById('trainer-intro').textContent = c.trainTheTrainer.intro;
  document.getElementById('trainer-list').innerHTML = c.trainTheTrainer.items.map(function (t) {
    return '<div class="vision-item"><div class="vision-number">' + cfEsc(t.emoji) + '</div>' +
      '<div class="vision-text"><h4>' + cfEsc(t.name) + '</h4><p>' + cfBold(t.text) + '</p></div></div>';
  }).join('');
  document.getElementById('trainer-footer-note').textContent = c.trainTheTrainer.footerNote;

  // IMPACT
  document.getElementById('impact-label').textContent = c.impact.label;
  document.getElementById('impact-heading').textContent = c.impact.heading;
  document.getElementById('impact-intro').textContent = c.impact.intro;
  document.getElementById('impact-grid').innerHTML = c.impact.stats.map(function (s) {
    return '<div class="impact-card"><div class="impact-number">' + cfEsc(s.number) +
      '</div><div class="impact-label">' + cfEsc(s.label) + '</div></div>';
  }).join('');

  // VISION
  document.getElementById('vision-label').textContent = c.vision.label;
  document.getElementById('vision-heading').textContent = c.vision.heading;
  document.getElementById('vision-intro').textContent = c.vision.intro;
  document.getElementById('vision-list').innerHTML = c.vision.items.map(function (v, i) {
    return '<div class="vision-item"><div class="vision-number">' + (i + 1) + '</div>' +
      '<div class="vision-text"><h4>' + cfEsc(v.title) + '</h4><p>' + cfBold(v.text) + '</p></div></div>';
  }).join('');

  // DONATE
  document.getElementById('donate-label').textContent = c.donate.label;
  document.getElementById('donate-heading').textContent = c.donate.heading;
  document.getElementById('donate-intro').textContent = c.donate.intro;
  document.getElementById('help-grid').innerHTML = c.donate.helpCards.map(function (h) {
    return '<a class="help-card" href="' + cfEscAttr(h.link) + '"><div class="help-icon">' + cfEsc(h.icon) +
      '</div><h4>' + cfEsc(h.title) + '</h4><p>' + cfEsc(h.text) + '</p></a>';
  }).join('');
  var contactBtn = document.getElementById('donate-contact-btn');
  contactBtn.textContent = c.donate.contactButton;
  contactBtn.setAttribute('href', 'mailto:' + c.donate.contactEmail);
  document.getElementById('donate-hfaac-btn').textContent = c.donate.hfaacButton;
  document.getElementById('bank-transfer-btn').textContent = c.donate.bankButton;
  document.getElementById('donate-note').textContent = c.donate.note;

  // HFAAC
  var hfaacImage = document.getElementById('hfaac-image');
  hfaacImage.setAttribute('data-img', c.hfaac.image);
  hfaacImage.style.backgroundImage = "url('" + c.hfaac.image + "')";
  document.getElementById('hfaac-label').textContent = c.hfaac.label;
  document.getElementById('hfaac-heading').textContent = c.hfaac.heading;
  document.getElementById('hfaac-text').innerHTML = cfBold(c.hfaac.text);
  document.getElementById('hfaac-facts').innerHTML = c.hfaac.facts.map(function (f) {
    return '<li>' + cfBold(f) + '</li>';
  }).join('');
  var hfaacLink = document.getElementById('hfaac-link');
  hfaacLink.textContent = c.hfaac.linkText;
  hfaacLink.setAttribute('href', c.hfaac.linkUrl);

  // FOOTER
  document.getElementById('footer-copyright').textContent = c.footer.copyright;

  // BANK MODAL
  document.getElementById('bank-details').innerHTML =
    cfBankRow('Beneficiary', c.bank.beneficiary) +
    cfBankRow('IBAN', c.bank.iban) +
    cfBankRow('BIC / SWIFT', c.bank.bic) +
    cfBankRow('Bank name & address', c.bank.bankAddress);
  document.getElementById('bank-note').textContent = c.bank.note;

  cfSetupInteractions();
  cfStartHeroSlideshow();
}

function cfStartHeroSlideshow() {
  var slides = document.querySelectorAll('#hero-slideshow .hero-slide');
  if (slides.length > 1) {
    var i = 0;
    setInterval(function () {
      slides[i].classList.remove('active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('active');
    }, 4500);
  }
}

function cfSetupInteractions() {
  var modal = document.getElementById('detail-modal');
  var modalTitle = document.getElementById('modal-title');
  var modalText = document.getElementById('modal-text');
  var modalImages = document.getElementById('modal-images');
  var photoModal = document.getElementById('photo-modal');
  var photoModalImg = document.getElementById('photo-modal-img');
  var bankModal = document.getElementById('bank-modal');

  function openPhotoModal(src) {
    photoModalImg.src = src;
    photoModal.classList.add('open');
  }
  window.__cfOpenPhotoModal = openPhotoModal;

  // Event delegation: works for both static and dynamically-rendered buttons.
  document.body.addEventListener('click', function (e) {
    var tag = e.target.closest('.workshop-tag');
    if (tag) {
      modalTitle.textContent = tag.textContent.trim();
      modalText.textContent = tag.getAttribute('data-detail');
      modalImages.innerHTML = '';
      var imgs = tag.getAttribute('data-images');
      if (imgs) {
        imgs.split(',').forEach(function (src) {
          var img = document.createElement('img');
          img.src = src;
          img.alt = '';
          img.addEventListener('click', function () { openPhotoModal(src); });
          modalImages.appendChild(img);
        });
      }
      modal.classList.add('open');
      return;
    }
    var zoomBtn = e.target.closest('.zoomable');
    if (zoomBtn) {
      openPhotoModal(zoomBtn.getAttribute('data-img'));
      return;
    }
    var teamTrigger = e.target.closest('#team-photo-trigger');
    if (teamTrigger) {
      openPhotoModal(window.__cfTeamPhoto);
      return;
    }
    if (e.target.closest('#bank-transfer-btn')) {
      bankModal.classList.add('open');
      return;
    }
    if (e.target === modal || e.target.closest('#modal-close')) {
      modal.classList.remove('open');
    }
    if (e.target === photoModal || e.target.closest('#photo-modal-close')) {
      photoModal.classList.remove('open');
    }
    if (e.target === bankModal || e.target.closest('#bank-modal-close')) {
      bankModal.classList.remove('open');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      modal.classList.remove('open');
      photoModal.classList.remove('open');
      bankModal.classList.remove('open');
    }
  });
}
