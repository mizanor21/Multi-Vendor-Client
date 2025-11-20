import "./globals.css";
import ClientProviders from "@/app/client-providers";
import SearchNavbar from "@/components/searchNavbar/SearchNavbar";
import CategoryNavbar from "@/components/landingPage/categoryNavbar/CategoryNavbar";
import Footer from "@/components/footer/Footer";

export const metadata = {
  title: "BD Plaza - Bangladesh's Trusted E-Marketplace",
  description: "Your one-stop solution for all your shopping needs in Bangladesh.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-[inter]">
      <body>
        <ClientProviders>
          <SearchNavbar />
          <main>{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
