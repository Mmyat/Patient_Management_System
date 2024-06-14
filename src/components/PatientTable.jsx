import React, { useState } from 'react';

const PatientTable = ({ patients }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const sortedPatients = [...patients].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const indexOfLastPatient = currentPage * rowsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - rowsPerPage;
  const currentPatients = sortedPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mx-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} className="py-2 px-4 border-b">Name</th>
            <th onClick={() => handleSort('age')} className="py-2 px-4 border-b">Age</th>
            <th onClick={() => handleSort('condition')} className="py-2 px-4 border-b">Condition</th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.map((patient) => (
            <tr key={patient.id}>
              <td className="py-2 px-4 border-b">{patient.name}</td>
              <td className="py-2 px-4 border-b">{patient.age}</td>
              <td className="py-2 px-4 border-b">{patient.condition}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center py-2">
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="py-1 px-3 bg-blue-500 text-white rounded"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(patients.length / rowsPerPage)))}
            className="py-1 px-3 bg-blue-500 text-white rounded ml-2"
          >
            Next
          </button>
        </div>
        <div>
          <label>
            Rows per page:
            <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="ml-2">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PatientTable;
