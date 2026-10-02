import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function NotFound() {
  return (
    <div className="page-container not-found">
      <p className="eyebrow">404 / OUTSIDE THE MODEL</p>
      <h1>
        This page
        <br />
        doesn’t add up.
      </h1>
      <p>The address may have changed. Let’s get you back.</p>
      <Link href="/" className="button button-primary">
        Back to overview <ArrowUpRight size={17} />
      </Link>
    </div>
  );
}
