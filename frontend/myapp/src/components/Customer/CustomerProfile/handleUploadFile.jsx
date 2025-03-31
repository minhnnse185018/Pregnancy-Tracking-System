import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const [previewImage, setPreviewImage] = useState(null);
const [img, setImg] = useState(null);
const [profileImage, setProfileImage] = useState(null);

const uploadProfileImage = async (file) => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    throw new Error('User not logged in');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `http://localhost:5254/api/PregnancyProfile/${userId}/upload-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      }
    );
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

const handleUploadFile = async (e) => {
  const file = e.target.files[0];

  if (file) {
    const fileType = file.type;
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (validTypes.includes(fileType)) {
      setPreviewImage(URL.createObjectURL(file));
      setImg(file);
      
      try {
        const imageUrl = await uploadProfileImage(file);
        setProfileImage(imageUrl);
        toast.success('Upload ảnh thành công');
      } catch (error) {
        if (error.message === 'User not logged in') {
          toast.error('Vui lòng đăng nhập để tải ảnh lên');
        } else {
          toast.error('Không thể tải ảnh lên');
        }
        console.error('Error:', error);
      }
    } else {
      toast.error('Định dạng file không hợp lệ! Vui lòng tải lên ảnh JPG hoặc PNG.');
      e.target.value = "";
    }
  } else {
    setPreviewImage(null);
  }
}; 