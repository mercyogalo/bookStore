// src/pages/LoginPage.jsx
import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import axiosInstance from "../Utils/axiosInstance"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { GalleryVerticalEnd } from "lucide-react"


export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axiosInstance.post(`/auth/login`, {
        email,
        password,
      })

      localStorage.setItem("token", res.data.token);
      console.log(res.data.token);
      localStorage.setItem("user",JSON.stringify({
        name:res.data.username,
        role:res.data.role,
        email:res.data.email,
        id:res.data.userID
      }));

      if (res.data.role === "author") {
        navigate("/author-dashboard")
      } else if (res.data.role === "reviewer") {
        navigate("/reviewer-dashboard")
      } else {
        navigate("/")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6 w-full max-w-md", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password to continue
        </p>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  )
}

export default function Login() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      
     
      <div className="relative hidden lg:block">
        <img
          src="https://s3.amazonaws.com/shecodesio-production/uploads/files/000/172/784/original/Pile_de_livres_automne.jpeg?1756202167"
          alt="Login Illustration"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

    
      <div className="flex flex-col justify-center items-center bg-background relative m-3">
       
        <div className="absolute top-6 left-6 hidden lg:flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          My Project
        </div>

     
        <LoginForm />
      </div>

      
    </div>
  )
}
