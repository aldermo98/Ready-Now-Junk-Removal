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
                                <a href="/index.html">
                                    <img src="/assets/img/logo/logo.svg" alt="logo-img" class="logo__img">
                                </a>
                            </div>
                            <div class="footer-content">
                                <p>Clearing space, reducing stress — one load at a time.</p>
                                <p>
                                    <a href="https://maps.apple/p/aihwI8kLI5eS7g" class="text-white">
                                        998 Riverfront St
                                        <br>
                                        West Sacramento, CA 95691
                                    </a>
                                </p>
                                <p>
                                    <a href="tel:+19162491009" class="text-white">(916) 249-1009</a>
                                </p>    
                                <div class="social-icon d-flex align-items-center">
                                    <a href="https://www.facebook.com/profile.php?id=61580363502616" target="_blank"><i class="fab fa-facebook-f"></i></a>
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
                                <li><a href="/about.html"><i class="fa-regular fa-arrow-right-long"></i> About Us</a></li>
                                <li><a href="/services/furniture-removal.html"><i class="fa-regular fa-arrow-right-long"></i> Services</a></li>
                                <li><a href="/service-areas/antelope.html"><i class="fa-regular fa-arrow-right-long"></i> Service Areas</a></li>
                                <li><a href="/pricing.html"><i class="fa-regular fa-arrow-right-long"></i> Pricing</a></li>
                                <li><a href="/faq.html"><i class="fa-regular fa-arrow-right-long"></i> FAQs</a></li>
                                <li><a href="/blog.html"><i class="fa-regular fa-arrow-right-long"></i> Blog</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-3 col-sm-6 wow fadeInUp" data-wow-delay=".4s">
                        <div class="single-footer-widget">
                            <div class="widget-head">
                                <h3>Popular Services</h3>
                            </div>
                            <ul class="list-items">
                                <li><a href="/services/furniture-removal.html"><i class="fa-regular fa-arrow-right-long"></i> All Services</a></li>
                                <li><a href="/services/appliance-removal.html"><i class="fa-regular fa-arrow-right-long"></i> Appliance Removal</a></li>
                                <li><a href="/services/furniture-removal.html"><i class="fa-regular fa-arrow-right-long"></i> Furniture Removal</a></li>
                                <li><a href="/services/garage-cleanouts.html"><i class="fa-regular fa-arrow-right-long"></i> Garage Cleanouts</a></li>
                                <li><a href="/services/storage-unit-cleanouts.html"><i class="fa-regular fa-arrow-right-long"></i> Storage Unit Cleanouts</a></li>
                                <li><a href="/services/estate-and-eviction-cleanouts.html"><i class="fa-regular fa-arrow-right-long"></i> Estate & Eviction Cleanouts</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-4 col-sm-12 col-md-12 col-lg-8 wow fadeInUp" data-wow-delay=".8s">
                        <div class="single-footer-widget">
                            <div class="widget-head">
                                <h3>Business Hours: 24/7</h3>
                            </div>
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3119.23753997139!2d-121.51925228794916!3d38.5743773716772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa430f18f45ba9317%3A0x601e8202c6173881!2sThe%20Right%20Way%20Home%20Services!5e0!3m2!1sen!2sus!4v1760687234918!5m2!1sen!2sus" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="container">
                    <div class="footer-bottom-wrapper">
                        <p>
                            &copy; <span id="ready-footer-year"></span> by <a href="/index.html">Ready Now Junk Removal</a>. All rights reserved.
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
