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
                    <div class="col-xl-4 col-sm-6 col-md-6 col-lg-4 wow fadeInUp" data-wow-delay=".2s">
                        <div class="single-footer-widget">
                            <div class="widget-head">
                                <a href="/index.html">
                                    <img src="/assets/img/logo/logo.png" alt="logo-img">
                                </a>
                            </div>
                            <div class="footer-content">
                                <p>Clearing space, reducing stress — one load at a time.</p>
                                <div class="social-icon d-flex align-items-center">
                                    <a href="https://facebook.com/readynowjunkremoval" target="_blank"><i class="fab fa-facebook-f"></i></a>
                                    <a href="https://x.com/readynowjunkremoval" target="_blank"><i class="fab fa-twitter"></i></a>
                                    <a href="https://instagram.com/readynowjunkremoval" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-4 col-sm-6 col-md-6 col-lg-4 wow fadeInUp" data-wow-delay=".4s">
                        <div class="single-footer-widget">
                            <div class="widget-head">
                                <h3>Quick Links</h3>
                            </div>
                            <ul class="list-items">
                                <li><a href="/about.html"><i class="fa-regular fa-arrow-right-long"></i> About Us</a></li>
                                <li><a href="/pricing.html"><i class="fa-regular fa-arrow-right-long"></i> Pricing</a></li>
                                <li><a href="/service.html"><i class="fa-regular fa-arrow-right-long"></i> Our Services</a></li>
                                <li><a href="/contact.html"><i class="fa-regular fa-arrow-right-long"></i> Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-4 col-sm-12 col-md-12 col-lg-8 wow fadeInUp" data-wow-delay=".8s">
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
