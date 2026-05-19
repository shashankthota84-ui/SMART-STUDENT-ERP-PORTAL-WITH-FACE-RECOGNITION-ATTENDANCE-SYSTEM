// src/utils/faceUtils.js
import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export const loadFaceModels = async () => {
  if (modelsLoaded) return true;
  
  try {
    const MODEL_URL = '/models';
    
    // Load the models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ]);
    
    modelsLoaded = true;
    console.log('Face models loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading face models:', error);
    return false;
  }
};

export const detectFaceDescriptor = async (videoElement) => {
  if (!modelsLoaded) {
    throw new Error('Face models not loaded yet');
  }

  try {
    // Detect a single face with landmarks and descriptor
    const detection = await faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      return null;
    }

    // Convert Float32Array to standard array for JSON serialization (localStorage)
    return {
      descriptor: Array.from(detection.descriptor),
      detection: detection.detection
    };
  } catch (error) {
    console.error('Error during face detection:', error);
    return null;
  }
};

export const matchFace = (liveDescriptorArray, savedDescriptorArray, threshold = 0.6) => {
    if(!liveDescriptorArray || !savedDescriptorArray) return false;

    const liveArr = Array.isArray(liveDescriptorArray) || liveDescriptorArray instanceof Float32Array ? liveDescriptorArray : Object.values(liveDescriptorArray);
    const savedArr = Array.isArray(savedDescriptorArray) || savedDescriptorArray instanceof Float32Array ? savedDescriptorArray : Object.values(savedDescriptorArray);

    // Convert regular arrays back to Float32Array for face-api computation
    const liveDesc = new Float32Array(liveArr);
    const savedDesc = new Float32Array(savedArr);

    // Calculate Euclidean distance between the two descriptors
    const distance = faceapi.euclideanDistance(liveDesc, savedDesc);
    
    // Lower distance means closer match. 0.6 is standard threshold.
    return {
        matched: distance < threshold,
        distance: distance
    };
};
