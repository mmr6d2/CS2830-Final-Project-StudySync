import React, { useState } from 'react';
//import logo from './logo.webp';


function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading status


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true when request starts
        try {
            const response = await fetch('http://localhost:3001/api/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: email,
                password: password,
                username: username
              })
            });
            if (!response.ok) {
              throw new Error(`Failed to add event - ${response.status}`);
            }
            const data = await response.json();
            localStorage.setItem("token", data.token);
        } 
        finally {
            setLoading(false); // Reset loading status regardless of outcome
        }
    };

    // Inline styles
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            backgroundColor: '#fffffee'
        },
        formContainer: {
            padding: '20px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '320px'
        },
        logo: {
            width: '300px',
            marginBottom: '40px'
        },
        input: {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '16px'
        },
        button: {
            width: '100%',
            padding: '10px',
            color: '#fff',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
        },
        toggleButton: {
            marginTop: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#007bff'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2>Register for StudySync</h2>
                <form onSubmit={handleSubmit}>
                <input
                        type="username"
                        value={username}
                        onChange={e => setUserName(e.target.value)}
                        placeholder="Username"
                        required
                        style={styles.input}
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        style={styles.input}
                    />
                    <button type="submit" disabled={loading} style={styles.button}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;
