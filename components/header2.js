class CustomHeader2 extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <!-- Offcanvas Area Start -->
      <div class="fix-area">
          <div class="offcanvas__info">
              <div class="offcanvas__wrapper">
                  <div class="offcanvas__content">
                      <div class="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                          <div class="offcanvas__logo">
                              <a href="/">
                                  <img src="/assets/img/logo/logo.png" alt="logo-img" width="150">
                              </a>
                          </div>
                          <div class="offcanvas__close">
                              <button>
                              <i class="fas fa-times"></i>
                              </button>
                          </div>
                      </div>
                      <p class="text d-none d-xl-block">
                          Clearing space, reducing stress — one load at a time.
                      </p>
                      <div class="mobile-menu fix mb-3"></div>
                      <div class="offcanvas__contact">
                          <h4>Contact Info</h4>
                          <ul>
                              
                              <li class="d-flex align-items-center">
                                  <div class="offcanvas__contact-icon mr-15">
                                      <i class="fal fa-envelope"></i>
                                  </div>
                                  <div class="offcanvas__contact-text">
                                      <a href="mailto:info@readynowjunkremoval.com">info@readynowjunkremoval.com</a>
                                  </div>
                              </li>
                              <li class="d-flex align-items-center">
                                  <div class="offcanvas__contact-icon mr-15">
                                      <i class="fal fa-clock"></i>
                                  </div>
                                  <div class="offcanvas__contact-text">
                                      Everyday, 8am - 6pm
                                  </div>
                              </li>
                              <li class="d-flex align-items-center">
                                  <div class="offcanvas__contact-icon mr-15">
                                      <i class="far fa-phone"></i>
                                  </div>
                                  <div class="offcanvas__contact-text">
                                      <a href="tel:+19162491009">(916) 249-1009</a>
                                  </div>
                              </li>
                          </ul>
                          <div class="header-button mt-4">
                              <a href="/free-quote" class="theme-btn text-center">
                                  <span>get A Quote<i class="fa-solid fa-arrow-right-long"></i></span>
                              </a>
                          </div>
                          <div class="social-icon d-flex align-items-center">
                              <a href="https://www.facebook.com/readynowjunkremoval"><i class="fab fa-facebook-f"></i></a>
                              <a href="https://www.instagram.com/readynowjunkremoval"><i class="fab fa-instagram"></i></a>
                              <a href="https://www.tiktok.com/@ready.now.junk.removal"><i class="fab fa-tiktok"></i></a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="offcanvas__overlay"></div>

      <!-- Header Section Start -->
      <header class="header-section">
          <div id="header-sticky" class="header-2 style-2">
              <div class="container">
                  <div class="mega-menu-wrapper">
                      <div class="header-main">
                          <div class="logo">
                              <a href="/" class="header-logo">
                                  <img src="/assets/img/logo/logo.png" alt="logo-img">
                              </a>
                          </div>
                          <div class="header-left">
                              <div class="mean__menu-wrapper">
                                  <div class="main-menu">
                                      <nav id="mobile-menu">
                                          <ul>
                                              <li>
                                                  <a href="/">Home</a>
                                              </li>
                                              <li>
                                                  <a href="/about">About Us</a>
                                              </li>
                                              <li class="has-dropdown active menu-thumb">
                                                  <a href="/services">
                                                  Services
                                                  </a>
                                                  <ul class="submenu has-homemenu">
                                                      <li>
                                                          <div class="homemenu-items">
                                                              <div class="homemenu">
                                                                  <div class="homemenu-thumb">
                                                                      <img src="/assets/img/header/furniture-removal-thumbnail.webp" alt="img">
                                                                      <div class="demo-button">
                                                                          <a href="/services/furniture-removal" class="theme-btn">
                                                                              View
                                                                          </a>
                                                                      </div>
                                                                  </div>
                                                                  <div class="homemenu-content text-center">
                                                                      <h4 class="homemenu-title">
                                                                          Furniture & Appliance Removal
                                                                      </h4>
                                                                  </div>
                                                              </div>
                                                              <div class="homemenu">
                                                                  <div class="homemenu-thumb mb-15">
                                                                      <img src="/assets/img/header/garage-cleanouts-thumbnail.webp" alt="img">
                                                                      <div class="demo-button">
                                                                          <a href="/services/garage-cleanouts" class="theme-btn">
                                                                              View
                                                                          </a>
                                                                      </div>
                                                                  </div>
                                                                  <div class="homemenu-content text-center">
                                                                      <h4 class="homemenu-title">
                                                                          Garage Cleanouts
                                                                      </h4>
                                                                  </div>
                                                              </div>
                                                              <div class="homemenu">
                                                                  <div class="homemenu-thumb mb-15">
                                                                      <img src="/assets/img/header/yard-waste-removal-thumbnail.webp" alt="img">
                                                                      <div class="demo-button">
                                                                          <a href="/services/yard-waste-removal" class="theme-btn">
                                                                              View
                                                                          </a>
                                                                      </div>
                                                                  </div>
                                                                  <div class="homemenu-content text-center">
                                                                      <h4 class="homemenu-title">
                                                                          Yard Waste & Debris Removal
                                                                      </h4>
                                                                  </div>
                                                              </div>
                                                              <div class="homemenu">
                                                                  <div class="homemenu-thumb mb-15">
                                                                      <img src="/assets/img/header/construction-debris-removal-thumbnail.webp" alt="img">
                                                                      <div class="demo-button">
                                                                          <a href="/services/construction-debris-removal" class="theme-btn">
                                                                              View
                                                                          </a>
                                                                      </div>
                                                                  </div>
                                                                  <div class="homemenu-content text-center">
                                                                      <h4 class="homemenu-title">
                                                                          Construction Debris Removal
                                                                      </h4>
                                                                  </div>
                                                              </div>
                                                              <div class="homemenu">
                                                                  <div class="homemenu-thumb mb-15">
                                                                      <img src="/assets/img/header/dump-trailer-rental-thumbnail.webp" alt="dump trailer rental">
                                                                      <div class="demo-button">
                                                                          <a href="/services/dump-trailer-rental" class="theme-btn">
                                                                              View
                                                                          </a>
                                                                      </div>
                                                                  </div>
                                                                  <div class="homemenu-content text-center">
                                                                      <h4 class="homemenu-title">
                                                                          Dump Trailer Rental
                                                                      </h4>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div>
                                                              <div class="d-flex align-items-center my-4">
                                                                  <hr class="flex-grow-1 me-3" style="border-top: 2px solid #ccc;">
                                                                  <h4 class="mb-0 text-nowrap" style="font-weight: 600;">More Services</h4>
                                                                  <hr class="flex-grow-1 ms-3" style="border-top: 2px solid #ccc;">
                                                              </div>
                                                              <div class="row">
                                                                  <div class="col-3 py-2"><a href="/services/estate-and-eviction-cleanouts" class="fw-light">Estate & Eviction Cleanouts</a></div>
                                                                  <div class="col-3 py-2"><a href="/services/hot-tub-removal" class="fw-light">Hot Tub Removal</a></div>
                                                                  <div class="col-3 py-2"><a href="/services/hoarder-house-cleanouts" class="fw-light">Hoarder House Cleanouts</a></div>
                                                                  <div class="col-3 py-2"><a href="/services/light-demolition" class="fw-light">Light Demolition</a></div>
                                                                  <div class="col-3 py-2"><a href="/services/storage-unit-cleanouts" class="fw-light">Storage Unit Cleanouts</a></div>
                                                                  <div class="col-3 py-2"><a href="/services/office-and-commerical-cleanouts" class="fw-light">Office & Commercial Cleanouts</a></div>
                                                                  <div class="col-3 py-2"><a href="/services/donation-pickup" class="fw-light">Donation Pickup</a></div>
                                                                  <div class="col-3 py-2"><a href="/services/storm-debris-cleanup" class="fw-light">Storm Debris Cleanup</a></div>
                                                                  <div class="col-3 py-2"><a href="/services/event-and-festival-cleanup" class="fw-light">Event & Festival Cleanup</a></div><div class="col-3 py-2"><a href="/services/couch-removal" class="fw-light">Couch Removal</a></div><div class="col-3 py-2"><a href="/services/mattress-removal" class="fw-light">Mattress Removal</a></div><div class="col-3 py-2"><a href="/services/shed-removal" class="fw-light">Shed Removal</a></div><div class="col-3 py-2"><a href="/services/electronics-recycling" class="fw-light">E-Waste & TV Removal</a></div>
                                                              </div>
                                                          </div>
                                                      </li>
                                                  </ul>
                                              </li>
                                              <li class="has-dropdown active d-xl-none">
                                                  <a href="/services" class="border-none">
                                                      Services
                                                  </a>
                                                  <ul class="submenu">
                                                      <li><a href="/services/furniture-removal">Furniture Removal</a></li>
                                                      <li><a href="/services/appliance-removal">Appliance Removal</a></li>
                                                      <li><a href="/services/garage-cleanouts">Garage Cleanouts</a></li>
                                                      <li><a href="/services/dump-trailer-rental">Dump Trailer Rental</a></li>
                                                      <li><a href="/services/yard-waste-removal">Yard Waste Removal</a></li>
                                                      <li><a href="/services/construction-debris-removal">Construction Debris Removal</a></li>
                                                      <li><a href="/services/estate-and-eviction-cleanouts">Estate & Eviction Cleanouts</a></li>
                                                      <li><a href="/services/hot-tub-removal">Hot Tub Removal</a></li>
                                                      <li><a href="/services/hoarder-house-cleanouts">Hoarder House Cleanouts</a></li>
                                                      <li><a href="/services/light-demolition">Light Demolition</a></li>
                                                      <li><a href="/services/storage-unit-cleanouts">Storage Unit Cleanouts</a></li>
                                                      <li><a href="/services/office-and-commerical-cleanouts">Office & Commercial Cleanouts</a></li>
                                                      <li><a href="/services/donation-pickup">Donation Pickup</a></li>
                                                      <li><a href="/services/storm-debris-cleanup">Storm Debris Cleanup</a></li>
                                                      <li><a href="/services/event-and-festival-cleanup">Event & Festival Cleanup</a></li>
                                                      <li><a href="/services/couch-removal">Couch Removal</a></li>
                                                      <li><a href="/services/mattress-removal">Mattress Removal</a></li>
                                                      <li><a href="/services/shed-removal">Shed Removal</a></li>
                                                      <li><a href="/services/electronics-recycling">E-Waste & TV Removal</a></li>
                                                  </ul>
                                              </li>
                                              <li class="has-dropdown">
                                                  <a href="/service-areas/">Service Areas</a>
                                                  <ul class="submenu">
                                                      <li><a href="/service-areas/west-sacramento">West Sacramento</a></li>
                                                      <li><a href="/service-areas/sacramento">Sacramento</a></li>
                                                      <li><a href="/service-areas/davis">Davis</a></li>
                                                      <li><a href="/service-areas/woodland">Woodland</a></li>
                                                      <li><a href="/service-areas/elk-grove">Elk Grove</a></li>
                                                      <li><a href="/service-areas/roseville">Roseville</a></li>
                                                      <li><a href="/service-areas/folsom">Folsom</a></li>
                                                      <li><a href="/service-areas/citrus-heights">Citrus Heights</a></li>
                                                      <li><a href="/service-areas/">All Service Areas</a></li>
                                                  </ul>
                                              </li>
                                              <li>
                                                  <a href="/pricing" class="border-none">Pricing</a>
                                              </li>
                                              <li>
                                                  <a href="/blog/" class="border-none">
                                                      Blog
                                                  </a>
                                              </li>
                                              <li>
                                                  <a href="/ppc" class="border-none">
                                                      Promotions
                                                  </a>
                                              </li>
                                          </ul>
                                      </nav>
                                  </div>
                              </div>
                          </div>
                          <div class="header-right d-flex justify-content-end align-items-center">
                              
                              <div class="header__hamburger d-xl-block my-auto">
                                  <div class="sidebar__toggle">
                                      <img src="/assets/img/logo/bar.webp" alt="img">
                                  </div>
                              </div>
                              <div class="header-button">
                                  <a href="/free-quote" class="theme-btn">
                                      <span>
                                          Get a quote
                                          <i class="fa-regular fa-angles-right"></i>
                                      </span>
                                    </a>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </header>
    `;
  }
}

customElements.define('custom-header-2', CustomHeader2);