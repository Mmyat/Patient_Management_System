import React from 'react'

const FileManager = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <button className="text-xl bg-white p-1 mb-2 border-dashed border-1 border-gray-300 stroke-1 rounded-md" onClick={() => navigate(`/admin/patient/`)}>
        New      
      </button>
      <div className="grid w-full h-fit bg-white grid-cols-1 sm:grid-cols-2 gap-2 shadow-md">
        <p>Hi How are you?</p>
      </div>
    </div>
  )
}

export default FileManager