import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LangProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalBackground } from "@/components/ui/global-background";
import { AccessibilityButton } from "@/components/ui/accessibility-button";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartFood AI",
  description: "Optimiza tu nutrición con datos inteligentes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        "scroll-smooth",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col relative">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <GlobalBackground />
          <div className="relative z-10 w-full min-h-full flex flex-col">
            <LangProvider>{children}</LangProvider>
          </div>
          <AccessibilityButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
