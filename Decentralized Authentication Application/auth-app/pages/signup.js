import {useState} from 'react';
import styles from '../styles/signup.module.css';

// create the sign up page with the form to get the user's name and email
function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // The handleSubmit function only prevents the default action and does not perform any further actions
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // The fetch function is used to send a POST request to the /api/signup 
        // endpoint with the user's name and email as the request body
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
          });
          console.log(response)
          const data = await response.json();
          console.log(data);
    };
    

    return (
        <div className={styles.container}> 
            <h1>Sign Up</h1>
            {/* create the form */}
            <form  onSubmit={handleSubmit} className={styles.form}>
                <label>
                    <span className= {styles.label}>Name:</span>
                    <input
                    type = "text"
                    value = {name} 
                    onChange={(event) => setName(event.target.value)}
                    className={styles.input}
                    />
                </label> 
                <label>
                    <span className= {styles.label}>Email:</span>
                    <input
                    type = "email"
                    value = {email} 
                    onChange={(event) => setEmail(event.target.value)}
                    className={styles.input}
                    />
                </label> 
                <button className={styles.btn} type="submit">Submit</button>
            </form>
        </div>
    );
}

export default SignupPage;
