import type { ReactNode } from "react";
import { Link } from "react-router";
import legalStyles from "../../styles/legal.css?url";
import { APP_SUPPORT_EMAIL, APP_TITLE } from "../../utils/constants";

export const legalPageLinks = () => [{ rel: "stylesheet", href: legalStyles }];

interface LegalPageShellProps {
  title: string;
  subtitle: string;
  currentPath: "/privacy" | "/faq";
  children: ReactNode;
}

export function LegalPageShell({
  title,
  subtitle,
  currentPath,
  children,
}: LegalPageShellProps) {
  return (
    <div className="legal-page">
      <header className="legal-page__header">
        <div className="legal-page__header-inner">
          <Link className="legal-page__brand" to="/">
            {APP_TITLE}
          </Link>
          <h1 className="legal-page__title">{title}</h1>
          <p className="legal-page__subtitle">{subtitle}</p>
          <nav className="legal-page__nav" aria-label="Legal pages">
            <Link
              to="/privacy"
              aria-current={currentPath === "/privacy" ? "page" : undefined}
            >
              Privacy Policy
            </Link>
            <Link
              to="/faq"
              aria-current={currentPath === "/faq" ? "page" : undefined}
            >
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      <main className="legal-page__main">
        <div className="legal-card">{children}</div>
      </main>

      <footer className="legal-page__footer">
        <div className="legal-page__footer-inner">
          <span>
            © {new Date().getFullYear()} {APP_TITLE}
          </span>
          <div className="legal-page__footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/faq">FAQ</Link>
            <a href={`mailto:${APP_SUPPORT_EMAIL}`}>Contact support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
