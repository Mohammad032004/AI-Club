import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatbotWidget from "@/components/ui/ChatbotWidget";

/**
 * PUBLIC LAYOUT
 * Applied to: /, /about, /events, /projects, /resources, /contact, /apply
 * Wraps public pages with Navbar + Footer + Chatbot.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
