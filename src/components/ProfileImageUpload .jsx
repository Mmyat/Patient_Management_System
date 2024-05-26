import React, { useState } from 'react';
import { AiOutlinePlus } from "react-icons/ai";

const ProfileImageUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUpload = () => {
    // Implement the upload logic here
    console.log('Uploading', image);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="relative w-40 h-40">
        {preview ? (
          <img
            src={preview}
            alt="Profile Preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
            {/* <span className="text-gray-400">No Image</span> */}
            <AiOutlinePlus className='text-3xl font-semibold object-cover'/>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default ProfileImageUpload;