const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
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
    let block = new Block(Date.now(), this.pendingTranscations);
    block.mineBlock(this.difficulty);

    console.log("Block Succesfully Mined");
    this.chain.push(block);

    this.pendingTranscations = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransaction() {
    this.pendingTranscations.push(Transaction);
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
