import type { MetaFunction } from "react-router";
import { LegalPageShell, legalPageLinks } from "../components/legal";
import { APP_SUPPORT_EMAIL, APP_TITLE } from "../utils/constants";

export const links = legalPageLinks;

export const meta: MetaFunction = () => [
  { title: `FAQ — ${APP_TITLE}` },
  {
    name: "description",
    content: `Frequently asked questions about ${APP_TITLE} for Shopify stores.`,
  },
];

const FAQ_ITEMS = [
  {
    question: "What does Smart Announcement Bar do?",
    answer:
      "Smart Announcement Bar lets you create and manage promotional message bars for your Shopify storefront. You can share sales, shipping updates, coupon codes, and call-to-action links in a bar at the top or bottom of your store, on the cart page, or inside the cart drawer.",
  },
  {
    question: "How do I show bars on my storefront?",
    answer:
      "After installing the app, enable the Smart Announcement Bar app embed in your theme. In the Shopify admin, go to Online Store → Themes → Customize, open App embeds, and turn on Smart Announcement Bar. Then create a bar in the app and publish it.",
  },
  {
    question: "What types of announcement bars can I create?",
    answer:
      "You can create three display styles: Simple (a static message), Running (scrolling ticker text), and Rotating (multiple messages that change automatically). Each bar can include an optional coupon code, button, or text link.",
  },
  {
    question: "Where can announcement bars appear?",
    answer:
      "You can place bars as a top or bottom site-wide bar, on the cart page, or at the top of the cart drawer. For site-wide bars, you can also choose specific pages and devices, set sticky behavior, and schedule start and end dates.",
  },
  {
    question: "Will the app slow down my store?",
    answer:
      "The app uses a lightweight theme app extension that loads your saved bar settings from your shop metafields. It is designed to add minimal overhead compared with heavy custom theme edits.",
  },
  {
    question: "Can I customize the design?",
    answer:
      "Yes. You can choose from design presets or set your own background, text, and button colors. You can also adjust font size, bar height, padding, border radius, and optional custom CSS or HTML/JavaScript for advanced styling.",
  },
  {
    question: "Does the app collect customer data?",
    answer:
      "The app does not collect customer names, emails, or order information. If a shopper dismisses a bar, a small preference may be stored in their browser so the bar stays hidden until its content changes. That data stays on their device.",
  },
  {
    question: "What happens when I uninstall the app?",
    answer:
      "When you uninstall the app, Shopify notifies us and we delete app session data from our systems. Your announcement bar settings remain in your shop metafields until you remove them. You should also disable the app embed in your theme if you no longer use the app.",
  },
  {
    question: "Why is my bar not visible on the storefront?",
    answer:
      "Check that the app embed is enabled in your theme, the bar is published, the current date falls within any schedule you set, and page or device targeting matches the page you are viewing. Also confirm the bar is not dismissed in your browser if dismissible mode is enabled.",
  },
  {
    question: "How do I get help or request a feature?",
    answer: `Contact us at ${APP_SUPPORT_EMAIL} or reach out through the support channel listed on the Shopify App Store listing.`,
  },
] as const;

export default function FaqPage() {
  return (
    <LegalPageShell
      title="Frequently Asked Questions"
      subtitle="Common questions about installing, configuring, and using Smart Announcement Bar."
      currentPath="/faq"
    >
      <div className="legal-faq-list">
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} className="legal-faq-item">
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </LegalPageShell>
  );
}
