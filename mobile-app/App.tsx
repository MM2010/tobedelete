import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import { SessionProvider, useAuth } from './src/hooks/useAuth';

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

function AuthUI() {
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const { signIn, signOut, session, isLoading } = useAuth();

  const handleConnect = () => {
    if (isConnected) {
      provider?.disconnect();
    } else {
      open();
    }
  };

  const handleSignOut = () => {
    signOut();
    // We also disconnect the wallet on sign out for a clean state
    if (isConnected) {
      provider?.disconnect();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIWE Authentication</Text>

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
        {!session && (
          <Button
            title={isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
            onPress={handleConnect}
          />
        )}
      </View>

      {/* Authentication Section */}
      <View style={styles.section}>
        <Text style={styles.status}>
          Session: {session ? 'Signed In' : 'Signed Out'}
        </Text>
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

        {isConnected && !session && !isLoading && (
          <Button title="Sign In With Ethereum" onPress={() => signIn().catch(alert)} />
        )}

        {session && !isLoading && (
          <Button title="Sign Out" onPress={handleSignOut} />
        )}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <>
      <SessionProvider>
        <AuthUI />
      </SessionProvider>
      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
      />
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
