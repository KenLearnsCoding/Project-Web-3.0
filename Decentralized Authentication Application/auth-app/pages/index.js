import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/styles.module.css';
import { ethers} from 'ethers';  // Ensure this line is correct

function HomePage() {
    // Check if the browser has MetaMask installed or not
    const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);

    // Return the check result on the browser about the MetaMask
    useEffect(() => {
        setIsMetamaskInstalled(!!window.ethereum);
    }, []);

    async function handleMetamaskLogin() {
        try {
            // Check if the MetaMask is installed or not
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed');
            }
            // This line will allow the application to interact with the Ethereum blockchain
            const provider = new ethers.BrowserProvider(window.ethereum);
            // This line will send a request to MetaMask to get the user's account
            await provider.send("eth_requestAccounts", []);
            // This line will indicate that it has the ability to authorize actions on the blockchain
            const signer = await provider.getSigner();

            // This line will get the signer's address
            const address = await signer.getAddress();
            console.log('this is the address: '+address);

            // This block of code just gets the address from the mongoDB
            const response = await fetch ('/api/nonce', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address }),
            });

            // if the address is not stored on the mongoDB, it will return an error message
            if (!response.ok) {
                const error = await response.json();
                console.log(error);
            }

            // just print out the address if the address is on the mongoDB
            const resp = await response.json();
            const nonce = resp.message;
            console.log('this is the nonce '+nonce);
            
            // the purpose is to keep the token for using the login, it will avoid logining again in the metamask multiple time. 
            // the token is saved on the protected browser. 
            const signedMessage = await signer.signMessage(nonce);
            console.log('this is signMessage ' +signedMessage);
            const data = {signedMessage, nonce, address};
            const authResponse = await fetch('/api/login', {
                method: 'POST', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(data)
            });

            let token = await authResponse.json();
            console.log('this is token ' +token);

            // Use this line to differentiae the unique token for the metamask acc using in the browser.
            localStorage.setItem(address, token.token);

        } catch (error) {
            console.error(error);
            alert(`Failed to login with MetaMask: ${error.message}`);
        }
    }

    return (
        <div className={styles.container}>
            <h1>Welcome, Please select an option below to continue</h1>
            <div>
                <button className={styles.btn} onClick={handleMetamaskLogin}>Login with MetaMask</button>
                <br />
                <br />
            </div>
            <Link href="/signup">
                <button className={styles.btn}>Sign Up</button>
            </Link>
        </div>
    );
}

export default HomePage;
