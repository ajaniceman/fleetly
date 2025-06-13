import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './VerifyEmailPage.css'; // Create this CSS file

export default function VerifyEmailPage() {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying your email...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false); // To show login button only on success/failure

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('Error: No verification token found.');
        setIsSuccess(false);
        setShowLoginButton(true);
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus(data.message); // Should be "Email verified successfully!"
          setIsSuccess(true);
        } else {
          setStatus(`Verification failed: ${data.message || 'An unknown error occurred.'}`);
          setIsSuccess(false);
        }
      } catch (error) {
        console.error('Error during email verification fetch:', error);
        setStatus('An unexpected error occurred during verification. Please try again later.');
        setIsSuccess(false);
      } finally {
        setShowLoginButton(true); // Show login button after attempt
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="verify-email-page-container">
      <div className="verify-email-card">
        <div className="status-icon">
          {isSuccess ? '✅' : '❌'}
        </div>
        <h2>Email Verification</h2>
        <p className={`verification-status ${isSuccess ? 'success' : 'failure'}`}>
          {status}
        </p>
        {showLoginButton && (
          <Link to="/login" className="login-button primary-cta">
            Go to Login
          </Link>
        )}
        <Link to="/" className="back-home-link">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
