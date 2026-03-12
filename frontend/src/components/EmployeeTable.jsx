export default function EmployeeTable({ employees, onEdit, onDelete }) {
  return (
    <div>
      <h2 className="text-2xl mb-4">Employee List</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Department</th>
            <th className="p-3 text-left">Position</th>
            <th className="p-3 text-left">Salary</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{emp.name}</td>
              <td className="p-3">{emp.email}</td>
              <td className="p-3">{emp.department}</td>
              <td className="p-3">{emp.position}</td>
              <td className="p-3">${emp.salary}</td>
              <td className="p-3 text-center">
                <button onClick={() => onEdit(emp)} className="bg-yellow-500 text-white px-4 py-1 rounded mr-2">Edit</button>
                <button onClick={() => onDelete(emp.id)} className="bg-red-500 text-white px-4 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}