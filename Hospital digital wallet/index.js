const express = require('express');
const app = express();
const port = 2000;
const path = require('path');
const bodyParser = require('body-parser');
const Blockchain = require('./back-end/blockchain/blockchain');
const Transaction = require('./back-end/blockchain/transaction');
const Block = require('./back-end/blockchain/block');
const elliptic = require('elliptic');

const myBlockchain = new Blockchain();
const ec = new elliptic.ec('secp256k1');
const wallets = {};

app.use(bodyParser.json());
app.post('/generate-wallet', (req, res) => {
    const keyPair = ec.genKeyPair();
    const address = keyPair.getPublic('hex');
    const privateKey = keyPair.getPrivate('hex');
    const wallet = { address, privateKey };
    wallets[address] = wallet;
    myBlockchain.registerWallet(wallet); // Pass the entire wallet object here
    res.json(wallet); // Return both the address and private key to the client
});
app.post('/connect-wallet', (req, res) => {
    const { address, privateKey } = req.body;
    const wallet = wallets[address];
    if (!wallet) {
        return res.status(400).json({ error: 'Wallet not found' });
    }
    if (wallet.privateKey !== privateKey) {
        return res.status(400).json({ error: 'Invalid private key' });
    }
    myBlockchain.connectWallet(address, privateKey);
    res.json({ message: 'Wallet connected successfully!' });
});

app.post('/create-transaction', (req, res) => {
    const { sender, receiver, insuranceId, insuranceDate, healthStatus, dob, phoneNumber, privateKey } = req.body;
    const transaction = new Transaction(sender, receiver, insuranceId, insuranceDate, healthStatus, dob, phoneNumber);
    transaction.signTransaction(privateKey);
    myBlockchain.addTransaction(transaction);

    const latestBlock = myBlockchain.getLatestBlock();
    if (latestBlock.transactions.length === latestBlock.maxBlockSize) {
        // Automatically mine the block if it reaches its maximum size
        myBlockchain.minePendingTransactions();
    }
    
    res.json({ message: 'Transaction created successfully!' });
});

app.post('/mine-block', (req, res) => {
    const latestBlock = myBlockchain.getLatestBlock();
    if (myBlockchain.pendingTransactions.length >= latestBlock.maxBlockSize) {
        // Create a new block and add it to the blockchain
        myBlockchain.minePendingTransactions();
        res.json({ message: 'Block added to the blockchain and mined successfully!' });
    } else {
        // Mine the current block with pending transactions
        res.json({ message: 'Block mined successfully!' });
    }
});


app.get('/blockchain', (req, res) => {
    res.json(myBlockchain.chain);
});


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'front-end'));
app.use(express.static(path.join(__dirname, 'front-end')));
// Corrected the path to the 'assets' directory
app.use("/Assets", express.static(path.join(__dirname, 'assets')));

app.get('/', async (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
