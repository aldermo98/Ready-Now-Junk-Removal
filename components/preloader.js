class CustomPreloader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="preloader" class="preloader">
        <div class="animation-preloader">
          <div class="position-relative">
            <div class="spinner"></div>
            <img src="/assets/img/logo/logo.png" alt="logo-img" class="position-absolute top-50 start-50 translate-middle">
          </div>
          <div class="txt-loading">
            <span data-text-preloader="R" class="letters-loading">R</span>
            <span data-text-preloader="E" class="letters-loading">E</span>
            <span data-text-preloader="A" class="letters-loading">A</span>
            <span data-text-preloader="D" class="letters-loading">D</span>
            <span data-text-preloader="Y" class="letters-loading">Y</span>
            <span data-text-preloader=" " class="letters-loading"> </span>
            <span data-text-preloader="N" class="letters-loading">N</span>
            <span data-text-preloader="O" class="letters-loading">O</span>
            <span data-text-preloader="W" class="letters-loading">W</span>
          </div>
          <p class="text-center">Junk Removal</p>
        </div>
        <div class="loader">
          <div class="row">
            <div class="col-3 loader-section section-left"><div class="bg"></div></div>
            <div class="col-3 loader-section section-left"><div class="bg"></div></div>
            <div class="col-3 loader-section section-right"><div class="bg"></div></div>
            <div class="col-3 loader-section section-right"><div class="bg"></div></div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('custom-preloader', CustomPreloader);
