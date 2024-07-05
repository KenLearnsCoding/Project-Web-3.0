const SHA256 = require('crypto-js/sha256');
const Transaction = require('./transaction');

class Block {
    constructor(timestamp, transactions = [], previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
        this.maxBlockSize = 2; // Maximum transactions per block
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (true) {
            this.nonce++;
            this.hash = this.calculateHash();
            if (this.hash.substring(0, difficulty) === Array(difficulty + 1).join('0')) {
                console.log('Block mined:', this.hash);
                break;
            }
        }
    }

    addTransaction(transaction) {
        if (this.transactions.length < this.maxBlockSize) {
            this.transactions.push(transaction);
            if (this.transactions.length === this.maxBlockSize) {
                this.mineBlock(difficulty); // Automatically mine the block when maximum transactions are reached
            }
        } else {
            console.log('Block is full. Creating a new block instance...');
            const newBlock = new Block(Date.now(), [transaction], this.hash);
            return newBlock;
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

module.exports = Block;