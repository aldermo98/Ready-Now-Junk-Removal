class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer-section fix section-bg">
        <div class="shape-1">
            <img src="/assets/img/footer/shape-1.webp" alt="img">
        </div>
        <div class="shape-2">
            <img src="/assets/img/footer/shape-2.webp" alt="img">
        </div>
        <div class="container">
            <div class="footer-widgets-wrapper style-2">
                <div class="row">
                    <div class="col-xl-3 col-12 wow fadeInUp" data-wow-delay=".2s">
                        <div class="single-footer-widget">
                            <div class="widget-head">
                                <a href="/">
                                    <img src="/assets/img/logo/logo.png" alt="Ready Now Junk Removal logo" class="logo__img">
                                </a>
                            </div>
                            <div class="footer-content">
                                <p>Clearing space, reducing stress — one load at a time.</p>
                                <p>
                                    <a href="https://maps.apple/p/aihwI8kLI5eS7g" class="text-white">
                                        998 Riverfront St Apt 309
                                        <br>
                                        West Sacramento, CA 95691
                                    </a>
                                </p>
                                <p>
                                    <a href="tel:+19162491009" class="text-white">(916) 249-1009</a>
                                </p>    
                                <div class="social-icon d-flex align-items-center">
                                    <a href="https://www.facebook.com/readynowjunkremoval" target="_blank"><i class="fab fa-facebook-f"></i></a>
                                    <a href="https://instagram.com/readynowjunkremoval" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                                    <a href="https://www.tiktok.com/@ready.now.junk.removal"><i class="fab fa-tiktok"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-2 col-sm-6 col-lg-4 wow fadeInUp" data-wow-delay=".4s">
                        <div class="single-footer-widget">
                            <div class="widget-head">
                                <h3>Quick Links</h3>
                            </div>
                            <ul class="list-items">
                                <li><a href="/free-quote"><i class="fa-regular fa-arrow-right-long"></i> Free Quote</a></li>
                                <li><a href="/about"><i class="fa-regular fa-arrow-right-long"></i> About Us</a></li>
                                <li><a href="/services"><i class="fa-regular fa-arrow-right-long"></i> Services</a></li>
                                <li><a href="/pricing"><i class="fa-regular fa-arrow-right-long"></i> Pricing</a></li>
                                <li><a href="/service-areas/"><i class="fa-regular fa-arrow-right-long"></i> Service Areas</a></li>
                                <li><a href="/faq"><i class="fa-regular fa-arrow-right-long"></i> FAQs</a></li>
                                <li><a href="/blog/"><i class="fa-regular fa-arrow-right-long"></i> Blog</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-3 col-sm-6 wow fadeInUp" data-wow-delay=".4s">
                        <div class="single-footer-widget">
                            <div class="widget-head">
                                <h3>Popular Services</h3>
                            </div>
                            <ul class="list-items">
                                <li><a href="/services"><i class="fa-regular fa-arrow-right-long"></i> All Services</a></li>
                                <li><a href="/services/appliance-removal"><i class="fa-regular fa-arrow-right-long"></i> Appliance Removal</a></li>
                                <li><a href="/services/furniture-removal"><i class="fa-regular fa-arrow-right-long"></i> Furniture Removal</a></li>
                                <li><a href="/services/garage-cleanouts"><i class="fa-regular fa-arrow-right-long"></i> Garage Cleanouts</a></li>
                                <li><a href="/services/storage-unit-cleanouts"><i class="fa-regular fa-arrow-right-long"></i> Storage Unit Cleanouts</a></li>
                                <li><a href="/services/estate-and-eviction-cleanouts"><i class="fa-regular fa-arrow-right-long"></i> Estate & Eviction Cleanouts</a></li>
                                <li><a href="/services/dump-trailer-rental"><i class="fa-regular fa-arrow-right-long"></i> Dump Trailer Rental</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-4 col-sm-12 col-md-12 col-lg-8 wow fadeInUp" data-wow-delay=".8s">
                        <div class="single-footer-widget">
                            <div class="widget-head">
                                <h3>Business Hours: 24/7</h3>
                            </div>
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3119.229310525389!2d-121.52077032058457!3d38.57456690336563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x69505da5816e535d%3A0x786860f6ca3900ff!2sReady%20Now%20Junk%20Removal!5e0!3m2!1sen!2sus!4v1766526170899!5m2!1sen!2sus" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer-areas text-center py-3" style="border-top:1px solid rgba(255,255,255,.12);">
                <p class="text-white mb-0" style="font-size:14px;line-height:2;">Junk removal in: <a href="/service-areas/west-sacramento" class="text-white">West Sacramento</a> &middot; <a href="/service-areas/davis" class="text-white">Davis</a> &middot; <a href="/service-areas/woodland" class="text-white">Woodland</a> &middot; <a href="/service-areas/sacramento" class="text-white">Sacramento</a> &middot; <a href="/service-areas/natomas" class="text-white">Natomas</a> &middot; <a href="/service-areas/land-park" class="text-white">Land Park</a> &middot; <a href="/service-areas/pocket" class="text-white">Pocket</a> &middot; <a href="/service-areas/south-natomas" class="text-white">South Natomas</a> &middot; <a href="/service-areas/north-natomas" class="text-white">North Natomas</a> &middot; <a href="/service-areas/arden-arcade" class="text-white">Arden-Arcade</a> &middot; <a href="/service-areas/carmichael" class="text-white">Carmichael</a> &middot; <a href="/service-areas/fair-oaks" class="text-white">Fair Oaks</a> &middot; <a href="/service-areas/citrus-heights" class="text-white">Citrus Heights</a> &middot; <a href="/service-areas/orangevale" class="text-white">Orangevale</a> &middot; <a href="/service-areas/antelope" class="text-white">Antelope</a> &middot; <a href="/service-areas/north-highlands" class="text-white">North Highlands</a> &middot; <a href="/service-areas/foothill-farms" class="text-white">Foothill Farms</a> &middot; <a href="/service-areas/rio-linda" class="text-white">Rio Linda</a> &middot; <a href="/service-areas/rancho-cordova" class="text-white">Rancho Cordova</a> &middot; <a href="/service-areas/rosemont" class="text-white">Rosemont</a> &middot; <a href="/service-areas/elk-grove" class="text-white">Elk Grove</a> &middot; <a href="/service-areas/vineyard" class="text-white">Vineyard</a> &middot; <a href="/service-areas/folsom" class="text-white">Folsom</a> &middot; <a href="/service-areas/roseville" class="text-white">Roseville</a> &middot; <a href="/service-areas/rocklin" class="text-white">Rocklin</a> &middot; <a href="/service-areas/lincoln" class="text-white">Lincoln</a> &middot; <a href="/service-areas/granite-bay" class="text-white">Granite Bay</a> &middot; <a href="/service-areas/el-dorado-hills" class="text-white">El Dorado Hills</a></p>
            </div>
            <div class="footer-bottom">
                <div class="container">
                    <div class="footer-bottom-wrapper">
                        <p>
                            &copy; <span id="ready-footer-year"></span> by <a href="/">Ready Now Junk Removal</a>. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </footer>
    `;

    // Set the current year
    this.querySelector('#ready-footer-year').textContent = new Date().getFullYear();
  }
}

customElements.define('custom-footer', CustomFooter);

// ---- Lead tracking + mobile action bar (runs once per page) ----
(function () {
  if (window.__rnLeadInit) return;
  window.__rnLeadInit = true;

  // Send an event to Google Analytics (gtag is added by the host; fall back to dataLayer)
  function track(name, params) {
    params = Object.assign({ page_path: location.pathname }, params || {});
    try {
      if (typeof window.gtag === 'function') { window.gtag('event', name, params); }
      else { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: name }, params)); }
    } catch (e) {}
  }

  // Track taps on phone, text and quote links anywhere on the site
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var where = a.closest('.rn-mobile-bar') ? 'mobile_bar' : (a.closest('header, custom-header, custom-header-2') ? 'header' : (a.closest('footer, custom-footer') ? 'footer' : 'page'));
    if (href.indexOf('tel:') === 0) track('phone_call_click', { link_location: where });
    else if (href.indexOf('sms:') === 0) track('text_message_click', { link_location: where });
    else if (/\/free-quote|\/book|app\.readynowjunkremoval\.com|^#quote$/.test(href)) track('quote_click', { link_location: where });
  }, true);

  // Sticky Call / Text / Free Quote bar on phones
  function addBar() {
    if (document.querySelector('.rn-mobile-bar')) return;
    var css = document.createElement('style');
    css.textContent =
      '.rn-mobile-bar{position:fixed;left:0;right:0;bottom:0;z-index:9999;display:none;background:#0f1d3a;box-shadow:0 -2px 10px rgba(0,0,0,.25);padding:8px 8px calc(8px + env(safe-area-inset-bottom));gap:8px}' +
      '.rn-mobile-bar a{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;height:46px;border-radius:6px;font-weight:700;font-size:15px;text-decoration:none;color:#fff;border:1px solid rgba(255,255,255,.35)}' +
      '.rn-mobile-bar a.rn-primary{background:#60AC45;border-color:#60AC45}' +
      '@media (max-width:767px){.rn-mobile-bar{display:flex}body{padding-bottom:70px}#back-top{bottom:80px!important}}';
    document.head.appendChild(css);
    var bar = document.createElement('div');
    bar.className = 'rn-mobile-bar';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Contact Ready Now Junk Removal');
    bar.innerHTML =
      '<a href="tel:+19162491009"><i class="fa-solid fa-phone"></i> Call</a>' +
      '<a href="sms:+19162491009"><i class="fa-solid fa-comment"></i> Text</a>' +
      '<a href="/free-quote" class="rn-primary">Free Quote</a>';
    document.body.appendChild(bar);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addBar); else addBar();
})();
