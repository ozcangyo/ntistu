import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

export const metadata = { title: "MedAI" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <div className="pointer-events-none fixed -top-24 -left-20 h-72 w-72 rounded-full bg-fuchsia-400/25 blur-3xl animate-float" />
          <div className="pointer-events-none fixed bottom-10 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl animate-pulseSlow" />
          <Nav role={session?.user?.role} email={session?.user?.email} />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
