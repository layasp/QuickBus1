import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link component from React Router
import './LoginForm.css'; // Import CSS file for styling

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(username === "sri" && password === "Sril"){
      sessionStorage.setItem("user_id", username);
       window.location='/bussearch';
    }else{
      alert("Invalid username and password");
    }
    console.log('Logging in with:', { username, password });
    
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      {/* Add a Link to the Signup page */}
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      {/* Add a Link to the Forgot Password page */}
      <p><Link to="/reset-password">Forgot Password?</Link></p>
    </div>
  );
};

export default LoginForm;
