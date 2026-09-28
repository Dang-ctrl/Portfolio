import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Curtain from "@/components/motion/Curtain";
import Reveals from "@/components/motion/Reveals";
import Cursor from "@/components/motion/Cursor";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <SmoothScroll />
      <Nav />
      <div id="main">
        {children}
        <Footer />
      </div>
      <Curtain />
      <Reveals />
      <Cursor />
    </>
  );
}
