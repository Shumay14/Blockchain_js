// Generate a simple did document model
const didDocumentModel = getDidDocumentModel(
  primaryKey.publicKey,
  recoveryKey.privateKey
);

// Generate Sidetree Create payload
const createPayload = getCreatePayload(didDocumentModel, primaryKey);

// Create the Sidetree transaction.
// This can potentially take a few minutes if you're not on a local network

console.log(`${did} was successfully created`);


const getDidDocumentModel = (primaryPublicKey, recoveryPrivateKey) => ({
  '@context': 'https://w3id.org/did/v1',
  publicKey: [
    {
      id: '#primary',
      usage: 'signing',
      type: 'Secp256k1VerificationKey2018',
      publicKeyHex: primaryPublicKey,
    },
    {
      id: '#recovery',
      usage: 'recovery',
      type: 'Secp256k1VerificationKey2018',
      publicKeyHex: recoveryPublicKey,
    },
  ],
});