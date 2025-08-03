'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmojiRain } from '@/components/EmojiRain';

import { Eye, EyeOff } from 'lucide-react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const storedUsername = localStorage.getItem('user_username');

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setLoggedInUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setLoggedInUsername(null);
    }
  }, []);

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsSubmitting(true); // Start loading

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful! You can now log in.');
        setEmail('');
        setPassword('');
        setUsername('');
        setIsRegistering(false);
        setTimeout(clearMessages, 2000);
      } else {
        setError(data.error || 'Unknown registration error.');
        setTimeout(clearMessages, 2000);
      }
    } catch (err: unknown) {
      console.error('Network or other error:', err);
      if (err instanceof Error) {
        setError('Connection error: ' + err.message);
      } else {
        setError('Connection error. Please try again.');
      }
      setTimeout(clearMessages, 2000);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsSubmitting(true); // Start loading

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful!');
        if (data.token && data.user && data.user.username) {
          localStorage.setItem('jwt_token', data.token);
          localStorage.setItem('user_username', data.user.username);
          localStorage.setItem('user_email', data.user.email);

          setIsLoggedIn(true);
          setLoggedInUsername(data.user.username);
          setTimeout(() => {
            clearMessages();
            router.push('/');
          }, 2000);
        } else {
          setError('Login successful, but user data or token not received.');
          setTimeout(clearMessages, 2000);
        }
      } else {
        setError(data.error || 'Unknown login error.');
        setTimeout(clearMessages, 2000);
      }
    } catch (err: unknown) {
      console.error('Network or other error:', err);
      if (err instanceof Error) {
        setError('Connection error: ' + err.message);
      } else {
        setError('Connection error. Please try again.');
      }
      setTimeout(clearMessages, 2000);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_username');
    localStorage.removeItem('user_email');
    setIsLoggedIn(false);
    setLoggedInUsername(null);
    setMessage('You have successfully logged out.');
    setError('');
    setTimeout(clearMessages, 2000);
  };

  return (
    <div className={cn("flex flex-col gap-6 max-w-100 mx-auto mt-10")}>
      <h1 className='text-white text-center font-bold text-2xl'>Log in / Sign in</h1>
      <EmojiRain />

      {isLoggedIn ? (
        <Card className="text-center p-8">
          <CardTitle className="text-2xl mb-4 text-white">Welcome to the app.</CardTitle>
          {loggedInUsername && (
            <CardDescription className="text-lg mb-6 text-white/80">
              Nice to see you, {loggedInUsername}!
            </CardDescription>
          )}
          <Button onClick={handleLogout} className="w-full max-w-xs mx-auto">
            Log Out
          </Button>
          {message && <p className="text-green-500 mt-4">{message}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{isRegistering ? 'Create your account' : 'Login to your account'}</CardTitle>
            <CardDescription>
              {isRegistering ? 'Enter your details to create a new account.' : 'Enter your email below to login to your account.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
              <div className="flex flex-col gap-6">
                {isRegistering && (
                  <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="your_nickname"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="grid gap-3 relative">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isRegistering ? "new-password" : "current-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-8"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-[#2cb52c]" /> : <Eye className="h-5 w-5 text-[#2cb52c]" />}
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (isRegistering ? 'Registering...' : 'Logging in...') : (isRegistering ? 'Register' : 'Login')}
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                {isRegistering ? (
                  <>
                    Already have an account?{" "}
                    <a
                      href="#"
                      className="underline underline-offset-4"
                      onClick={(e) => { e.preventDefault(); setIsRegistering(false); }}
                    >
                      Login
                    </a>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <a
                      href="#"
                      className="underline underline-offset-4"
                      onClick={(e) => { e.preventDefault(); setIsRegistering(true); }}
                    >
                      Sign up
                    </a>
                  </>
                )}
              </div>
            </form>
            {message && <p className="text-green-500 text-center mt-4">{message}</p>}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
