import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext)

  return (
    <nav className="bg-blue-700 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employee System</h1>
        <div>
          {isLoggedIn ? (
            <>
              <Link to="/employees" className="mr-6 hover:underline">Employees</Link>
              <button onClick={logout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-6 hover:underline">Login</Link>
              <Link to="/register" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}