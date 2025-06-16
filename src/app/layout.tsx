import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { SoundProvider } from '@/context/SoundContext';

export const metadata = {
  title: 'B&WEdu',
  description: 'Black and White Edu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SoundProvider>
            {children}
          </SoundProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
