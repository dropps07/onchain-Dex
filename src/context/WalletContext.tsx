// context/WalletContext.tsx

'use client'

import React, { ReactNode, useEffect, useState } from 'react';
import { createConfig, WagmiProvider, useAccount, useBalance as useWagmiBalance } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { http } from 'viem';
import { 
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme 
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

type ExtendedProvider = ethers.providers.ExternalProvider & {
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
};

// Define chains
const neoXTestnet = {
  id: 12227332,
  name: 'NeoX Testnet',
  network: 'neoxtestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'GAS',
    symbol: 'GAS',
  },
  rpcUrls: {
    default: {
      http: ['https://neoxt4seed1.ngd.network/']
    },
    public: {
      http: ['https://neoxt4seed1.ngd.network/']
    }
  },
  blockExplorers: {
    default: {
      name: 'NeoX Scan',
      url: 'https://xt4scan.ngd.network/'
    }
  },
  testnet: true,
} as const;

const neoXMainnet = {
  id: 47763,
  hexId: '0xBA93',
  name: 'NeoX Mainnet',
  network: 'neoxmainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'GAS',
    symbol: 'GAS',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet-1.rpc.banelabs.org/']
    },
    public: {
      http: ['https://mainnet-1.rpc.banelabs.org/']
    }
  },
  blockExplorers: {
    default: {
      name: 'NeoX Explorer',
      url: 'https://xexplorer.neo.org/'
    }
  },
  testnet: false,
} as const;

const eduChainTestnet = {
  id: 656476,
  name: 'EDU Chain Testnet',
  network: 'educhaintestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'EDU',
    symbol: 'EDU',
  },
  rpcUrls: {
    default: {
      http: ['https://open-campus-codex-sepolia.drpc.org/']
    },
    public: {
      http: ['https://open-campus-codex-sepolia.drpc.org/']
    }
  },
  blockExplorers: {
    default: {
      name: 'EDU Chain Explorer',
      url: 'https://opencampus-codex.blockscout.com/'
    }
  },
  testnet: true,
} as const;

const flowTestnet = {
  id: 545,
  hexId: '0x221',
  name: 'Flow Testnet',
  network: 'flowtestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'FLOW',
    symbol: 'FLOW',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.evm.nodes.onflow.org']
    },
    public: {
      http: ['https://testnet.evm.nodes.onflow.org']
    }
  },
  blockExplorers: {
    default: {
      name: 'Flow Testnet Explorer',
      url: 'https://evm-testnet.flowscan.io'
    }
  },
  testnet: true,
} as const;

const telosTestnet = {
  id: 41,
  hexId: '0x29',
  name: 'Telos Testnet',
  network: 'telostestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'TLOS',
    symbol: 'TLOS',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.telos.net/evm']
    },
    public: {
      http: ['https://testnet.telos.net/evm']
    }
  },
  blockExplorers: {
    default: {
      name: 'Telos Testnet Explorer',
      url: 'https://testnet.teloscan.io/'
    }
  },
  testnet: true,
} as const;

const ancient8Testnet = {
  id: 28122024,
  hexId: '0x1AD1BA8',
  name: 'Ancient8 Testnet',
  network: 'ancient8testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpcv2-testnet.ancient8.gg/']
    },
    public: {
      http: ['https://rpcv2-testnet.ancient8.gg/']
    }
  },
  blockExplorers: {
    default: {
      name: 'Ancient8 Testnet Explorer',
      url: 'https://ancient8.testnet.routescan.io/'
    }
  },
  testnet: true,
} as const;

const chains = [neoXMainnet, neoXTestnet, eduChainTestnet, flowTestnet, telosTestnet, ancient8Testnet] as const; 

const projectId = 'b8ad206ba9492e6096fa0aa0f868586c';

const { wallets } = getDefaultWallets({
  appName: 'ProtectedPay',
  projectId,
});

const connectors = connectorsForWallets([
  ...wallets,
], {
  appName: 'ProtectedPay',
  projectId,
});

const wagmiConfig = createConfig({
  connectors,
  chains,
  transports: {
    [neoXTestnet.id]: http(),
    [eduChainTestnet.id]: http(),
    [flowTestnet.id]: http(),
    [telosTestnet.id]: http(),
    [neoXMainnet.id]: http(),
    [ancient8Testnet.id]: http(),
  },
});

const queryClient = new QueryClient();

interface WalletContextType {
  address: string | null;
  balance: string | null;
  signer: ethers.Signer | null;
  isConnected: boolean;
}

const WalletContext = React.createContext<WalletContextType>({
  address: null,
  balance: null,
  signer: null,
  isConnected: false,
});

function WalletState({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<WalletContextType>({
    address: null,
    balance: null,
    signer: null,
    isConnected: false,
  });

  const { address, isConnected } = useAccount();
  const { data: wagmiBalance } = useWagmiBalance({
    address: address as `0x${string}` | undefined,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const initializeWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum && address) {
        try {
          const provider = new ethers.providers.Web3Provider(
            window.ethereum as unknown as ExtendedProvider
          );
          
          const signer = provider.getSigner();
          
          let balance: string;
          if (wagmiBalance) {
            balance = ethers.utils.formatEther(wagmiBalance.value.toString());
          } else {
            const ethersBalance = await provider.getBalance(address);
            balance = ethers.utils.formatEther(ethersBalance);
          }
          
          setState({
            address,
            balance,
            signer,
            isConnected: true,
          });
        } catch (error) {
          console.error('Error initializing wallet:', error);
          setState({
            address: null,
            balance: null,
            signer: null,
            isConnected: false,
          });
        }
      } else if (!address) {
        setState({
          address: null,
          balance: null,
          signer: null,
          isConnected: false,
        });
      }
    };

    const handleAccountsChanged = () => {
      initializeWallet();
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    initializeWallet();

    const ethereum = window.ethereum as unknown as ExtendedProvider;
    if (ethereum?.on) {
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (ethereum?.removeListener) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [mounted, address, isConnected, wagmiBalance]);

  useEffect(() => {
    if (wagmiBalance && address && isConnected) {
      try {
        const formattedBalance = ethers.utils.formatEther(wagmiBalance.value.toString());
        setState(prev => ({
          ...prev,
          balance: formattedBalance,
        }));
      } catch (error) {
        console.error('Error formatting balance:', error);
      }
    }
  }, [wagmiBalance, address, isConnected]);

  if (!mounted) return null;

  return (
    <WalletContext.Provider value={state}>
      {children}
    </WalletContext.Provider>
  );
}

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#22c55e',
            accentColorForeground: 'white',
          })}
        >
          <WalletState>{children}</WalletState>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useWallet() {
  const context = React.useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';