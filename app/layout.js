import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AppContext, AppProvider } from "./context/context";
import Provider from "./Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Digital Gram Panchayat",
  description: "Digital Gram Panchayat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <Toaster />
          <div className="w-full max-h-[99vh]">
            <Provider>{children}</Provider>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
