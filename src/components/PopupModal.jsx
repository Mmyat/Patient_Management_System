import React, { useState } from 'react';
import Modal from './Modal';

const PopupModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    // <div className="App">
    //   <div className="container mx-auto p-4">
    //     <h1 className="text-2xl font-bold mb-4">React Modal with Tailwind CSS</h1>
    //     <button
    //       onClick={openModal}
    //       className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
    //     >
    //       Open Modal
    //     </button>
    //   </div>
    //   <Modal isOpen={isModalOpen} onClose={closeModal} confirmBtnText ={"OK"} cancelBtnText ={"Cancel"}>
    //     <h2 className="text-xl font-bold mb-4">Modal Title</h2>
    //     <p className="mb-4">
    //       This is a sample modal. You can place any content you like here.
    //     </p>
    //     <div className="flex px-4 py-3 sm:px-6 sm:flex justify-end">
    //       <button
    //         onClick={closeModal}
    //         className="w-20 bg-blue-700 focus:bg-blue-500 text-white font-bold py-2 px-4 ml-4 rounded-full"
    //       >
    //         No
    //       </button>
    //       <button
    //         onClick={closeModal}
    //         className="w-20 bg-blue-700 focus:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
    //       >
    //         Yes
    //       </button>
    //       {/* <button
    //         onClick={onClose}
    //         className="w-full inline-flex justify-center border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-xl font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm rounded-full"
    //       >
    //         {cancelBtnText}
    //       </button> */}
    //     </div>
    //   </Modal>
    // </div>
    <div>
      
    </div>
  )
};

export default PopupModal;
