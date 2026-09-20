import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
export const metadata = { title: "Hourglass", description: "A quiet wall of things people keep. One piece takes the hour." };
export default async function RootLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="wrap">
          <nav className="top">
            <Link href="/" className="mark"><span className="glass" aria-hidden><i /></span>Hourglass</Link>
            <div className="nav-links">
              <Link href="/">The wall</Link>
              {user ? (<><Link href="/studio">Studio</Link><form action="/auth/signout" method="post"><button className="btn ghost" type="submit">Leave</button></form></>) : (<Link href="/login">Enter</Link>)}
            </div>
          </nav>
          {children}
          <footer className="site">
            <span>Public pieces stay on the wall. Private ones stay yours.</span>
            <span>The hour turns whether anyone is watching.</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
