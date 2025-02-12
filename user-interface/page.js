'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
const ImageUpload =() =>{


  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponse] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8001/predict',formData
      //    {
      //   method: 'POST',
      //   body: formData,
      // }
    );

      // if (!response.ok) {
      //   throw new Error('Upload failed');
      // }

      // const data = await response.json();
      // alert(`Upload successful: ${data.url}`);
      console.log("response", response)
      setResponse(response.data.predictions)
    } catch (error) {
      console.error('Error uploading file:', error);
      // alert('Upload failed');
      setResponse("Upload Failed!")
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md" style={{marginTop:"80px"}}>
      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileInput" />
      <label htmlFor="fileInput" className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Choose Image
      </label>
      {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />}
      <Button onClick={handleUpload} disabled={!file || loading}>
        {loading ? 'Uploading...' : 'Upload Image'}
      </Button>

      <p>{responseMsg}</p>
    </div>
  );
}


export default ImageUpload