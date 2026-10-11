import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-KTCW2P13V8";

export const metadata: Metadata = {
  metadataBase: new URL("https://simuladordehacker.com.br"),
  title: "Simulador de Hacker (RPG) — HackerLife",
  description:
    "Simulador de Hacker em formato RPG: evolua seu personagem, faça missões, gerencie riscos, ganhe reputação e construa sua vida no submundo digital no HackerLife. Jogue no navegador.",
  robots: { index: true, follow: true },
  verification: { google: "V1ODZl8IBP_xIrHPMXIbPAXRPgsNaR4iqaHhosNK4_k" },
  alternates: { canonical: "/" },
  openGraph: {
    locale: "pt_BR",
    type: "website",
    url: "https://simuladordehacker.com.br/",
    title: "Simulador de Hacker (RPG) — HackerLife",
    description:
      "Simulador de Hacker em formato RPG: evolua seu personagem, faça missões, gerencie riscos, ganhe reputação e construa sua vida no submundo digital no HackerLife.",
  },
  twitter: {
    card: "summary",
    title: "Simulador de Hacker (RPG) — HackerLife",
    description:
      "Simulador de Hacker em formato RPG: evolua seu personagem, faça missões, gerencie riscos, ganhe reputação e construa sua vida no submundo digital no HackerLife.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1117",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        {/* Google Analytics (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
