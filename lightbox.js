(function () {
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<button class="lightbox-close" aria-label="Close">×</button><img class="lightbox-img" alt="" />';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('.lightbox-img');

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    lbImg.removeAttribute('src');
    document.body.style.overflow = '';
  }

  // Enlarge any slideshow image on click
  document.querySelectorAll('.slides .slide img').forEach(function (img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function () {
      open(img.currentSrc || img.src, img.alt);
    });
  });

  // Enlarge standalone figures that link to an image (leave PDF links alone)
  document.querySelectorAll('.case-figure a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (!/\.(jpe?g|png|webp|gif)$/i.test(href)) return;
    var img = a.querySelector('img');
    a.style.cursor = 'zoom-in';
    a.addEventListener('click', function (e) {
      e.preventDefault();
      open(href, img ? img.alt : '');
    });
  });

  lb.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
