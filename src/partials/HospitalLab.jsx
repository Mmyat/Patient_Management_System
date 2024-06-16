import React from 'react'
import Table from  '../components/Table';
import PatientTable from '../components/PatientTable';
import TableComponent from '../components/TableComponent';
const columns = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'condition', label: 'Condition' }
];

const data = [
  { name: 'John Doe', age: 30, condition: 'Flu' },
  { name: 'Jane Smith', age: 25, condition: 'Cold' },
  { name: 'Mike Johnson', age: 40, condition: 'Covid-19' },
  { name: 'Sarah Williams', age: 35, condition: 'Allergies' },
  { name: 'Chris Brown', age: 28, condition: 'Asthma' },
  { name: 'Laura Wilson', age: 50, condition: 'Diabetes' },
  { name: 'Paul White', age: 45, condition: 'Hypertension' },
  // Add more patients as needed
];

const HospitalLab = () => {
  return (
    <div className='mt-8'>
      <TableComponent columns={columns} data={data} />    
    </div>
  )
}

export default HospitalLab