class CustomHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <!-- Offcanvas Area Start -->
      <div class="fix-area">
          <div class="offcanvas__info">
              <div class="offcanvas__wrapper">
                  <div class="offcanvas__content">
                      <div class="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                          <div class="offcanvas__logo">
                              <a href="index.html">
                                  <img src="assets/img/logo/logo.png" alt="logo-img">
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
                                      <a href="mailto:morenoalder98@gmail.com">morenoalder98@gmail.com</a>
                                  </div>
                              </li>
                              <li class="d-flex align-items-center">
                                  <div class="offcanvas__contact-icon mr-15">
                                      <i class="fal fa-clock"></i>
                                  </div>
                                  <div class="offcanvas__contact-text">
                                      <a target="_blank" href="#">Mon-Fri, 9am - 5pm</a>
                                  </div>
                              </li>
                              <li class="d-flex align-items-center">
                                  <div class="offcanvas__contact-icon mr-15">
                                      <i class="far fa-phone"></i>
                                  </div>
                                  <div class="offcanvas__contact-text">
                                      <a href="tel:+19163901005">+19163901005</a>
                                  </div>
                              </li>
                          </ul>
                          <div class="header-button mt-4">
                              <a href="contact.html" class="theme-btn text-center">
                                  <span>get A Quote<i class="fa-solid fa-arrow-right-long"></i></span>
                              </a>
                          </div>
                          <div class="social-icon d-flex align-items-center">
                              <a href="#"><i class="fab fa-facebook-f"></i></a>
                              <a href="#"><i class="fab fa-twitter"></i></a>
                              <a href="#"><i class="fab fa-instagram"></i></a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="offcanvas__overlay"></div>

      <!-- Header Section Start -->
      <header class="header-section-2">
          <div class="header-top-section fix">
              <div class="container-fluid">
                  <div class="header-top-wrapper">
                      <h6><img src="assets/img/logo/location.png" alt="">Need help?  Call us: <a href="tel:+8001234567890">(+800) 1234 5678 90</a>  or  <a href="mailto:info@example.com">info@example.com</a></h6>
                      <div class="top-right">
                          <div class="social-icon d-flex align-items-center">
                              <span>Follow Us:</span>
                              <a href="#"><i class="fab fa-facebook-f"></i></a>
                              <a href="#"><i class="fab fa-twitter"></i></a>
                              <a href="#"><i class="fa-brands fa-instagram"></i></a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div id="header-sticky" class="header-1">
              <div class="container-fluid">
                  <div class="mega-menu-wrapper">
                      <div class="header-main">
                          <div class="logo">
                              <a href="index.html" class="header-logo">
                                  <img src="assets/img/logo/logo.png" alt="logo-img">
                              </a>
                          </div>
                          <div class="header-left">
                              <div class="mean__menu-wrapper">
                                  <div class="main-menu">
                                      <nav id="mobile-menu">
                                          <ul>
                                              <li>
                                                  <a href="/index.html">Home</a>
                                              </li>
                                              <li>
                                                  <a href="/about.html">About Us</a>
                                              </li>
                                              <li>
                                                  <a href="/pricing.html">Pricing</a>
                                              </li>
                                              <li class="has-dropdown active menu-thumb">
                                                  <a href="/services/furniture-removal.html">
                                                  Services
                                                  </a>
                                                  <ul class="submenu has-homemenu">
                                                      <li>
                                                          <div class="homemenu-items">
                                                              <div class="homemenu">
                                                                  <div class="homemenu-thumb">
                                                                      <img src="/assets/img/header/furniture-removal-thumbnail.jpg" alt="img">
                                                                      <div class="demo-button">
                                                                          <a href="/services/furniture-removal.html" class="theme-btn">
                                                                              View
                                                                          </a>
                                                                      </div>
                                                                  </div>
                                                                  <div class="homemenu-content text-center">
                                                                      <h4 class="homemenu-title">
                                                                          Furniture Removal
                                                                      </h4>
                                                                  </div>
                                                              </div>
                                                              <div class="homemenu">
                                                                  <div class="homemenu-thumb mb-15">
                                                                      <img src="/assets/img/header/appliance-removal-thumbnail.jpg" alt="img">
                                                                      <div class="demo-button">
                                                                          <a href="/services/appliance-removal.html" class="theme-btn">
                                                                              View
                                                                          </a>
                                                                      </div>
                                                                  </div>
                                                                  <div class="homemenu-content text-center">
                                                                      <h4 class="homemenu-title">
                                                                          Appliance Removal
                                                                      </h4>
                                                                  </div>
                                                              </div>
                                                              <div class="homemenu">
                                                                  <div class="homemenu-thumb mb-15">
                                                                      <img src="/assets/img/header/garage-cleanouts-thumbnail.jpg" alt="img">
                                                                      <div class="demo-button">
                                                                          <a href="/services/garage-cleanouts.html" class="theme-btn">
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
                                                                      <img src="/assets/img/header/yard-waste-removal-thumbnail.jpg" alt="img">
                                                                      <div class="demo-button">
                                                                          <a href="/services/yard-waste-removal.html" class="theme-btn">
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
                                                                      <img src="/assets/img/header/construction-debris-removal-thumbnail.jpg" alt="img">
                                                                      <div class="demo-button">
                                                                          <a href="/services/construction-debris-removal.html" class="theme-btn">
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
                                                          </div>
                                                          <div>
                                                              <div class="d-flex align-items-center my-4">
                                                                  <hr class="flex-grow-1 me-3" style="border-top: 2px solid #ccc;">
                                                                  <h4 class="mb-0 text-nowrap" style="font-weight: 600;">More Services</h4>
                                                                  <hr class="flex-grow-1 ms-3" style="border-top: 2px solid #ccc;">
                                                              </div>
                                                              <div class="row">
                                                                  <div class="col-3 py-2"><a href="services/estate-and-eviction-cleanouts.html" class="fw-light">Estate & Eviction Cleanouts</a></div>
                                                                  <div class="col-3 py-2"><a href="services/hot-tub-removal.html" class="fw-light">Hot Tub Removal</a></div>
                                                                  <div class="col-3 py-2"><a href="services/hoarder-house-cleanouts.html" class="fw-light">Hoarder House Cleanouts</a></div>
                                                                  <div class="col-3 py-2"><a href="services/light-demolition.html" class="fw-light">Light Demolition</a></div>
                                                                  <div class="col-3 py-2"><a href="services/storage-unit-cleanouts.html" class="fw-light">Storage Unit Cleanouts</a></div>
                                                                  <div class="col-3 py-2"><a href="services/office-and-commerical-cleanouts.html" class="fw-light">Office & Commerical Cleanouts</a></div>
                                                                  <div class="col-3 py-2"><a href="services/donation-pickup-services.html" class="fw-light">Donation Pickup Services</a></div>
                                                                  <div class="col-3 py-2"><a href="services/storm-debris-cleanup.html" class="fw-light">Storm Debris Cleanup</a></div>
                                                                  <div class="col-3 py-2"><a href="services/event-and-festival-cleanup.html" class="fw-light">Event & Festival Cleanup</a></div>
                                                              </div>
                                                          </div>
                                                      </li>
                                                  </ul>
                                              </li>
                                              <li class="has-dropdown active d-xl-none">
                                                  <a href="team.html" class="border-none">
                                                      Services
                                                  </a>
                                                  <ul class="submenu">
                                                      <li><a href="services/furniture-removal.html">Furniture Removal</a></li>
                                                      <li><a href="services/appliance-removal.html">Appliance Removal</a></li>
                                                      <li><a href="services/garage-cleanouts.html">Garage Cleanouts</a></li>
                                                      <li><a href="services/yard-waste-removal.html">Yard Waste Removal</a></li>
                                                      <li><a href="services/construction-debris-removal.html">Construction Debris Removal</a></li>
                                                      <li><a href="services/estate-and-eviction-cleanouts.html">Estate & Eviction Cleanouts</a></li>
                                                      <li><a href="services/hot-tub-removal.html">Hot Tub Removal</a></li>
                                                      <li><a href="services/hoarder-house-cleanouts.html">Hoarder House Cleanouts</a></li>
                                                      <li><a href="services/light-demolition.html">Light Demolition</a></li>
                                                      <li><a href="services/storage-unit-cleanouts.html">Storage Unit Cleanouts</a></li>
                                                      <li><a href="services/office-and-commerical-cleanouts.html">Office & Commerical Cleanouts</a></li>
                                                      <li><a href="services/donation-pickup-services.html">Donation Pickup Services</a></li>
                                                      <li><a href="services/storm-debris-cleanup.html">Storm Debris Cleanup</a></li>
                                                      <li><a href="services/event-and-festival-cleanup.html">Event & Festival Cleanup</a></li>
                                                  </ul>
                                              </li>
                                              <li>
                                                  <a href="contact.html">Contact Us</a>
                                              </li>
                                          </ul>
                                      </nav>
                                  </div>
                              </div>
                          </div>
                          <div class="header-right d-flex justify-content-end align-items-center">
                              
                              <div class="header__hamburger d-xl-block my-auto">
                                  <div class="sidebar__toggle">
                                      <img src="assets/img/logo/bar.png" alt="img">
                                  </div>
                              </div>
                              <div class="header-button">
                                  <a href="contact.html" class="theme-btn">
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

customElements.define('custom-header', CustomHeader);