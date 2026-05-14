// src/components/WebcamFaceBox.jsx
import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { loadFaceModels, detectFaceDescriptor } from '../utils/faceUtils';

const WebcamFaceBox = ({ onFaceDetected, isProcessing, buttonText, error }) => {
  const videoRef = useRef(null);
  const [modelsReady, setModelsReady] = useState(false);
  const [webcamError, setWebcamError] = useState('');

  useEffect(() => {
    let stream = null;

    const setup = async () => {
      const loaded = await loadFaceModels();
      setModelsReady(loaded);

      if (loaded) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing webcam:", err);
          setWebcamError("Could not access webcam. Please allow permissions.");
        }
      } else {
         setWebcamError("Could not load face-api.js models.");
      }
    };

    setup();

    // Cleanup: Stop webcam tracks when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || isProcessing) return;
    
    try {
      const detectionResult = await detectFaceDescriptor(videoRef.current);
      if (detectionResult) {
        onFaceDetected(detectionResult.descriptor);
      } else {
        onFaceDetected(null); // Signal that face wasn't found
      }
    } catch (err) {
      console.error("Error during capture", err);
      onFaceDetected(null);
    }
  };

  return (
    <div className="webcam-wrapper">
      <div className="webcam-container">
        {webcamError ? (
          <div className="flex items-center justify-center h-full text-danger p-4 text-center">
            {webcamError}
          </div>
        ) : !modelsReady ? (
          <div className="flex items-center justify-center h-full text-white animate-pulse">
            Loading Face Models...
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className="webcam-video"
              onPlay={() => console.log('Video playing')}
            />
            {isProcessing && (
              <div className="webcam-overlay">
                <div className="scanning-line"></div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 text-center">
        {error && <div className="alert alert-error mb-4">{error}</div>}
        
        <button 
          type="button"
          className="btn btn-primary w-full"
          onClick={handleCapture}
          disabled={!modelsReady || isProcessing || webcamError}
        >
          {isProcessing ? 'Processing...' : buttonText}
        </button>
      </div>
    </div>
  );
};

export default WebcamFaceBox;
