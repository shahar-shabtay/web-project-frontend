import React from 'react';

const SignIn: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Sign In</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>
        <div className="mt-3 text-center">
          <a href="/forgot-password" className="text-decoration-none">Forgot Password?</a>
          <p className="mt-2">
            Don't have an account? <a href="/signup" className="text-decoration-none">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;