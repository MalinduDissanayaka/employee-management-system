import { useState, useEffect } from 'react'
import axios from 'axios'

export default function EmployeeForm({ employee, onSubmit, API_URL, token }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    salary: ''
  })

  // Reset or populate form when editing
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        department: employee.department || '',
        position: employee.position || '',
        salary: employee.salary || ''
      })
    } else {
      setFormData({ 
        name: '', 
        email: '', 
        department: '', 
        position: '', 
        salary: '' 
      })
    }
  }, [employee])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    try {
      if (employee) {
        // Update existing employee
        await axios.put(`${API_URL}/employees/${employee.id}`, formData, config)
        alert('Employee updated successfully!')
      } else {
        // Create new employee
        await axios.post(`${API_URL}/employees/`, formData, config)
        alert('Employee added successfully!')
      }
      onSubmit()  // This will refresh the list and clear the form
    } catch (error) {
      console.error("Error:", error)
      alert(error.response?.data?.detail || "Failed to save employee. Make sure you are logged in.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-10 p-6 border rounded-lg bg-gray-50">
      <h2 className="text-2xl mb-4 font-semibold text-gray-800">
        {employee ? 'Edit Employee' : 'Add New Employee'}
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <input 
          name="name" 
          placeholder="Full Name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          className="p-3 border rounded focus:outline-none focus:border-blue-500" 
        />
        
        <input 
          name="email" 
          type="email" 
          placeholder="Email Address" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          className="p-3 border rounded focus:outline-none focus:border-blue-500" 
        />
        
        <input 
          name="department" 
          placeholder="Department" 
          value={formData.department} 
          onChange={handleChange} 
          required 
          className="p-3 border rounded focus:outline-none focus:border-blue-500" 
        />
        
        <input 
          name="position" 
          placeholder="Position / Job Title" 
          value={formData.position} 
          onChange={handleChange} 
          required 
          className="p-3 border rounded focus:outline-none focus:border-blue-500" 
        />
        
        <input 
          name="salary" 
          type="number" 
          step="0.01"
          placeholder="Salary" 
          value={formData.salary} 
          onChange={handleChange} 
          required 
          className="p-3 border rounded focus:outline-none focus:border-blue-500" 
        />
      </div>

      <button 
        type="submit" 
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition"
      >
        {employee ? 'Update Employee' : 'Add Employee'}
      </button>
    </form>
  )
}