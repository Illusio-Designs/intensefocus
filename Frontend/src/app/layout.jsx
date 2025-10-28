import "./globals.css";
import LoaderProvider from "../components/LoaderProvider";

export const metadata = {
  title: "Stallion Eyewear",
  description: "Your Vision, Our Passion",
  icons: {
    icon: '/favicon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  other: {
    'color-scheme': 'light only',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{colorScheme: 'light'}}>
      <head>
        <link
          rel="preload"
          href="/SpoofTrial-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <meta name="color-scheme" content="light only" />
      </head>
      <body className="antialiased" style={{colorScheme: 'light'}}>
        <LoaderProvider>
          {children}
        </LoaderProvider>
      </body>
    </html>
  );
}
