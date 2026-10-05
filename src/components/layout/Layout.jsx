import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppState";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();
  const { notice } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col font-sans text-ink">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Header />
      {notice ? (
        <div role="status" className="border-b border-white/10 bg-pine text-paper">
          <p className="mx-auto max-w-6xl px-5 py-2.5 text-sm">{notice}</p>
        </div>
      ) : null}
      <main id="content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
