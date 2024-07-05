const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.wallets = {};
        this.difficulty = 4; // Initial difficulty level
        this.blockGenerationInterval = 3000; // 3 seconds (adjust as needed)
        this.blockNumber = 1;
    }

    createGenesisBlock() {
        return new Block(Date.now(), []);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(transaction) {
        const latestBlock = this.getLatestBlock();
        const pendingTransactionsCount = latestBlock.transactions.length;
        
        if (this.chain.length === 1 && pendingTransactionsCount === 0) {
            // If the blockchain contains only the genesis block, create a new block with the transaction
            const newBlock = new Block(Date.now(), [transaction], this.chain[0].hash);
            newBlock.blockNumber = this.chain.length; // Assign block number
            this.chain.push(newBlock);
        } else if (pendingTransactionsCount < latestBlock.maxBlockSize) {
            // If there is space in the latest block, add the transaction to its pending transactions
            latestBlock.transactions.push(transaction);
        } else {
            // If the latest block is full, create a new block with the current transaction
            const newBlock = new Block(Date.now(), [transaction], latestBlock.hash);
            newBlock.blockNumber = this.chain.length; // Assign block number
            this.chain.push(newBlock);
        }
    }
    
    addBlock(newBlock) {
        // Ensure that transactions are only added to blocks other than the genesis block
        if (this.chain.length > 1) {
            newBlock.previousHash = this.getLatestBlock().hash;
            newBlock.blockNumber = this.chain.length; // Assign block number
            this.chain.push(newBlock);
            this.pendingTransactions = []; // Clear pending transactions
        } else {
            console.log("Cannot add block to genesis block.");
        }
    }

    minePendingTransactions() {
        const latestBlock = this.getLatestBlock();
        const newBlock = new Block(Date.now(), latestBlock.transactions, latestBlock.hash);
        newBlock.mineBlock(this.difficulty);
        newBlock.blockNumber = this.chain.length; // Assign block number
        console.log('Block successfully mined!');
        this.chain.push(newBlock);
        this.pendingTransactions = []; // Clear pending transactions
    }

    registerWallet(wallet) {
        // Store the entire wallet object
        this.wallets[wallet.address] = wallet;
        console.log(`Wallet ${wallet.address} registered with the blockchain.`);
    }

    connectWallet(address, privateKey) {
        // Check if the provided address exists in the wallets registry
        const wallet = this.wallets[address];
        if (!wallet) {
            throw new Error('Wallet not found.');
        }
        
        // Verify that the provided private key matches the one associated with the address
        if (wallet.privateKey !== privateKey) {
            throw new Error('Invalid private key for the given address.');
        }
    
        console.log(`Wallet ${address} connected to the blockchain.`);
    }

    
}


module.exports = Blockchain;





