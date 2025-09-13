import Link from "next/link";

export default function NavBar() {
  return (
    <div className="navbar bg-base-100 px-4 lg:px-8">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl font-bold">
          🔍 Fovea
        </Link>
      </div>

      <div className="navbar-end">
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <Link href="/measure" className="btn btn-ghost font-medium">
                Measure Your Focus
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="btn btn-ghost font-medium">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/about" className="btn btn-ghost font-medium">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="btn btn-ghost font-medium">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
