import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Chrome } from 'lucide-react';
import { authAPI } from '../../utils/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'driver'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await authAPI.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.1),transparent_50%)]" />
      
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Park<span className="neon-text">Ease</span>
          </h1>
          <p className="text-gray-400">Create your account</p>
        </div>

        <div className="card backdrop-blur-xl bg-dark-card/80">
          <div className="flex p-1 bg-dark-lighter rounded-lg mb-6">
            {['driver', 'owner'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setFormData({ ...formData, role: r })}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  formData.role === r 
                    ? 'bg-neon-gradient text-white shadow-neon-blue' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm text-center">{error}</div>}
            
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                className="input-field pl-10"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="input-field pl-10"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="input-field pl-10"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5" />
              Sign Up as {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-dark-card px-2 text-gray-500">Or continue with</span></div>
            </div>

            <button type="button" className="w-full py-3 px-4 border border-white/10 rounded-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
              <Chrome className="w-5 h-5" />
              Google
            </button>

            <p className="text-center text-sm text-gray-400 mt-6">
              Already have an account? <Link to="/login" className="text-neon-purple hover:underline">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
