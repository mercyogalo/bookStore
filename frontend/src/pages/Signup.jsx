// src/pages/RegisterPage.jsx
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axiosInstance from "../Utils/axiosInstance"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { GalleryVerticalEnd } from "lucide-react"

export function RegisterForm({ className, ...props }) {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("author")
  const [avatar, setAvatar] = useState(null)    
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("username", username)
      formData.append("email", email)
      formData.append("password", password)
      formData.append("role", role)
      if (avatar) formData.append("avatar", avatar)

      const res = await axiosInstance.post(`/auth/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      localStorage.setItem("token", res.data.token)
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: res.data.name,
          username: res.data.username,
          role: res.data.role,
          email: res.data.email,
          id:res.data.userID,
          avatar: res.data.avatar || null,
        })
      )

      if (res.data.role === "author") {
        navigate("/author-dashboard")
      } else if (res.data.role === "reviewer") {
        navigate("/reviewer-dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details to register
        </p>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="joedoe@example.com"
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

        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            className="border rounded-md px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="author">Author</option>
            <option value="reviewer">Reviewer</option>
          </select>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="avatar">
            Profile Picture <span className="text-xs text-gray-500">(jpeg, jpg, png)</span>
          </Label>
          <Input
            id="avatar"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  )
}

export default function SignUp() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://s3.amazonaws.com/shecodesio-production/uploads/files/000/172/784/original/Pile_de_livres_automne.jpeg?1756202167"
          alt="Register Illustration"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10 m-3">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            My Project
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}
