import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import image from '../assests/default_image.svg';

const ImageGenerator = () => {
  const [image_url, setImage_url] = useState("/");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef(null);

  const imageGenerator = async () => {
    if (inputRef.current.value === "") {
      setErrorMessage("Input cannot be empty");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const token = "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";  // Replace with your actual token

    async function query(data) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorDetail = await response.json();
        throw new Error(`API Error: ${errorDetail.error}`);
      }

      const result = await response.blob();
      return result;
    }

    try {
      const imageBlob = await query({ "inputs": inputRef.current.value });
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImage_url(imageObjectURL);

      // Clear the input field after the image is generated
      inputRef.current.value = "";
    } catch (error) {
      setErrorMessage(`Failed to generate image: ${error.message}`);
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='ai-image-generator'>
      <div className="header">Ai image <span>generator</span></div>
      
      <div className="img-loading">
        <div className="image">
          <img src={image_url === "/" ? image : image_url} alt='' />
        </div>
      </div>
      
      <div className="search-box">
        <input 
          type='text' 
          ref={inputRef} 
          className='serch-input' 
          placeholder='Describe what you want to see' 
        />
        <div className="btn" onClick={imageGenerator}>
          {loading ? "Generating..." : "Generate"}
        </div>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default ImageGenerator;
