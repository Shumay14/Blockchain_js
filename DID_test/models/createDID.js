const DIDWallet = require('@transmute/did-wallet');
const ES256K = require('@transmute/es256k-jws-ts');


const { encodeJson } = require('../../func');

const elementCrypto = require('../../crypto');
const MnemonicKeySystem = require('../../crypto/MnemonicKeySystem');

const header = {
  "typ": "JWT",
  "alg": "RSA"
};

export interface JWTHeader {
  typ: 'JWT'
  alg: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}

export interface JWTPayload {
  iss?: string
  sub?: string
  aud?: string | string[]
  iat?: number
  nbf?: number
  exp?: number
  rexp?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}

// Generate a simple did document model
const didDocumentModel = getDidDocumentModel(
  primaryKey.publicKey,
  recoveryKey.publicKey
);

// Generate Sidetree Create payload
const createPayload = getCreatePayload(didDocumentModel, primaryKey);

// Create the Sidetree transaction.
// This can potentially take a few minutes if you're not on a local network

console.log(`${did} was successfully created`);


const getDidDocumentModel = (primaryPublicKey, recoveryPublicKey) => ({
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

const makeSignedOperation = (header, payload, privateKey) => {
  const encodedHeader = encodeJson(header);
  const encodedPayload = encodeJson(payload);
  const signature = signEncodedPayload(
    encodedHeader,
    encodedPayload,
    privateKey
  );
  const operation = {
    protected: encodedHeader,
    payload: encodedPayload,
    signature,
  };
  return operation;
};

const getCreatePayload = (didDocumentModel, primaryKey) => {
  // Create the encoded protected header.
  const header = {
    operation: 'create',
    kid: '#primary',
    alg: 'ES256K',
  };
  return makeSignedOperation(header, didDocumentModel, primaryKey.privateKey);
};

const walletToInitialDIDDoc = wallet => {
  const didDocumentModel = {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://docs.element-did.com/contexts/sidetree/sidetree-v0.1.jsonld',
    ],
  };

  const publicKeys = [];
  const commonVerificationMethods = [];
  const keyAgreementkeys = [];

  Object.values(wallet.keys).forEach(walletKey => {
    if (walletKey.type === 'assymetric') {
      if (walletKey.tags[0] === 'X25519KeyAgreementKey2019') {
        keyAgreementkeys.push({
          id: walletKey.tags[1] || `#${walletKey.kid}`,
          type: 'X25519KeyAgreementKey2019',
          usage: 'signing',
          [walletKey.didPublicKeyEncoding]: walletKey.publicKey,
        });
      } else {
        if (walletKey.encoding === 'jwk') {
          publicKeys.push({
            id: walletKey.tags[1] || `#${walletKey.kid}`,
            type: walletKey.tags[0],
            usage: 'signing',
            [walletKey.didPublicKeyEncoding]: JSON.parse(walletKey.publicKey),
          });
        } else {
          publicKeys.push({
            id:
              walletKey.tags[1] !== undefined
                ? walletKey.tags[1]
                : `#${walletKey.kid}`,
            type: walletKey.tags[0],
            usage:
              walletKey.tags[1] &&
              walletKey.tags[1].split('#').pop() === 'recovery'
                ? 'recovery'
                : 'signing',
            [walletKey.didPublicKeyEncoding]: walletKey.publicKey,
          });
        }

        commonVerificationMethods.push(publicKeys[publicKeys.length - 1].id);
      }
    }
  });
  didDocumentModel.publicKey = publicKeys;
  didDocumentModel.authentication = commonVerificationMethods;
  didDocumentModel.assertionMethod = commonVerificationMethods;
  didDocumentModel.capabilityDelegation = commonVerificationMethods;
  didDocumentModel.capabilityInvocation = commonVerificationMethods;
  didDocumentModel.keyAgreement = keyAgreementkeys;
  // return didDocumentModel;
}