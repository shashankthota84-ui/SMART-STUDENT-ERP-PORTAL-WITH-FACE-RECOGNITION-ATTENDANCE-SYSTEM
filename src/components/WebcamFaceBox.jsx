/**
 * @file WebcamFaceBox.jsx
 * @description A reusable component that accesses the user's webcam and captures a face descriptor.
 * It integrates with face-api.js to detect facial landmarks and descriptors.
 */

import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { loadFaceModels, detectFaceDescriptor } from '../utils/faceUtils';

/**
 * WebcamFaceBox Component
 * @param {Object} props - Component props
 * @param {Function} props.onFaceDetected - Callback function triggered when a face is detected (passes the descriptor)
 * @param {boolean} props.isProcessing - Indicates whether the app is currently processing an image
 * @param {string} props.buttonText - Text to display on the capture button
 * @param {string} props.error - Error message to display (if any)
 * @returns {JSX.Element} The webcam UI and capture controls
 */
const WebcamFaceBox = ({ onFaceDetected, isProcessing, buttonText, error }) => {
  // Reference to the video element for attaching the media stream
  const videoRef = useRef(null);
  
  // State to track if face detection models are loaded
  const [modelsReady, setModelsReady] = useState(false);
  
  // State to track webcam access errors
  const [webcamError, setWebcamError] = useState('');

  /**
   * Effect hook to initialize face models and webcam stream on mount.
   */
  useEffect(() => {
    let stream = null;

    const setup = async () => {
      // 1. Load the AI models
      const loaded = await loadFaceModels();
      setModelsReady(loaded);

      if (loaded) {
        try {
          // 2. Request webcam access from the browser
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          // 3. Attach the stream to the video element
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

    // Cleanup function: Stop the webcam tracks when the component unmounts to free resources
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  /**
   * Event handler for the capture button.
   * Calls the detect function and triggers the parent callback.
   */
  const handleCapture = async () => {
    // Prevent capturing if video isn't ready or already processing
    if (!videoRef.current || isProcessing) return;
    
    try {
      // Attempt to extract face descriptor from the current video frame
      const detectionResult = await detectFaceDescriptor(videoRef.current);
      
      if (detectionResult) {
        // Face found, pass the descriptor back to parent
        onFaceDetected(detectionResult.descriptor);
      } else {
        // No face found in the frame
        onFaceDetected(null);
      }
    } catch (err) {
      console.error("Error during capture", err);
      onFaceDetected(null);
    }
  };

  return (
    <div className="webcam-wrapper">
      <div className="webcam-container">
        {/* Conditional rendering based on state: Errors -> Loading -> Video */}
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
            {/* Live video feed */}
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className="webcam-video"
              onPlay={() => console.log('Video playing')}
            />
            {/* Overlay a scanning animation when processing an image */}
            {isProcessing && (
              <div className="webcam-overlay">
                <div className="scanning-line"></div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 text-center">
        {/* Display parent-provided error messages (e.g. face mismatch) */}
        {error && <div className="alert alert-error mb-4">{error}</div>}
        
        {/* Capture Action Button */}
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
