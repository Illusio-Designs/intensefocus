import "./globals.css";
import LoaderProvider from "../components/LoaderProvider";

export const metadata = {
  title: "Stallion Eyewear",
  description: "Your Vision, Our Passion",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/SpoofTrial-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <LoaderProvider>
          {children}
        </LoaderProvider>
      </body>
    </html>
  );
}
