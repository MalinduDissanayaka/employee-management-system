import { useState, useEffect } from 'react'
import axios from 'axios'

export default function EmployeeForm({ employee, onSubmit, API_URL }) {
  const [formData, setFormData] = useState({
    name: '', email: '', department: '', position: '', salary: ''
  })

  useEffect(() => {
    if (employee) {
      setFormData(employee)
    } else {
      setFormData({ name: '', email: '', department: '', position: '', salary: '' })
    }
  }, [employee])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (employee) {
      await axios.put(`${API_URL}/employees/${employee.id}`, formData)
    } else {
      await axios.post(`${API_URL}/employees/`, formData)
    }
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-10 p-6 border rounded-lg bg-gray-50">
      <h2 className="text-2xl mb-4">{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
      <div className="grid grid-cols-2 gap-4">
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="p-3 border rounded" />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="p-3 border rounded" />
        <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} required className="p-3 border rounded" />
        <input name="position" placeholder="Position" value={formData.position} onChange={handleChange} required className="p-3 border rounded" />
        <input name="salary" type="number" placeholder="Salary" value={formData.salary} onChange={handleChange} required className="p-3 border rounded" />
      </div>
      <button type="submit" className="mt-6 bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700">
        {employee ? 'Update Employee' : 'Add Employee'}
      </button>
    </form>
  )
}