"use client";

import { WalletProvider } from '@/context/WalletContext';

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-black to-green-950" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />

      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-green-500/10 via-transparent to-transparent blur-3xl transform rotate-12 animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-green-500/10 via-transparent to-transparent blur-3xl transform -rotate-12 animate-pulse delay-1000" />
      </div>

      {children}
    </WalletProvider>
  );
}
