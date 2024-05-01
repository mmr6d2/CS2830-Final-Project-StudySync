import React, { useState } from 'react';
import axios from 'axios';
import logo from './logo.webp';

function AuthForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false); // State to manage loading status

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true when request starts
        const url = `http://localhost:3001/api/${isLogin ? 'login' : 'register'}`;
        try {
            const response = await axios.post(url, { email, password });
            alert(response.data.message); // Consider replacing with non-blocking UI feedback
        } catch (error) {
            alert(error.response.data.error); // Consider showing this error inline
        } finally {
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
                <img src={logo} alt="" style={styles.logo} />
                <h2>{isLogin ? '' : 'Register for StudySync'}</h2>
                <form onSubmit={handleSubmit}>
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
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>
                <button onClick={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
                    {isLogin ? 'Need to register?' : 'Already registered?'}
                </button>
            </div>
        </div>
    );
}

export default AuthForm;
