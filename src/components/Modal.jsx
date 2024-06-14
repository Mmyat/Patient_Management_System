import React from 'react';

const Modal = ({ isOpen, onClose, children,confirmBtnText,cancelBtnText}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
        <div className="bg-white p-6">
          {children}
        </div>
        <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            onClick={onClose}
            className="w-20 bg-blue-700 focus:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="w-20 bg-blue-700 focus:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="w-full inline-flex justify-center border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-xl font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm rounded-full"
          >
            {cancelBtnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
