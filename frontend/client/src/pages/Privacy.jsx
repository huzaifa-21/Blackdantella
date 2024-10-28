import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
const Privacy = () => {
  return (
    <div className="privacy-policy">
      <Container>
        <h1>Privacy Policy for Blackdantella</h1>
        <div className="date">
          <b>Effective Date :</b> 20/09/2024
        </div>
        <p className="m-4 ms-0">
          At <b>Blackdantella</b>, we value your privacy and are committed to
          protecting your personal data. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit
          our website,{" "}
          <b>
            <Link to="/">blackdantella.com</Link>
          </b>
          , and any associated services.
        </p>
        <ol>
          <li>
            <h4> Information We Collect</h4>
            <p>
              We collect information to provide a better experience and improve
              our services. The types of information we collect include:
            </p>
            <ol type="A">
              <li>
                <h5> Personal Information</h5>{" "}
                <p>
                  When you use our Services, we may collect the following
                  personal information from you:
                </p>
                <ul>
                  <li>
                    <b>Contact information</b> (e.g., name, email address, phone
                    number).
                  </li>
                  <li>
                    <b>Payment information</b> (e.g., credit card details,
                    billing address).
                  </li>
                  <li>
                    <b>Account details</b> if you register with us (e.g.,
                    username, password).
                  </li>
                </ul>
              </li>
              <li>
                {" "}
                <h5> Non-Personal Information</h5>{" "}
                <p>We may also collect non-personal information such as:</p>
                <ul>
                  <li>
                    <b>Device information</b> (e.g., IP address, browser type).
                  </li>
                  <li>
                    <b>Usage data</b> (e.g., pages visited, time spent on the
                    website).
                  </li>
                </ul>
              </li>
            </ol>
          </li>
          <li>
            <h4>How We Use Your Information</h4>
            <p>We use your information to:</p>
            <ul>
              <li>
                <b>Provide and maintain our Services</b>, including processing
                transactions and managing your account.
              </li>
              <li>
                <b>Improve our services</b> by analyzing website performance and
                user behavior.
              </li>
              <li>
                <b>Communicate with you</b> regarding your account, purchases,
                and promotions.
              </li>
              <li>
                <b>Comply with legal obligations</b> as required under UAE law.
              </li>
            </ul>
          </li>
          <li>
            <h4>Cookies and Tracking Technologies</h4>
            <p>We use cookies and similar tracking technologies to:</p>
            <ul>
              <li>
                <b>Enhance your user experience</b> by remembering your
                preferences.
              </li>
              <li>
                <b>Analyze website traffic</b> to improve our website's
                functionality and performance.
              </li>
            </ul>
          </li>
          <li>
            <h4>How We Share Your Information</h4>
            <p>
              We do not sell or rent your personal information. However, we may
              share your information:
            </p>
            <ul>
              <li>
                <b>With service providers</b> who help us operate our business
                (e.g., payment processors, hosting services).
              </li>
              <li>
                <b>To comply with UAE laws</b>, legal processes, or regulatory
                requirements.
              </li>
              <li>
                <b>With third-party analytics tools</b> to understand website
                traffic and user behavior.
              </li>
            </ul>
          </li>
          <li>
            <h4>Security of Your Information</h4>
            <p>
              We use appropriate technical and organizational measures to
              protect your personal data from unauthorized access, disclosure,
              alteration, or destruction. However, no security system is
              impenetrable, and we cannot guarantee the complete security of
              your information.
            </p>
          </li>
          <li>
            <h4>Your Rights</h4>
            <p>
              As a user in the UAE, you have certain rights regarding your
              personal data:
            </p>
            <ul>
              <li>
                <b>Access: </b>You have the right to request access to your
                personal information.
              </li>
              <li>
                <b>Correction:</b> You may request correction of inaccurate or
                incomplete personal information.
              </li>
              <li>
                <b>Deletion:</b> You may request the deletion of your personal
                data, subject to certain legal conditions.
              </li>
              <li>
                <b>Objection:</b> You may object to the processing of your
                personal data for certain purposes.
              </li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at {}
              <b>
                <a href="mailto:Blackdantella@gmail.com">
                  Blackdantella@gmail.com
                </a>
              </b>
              .
            </p>
          </li>
          <li>
            <h4> Data Retention</h4>
            <p>
              We will retain your personal information for as long as necessary
              to fulfill the purposes outlined in this Privacy Policy, or as
              required by law.
            </p>
          </li>
          <li>
            <h4> Third-Party Links</h4>
            <p>
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices of such websites, and we
              encourage you to review their privacy policies before providing
              any personal information.
            </p>
          </li>
          <li>
            <h4>Changes to This Privacy Policy</h4>
            <p>
              We reserve the right to update this Privacy Policy at any time.
              Any changes will be effective when we post the revised policy on
              our website. We encourage you to review this Privacy Policy
              periodically.
            </p>
          </li>
          <li>
            <h4>Contact Us</h4>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us at:
            </p>
            <h5>Blackdantella</h5>
            <p className="mb-0">
              Email: {""}
              <a href="mailto:Blackdantella@gmail.com">
                <b>Blackdantella@gmail.com</b>
              </a>
            </p>
            <p>
              Phone: {""} <b>+971522826161</b>
            </p>
          </li>
        </ol>
      </Container>
    </div>
  );
};

export default Privacy;
