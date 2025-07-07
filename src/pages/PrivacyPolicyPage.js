import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-14 text-zinc-100">
      <h1 className="text-4xl font-bold mb-4 text-cyan-400">Privacy Policy</h1>
      <p className="mb-6 text-lg">
        <b>Last updated:</b> July 2025
      </p>

      <h2 className="text-2xl font-bold mb-3 mt-8">1. Introduction</h2>
      <p className="mb-4">
        CinemAI ("we", "us", or "our") is committed to protecting your privacy and personal data. This Privacy Policy describes how we collect, use, store, share, and protect your information when you use CinemAI, our website, mobile applications, and any related services.
      </p>

      <h2 className="text-2xl font-bold mb-3 mt-8">2. What Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>
          <b>Account Information:</b> Name, username, email address, password, gender, birth date, preferences, and other profile data.
        </li>
        <li>
          <b>Usage Data:</b> IP address, browser/device info, access times, pages viewed, links clicked, and other activity logs.
        </li>
        <li>
          <b>Content Data:</b> User-generated content, messages, uploaded videos, reviews, and feedback.
        </li>
        <li>
          <b>Payment Data:</b> (If you subscribe) Partial payment information may be collected and processed securely by third-party providers.
        </li>
        <li>
          <b>Cookies and Tracking:</b> Data from cookies, local storage, analytics, and other tracking technologies (see section 6).
        </li>
      </ul>

      <h2 className="text-2xl font-bold mb-3 mt-8">3. How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>To provide, maintain, and improve CinemAI services.</li>
        <li>To create and manage user accounts and profiles.</li>
        <li>To personalize your experience, show recommendations, and remember your preferences.</li>
        <li>To communicate with you about your account, subscriptions, platform updates, and promotions.</li>
        <li>To process payments and manage subscriptions.</li>
        <li>To monitor, detect, and prevent fraud, abuse, or violations of our Terms.</li>
        <li>To comply with legal obligations and protect our rights.</li>
      </ul>

      <h2 className="text-2xl font-bold mb-3 mt-8">4. How We Share Your Data</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>
          <b>With Service Providers:</b> We may share data with hosting, analytics, payment processors, support, and other partners who help us operate CinemAI.
        </li>
        <li>
          <b>Legal Requirements:</b> We may disclose your data if required by law, regulation, subpoena, or to protect CinemAI, our users, or the public.
        </li>
        <li>
          <b>With Your Consent:</b> We may share your information for other purposes with your explicit consent.
        </li>
        <li>
          <b>Community and Social:</b> If you publish content or participate in social features, some information (e.g., username, profile, reviews) may be visible to others.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mb-3 mt-8">5. Data Security</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>We use industry-standard security measures (encryption, HTTPS, access controls) to protect your personal data.</li>
        <li>Despite our efforts, no method of transmission or storage is 100% secure. Please keep your password confidential and notify us of any suspected breach.</li>
      </ul>

      <h2 className="text-2xl font-bold mb-3 mt-8">6. Cookies & Tracking Technologies</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>
          CinemAI uses cookies, local storage, and similar technologies to enable features, analyze usage, remember preferences, and deliver personalized ads and recommendations.
        </li>
        <li>
          You can control or delete cookies in your browser settings, but some platform features may not work correctly if cookies are disabled.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mb-3 mt-8">7. International Transfers</h2>
      <p className="mb-4">
        Your data may be stored and processed in the European Union, United States, or other countries where CinemAI or our partners operate. We comply with applicable laws on data transfers and ensure adequate protections.
      </p>

      <h2 className="text-2xl font-bold mb-3 mt-8">8. Your Rights</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>
          <b>Access:</b> You can request a copy of your data we hold.
        </li>
        <li>
          <b>Correction:</b> You may request corrections to inaccurate or incomplete data.
        </li>
        <li>
          <b>Deletion:</b> You can request deletion of your account and personal data, subject to legal limits.
        </li>
        <li>
          <b>Withdraw Consent:</b> You can withdraw consent for processing where applicable.
        </li>
        <li>
          <b>Object/Restrict:</b> You can object to or restrict certain processing in specific circumstances.
        </li>
        <li>
          To exercise these rights, contact us at <a href="mailto:support@cinemai.live" className="underline text-cyan-400">support@cinemai.live</a> or via the Contact page.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mb-3 mt-8">9. Data Retention</h2>
      <p className="mb-4">
        We retain your data as long as your account is active or as needed for legal, business, or security purposes. Data may be deleted upon request, except where retention is required by law.
      </p>

      <h2 className="text-2xl font-bold mb-3 mt-8">10. Children's Privacy</h2>
      <p className="mb-4">
        CinemAI is not intended for children under 16. We do not knowingly collect or process personal data from minors. If you believe a child has provided us data, please contact us for removal.
      </p>

      <h2 className="text-2xl font-bold mb-3 mt-8">11. Changes to this Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy at any time. Material changes will be announced via the platform or by email where possible. Continued use of CinemAI after changes constitutes acceptance of the new Policy.
      </p>

      <h2 className="text-2xl font-bold mb-3 mt-8">12. Contact Us</h2>
      <p className="mb-2">
        For questions or concerns about your privacy or this Policy, contact us at <a href="mailto:support@cinemai.live" className="underline text-cyan-400">support@cinemai.live</a> or via the <a href="/contact" className="underline text-cyan-400">Contact page</a>.
      </p>
      <p className="mt-12 text-xs text-zinc-400">
        By using CinemAI, you consent to the collection and use of your data as described in this Privacy Policy.
      </p>
    </div>
  );
}
