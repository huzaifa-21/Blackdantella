import React from "react";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const TermsAndCondition = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions</title>
        <link rel="canonical" href="https://www.blackdantella.com/terms" />
      </Helmet>
      <div className="terms">
        <Container>
          <h1>Terms and Conditions</h1>
          <div className="date">
            <b>Effective Date :</b> 20/09/2024
          </div>
          <p className="m-4 ms-0">
            Welcome to Blackdantella. These Terms and Conditions govern your use
            of our website,{" "}
            <b>
              <Link to="/">blackdantella.com</Link>
            </b>
            , and our products and services. By accessing or using the Services,
            you agree to comply with and be bound by these Terms and Conditions.
          </p>
          <ol>
            <li>
              <h4> Acceptance of Terms</h4>
              <p>
                By using our Services, you confirm that you have read,
                understood, and agreed to these Terms and Conditions and any
                other applicable laws and regulations. If you do not agree to
                these terms, please do not use our Services.
              </p>
            </li>
            <li>
              <h4>Eligibility</h4>
              <p>To use the Services, you must:</p>
              <ul>
                <li>
                  Be at least 18 years of age or have permission from a parent
                  or guardian.
                </li>
                <li>
                  Agree to comply with all applicable laws in the UAE and any
                  other local laws and regulations.
                </li>
              </ul>
            </li>
            <li>
              <h4>Use of Our Services</h4>
              <p>
                You agree to use the Services for lawful purposes only. You
                shall not:
              </p>
              <ul>
                <li>
                  Engage in fraudulent, misleading, or illegal activities.
                </li>
                <li>
                  Distribute or upload harmful or malicious software (e.g.,
                  viruses, malware).
                </li>
                <li>Interfere with the operation or security of the Site.</li>
                <li>
                  Attempt to gain unauthorized access to the Site or any
                  associated systems.
                </li>
              </ul>
            </li>
            <li>
              <h4>Account Registration</h4>
              <p>
                To make a purchase or access certain features of the Site, you
                may be required to create an account. You agree to:
              </p>
              <ul>
                <li>Provide accurate and up-to-date information.</li>
                <li>Keep your account credentials confidential.</li>
                <li>
                  Be responsible for all activities that occur under your
                  account.
                </li>
              </ul>
            </li>
            <li>
              <h4>Purchases and Payments</h4>
              <p>When making a purchase through our Site, you agree to:</p>
              <ul>
                <li>
                  Pay the total price listed for the products, including any
                  applicable taxes and shipping fees.
                </li>
                <li>Provide valid payment information.</li>
                <li>
                  Understand that all sales are final unless otherwise stated in
                  our return policy.
                </li>
              </ul>
              <p className="mt-3">
                We reserve the right to refuse or cancel any order at our
                discretion, particularly in cases of suspected fraud or
                unauthorized transactions.
              </p>
            </li>
            <li>
              <h4>Shipping and Delivery</h4>
              <p>
                We will process and deliver orders in accordance with our
                Shipping Policy, which can be found on our website. Delivery
                times are estimates and may vary due to external factors beyond
                our control (e.g., customs clearance, courier delays).
              </p>
            </li>
            <li>
              <h4> Returns and Refunds</h4>
              <p>
                If you are not satisfied with your purchase, please refer to our
                Return Policy for information on how to request a return or
                refund. All returns must meet the conditions outlined in the
                policy to be eligible for a refund or exchange.
              </p>
            </li>
            <li>
              <h4> Intellectual Property</h4>
              <p>
                All content on the Site, including text, graphics, logos,
                images, and software, is the intellectual property of{" "}
                <b>Blackdantella</b> or its licensors. You may not copy,
                reproduce, distribute, or create derivative works from any of
                the content without our prior written permission.
              </p>
            </li>
            <li>
              <h4>Third-Party Links</h4>
              <p>
                Our Site may contain links to third-party websites or services.
                We do not control or endorse these websites and are not
                responsible for their content or practices. You access
                third-party websites at your own risk.
              </p>
            </li>
            <li>
              <h4>Limitation of Liability</h4>
              <p>
                To the fullest extent permitted by law, <b>Blackdantella</b>{" "}
                shall not be liable for any direct, indirect, incidental,
                special, or consequential damages arising out of or related to
                your use of the Services. This includes, but is not limited to,
                damages for loss of profits, data, or other intangible losses.
              </p>
            </li>
            <li>
              <h4>Indemnification</h4>
              <p>
                You agree to indemnify and hold <b>Blackdantella</b> harmless
                from any claims, damages, or expenses (including legal fees)
                arising out of your use of the Services or violation of these
                Terms and Conditions.
              </p>
            </li>
            <li>
              <h4>Governing Law</h4>
              <p>
                These Terms and Conditions shall be governed by and construed in
                accordance with the laws of the United Arab Emirates. Any
                disputes arising out of or relating to these Terms shall be
                subject to the exclusive jurisdiction of the courts of the UAE.
              </p>
            </li>
            <li>
              <h4> Changes to These Terms</h4>
              <p>
                We reserve the right to update or modify these Terms and
                Conditions at any time without prior notice. Any changes will be
                effective immediately upon posting on the Site. We encourage you
                to review these Terms regularly.
              </p>
            </li>
            <li>
              <h4>Termination</h4>
              <p>
                We reserve the right to terminate or suspend your access to our
                Services at any time, without notice, for any reason, including
                but not limited to your violation of these Terms and Conditions.
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
    </>
  );
};

export default TermsAndCondition;
