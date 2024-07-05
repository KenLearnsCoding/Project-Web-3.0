import { ethers } from 'ethers';
import connectDB from '../../utils/connectDB';
import User from '../../models/schema';

connectDB();

async function handler (req, res) {
    if (req.method === 'POST') {
        try {
            // take data from the signup request
            const {name, email} = req.body;
            //find the user's email in the database
            const existingUser = await User.findOne({ email });
            // if the user's email is already in the database, return an error message
            if (existingUser) {
                return res.status(400).json({ message: 'Email already registered' });
            } 

            // if there is no duplicate email, create a new user
            // Assign the wallet variable to the random wallet generated by ethers library
            const wallet = ethers.Wallet.createRandom();

            // Create blockchain address, and blockchain private key
            const blockchainAddress = wallet.address;
            const blockchainPrivateKey = wallet.privateKey;

            // Create a new user with the name, email, and blockchain address
            // also provide enough parameters to avoid the error
            const newUser = new User({name, email, blockchainAddress});

            // Save the new user to the database
            await newUser.save();
            // Throw the message to the inspector
            res.status(200).json({message: "User created", blockchainPrivateKey})
            console.log("this is user blockchainPrivateKey", blockchainPrivateKey);

        } catch (error) {
            console.error(error.message);
            // Throw the error message to the inspector
            res.status(500).json({message: "An error occurred"})
        }

    } else {
        // Throw the error message to the inspector
        res.status(405).json({message: "Method Not Allowed"});
    }
}

export default handler;