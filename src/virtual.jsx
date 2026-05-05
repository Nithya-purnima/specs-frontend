// src/components/VirtualTryOn.js
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const VirtualTryOn = ({ glassesImg }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const glassesImgRef = useRef(null);
  const streamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = process.env.PUBLIC_URL + "/models";
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
  }, []);

  // Load glasses image
  useEffect(() => {
    const img = new Image();
    img.src = glassesImg;
    img.onload = () => {
      glassesImgRef.current = img;
    };
  }, [glassesImg]);

  // Handle video and face detection
  useEffect(() => {
    if (!modelsLoaded) return;

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

        detections.forEach((detection) => {
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
            const glassesHeight = glassesWidth * (glassesImgRef.current.height / glassesImgRef.current.width);
            const centerX = (leftEyeX + rightEyeX) / 2 - glassesWidth / 2;
            const centerY = (leftEyeY + rightEyeY) / 2 - glassesHeight / 2;
            const angle = Math.atan2(rightEyeY - leftEyeY, rightEyeX - leftEyeX);

            context.save();
            context.translate(centerX + glassesWidth / 2, centerY + glassesHeight / 2);
            context.rotate(angle);
            context.drawImage(
              glassesImgRef.current,
              -glassesWidth / 2,
              -glassesHeight / 2,
              glassesWidth,
              glassesHeight
            );
            context.restore();
          }
        });
      } catch (error) {
        console.error('Error detecting face:', error);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [modelsLoaded]);

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />
    </div>
  );
};

export default VirtualTryOn;
