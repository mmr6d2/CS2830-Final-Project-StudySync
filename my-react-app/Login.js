// Route to register a new user
import { app, pool } from './myserver'; // Adjust the path as necessary based on your file structure


app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = password; // You should hash passwords in a real app using bcrypt
  const sql = "INSERT INTO users (email, password) VALUES (?, ?)";

  pool.query(sql, [email, hashedPassword], (err, result) => {
      if (err) {
          console.error('Error during registration:', err);
          res.status(500).json({ error: 'Registration failed' });
      } else {
          res.status(201).json({ message: 'User registered successfully' });
      }
  });
});
// Route to login a user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT password FROM users WHERE email = ?";

  pool.query(sql, [email], (err, results) => {
      if (err) {
          console.error('Error during login:', err);
          res.status(500).json({ error: 'Login failed' });
      } else if (results.length > 0 && results[0].password === password) { // Password comparison should be with hashed passwords
          res.status(200).json({ message: 'Logged in successfully' });
      } else {
          res.status(401).json({ error: 'Invalid credentials' });
      }
  });
});
