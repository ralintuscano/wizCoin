const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const { Blockchain, Transaction } = require("./blockchain");

const myKey = ec.keyFromPrivate(
  "fb3bd843eaa984e2a5d6557df22fefad89e9285fb90497a71e63311c48d80b2b"
);

const myWalletAddress = myKey.getPublic("hex");

let wizCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "receipients public key", 10);
tx1.signTransaction(myKey);

wizCoin.addTransaction(tx1);

console.log("\n Start Mining");
wizCoin.minePendingTransactions(myWalletAddress);

console.log(
  "\n Balance of Wiz is ",
  wizCoin.getBalanceOfAddress(myWalletAddress)
);
