import { Geist, Geist_Mono } from "next/font/google";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

import MyNavbar from "./components/nav"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <>
          <MyNavbar />
        </>
        {children}
      </body>
    </html>
  );
}