import React from 'react';
import styles from './Terms.module.css';

function Terms({ onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Terms and Privacy Policy</h2>
        <div className={styles.policyText}>
          <h3>1. Terms of Service</h3>
          <p>
            Welcome to Baguio Teachers Camp's Guest Portal. By accessing or using our services,
            you agree to be bound by these Terms of Service. Please read them carefully.
            We reserve the right to modify these terms at any time.
          </p>
          <p>
            You agree not to misuse our services. This includes, but is not limited to,
            attempting to gain unauthorized access, interfering with service operation,
            or engaging in any activity that violates applicable laws.
          </p>

          <h3>2. Privacy Policy</h3>
          <p>
            Your privacy is important to us. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you visit our website
            and use our services.
          </p>
          <h4>Information We Collect:</h4>
          <ul>
            <li>**Personal Data:** Email, First Name, Last Name, Password (encrypted).</li>
            <li>**Usage Data:** Information on how the service is accessed and used.</li>
          </ul>
          <h4>How We Use Your Information:</h4>
          <ul>
            <li>To provide and maintain our service.</li>
            <li>To manage your account.</li>
            <li>To contact you with service updates or promotional offers.</li>
            <li>To monitor the usage of our service.</li>
          </ul>
          <h4>Disclosure of Your Information:</h4>
          <p>
            We may disclose your Personal Data in the good faith belief that such action
            is necessary to comply with a legal obligation, protect and defend our rights
            or property, prevent or investigate possible wrongdoing in connection with the Service,
            or protect the personal safety of users of the Service or the public.
          </p>
          <p>
            We implement reasonable security measures to protect your Personal Data.
            However, no method of transmission over the Internet or method of electronic
            storage is 100% secure.
          </p>
          <p>
            By using our services, you consent to our collection and use of your information
            as described in this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Terms;