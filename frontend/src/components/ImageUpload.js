// ImageUpload.js
import React, { useState } from 'react';
import ImageUploading from 'react-images-uploading';

const ImageUpload = ({ onImagesChange }) => {
  const [images, setImages] = useState([]);
  const maxNumber = 1; // กำหนดให้เลือกได้แค่รูปเดียว

  const onChange = (imageList) => {
    setImages(imageList);
    onImagesChange(imageList); // ส่งรูปภาพที่ถูกเลือกกลับไปยัง parent component
  };

  return (
    <div>
      <ImageUploading
        multiple={false} // ไม่อนุญาตให้เลือกหลายรูป
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({ imageList, onImageUpload, onImageRemoveAll, isDragging, dragProps }) => (
          <div>
            <button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here to upload image
            </button>
            &nbsp;
            {imageList.length > 0 && (
              <button onClick={onImageRemoveAll}>Remove image</button>
            )}
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image['data_url']} alt="uploaded" width="100" />
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
};

export default ImageUpload;
