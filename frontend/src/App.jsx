import { useState, useEffect } from 'react'
import axios from 'axios'
import EmployeeTable from './components/EmployeeTable'
import EmployeeForm from './components/EmployeeForm'

const API_URL = 'http://localhost:8000'

function App() {
  const [employees, setEmployees] = useState([])
  const [editingEmployee, setEditingEmployee] = useState(null)

  const fetchEmployees = async () => {
    const res = await axios.get(`${API_URL}/employees/`)
    setEmployees(res.data)
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee?')) {
      await axios.delete(`${API_URL}/employees/${id}`)
      fetchEmployees()
    }
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
  }

  const handleFormSubmit = () => {
    setEditingEmployee(null)
    fetchEmployees()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">
        Employee Management System
      </h1>
      
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-8">
        <EmployeeForm 
          employee={editingEmployee} 
          onSubmit={handleFormSubmit} 
          API_URL={API_URL}
        />
        
        <EmployeeTable 
          employees={employees} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  )
}

export default App