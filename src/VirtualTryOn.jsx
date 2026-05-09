// src/components/VirtualTryOn.js
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import * as tf from "@tensorflow/tfjs";

const VirtualTryOn = ({ glassesImg }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const glassesImgRef = useRef(null);
  const streamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [tfReady, setTfReady] = useState(false);
  const [glassesImageLoaded, setGlassesImageLoaded] = useState(false);

  // Validate glassesImg prop on mount
  useEffect(() => {
    console.log('🔍 VirtualTryOn component received glassesImg prop:', glassesImg);
    if (!glassesImg) {
      console.warn('⚠️ WARNING: glassesImg prop is undefined or null');
    }
  }, [glassesImg]);

  const takeScreenshot = () => {
    const canvas = canvasRef.current;
const context = canvas.getContext("2d");

// ✅ Force a redraw including glasses before capturing screenshot
context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

const screenshot = canvas.toDataURL("image/png");
setScreenshot(screenshot);

// ✅ Download image correctly with glasses
const link = document.createElement("a");
link.href = screenshot;
link.download = "virtual-tryon.png";
link.click();

  };

  // Initialize TensorFlow backend BEFORE loading models
  useEffect(() => {
    const initializeTensorFlow = async () => {
      try {
        // Set CPU backend as fallback to handle WebGL/WASM failures
        await tf.setBackend('cpu');
        await tf.ready();
        console.log('TensorFlow initialized with CPU backend');
        setTfReady(true);
      } catch (error) {
        console.warn('Error initializing TensorFlow:', error);
        // Continue anyway - TensorFlow may initialize on its own
        setTfReady(true);
      }
    };
    initializeTensorFlow();
  }, []);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      // Wait for TensorFlow to be ready BEFORE loading models
      if (!tfReady) return;

      try {
        const MODEL_URL = import.meta.env.BASE_URL + "models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };
    loadModels();
  }, [tfReady]);

  // Load glasses image
  useEffect(() => {
    if (!glassesImg) {
      console.error('❌ glassesImg is undefined - cannot load image');
      setGlassesImageLoaded(false);
      return;
    }

    console.log('📦 Loading glasses image from source:', glassesImg);
    const img = new Image();
    
    // Set CORS attributes to handle cross-origin images
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      glassesImgRef.current = img;
      console.log('✅ Glasses image loaded successfully:', { 
        src: glassesImg, 
        width: img.width, 
        height: img.height,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      });
      setGlassesImageLoaded(true);
    };
    
    img.onerror = (error) => {
      console.error('❌ Failed to load glasses image:', { src: glassesImg, error });
      setGlassesImageLoaded(false);
    };

    // Set timeout to detect if image fails to load
    const loadTimeout = setTimeout(() => {
      if (!glassesImgRef.current) {
        console.error('⏱️ TIMEOUT: Glasses image did not load within 5 seconds:', glassesImg);
      }
    }, 5000);

    img.src = glassesImg;

    return () => clearTimeout(loadTimeout);
  }, [glassesImg]);

  // Handle video and face detection
  useEffect(() => {
    if (!modelsLoaded) {
      console.log('⏳ Waiting for models to load...');
      return;
    }

    if (!glassesImageLoaded) {
      console.log('⏳ Waiting for glasses image to load...');
      return;
    }

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };
    startVideo();

    const interval = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.readyState !== 4) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        if (!detections || detections.length === 0) {
          console.warn('⚠️ No faces detected in frame');
        } else {
          console.log('✅ Face detection successful:', { faceCount: detections.length });
        }

        detections.forEach((detection, index) => {
          console.log(`📍 Face ${index + 1} landmarks detected:`, {
            leftEyePts: detection.landmarks.getLeftEye().map(pt => ({ x: pt.x.toFixed(2), y: pt.y.toFixed(2) })),
            rightEyePts: detection.landmarks.getRightEye().map(pt => ({ x: pt.x.toFixed(2), y: pt.y.toFixed(2) }))
          });
          const landmarks = detection.landmarks;
          const leftEyePts = landmarks.getLeftEye();
          const rightEyePts = landmarks.getRightEye();

          const leftEyeX = (leftEyePts[0].x + leftEyePts[3].x) / 2;
          const leftEyeY = (leftEyePts[1].y + leftEyePts[4].y) / 2;
          const rightEyeX = (rightEyePts[0].x + rightEyePts[3].x) / 2;
          const rightEyeY = (rightEyePts[1].y + rightEyePts[4].y) / 2;

          const eyeDist = Math.hypot(rightEyeX - leftEyeX, rightEyeY - leftEyeY);
          const glassesWidth = eyeDist * 2.1;

          if (glassesImgRef.current) {
            // Validate image is fully loaded with proper dimensions
            if (!glassesImgRef.current.complete) {
              console.warn('⚠️ Glasses image not fully loaded yet');
            }
            
            if (glassesImgRef.current.width === 0 || glassesImgRef.current.height === 0) {
              console.error('❌ Glasses image has invalid dimensions (0x0)');
            } else {
              const glassesHeight = glassesWidth * (glassesImgRef.current.height / glassesImgRef.current.width);
              const centerX = (leftEyeX + rightEyeX) / 2 - glassesWidth / 2;
              const centerY = (leftEyeY + rightEyeY) / 2 - glassesHeight / 2;
              const angle = Math.atan2(rightEyeY - leftEyeY, rightEyeX - leftEyeX);

              console.log(`🎨 Rendering glasses overlay for face ${index + 1}:`, {
                glassesWidth: glassesWidth.toFixed(2),
                glassesHeight: glassesHeight.toFixed(2),
                centerX: centerX.toFixed(2),
                centerY: centerY.toFixed(2),
                angleRad: angle.toFixed(3),
                imageLoaded: !!glassesImgRef.current,
                imageComplete: glassesImgRef.current?.complete
              });

              context.save();
              context.translate(centerX + glassesWidth / 2, centerY + glassesHeight / 2);
              context.rotate(angle);
              console.log('🖼️ Canvas drawImage called with glasses overlay');
              context.drawImage(
                glassesImgRef.current,
                -glassesWidth / 2,
                -glassesHeight / 2,
                glassesWidth,
                glassesHeight
              );
              context.restore();
            }
          } else {
            console.error('❌ glassesImgRef.current is null - glasses image not loaded (will retry on next frame)', {
              glassesImageLoaded,
              glassesImg
            });
          }
        });
      } catch (error) {
        console.error('❌ Face detection error:', error);
      }
    }, 300);

    return () => {
      clearInterval(interval);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [modelsLoaded, glassesImageLoaded]);

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    }}>
      <div style={{ 
        position: "relative", 
        width: "640px", 
        height: "480px",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "15px"
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "15px"
          }}
        />
      </div>
      <button
        onClick={takeScreenshot}
        style={{
          padding: '12px 24px',
          fontSize: '1.1rem',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
          transition: 'transform 0.2s ease',
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        📸 Take Screenshot
      </button>
    </div>
  );
};

export default VirtualTryOn;
