import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';

const secretKey = process.env.secretKey;

async function handler(req, res) {
    // get 3 values from the post method
    const { signedMessage, nonce, address } = req.body;
    console.log(signedMessage, nonce, address);

    // this line is for taking the address from the nonce and signedMessage
    const recoveredAddress = ethers.verifyMessage(nonce, signedMessage);
    console.log("recoveredAddress and address "+recoveredAddress, address);

    // see if the address from using nonce and signedMessage is the same one to the metamask or not
    if (recoveredAddress !== address) {
        return res.status(401).json({ error: 'Invalid Signature' });
    }
 
    // This token can be used for authenticating subsequent requests by the client, ensuring that the request is coming from an authenticated source within the specified expiry time.
    const token = jwt.sign({ address }, secretKey, { expiresIn: '25s' });
    console.log('Token from Early '+token);
    
    // Send the JWT token to the frontend
    res.status(200).json({token});
}

export default handler;


