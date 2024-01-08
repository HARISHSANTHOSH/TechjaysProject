
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './ResetPassword.css';
import { useNavigate} from 'react-router-dom';

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  // Password Hide and Show Functionality

  const togglePasswordVisibility = () => {
    console.log('Toggle password visibility');
    setShowPassword(!showPassword);
    console.log('showPassword:', showPassword);
  };
  
  // Csrf Token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/get-csrf-token/');
        const data = await response.json();

        if (response.ok) {
          setCsrfToken(data.csrf_token);
        } else {
          console.error(`Error fetching CSRF token: ${data.message}`);
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error.message);
      }
    };

    fetchCsrfToken();
  }, []);
 // Reset Functionality
  const handleResetPassword = async () => {
    try {
      // Validate the password manually
      if (!newPassword) {
        setResetMessage('Password is required.');
        return;
      }
      if (newPassword.length < 8) {
        setResetMessage('Password must be at least 8 characters long.');
      } else if (!/[A-Z]/.test(newPassword)) {
        setResetMessage('Password must contain at least one capital letter.');
      } else if (!/\d/.test(newPassword)) {
        setResetMessage('Password must contain at least one number.');
      } else if (!/[@#$!%*?&]/.test(newPassword)) {
        setResetMessage('Password must contain at least one special character.');
      }

      

      // If password passes validation, proceed with the reset request
      const response = await fetch(`http://127.0.0.1:8000/api/reset-password/${uidb64}/${token}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ new_password: newPassword }),
      });

      const data = await response.json();
     // Response from backend is ok then redirect to login
      if (response.ok) {
        navigate('/login');
        
      } else {
        setResetMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setResetMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className='reset-password-container'>
      <h2>Reset Password</h2>
        <div  style={{ position: 'relative' }}>
           <input className='form-control' style={{marginTop:'60px',marginLeft:'27px'}}  type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='New password'/>
              <span className="password-toggles" onClick={togglePasswordVisibility}>
               {showPassword ? 'Hide' : 'Show'}
              </span>
         </div>
       <button onClick={handleResetPassword}>Reset Password</button>
       <p className='reset' style={{marginTop:'-97px'}}>{resetMessage}</p>
   </div>
  );
};

export default ResetPassword;

