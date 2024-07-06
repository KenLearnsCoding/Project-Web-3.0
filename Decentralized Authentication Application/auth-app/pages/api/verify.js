import jwt from 'jsonwebtoken';

export default function handler(req, res) {
    // The function first checks if the incoming request is a POST request.
    // If not, it responds with a 405 HTTP status code (Method Not Allowed) and ends the execution.
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }
    // It then checks for the presence of an Authorization header in the request. The header should start with the word 'Bearer', followed by the JWT. 
    // If the header is missing or doesn't start with 'Bearer', it responds with a 401 status code (Unauthorized) and a message indicating an invalid token.
    const authHeader = req.headers.authorization; 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    // The function then extracts the JWT from the Authorization header 
    // and verifies it using the jwt.verify method.
    const token = authHeader.split(' ')[1];

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.secretKey, { algorithms: ['HS256'] });
        console.log(decoded);
        const currentTime = Math.floor(Date.now() / 1000);
        console.log(currentTime);
        // If the token is successfully verified, it checks if the token has expired 
        // by comparing the current time with the exp field in the decoded token.
        if (decoded.exp < currentTime) {
            // If the token is expired, it responds with a message indicating that the token is expired.
            res.json({message: 'Expired'});

        } else {
            // If the token is not expired, it responds with a message indicating that the token is valid.
            res.json({message: 'Valid'});
        }

    } catch (err) {
        // If an error occurs during the token verification process (e.g., if the token is invalid), it catches the error, logs it to the console, 
        // and responds with a 401 status code and a message indicating an invalid token.
        res.status(401).json({ error: 'Invalid token' });
    }
}