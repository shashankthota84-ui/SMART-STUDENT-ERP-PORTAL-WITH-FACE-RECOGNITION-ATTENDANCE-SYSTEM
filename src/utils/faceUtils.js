/**
 * @file faceUtils.js
 * @description Utility functions for handling face detection and recognition using face-api.js.
 * This includes loading models, detecting faces from a video stream, and matching face descriptors.
 */

import * as faceapi from 'face-api.js';

// State variable to track if face-api models are already loaded
let modelsLoaded = false;

/**
 * Loads the necessary face-api.js models from the public/models directory.
 * @returns {Promise<boolean>} True if models loaded successfully, false otherwise.
 */
export const loadFaceModels = async () => {
  // Prevent reloading models if they are already loaded
  if (modelsLoaded) return true;
  
  try {
    const MODEL_URL = '/models';
    
    // Load all required models concurrently for better performance
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ]);
    
    // Update state to indicate models are ready
    modelsLoaded = true;
    console.log('Face models loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading face models:', error);
    return false;
  }
};

/**
 * Detects a single face from a video element and extracts its descriptor (features).
 * @param {HTMLVideoElement} videoElement - The video element containing the live camera feed
 * @returns {Promise<Object|null>} An object containing the descriptor array and detection details, or null if no face found.
 */
export const detectFaceDescriptor = async (videoElement) => {
  // Ensure models are loaded before attempting detection
  if (!modelsLoaded) {
    throw new Error('Face models not loaded yet');
  }

  try {
    // Detect a single face with landmarks and extract the 128-dimensional descriptor
    const detection = await faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    // Return null if no face is detected in the current frame
    if (!detection) {
      return null;
    }

    // Convert Float32Array to standard array for JSON serialization (needed for localStorage)
    return {
      descriptor: Array.from(detection.descriptor),
      detection: detection.detection
    };
  } catch (error) {
    console.error('Error during face detection:', error);
    return null;
  }
};

/**
 * Compares a live face descriptor against a saved descriptor to check for a match.
 * @param {Array|Float32Array} liveDescriptorArray - Descriptor from the live camera feed
 * @param {Array|Float32Array} savedDescriptorArray - Descriptor saved in the database/storage
 * @param {number} [threshold=0.6] - The maximum distance to consider it a match (lower is stricter)
 * @returns {Object|boolean} An object with match status and distance, or false if inputs are invalid.
 */
export const matchFace = (liveDescriptorArray, savedDescriptorArray, threshold = 0.6) => {
    // Return early if either descriptor is missing
    if(!liveDescriptorArray || !savedDescriptorArray) return false;

    // Ensure descriptors are arrays, convert from objects if necessary
    const liveArr = Array.isArray(liveDescriptorArray) || liveDescriptorArray instanceof Float32Array ? liveDescriptorArray : Object.values(liveDescriptorArray);
    const savedArr = Array.isArray(savedDescriptorArray) || savedDescriptorArray instanceof Float32Array ? savedDescriptorArray : Object.values(savedDescriptorArray);

    // Convert regular arrays back to Float32Array which is required by face-api for computation
    const liveDesc = new Float32Array(liveArr);
    const savedDesc = new Float32Array(savedArr);

    // Calculate Euclidean distance between the two descriptors to find similarity
    const distance = faceapi.euclideanDistance(liveDesc, savedDesc);
    
    // Lower distance means closer match. 0.6 is the standard threshold for face recognition.
    return {
        matched: distance < threshold, // True if distance is within the acceptable threshold
        distance: distance // Return exact distance for debugging or logging
    };
};
