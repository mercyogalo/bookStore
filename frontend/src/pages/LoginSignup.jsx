import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../Utils/Api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const LoginSignup = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { login, signup } = useAuth();
  const [response, setResponse]=useState("");

  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    role:'',
    confirmPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    try {
      const res = await axios.post(`${api}/auth/login`, loginForm);
      const token = res.data.token;
      localStorage.setItem('authToken', token);
      setResponse(res.data);
     
       if (res.data.role === "author") {
      navigate('/author-dashboard');
    } else if (res.data.role === "reviewer") {
      navigate('/reviewer-dashboard');
    } else {
      navigate('/');
    }
      
      
    } catch (error) {
      console.log("Login failed:", error);
      alert("Failed with error");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(false);

    if (signupForm.password !== signupForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${api}/auth/register`, signupForm);
      const token = res.data.token;
      localStorage.setItem('authToken', token);

      if (res.data.role === "author") {
      navigate('/author-dashboard');
    } else if (res.data.role === "reviewer") {
      navigate('/reviewer-dashboard');
    } else {
      navigate('/');
    }
      alert("Successfully registered");
    } catch (error) {
      console.error("Registration error:", error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <BookOpen className="h-8 w-8 text-secondary" />
            <span className="text-2xl font-bold">BookReview</span>
          </div>
          <CardTitle>Welcome to BookReview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                {error && (
                  <p className="text-red-500 text-sm mt-2">
                    Something went wrong!
                  </p>
                )}
              </form>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="signup-role">Role</Label>
                <select
                  name="role"
                  value={signupForm.role}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2 border rounded"
                >
                   <option>Choose roles</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="author">Author</option>
                </select>
                
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>

                <p className="text-red-500 text-sm mt-2">
                    {response}
                  </p>

                {error && (
                  <p className="text-red-500 text-sm mt-2">
                    Something went wrong!
                  </p>
                )}
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-4 text-sm text-muted-foreground">
            Join thousands of readers sharing their love for books
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
