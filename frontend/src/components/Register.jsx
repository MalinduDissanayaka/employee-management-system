import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register({ API_URL }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await axios.post(`${API_URL}/register`, { email, password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow">
      <h2 className="text-3xl font-bold text-center mb-8">Register</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded mb-6"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account? <a href="/login" className="text-blue-600">Login here</a>
      </p>
    </div>
  )
}