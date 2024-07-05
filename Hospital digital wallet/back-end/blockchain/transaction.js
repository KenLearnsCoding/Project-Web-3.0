const SHA256 = require('crypto-js/sha256');
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');

class Transaction {
    constructor(sender, receiver, insuranceId, insuranceDate, healthStatus, dob, phoneNumber) {
        this.sender = sender;
        this.receiver = receiver;
        this.insuranceId = insuranceId;
        this.insuranceDate = insuranceDate;
        this.healthStatus = healthStatus;
        this.dob = dob;
        this.phoneNumber = phoneNumber;
        this.timestamp = Date.now();
        this.signature = '';
        this.accessAllowed = false; // Flag to indicate if receiver has access to sender's data
    }

    calculateHash() {
        return SHA256(this.sender + this.receiver + this.insuranceId + this.insuranceDate +
            this.healthStatus + this.dob + this.phoneNumber + this.timestamp + this.accessAllowed).toString();
    }

    signTransaction(privateKey) {
        const key = ec.keyFromPrivate(privateKey, 'hex');
        const hash = this.calculateHash();
        const signature = key.sign(hash, 'base64');
        this.signature = signature.toDER('hex');
    }

    isValid() {
        if (!this.signature || this.signature.length === 0) {
            throw new Error('Transaction signature is missing.');
        }
        const key = ec.keyFromPublic(this.sender, 'hex');
        return key.verify(this.calculateHash(), this.signature);
    }

    // Method to allow receiver to access sender's data
    allowAccess() {
        this.accessAllowed = true;
    }

    // Method to update data and sign the transaction
    updateDataAndSign(insuranceId, insuranceDate, healthStatus, dob, phoneNumber, privateKey) {
        this.insuranceId = insuranceId;
        this.insuranceDate = insuranceDate;
        this.healthStatus = healthStatus;
        this.dob = dob;
        this.phoneNumber = phoneNumber;
        this.timestamp = Date.now();
        this.signTransaction(privateKey);
    }
}


module.exports = Transaction;