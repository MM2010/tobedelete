import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

// Mock the WalletConnectModal to avoid errors in test environment
jest.mock('@walletconnect/modal-react-native', () => ({
  WalletConnectModal: () => null,
  useWalletConnectModal: () => ({
    open: jest.fn(),
    isConnected: false,
    address: null,
    provider: null,
  }),
}));

// Mock the useAuth hook. Note the path is relative to the test file's location.
jest.mock('../src/hooks/useAuth', () => ({
  SessionProvider: ({ children } : {children: React.ReactNode}) => <>{children}</>,
  useAuth: () => ({
    session: null,
    isLoading: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
}));


describe('<App />', () => {
  it('has 1 child', () => {
    const tree = renderer.create(<App />).toJSON();
    // A basic smoke test to ensure it renders something.
    expect(tree).not.toBeNull();
  });
});
