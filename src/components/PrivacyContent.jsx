import React from 'react';
import siteConfig from '../data/siteConfig.json';

export default function PrivacyContent() {
  return (
    <div className="policy-content">
            <h2 className="highlight">PRIVACY POLICY</h2>
            <p className="text-justify">
              This privacy policy sets out how the <span className="highlight">{siteConfig.title}</span> uses and
              protects any information that you give us when you use this website. The {siteConfig.title} is committed
              to ensuring that your privacy is protected.
            </p>
            <p className="text-justify">
              Should we ask you to provide certain information by which you can be identified when using this website,
              you can be assured that it will only be used in accordance with this privacy statement.
            </p>
            <p className="text-justify">
              The <span className="highlight">{siteConfig.title}</span> may change this policy from time to time by
              updating this page. You should check this page from time to time to ensure that you are happy with any
              changes. This policy is effective from 1st January 2023.
            </p>

            <hr />
            <h2 className="highlight">WHAT WE COLLECT</h2>
            <div className="text-justify">
              We may collect the following information:
              <ul>
                <li>1. Name and job title</li>
                <li>2. Contact information including email address</li>
                <li>3. Demographic information such as postcode, preferences and interests</li>
                <li>4. Other information relevant to customer surveys and/or offers</li>
              </ul>
            </div>
            <p className="text-justify">
              What we do with the information we gather We require this information to build and maintain the quality
              and integrity of the website. We also use this to understand your needs and provide a better service, and
              in particular for the following reasons:
            </p>

            <h2 className="highlight">INTERNAL RECORD KEEPING</h2>
            <p className="text-justify">We may use the information to improve our products and services.</p>
            <p className="text-justify">
              We may periodically send promotional emails about new products, special offers or other information,
              which we think you may find interesting using the email address that you have provided.
            </p>
            <p className="text-justify">
              From time to time, we may also use your information to contact you for market research purposes. We may
              contact you by email, phone, fax or mail. We may use the information to customise the website according
              to your interests.
            </p>

            <h2 className="highlight">SECURITY</h2>
            <p className="text-justify">
              We are committed to ensuring that your information is secure. In order to prevent unauthorised access or
              disclosure we have put in place suitable physical, electronic and managerial procedures to safeguard and
              secure the information we collect online.
            </p>

            <h2 className="highlight">HOW WE USE COOKIES</h2>
            <p className="text-justify">
              A cookie is a small file which asks permission to be placed on your computer’s hard drive. Once you agree,
              the file is added and the cookie helps analyse web traffic or lets you know when you visit a particular
              site. Cookies allow web applications to respond to you as an individual. The web application can tailor
              its operations to your needs, likes and dislikes by gathering and remembering information about your
              preferences.
            </p>
            <p className="text-justify">
              We use traffic log cookies to identify which pages are being used. This helps us analyse data about web
              page traffic and improve our website in order to tailor it to customer needs. We only use this
              information for statistical analysis purposes and then the data is removed from the system.
            </p>
            <p className="text-justify">
              Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find
              useful and which you do not. A cookie in no way gives us access to your computer or any information about
              you, other than the data you choose to share with us.
            </p>
            <p className="text-justify">
              You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can
              usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking
              full advantage of the website.
            </p>

            <h2 className="highlight">LINKS TO OTHER WEBSITES</h2>
            <p className="text-justify">
              Our website may contain links to other websites of interest. However, once you have used these links to
              leave our site, you should note that we do not have any control over any external website that isn’t part
              of The <span className="highlight">{siteConfig.title}</span>.
            </p>
            <p className="text-justify">
              Therefore, we cannot be responsible for the protection and privacy of any information which you provide
              whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise
              caution and look at the privacy statement applicable to the website in question.
            </p>

            <h2 className="highlight">CONTROLLING YOUR PERSONAL INFORMATION</h2>
            <p className="text-justify">
              We will not sell, distribute or lease your personal information to third parties unless we have your
              permission or are required to do so by law. We may use your personal information to send you promotional
              information about third parties that we think you may find interesting if you tell us that you wish this
              to happen.
            </p>
            <p className="text-justify">
              You may request details of personal information that we hold about you under the Data Protection Act 1998.
              A small fee may be payable. If you would like a copy of the information held on you please email{' '}
              <span className="highlight">{siteConfig.email}</span>.
            </p>
            <p className="text-justify">
              If you believe that any information we are holding on you is incorrect or incomplete, please write to or
              email us as soon as possible, at the above address. We will promptly correct any information found to be
              incorrect.
            </p>
            <br />
    </div>
  );
}
