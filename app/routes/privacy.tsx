import type { MetaFunction } from "react-router";
import { LegalPageShell, legalPageLinks } from "../components/legal";
import {
  APP_LEGAL_LAST_UPDATED,
  APP_SUPPORT_EMAIL,
  APP_TITLE,
} from "../utils/constants";

export const links = legalPageLinks;

export const meta: MetaFunction = () => [
  { title: `Privacy Policy — ${APP_TITLE}` },
  {
    name: "description",
    content: `Privacy Policy for ${APP_TITLE}, a Shopify app for storefront announcement bars.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      subtitle="How Smart Announcement Bar collects, uses, and protects information."
      currentPath="/privacy"
    >
      <p className="legal-meta">Last updated: {APP_LEGAL_LAST_UPDATED}</p>

      <p>
        This Privacy Policy describes how {APP_TITLE} (&quot;the App&quot;, &quot;we&quot;,
        &quot;us&quot;) handles information when merchants install and use the App on
        their Shopify stores. By installing or using the App, you agree to the practices
        described below.
      </p>

      <h2>1. Who this policy applies to</h2>
      <p>
        This policy applies to merchants who install the App in the Shopify admin. It
        also describes limited data stored in a shopper&apos;s browser when they interact
        with announcement bars on your storefront.
      </p>

      <h2>2. Information we process</h2>
      <p>When you use the App, we may process the following information:</p>
      <ul>
        <li>
          <strong>Shop and session data:</strong> Your shop domain and OAuth session
          details needed to authenticate the App inside Shopify.
        </li>
        <li>
          <strong>App configuration:</strong> Announcement bar settings you create,
          including messages, colors, links, coupon codes, scheduling rules, placement
          options, and optional custom CSS or HTML/JavaScript. This data is stored in
          your shop&apos;s app metafields in Shopify.
        </li>
        <li>
          <strong>Onboarding preferences:</strong> Setup choices such as whether
          onboarding was completed or skipped and your preferred bar placement.
        </li>
        <li>
          <strong>Technical logs:</strong> Basic server logs such as request timestamps
          and error messages used to operate and secure the App.
        </li>
      </ul>

      <h2>3. Storefront visitor data</h2>
      <p>
        The App does not collect customer names, emails, order details, or payment
        information from your storefront. When a shopper dismisses a bar, a small entry
        may be saved in the browser&apos;s local storage on their device so the bar stays
        hidden until its content changes. This information stays on the shopper&apos;s
        device and is not sent to our servers.
      </p>

      <h2>4. How we use information</h2>
      <p>We use the information above to:</p>
      <ul>
        <li>Provide, operate, and maintain the App</li>
        <li>Save and sync your announcement bar settings to your storefront</li>
        <li>Authenticate your Shopify admin session</li>
        <li>Respond to support requests and fix technical issues</li>
        <li>Comply with legal obligations and enforce our terms</li>
      </ul>

      <h2>5. Shopify&apos;s role</h2>
      <p>
        The App is built for Shopify. Your store data is processed through Shopify&apos;s
        platform and APIs. Shopify&apos;s own privacy practices apply to data handled by
        Shopify. We encourage you to review{" "}
        <a
          href="https://www.shopify.com/legal/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Shopify&apos;s Privacy Policy
        </a>
        .
      </p>

      <h2>6. Data sharing</h2>
      <p>
        We do not sell your personal information. We may share information only when
        necessary to:
      </p>
      <ul>
        <li>Provide hosting and infrastructure services that run the App</li>
        <li>Comply with applicable law, regulation, or legal process</li>
        <li>Protect the rights, safety, and security of merchants, shoppers, or the App</li>
      </ul>

      <h2>7. Data retention and deletion</h2>
      <p>
        App configuration is stored in your Shopify shop metafields while the App is
        installed. OAuth session data is kept only as long as needed to operate the App.
        When you uninstall the App, we receive Shopify&apos;s app/uninstalled webhook and
        delete associated app sessions from our systems. You may remove announcement bar
        settings from your shop by uninstalling the App or clearing the related app
        metafield data in Shopify.
      </p>

      <h2>8. Security</h2>
      <p>
        We use reasonable administrative, technical, and organizational measures to
        protect information processed by the App. No method of transmission or storage is
        completely secure, and we cannot guarantee absolute security.
      </p>

      <h2>9. Your choices and rights</h2>
      <p>
        You can update or delete announcement bar content at any time in the App admin.
        Depending on your location, you may have rights to access, correct, or delete
        personal information we hold about you as a merchant. To make a request, contact
        us using the details below.
      </p>

      <h2>10. International transfers</h2>
      <p>
        Information may be processed in countries other than your own, including where
        our hosting providers operate. We take steps designed to protect information
        when it is processed across borders.
      </p>

      <h2>11. Children</h2>
      <p>
        The App is intended for merchants using Shopify and is not directed to children.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will revise
        the &quot;Last updated&quot; date at the top of this page. Continued use of the
        App after changes become effective means you accept the updated policy.
      </p>

      <h2>13. Contact us</h2>
      <p>
        If you have questions about this Privacy Policy or how we handle data, contact us
        at{" "}
        <a href={`mailto:${APP_SUPPORT_EMAIL}`}>{APP_SUPPORT_EMAIL}</a>.
      </p>
    </LegalPageShell>
  );
}
