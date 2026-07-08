import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "./context/context";
import Provider from "./Provider";

export const metadata = {
  title: "MeriPanchayat — Digital Gram Panchayat",
  description:
    "Digital Gram Panchayat — transparent, accessible, multilingual village governance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-paper text-ink antialiased">
        <AppProvider>
          <Toaster
            toastOptions={{
              style: {
                background: "#1f1f1f",
                color: "#ffffff",
                borderRadius: "10px",
                fontSize: "14px",
              },
            }}
          />
          <div className="w-full max-h-[99vh]">
            <Provider>{children}</Provider>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
