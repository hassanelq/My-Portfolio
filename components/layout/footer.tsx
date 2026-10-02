import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navigation, site } from "@/content/site";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link href="/" className="footer-name">
          {site.name}
          <span>.</span>
        </Link>
        <p>
          Mathematics, markets,
          <br />
          and the things we can build.
        </p>
        <div className="footer-socials">
          <a href={site.github} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={14} />
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight size={14} />
          </a>
          <a href={`mailto:${site.email}`}>
            Email <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Hassan EL QADI</span>
        <nav aria-label="Footer navigation">
          {navigation.slice(1).map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <span>
          MA <span className="status-dot" /> Casablanca
        </span>
      </div>
    </footer>
  );
}
