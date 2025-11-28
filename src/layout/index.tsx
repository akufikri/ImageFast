import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Use wider max-width for editor page
  const maxWidth = location.pathname === '/editor' ? 'max-w-7xl' : 'max-w-[1080px]';

  return (
    <section className="min-h-screen">
      <Navbar />
      <div className={`${maxWidth} mx-auto`}>{children}</div>
      <Footer />
    </section>
  );
}
