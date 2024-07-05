// This file will return the nonce  after the address is valid on the blockchain or mongodb
import crypto from 'crypto';
import connectDB from '../../utils/connectDB';
import User from '../../models/schema';

// connect to the database to check if the user is on the mongodb or not
connectDB();

async function handler(req, res) {
    if (req.method === 'POST') {
        const {address} = req.body;
        // convert the address value to string to find in the mongoDB
        const stringAddress = address.toString();

        // try to find the user on the mongoDB
        try {
            const addressExists = await User.findOne({blockchainAddress: stringAddress});
            if (!addressExists) {
                return res.status(400).json({message: 'Please register first'});
            }

            // this line will generate the nonce from blockchain
            const nonce = crypto.randomBytes(32).toString('hex');
            // throw the nonce value to the inspectign mode
            res.status(200).json({message:nonce});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'An error occurred'});
        } 
    } else {
        res.status(405).json({message: 'Method not allowed'});
        
    }
}

export default handler;