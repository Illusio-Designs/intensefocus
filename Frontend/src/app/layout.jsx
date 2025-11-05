import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import LoaderProvider from "../components/LoaderProvider";
import ToastContainerProvider from "../components/ToastContainerProvider";

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
        {/* Prevent browser pinch-zoom on mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="color-scheme" content="light only" />
      </head>
      <body className="antialiased" style={{colorScheme: 'light'}}>
        <LoaderProvider>
          <ToastContainerProvider>
            {children}
          </ToastContainerProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
