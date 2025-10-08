class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer-section fix section-bg">
        <div class="shape-1">
            <img src="/assets/img/footer/shape-1.png" alt="img">
        </div>
        <div class="shape-2">
            <img src="/assets/img/footer/shape-2.png" alt="img">
        </div>
        <div class="container">
            <div class="footer-widgets-wrapper style-2">
                <div class="row">
                    <div class="col-xl-3 col-12 wow fadeInUp" data-wow-delay=".2s">
                        <div class="single-footer-widget">
                            <div class="widget-head">
                                <a href="/index.html">
                                    <img src="/assets/img/logo/logo.png" alt="logo-img" class="logo__img">
                                </a>
                            </div>
                            <div class="footer-content">
                                <p>Clearing space, reducing stress — one load at a time.</p>
                                <div class="social-icon d-flex align-items-center">
                                    <a href="https://www.facebook.com/profile.php?id=61580363502616" target="_blank"><i class="fab fa-facebook-f"></i></a>
                                    <a href="https://x.com/readynowjunkremoval" target="_blank"><i class="fab fa-twitter"></i></a>
                                    <a href="https://instagram.com/readynowjunkremoval" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-2 col-sm-12 col-md-6 col-lg-4 wow fadeInUp" data-wow-delay=".4s">
                        <div class="single-footer-widget">
                            <div class="widget-head">
                                <h3>Quick Links</h3>
                            </div>
                            <ul class="list-items">
                                <li><a href="/about.html"><i class="fa-regular fa-arrow-right-long"></i> About Us</a></li>
                                <li><a href="/pricing.html"><i class="fa-regular fa-arrow-right-long"></i> Pricing</a></li>
                                <li><a href="/faq.html"><i class="fa-regular fa-arrow-right-long"></i> FAQs</a></li>
                                <li><a href="/service.html"><i class="fa-regular fa-arrow-right-long"></i> Our Services</a></li>
                                <li><a href="/free-quote"><i class="fa-regular fa-arrow-right-long"></i> Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-4 col-sm-12 col-md-6 wow fadeInUp" data-wow-delay=".4s">
                        <div class="single-footer-widget">
                            <div class="widget-head">
                                <h3>Service Areas</h3>
                            </div>
                            <ul class="list-items d-flex gap-4 justify-content-between justify-content-xl-start">
                                <div>
                                    <li><a href="/service-areas/antelope.html"><i class="fa-regular fa-arrow-right-long"></i> Antelope</a></li>
                                    <li><a href="/service-areas/carmichael.html.html"><i class="fa-regular fa-arrow-right-long"></i> Carmichael</a></li>
                                    <li><a href="/service-areas/citrus-heights.html.html"><i class="fa-regular fa-arrow-right-long"></i> Citrus Heights</a></li>
                                    <li><a href="/service-areas/elk-grove.html.html"><i class="fa-regular fa-arrow-right-long"></i> Elk Grove</a></li>
                                    <li><a href="/service-areas/fair-oaks.html.html"><i class="fa-regular fa-arrow-right-long"></i> Fair Oaks</a></li>
                                    <li><a href="/service-areas/folsom.html.html"><i class="fa-regular fa-arrow-right-long"></i> Folsom</a></li>
                                    <li><a href="/service-areas/foothill-farms.html.html"><i class="fa-regular fa-arrow-right-long"></i> Foothill Farms</a></li>
                                    
                                </div>
                                <div>
                                    <li><a href="/service-areas/north-highlands.html.html"><i class="fa-regular fa-arrow-right-long"></i> North Highlands</a></li>
                                    <li><a href="/service-areas/orangevale.html.html"><i class="fa-regular fa-arrow-right-long"></i> Orangevale</a></li>
                                    <li><a href="/service-areas/rancho-cordova.html.html"><i class="fa-regular fa-arrow-right-long"></i> Rancho Cordova</a></li>
                                    <li><a href="/service-areas/rio-linda.html"><i class="fa-regular fa-arrow-right-long"></i> Rio Linda</a></li>
                                    <li><a href="/service-areas/rosemont.html"><i class="fa-regular fa-arrow-right-long"></i> Rosemont</a></li>
                                    <li><a href="/service-areas/sacramento.html"><i class="fa-regular fa-arrow-right-long"></i> Sacramento</a></li>
                                    <li><a href="/service-areas/vineyard.html"><i class="fa-regular fa-arrow-right-long"></i> Vineyard</a></li>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-3 col-sm-12 col-md-12 col-lg-8 wow fadeInUp" data-wow-delay=".8s">
                        <div class="single-footer-widget">
                            <div class="widget-head">
                                <h3>Newsletter</h3>
                            </div>
                            <div class="footer-content">
                                <p>
                                  Stay updated with exclusive offers, tips, and news from Ready Now Junk Removal. Sign up for our newsletter and never miss an update!
                                </p>
                                <form name="newsletter" method="POST" data-netlify="true" class="footer-input">
                                    <input type="email" name="email" placeholder="Your email address" required>
                                    <button class="theme-btn" type="submit">Subscribe Now</button>
                                </form>
                            </div>
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
