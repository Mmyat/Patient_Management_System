import React, { useState } from 'react';
import Modal from './Modal';

const PopupModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="App">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">React Modal with Tailwind CSS</h1>
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
        >
          Open Modal
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} confirmBtnText ={"OK"} cancelBtnText ={"Cancel"}>
        <h2 className="text-xl font-bold mb-4">Modal Title</h2>
        <p className="mb-4">
          This is a sample modal. You can place any content you like here.
        </p>
        {/* <button
          onClick={closeModal}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none"
        >
          Close Modal
        </button> */}
      </Modal>
    </div>
  );
};

export default PopupModal;
