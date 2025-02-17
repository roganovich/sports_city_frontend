import type { Metadata } from "next";
import Header from '@components/Header';
import Footer from '@components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css'; // Импорт стилей Bootstrap

import "./main.css";

export const metadata: Metadata = {
  title: "Спортивный город",
  description: "Резервирование спортивной площадки",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
        className={`service-details-page`}
      >
        <Header />
        <main className="main">
        {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
