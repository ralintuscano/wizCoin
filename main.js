const { Blockchain, Transaction } = require("./blockchain");

let wizCoin = new Blockchain();

wizCoin.createTransaction(new Transaction("add1", "add2", 100));
wizCoin.createTransaction(new Transaction("addd2", "add1", 50));

console.log("\n Start Mining");
wizCoin.minePendingTransactions("wiz-balance");

console.log(
  "\n Balance of Wiz is ",
  wizCoin.getBalanceOfAddress("wiz-balance")
);

console.log("\n Start Mining again...");
wizCoin.minePendingTransactions("wiz-balance");

console.log(
  "\n Balance of Wiz is ",
  wizCoin.getBalanceOfAddress("wiz-balance")
);
