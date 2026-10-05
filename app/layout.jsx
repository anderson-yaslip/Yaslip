import { Montserrat, Nunito, Zen_Old_Mincho } from "next/font/google";
import "./globals.scss";

// Títulos, números e rótulos. Fonte variável (todos os pesos num arquivo).
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

// Textos corridos, descrições e botões. Fonte variável.
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

// Só a letra inicial de alguns títulos (classe .initial).
const mincho = Zen_Old_Mincho({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-mincho",
  display: "swap",
});

export const metadata = {
  title: "Yaslip - Seu Site na 1ª Página do Google",
  description:
    "A Yaslip une design, tecnologia, SEO e estratégia para transformar sua presença digital em novas oportunidades de negócio.",
};

export const viewport = {
  themeColor: "#f6f4f8",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${nunito.variable} ${mincho.variable}`}>
      <body>{children}</body>
    </html>
  );
}
