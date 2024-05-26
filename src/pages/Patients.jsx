import React from 'react'
import FilterButton from '../components/DropdownFilter';
import { IoMdContact } from "react-icons/io";
import Datepicker from '../components/Datepicker';
import {useNavigate} from 'react-router-dom';
import Table from '../partials/Table';
import SearchBar from '../components/SearchBar';
const Patients = () => {
  const navigate = useNavigate();
  return (
    <div className="flex px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl items-center sm:justify-center mx-auto">
      <div className="flex-col items-center sm:items-center justify-center md:justify-center items-center mb-8 overflow-x-auto">
          {/* Right: Actions */}
          <h3 className='text-center text-2xl mb-4 font-semibold '>Search Your Patients</h3>
          {/* <IoMdContact className='text-blue-400 self-center  text-7xl'/> */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2 mb-8">
              {/* <Datepicker /> */}
              <button className="flex-end btn bg-blue-500 hover:bg-blue-500 text-white justify-items-end" onClick={()=> navigate(`patientform/${null}`)}>
                  <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="ml-2">New Patient</span>
              </button>                
          </div>
          {/* <SearchBar/> */}
          <Table/>
      </div>
    </div>
  )
}

export default Patients