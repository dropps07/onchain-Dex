'use client'

import React from 'react';
import { useWallet } from '@/context/WalletContext';

const ConnectWallet: React.FC = () => {
  const { address, connectWallet, disconnectWallet } = useWallet();

  const handleClick = () => {
    if (address) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-80 transition-colors"
    >
      {address ? `Disconnect (${address.slice(0, 6)}...${address.slice(-4)})` : 'Connect Wallet'}
    </button>
  );
};

export default ConnectWallet;