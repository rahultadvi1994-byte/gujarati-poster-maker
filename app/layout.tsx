import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_Gujarati } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';

const notoGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-gujarati',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ગુજરાત પોસ્ટર મેકર | Gujarat Poster Maker',
  description: 'બધા જ પ્રકારના ગુજરાતી પોસ્ટર બનાવો - સરકારી યોજના, તહેવાર, બિઝનેસ, રાજકીય પોસ્ટર',
  openGraph: {
    title: 'ગુજરાત પોસ્ટર મેકર',
    description: 'બધા જ પ્રકારના ગુજરાતી પોસ્ટર બનાવો',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="gu" className={notoGujarati.variable}>
      <body className="font-gujarati antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
