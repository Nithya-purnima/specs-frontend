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
  const [tfReady, setTfReady] = useState(false);
  const [glassesImageLoaded, setGlassesImageLoaded] = useState(false);

  // -----------------------------
  // TensorFlow init
  // -----------------------------
  useEffect(() => {
    const initTF = async () => {
      try {
        await tf.setBackend("cpu");
        await tf.ready();
        setTfReady(true);
      } catch (err) {
        console.warn("TF init error:", err);
        setTfReady(true);
      }
    };
    initTF();
  }, []);

  // -----------------------------
  // Load face models
  // -----------------------------
  useEffect(() => {
    const loadModels = async () => {
      if (!tfReady) return;

      const MODEL_URL = import.meta.env.BASE_URL + "models";

      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Model load error:", err);
      }
    };

    loadModels();
  }, [tfReady]);

  // -----------------------------
  // Load glasses image
  // -----------------------------
  useEffect(() => {
    if (!glassesImg) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      glassesImgRef.current = img;
      setGlassesImageLoaded(true);
    };

    img.onerror = (err) => {
      console.error("Glasses load error:", err);
      setGlassesImageLoaded(false);
    };

    img.src = glassesImg;
  }, [glassesImg]);

  // -----------------------------
  // DRAW FRAME (IMPORTANT FIX)
  // -----------------------------
  const drawFrame = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    if (!video || !canvas) return;

    // draw camera
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      detections.forEach((detection) => {
        const lm = detection.landmarks;

        const left = lm.getLeftEye();
        const right = lm.getRightEye();

        const leftX = (left[0].x + left[3].x) / 2;
        const leftY = (left[1].y + left[4].y) / 2;

        const rightX = (right[0].x + right[3].x) / 2;
        const rightY = (right[1].y + right[4].y) / 2;

        const eyeDist = Math.hypot(rightX - leftX, rightY - leftY);

        const width = eyeDist * 2.1;

        if (!glassesImgRef.current) return;

        const height =
          width *
          (glassesImgRef.current.height / glassesImgRef.current.width);

        const x = (leftX + rightX) / 2 - width / 2;
        const y = (leftY + rightY) / 2 - height / 2;

        const angle = Math.atan2(rightY - leftY, rightX - leftX);

        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);
        ctx.rotate(angle);

        ctx.drawImage(
          glassesImgRef.current,
          -width / 2,
          -height / 2,
          width,
          height
        );

        ctx.restore();
      });
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // VIDEO + LOOP
  // -----------------------------
  useEffect(() => {
    if (!modelsLoaded || !glassesImageLoaded) return;

    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    };

    start();

    const interval = setInterval(() => {
      if (
        videoRef.current &&
        videoRef.current.readyState === 4
      ) {
        const canvas = canvasRef.current;
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        drawFrame();
      }
    }, 100);

    return () => {
      clearInterval(interval);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [modelsLoaded, glassesImageLoaded]);

  // -----------------------------
  // SCREENSHOT FIX (MAIN FIX)
  // -----------------------------
  const takeScreenshot = async () => {
    await drawFrame(); // 🔥 FORCE correct render

    const canvas = canvasRef.current;

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "virtual-tryon.png";
    link.click();
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: "640px",
          height: "480px",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />

        <canvas
          ref={canvasRef}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
      </div>

      <button
        onClick={takeScreenshot}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        📸 Take Screenshot
      </button>
    </div>
  );
};

export default VirtualTryOn;