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
