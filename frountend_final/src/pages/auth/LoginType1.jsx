import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../App';
import { LogIn, Mail, Lock, Chrome } from 'lucide-react';
import { authAPI } from '../../utils/api';
import { useGoogleLogin } from '@react-oauth/google';

const LoginType1 = () => {
  const [role, setRole] = useState('driver');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authAPI.login({ email, password });
      if (data.user.role !== role) {
        setError(`This account is not a ${role}`);
        return;
      }
      login(data.user, data.token);
      navigate(`/${role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await authAPI.googleLogin({ 
          tokenId: tokenResponse.access_token, 
          role 
        });
        login(data.user, data.token);
        navigate(`/${data.user.role}`);
      } catch (err) {
        setError('Google login failed');
      }
    },
    onError: () => setError('Google login failed'),
  });

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.1),transparent_50%)]" />
      
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Park<span className="neon-text">Ease</span>
          </h1>
          <p className="text-gray-400">Welcome Back</p>
        </div>

        <div className="card backdrop-blur-xl bg-dark-card/80">
          <div className="flex p-1 bg-dark-lighter rounded-lg mb-6">
            {['driver', 'owner', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  role === r 
                    ? 'bg-neon-gradient text-white shadow-neon-blue' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm text-center">{error}</div>}
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="email"
                placeholder="Email Address"
                className="input-field pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="password"
                placeholder="Password"
                className="input-field pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm text-neon-blue hover:underline">Forgot Password?</a>
            </div>

            <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Login as {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-dark-card px-2 text-gray-500">Or continue with</span></div>
            </div>

            <button 
              type="button" 
              onClick={() => googleLogin()}
              className="w-full py-3 px-4 border border-white/10 rounded-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
            >
              <Chrome className="w-5 h-5" />
              Google
            </button>

            <p className="text-center text-sm text-gray-400 mt-6">
              Don't have an account? <Link to="/signup" className="text-neon-purple hover:underline">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginType1;
