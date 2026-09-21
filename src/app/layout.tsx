import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";
import InitUser from "@/InitUser";
import AutopartFooter from "@/components/autopartFooter";
import { FlyingCartProvider } from "@/components/FlyingCartContext";

export const metadata: Metadata = {
  title: "AutoPartsHub",
  description: "A trusted auto parts seller across Pakistan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen flex flex-col bg-gradient-to-b from-black to-white antialiased">
        <Provider>
          <InitUser />
          <FlyingCartProvider>
            {/* Main content takes remaining vertical space */}
            <main className="flex-1 w-full">
              {children}
            </main>
          </FlyingCartProvider>
          {/* Footer shows on every page at the bottom */}
          <AutopartFooter />
        </Provider>
      </body>
    </html>
  );
}