import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { Base64 } from 'js-base64';

// In a real app, these would be API calls.
// We are mocking them here with promises to simulate network latency.

/**
 * Mocks a backend call to get a nonce.
 * @returns {Promise<string>} A random string to be used as a nonce.
 */
export const getNonce = async (): Promise<string> => {
  // In a real backend, you would generate and store this nonce for the user's session.
  const nonce = ethers.utils.hexlify(ethers.utils.randomBytes(16));
  return new Promise((resolve) => setTimeout(() => resolve(nonce), 500));
};

/**
 * Mocks a backend call to verify the signature and issue a JWT.
 * @param {object} params - The parameters for verification.
 * @param {string} params.message - The original SIWE message.
 * @param {string} params.signature - The signature from the user's wallet.
 * @returns {Promise<{ token: string }>} A mock JWT.
 */
export const verifySignature = async ({
  message,
  signature,
}: {
  message: string;
  signature: string;
}): Promise<{ token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const siweMessage = new SiweMessage(message);
        // In a real backend, you would also check the nonce against the one stored for the user.
        // Here we are just verifying the signature is valid for the given message.
        const recoveredAddress = ethers.utils.verifyMessage(
          siweMessage.prepareMessage(),
          signature
        );

        if (ethers.utils.getAddress(recoveredAddress) !== ethers.utils.getAddress(siweMessage.address)) {
          throw new Error('Signature verification failed: address mismatch.');
        }

        // Signature is valid, issue a mock JWT
        const mockJwt = `mock-jwt-header.${Base64.encode(JSON.stringify({ address: siweMessage.address, issuedAt: Date.now() }))}.mock-signature`;

        resolve({ token: mockJwt });
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};
