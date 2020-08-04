const SHA256 = require("crypto-js/sha256");
class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }
  calculateHash() {
    return SHA256(
      this.index +
        this.timestamp +
        this.previousHash +
        JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenisisBlock()];
  }

  createGenisisBlock() {
    return new Block(0, "04/08/20", "Genesis Block", "0");
  }

  getLatestblock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestblock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
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

let wizCoin = new Blockchain();

wizCoin.addBlock(new Block(1, "04/08/2020", { amount: 4 }));
wizCoin.addBlock(new Block(2, "05/08/2020", { amount: 2 }));
wizCoin.addBlock(new Block(3, "06/08/2020", { amount: 6 }));

console.log(JSON.stringify(wizCoin, null, 4));

//tampering Data
// wizCoin.chain[1].data = { amount: 100 };
// console.log("Is Blockchain Valid?" + wizCoin.isChainValid());
