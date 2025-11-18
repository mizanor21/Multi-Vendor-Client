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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientProviders>
          <div className="fixed top-0 left-0 w-full z-20 bg-white shadow-md">
            <SearchNavbar />
            <CategoryNavbar />
          </div>
          <main className="pt-[104px]">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
