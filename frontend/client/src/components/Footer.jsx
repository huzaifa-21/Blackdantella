import React from "react";
import { assets } from "../assets/assets";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faSnapchat,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <div className="row">
          <div className="col-12 col-md-6 col-lg-3">
            <img width={300} height={100} src={assets.black_logo} alt="" />
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <div className="quick-links">
              <span className="footer-head">Quick Links</span>
              <ul>
                <li>
                  <Link to="">Our Story</Link>
                </li>
                <li>
                  <Link to="/policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms">Terms & Conditions</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <div className="social-accounts">
              <span className="footer-head">Follow Us</span>
              <ul>
                <li>
                  <a
                    aria-label="follow us on facebook account"
                    target="_blank"
                    href="https://www.facebook.com/profile.php?id=61550969580928&mibextid=ZbWKwL"
                  >
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                </li>
                <li>
                  <a
                    aria-label="follow us on Tiktok account"
                    target="_blank"
                    href="https://www.tiktok.com/@blackdantella"
                  >
                    <FontAwesomeIcon icon={faTiktok} />
                  </a>
                </li>
                <li>
                  <a
                    aria-label="follow us on Instagram account"
                    target="_blank"
                    href="https://www.instagram.com/black.dantella"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                </li>
                <li>
                  <a
                    aria-label="follow us on Snapchat account"
                    target="_blank"
                    href="https://snapchat.com/t/8J14GFo0"
                  >
                    <FontAwesomeIcon icon={faSnapchat} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <span className="footer-head">Contact Us</span>
            <ul>
              <li>
                <p>
                  UAE – Abu Dhabi – Al Mushrif – near WOMAN UNION – Khoor laffan
                  – Al Ghuwali street
                </p>
              </li>
              <li>
                {" "}
                Whatsapp : <span>+971522826161</span>{" "}
              </li>
              <li>
                Email :{" "}
                <a href="mailto:blackdantella@gmail.com">
                  blackdantella@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="copyrights  ">
          Copyright &copy;2024.<Link to="/">Blackdantella</Link> , All Rights
          Reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
