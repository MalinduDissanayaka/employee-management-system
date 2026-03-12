import { useState, useEffect, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from './context/AuthContext'
import Login from './components/Login'
import Register from './components/Register'
import EmployeeTable from './components/EmployeeTable'
import EmployeeForm from './components/EmployeeForm'
import Navbar from './components/Navbar'

const API_URL = 'http://localhost:8000'   // ← Now using standard port 8000

function App() {
  const { token, logout, isLoggedIn } = useContext(AuthContext)
  const [employees, setEmployees] = useState([])
  const [editingEmployee, setEditingEmployee] = useState(null)

  const fetchEmployees = async () => {
    if (!token) return
    try {
      const res = await axios.get(`${API_URL}/employees/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEmployees(res.data)
      console.log("✅ Employees loaded!")
    } catch (error) {
      console.error("❌ Fetch error:", error.response?.status)
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.")
        logout()
      }
    }
  }

  useEffect(() => {
    if (isLoggedIn && token) fetchEmployees()
  }, [isLoggedIn, token])

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee?')) {
      try {
        await axios.delete(`${API_URL}/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchEmployees()
      } catch (error) {
        if (error.response?.status === 401) logout()
      }
    }
  }

  const handleEdit = (employee) => setEditingEmployee(employee)
  const handleFormSubmit = () => {
    setEditingEmployee(null)
    fetchEmployees()
  }

  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />
  }

  return (
    <Router>
      <Navbar logout={logout} />
      <div className="min-h-screen bg-gray-100 p-8">
        <Routes>
          <Route path="/login" element={<Login API_URL={API_URL} />} />
          <Route path="/register" element={<Register API_URL={API_URL} />} />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-8">
                  <EmployeeForm 
                    employee={editingEmployee} 
                    onSubmit={handleFormSubmit} 
                    API_URL={API_URL}
                    token={token}
                  />
                  <EmployeeTable 
                    employees={employees} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                  />
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={isLoggedIn ? "/employees" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App