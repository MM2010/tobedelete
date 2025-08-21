// This import must be at the top
import 'react-native-gesture-handler';

import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import { SessionProvider, useAuth } from './src/hooks/useAuth';
import { RootNavigator } from './src/navigation/RootNavigator';

// TODO: Replace this with your own project ID from cloud.walletconnect.com
const projectId = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';

const providerMetadata = {
  name: 'Test AIgent App',
  description: 'A React Native app built by an AI agent.',
  url: 'https://yourapp.com/',
  icons: ['https://yourapp.com/icon.png'],
  redirect: {
    native: 'yourappscheme://',
    universal: 'https://yourapp.com',
  },
};

function AppContent() {
    const { session, isLoading } = useAuth();

    if (isLoading) {
        // You might want a more sophisticated loading screen here
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // If there is a session, show the main app, otherwise show the Auth UI
    return session ? <RootNavigator /> : <AuthUI />;
}


function AuthUI() {
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const { signIn, isLoading } = useAuth();

  const handleConnect = () => {
    if (isConnected) {
      provider?.disconnect();
    } else {
      open();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Please connect your wallet and sign in.</Text>

      {/* Wallet Connection Section */}
      <View style={styles.section}>
        <Text style={styles.status}>
          Wallet: {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
        {isConnected && (
          <Text style={styles.address} numberOfLines={1} ellipsizeMode="middle">
            {address}
          </Text>
        )}
        <Button
          title={isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
          onPress={handleConnect}
        />
      </View>

      {/* Authentication Section */}
      {isConnected && (
        <View style={styles.section}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Sign In With Ethereum" onPress={() => signIn().catch(alert)} />
            )}
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
      />
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
   subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    width: '100%',
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  },
  status: {
    fontSize: 18,
    marginVertical: 10,
  },
  address: {
    fontSize: 16,
    fontFamily: 'monospace',
    marginVertical: 10,
    maxWidth: '90%',
  },
});
