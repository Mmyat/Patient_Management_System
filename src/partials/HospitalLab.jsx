import React from 'react'
import Table from  '../components/Table';
import PatientTable from '../components/PatientTable';
const patients = [
  { id: 1, name: 'John Doe', age: 30, condition: 'Flu' },
  { id: 2, name: 'Jane Smith', age: 25, condition: 'Cold' },
  { id: 3, name: 'Mike Johnson', age: 40, condition: 'Covid-19' },
  { id: 4, name: 'Sarah Williams', age: 35, condition: 'Allergies' },
  { id: 5, name: 'Chris Brown', age: 28, condition: 'Asthma' },
  { id: 6, name: 'Laura Wilson', age: 50, condition: 'Diabetes' },
  { id: 7, name: 'Paul White', age: 45, condition: 'Hypertension' },
  // Add more patients as needed
];
const HospitalLab = () => {
  return (
    <div className='mt-8'>
      <PatientTable patients={patients} />    
    </div>
  )
}

export default HospitalLab