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
        
      </div>
    </div>
  );
};

export default Modal;
