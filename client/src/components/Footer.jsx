function Footer() {
  return (
    <footer className="starthack-footer">
      <div className="footer-content-wrapper">
        <div className="footer-left-col">
          <div className="footer-row">
            <button type="button" className="footer-btn">Login</button>
            <span className="footer-inline">
              <a href="#terms" className="footer-a">Terms</a>
              <span className="sep">&amp;</span>
              <a href="#privacy" className="footer-a">Privacy</a>
            </span>
          </div>

          <div className="footer-row">
            <div className="footer-inline-links">
              <a href="#how-it-works" className="footer-a">How it works</a>
              <span className="v-divider" />
              <span className="social-links">
                <a href="#discord" className="footer-a">Discord</a>
                <span>,</span>
                <a href="#x" className="footer-a">X</a>
                <span>,</span>
                <a href="#instagram" className="footer-a">Instagram</a>
              </span>
              <span className="v-divider" />
              <button type="button" className="theme-toggle-btn" aria-label="Toggle theme">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              </button>
            </div>
            <p className="copyright-text">© 2026 Mrolla Systems Pvt Ltd.</p>
          </div>
        </div>

        <div className="footer-right-col">
          <span className="brand-signature">Mrolla.io</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
