import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { SiweMessage } from 'siwe';
import { getNonce, verifySignature } from '../services/authService';

const SESSION_KEY = 'user_session_jwt';

interface AuthContextType {
  session: string | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isConnected, address, provider } = useWalletConnectModal();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = await SecureStore.getItemAsync(SESSION_KEY);
        if (storedSession) {
          setSession(storedSession);
        }
      } catch (e) {
        console.error('Failed to load session from secure store', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const signIn = useCallback(async () => {
    if (!isConnected || !address || !provider) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      const nonce = await getNonce();
      const chainIdHex = await provider.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);

      const message = new SiweMessage({
        domain: 'yourapp.com', // In a real app, this should be a consistent, verified domain
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: 'https://yourapp.com/login', // In a real app, this should be a consistent, verified URI
        version: '1',
        chainId,
        nonce,
      });

      const messageToSign = message.prepareMessage();
      const signature = await provider.request({
        method: 'personal_sign',
        params: [messageToSign, address],
      });

      const { token } = await verifySignature({ message: messageToSign, signature });

      await SecureStore.setItemAsync(SESSION_KEY, token);
      setSession(token);
    } catch (e) {
      console.error('Failed to sign in', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, provider]);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await SecureStore.deleteItemAsync(SESSION_KEY);
      setSession(null);
    } catch (e) {
      console.error('Failed to sign out', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a SessionProvider');
  }
  return context;
};
