const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransaction(signingkey) {
    if (signingkey.getPublic("hex") != this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets");
    }

    const hashTx = this.calculateHash();
    const sig = signingkey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }

  isValid() {
    if (this.fromAddress == null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No Signature in this Transaction");
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.timestamp +
        this.previousHash +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenisisBlock()];
    this.difficulty = 2;
    this.pendingTranscations = [];
    this.miningReward = 100;
  }

  createGenisisBlock() {
    return new Block("04/08/20", "Genesis Block", "0");
  }

  getLatestblock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardTx = new Transaction(
      null,
      miningRewardAddress,
      this.miningReward
    );
    this.pendingTranscations.push(rewardTx);

    let block = new Block(Date.now(), this.pendingTranscations);
    block.mineBlock(this.difficulty);

    console.log("Block Succesfully Mined");
    this.chain.push(block);

    this.pendingTranscations = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress)
      throw new Error("Transaction must include to and from address");

    if (!transaction.isValid()) {
      throw new Error("Can't add invalid transaction");
    }
    this.pendingTranscations.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress == address) {
          balance -= trans.amount;
        }
        if (trans.toAddress == address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid() {
    for (let index = 1; index < this.chain.length; index++) {
      const currentBlock = this.chain[index];
      const previousBlock = this.chain[index - 1];

      if (!currentBlock.hasValidTransactions()) return false;
      if (currentBlock.hash != currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash != previousBlock.hash) {
        return false;
      }
      return true;
    }
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
