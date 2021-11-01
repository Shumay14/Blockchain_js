import { TokenSigner, createUnsecuredToken, decodeToken } from "jsontokens"
 
const rawPrivateKey = '278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f'
const tokenPayload = {"iat": 1440713414.85}
const token = new TokenSigner('ES256K', rawPrivateKey).sign(tokenPayload)

const unsecuredToken = createUnsecuredToken(tokenPayload)

const tokenData = decodeToken(token)

const { Sidetree, MnemonicKeySystem } = require("@transmute/element-lib");

// Instantiate the Sidetree class
const element = new Sidetree(/* See previous section for how to initialize the Sidetree class*/);

// Generate a simple did document model
const mks = new MnemonicKeySystem(MnemonicKeySystem.generateMnemonic());
const primaryKey = await mks.getKeyForPurpose("primary", 0);
const recoveryKey = await mks.getKeyForPurpose("recovery", 0);
const didDocumentModel = element.op.getDidDocumentModel(
  primaryKey.publicKey,
  recoveryKey.publicKey
);

// Generate Sidetree Create payload
const createPayload = element.op.getCreatePayload(didDocumentModel, primaryKey);

// Create the Sidetree transaction.
// This can potentially take a few minutes if you're not on a local network
const createTransaction = await element.batchScheduler.writeNow(createPayload);
const didUniqueSuffix = element.func.getDidUniqueSuffix(createPayload);
const did = `did:elem:ropsten:${didUniqueSuffix}`;
console.log(`${did} was successfully created`);
