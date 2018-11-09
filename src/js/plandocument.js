(function(){
  function initImageExpand() {
    let figs = document
      .querySelectorAll('.plandoc-image-left, .plandoc-image-right');
    for (let i = 0; i < figs.length; i++) {
      let fig = figs[i];
      let icon = document.createElement('ion-icon');
      icon.name = 'expand';
      let button = document.createElement('button');
      button.classList.add('plandoc-image-expander');
      button.appendChild(icon);
      button.setAttribute('aria-hidden', 'true');
      button.addEventListener('click', function(e) {
        showImageExpand(fig);
      });
      button.title = 'View image larger';
      let wrapper = document.createElement('div');
      wrapper.classList.add('plandoc-image-wrapper');
      wrapper.appendChild(fig.querySelector('img'));
      wrapper.appendChild(button);
      fig.insertBefore(wrapper, fig.childNodes[0]);
    }
    document.body.addEventListener('keydown', function(e) {
      if (e.keyCode === 27) hideImageExpand();
    });
  }

  function showImageExpand(fig) {
    let overlay = document.createElement('div');
    overlay.classList.add('plandoc-overlay');
    overlay.appendChild(fig.cloneNode(true));
    document.body.appendChild(overlay);
    overlay.addEventListener('click', hideImageExpand);
    overlay.querySelector('ion-icon').remove();
    let button = overlay.querySelector('button');
    button.title = 'Close image';
    let icon = document.createElement('ion-icon');
    icon.name = 'contract';
    button.appendChild(icon);
  }

  function hideImageExpand() {
    let overlay = document.querySelector('div.plandoc-overlay');
    if (overlay) overlay.remove();
  }

  initImageExpand();
})();
