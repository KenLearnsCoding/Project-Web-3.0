// This file defines a higher-order component (HOC) named withAuth for use in a Next.js 
// application that integrates with Ethereum blockchain through MetaMask for authentication. 

import {useEffect, useState} from "react";
 import {useRouter} from 'next/router';
 import {ethers} from 'ethers';

// It's a higher-order component (HOC) that takes a component (Component) as an argument and returns a new component (Auth).
 const withAuth = (Component) => {
    const Auth = (props) => {
        // Uses useRouter to navigate the user based on authentication status.
        const router = useRouter();
        // Initializes state resp with 'valid' to track the authentication response.
        const [resp, setResponse] = useState('valid');

        // Uses useEffect hook to perform side effects:
        useEffect(() => {
            // Defines checkMetamask as an asynchronous function to check if MetaMask is installed (window.ethereum is present).
            const checkMetamask = async() => {
                // If MetaMask is installed, it requests the user's Ethereum accounts, gets the signer, and retrieves the current address.
                if (window.ethereum) {
                    try {
                        await window.ethereum.request({ method: 'eth_requestAccounts'});
                        const  provider = new ethers.BrowserProvider(window.ethereum);
                        const signer = await provider.getSigner();
                        const currentAddress = await signer.getAddress();

                        // It then attempts to retrieve a token from localStorage using the current address as the key.
                        const token = localStorage.getItem(currentAddress);
                        // If a token exists, it sends a POST request to /api/verify with the token for verification.
                        if (token != '') {
                            const response = await fetch('/api/verify', {
                                method: 'POST', 
                                headers: {
                                    'Content-Type': 'application/json', 
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            // Based on the response (newResponse.message), it updates the resp state.
                            let newresponse = await response.json();
                            setResponse(newresponse.message);

                            // If the response is not 'valid', it removes the item from localStorage and 
                            // redirects the user to the homepage (router.push('/')).
                            if (newresponse.message  !== 'Valid') {
                                window.localStorage.removeItem(currentAddress);
                                router.push('/');
                            }
                        } else {
                            // If no token is found, it also redirects the user to the homepage.
                            router.push('/')
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            };
            checkMetamask();
        }, [resp, router]);
        // Finally, it renders the passed Component with all its props.
        return <Component {...props} />;
    };
    return Auth; 
 };

 export default withAuth;