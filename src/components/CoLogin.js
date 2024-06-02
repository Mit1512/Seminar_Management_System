import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function StuLogin(props) {
  // State to handle user input for email and password

  const [credentials, setCredentials] = useState({ email: '', cpassword: '' });
  const navigate = useNavigate();
  
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Sending a POST request to the server for login
    const response = await fetch('http://localhost:5000/cologin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: credentials.email, cpassword: credentials.cpassword }),
    });
    const json = await response.json();
    console.log(json);
    // Checking if login was successful
    if (json.success) {
      // Saving email and token in local storage on successful login
      localStorage.setItem('coEmail', credentials.email);
      console.log(credentials.email);
      localStorage.setItem('token', json.token);
      
      // Redirecting to 'coreview' page
      navigate('/coreview');
    alert("Successfully Loged in")
    } else {
    // Alerting user if login fails  
    alert("Please Login With Correct Credentials")
    }
  };
  // Function to handle input changes
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Function to navigate to signup page
  const signUp = () => {
    navigate('/signup');
  };

  const styles = `
    .container-fluid {
      background-repeat: no-repeat;
      background-size: cover;
      // height: 100vh;
      // width: 100vw;
      position: relative;
      margin-top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .form-container {
      background-color: rgba(255, 255, 255, 0.8);
      padding: 30px;
      border-radius: 5px;
    }

    .form-label {
      font-weight: bold;
    }

    .form-control {
      border-radius: 5px;
    }

    .btn-primary {
      background-color: #007bff;
      border: none;
      border-radius: 5px;
      padding: 10px 20px;
      margin-top: 10px;
    }

    .btn-primary:hover {
      background-color: #0069d9;
    }
  `;

  return (
    <>
    <Navbar />
      <style>{styles}</style>
      <div 
        className='container-fluid'
        style={{
          backgroundImage: 'url(bg-mit.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          height: '100vh',
          width: '100vw',
          position: 'relative',
          marginTop: '0'
        }}
      >
      <div className='container-fluid'>
        <div className='form-container'>
         <h1>Coordinator Login</h1>
          <form onSubmit={handleSubmit}
            className='my-5'
            style={{
              marginTop: '30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div className='mb-3'>
              <label htmlFor='email' className='form-label'>
                Email address
              </label>
              <input value={credentials.email} onChange={onChange}
                type='email'
                className='form-control'
                id='email'
                name='email'
                aria-describedby='emailHelp'
              />
              <div id='emailHelp' className='form-text'>
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className='mb-3'>
              <label htmlFor='password' className='form-label'>
                Password
              </label>
              <input type='password' className='form-control' value={credentials.cpassword} onChange={onChange} name='cpassword' id='cpassword' required />
            </div>

            <button type='submit' className='btn btn-primary'>
              Submit
            </button>
          </form>
        </div>
      </div>
      </div>
    </>
  );
}

export default StuLogin;