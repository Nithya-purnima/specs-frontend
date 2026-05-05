import React, { useRef, useEffect, useState } from 'react';

const CameraTest = () => {
    const videoRef = useRef(null);
    const [status, setStatus] = useState('Checking camera...');
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        checkCameraDevices();
    }, []);

    const checkCameraDevices = async () => {
        try {
            // First check if mediaDevices is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setStatus('❌ Your browser does not support camera access');
                return;
            }

            // List all video devices
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);

            if (videoDevices.length === 0) {
                setStatus('❌ No camera found on your device');
                return;
            }

            setStatus(`✅ Found ${videoDevices.length} camera(s). Click "Start Camera" to test.`);
        } catch (err) {
            setStatus(`❌ Error checking devices: ${err.message}`);
        }
    };

    const startSimpleCamera = async () => {
        try {
            setStatus('🔄 Starting camera...');
            
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: false
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setStatus('✅ Camera working! You should see yourself below.');
            }
        } catch (err) {
            console.error('Camera start error:', err);
            setStatus(`❌ Camera error: ${err.name} - ${err.message}`);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Camera Test</h2>
            <p style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
                {status}
            </p>
            
            {devices.length > 0 && (
                <div style={{ margin: '20px 0' }}>
                    <h3>Available Cameras:</h3>
                    <ul>
                        {devices.map((device, idx) => (
                            <li key={device.deviceId}>
                                {device.label || `Camera ${idx + 1}`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button 
                onClick={startSimpleCamera}
                style={{
                    padding: '12px 24px',
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginBottom: '20px'
                }}
            >
                Start Camera
            </button>

            <div style={{ background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', maxWidth: '640px', display: 'block' }}
                />
            </div>

            <div style={{ marginTop: '20px', background: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
                <h4>📋 Fix Camera Access - Follow These Steps:</h4>
                <ol style={{ margin: '10px 0', lineHeight: '1.8' }}>
                    <li><strong>Windows Settings:</strong> Press Windows key, search "Camera privacy settings", enable "Let apps access your camera"</li>
                    <li><strong>Browser Permissions:</strong> Click the 🔒 lock icon in the address bar → Site settings → Camera → Allow</li>
                    <li><strong>Close Other Apps:</strong> Close Zoom, Teams, Skype, or any video app</li>
                    <li><strong>Try Another Browser:</strong> If using Edge, try Chrome or vice versa</li>
                    <li><strong>Device Manager:</strong> Search "Device Manager" → Cameras → Make sure your camera is enabled</li>
                    <li><strong>Restart Browser:</strong> Close all browser windows and reopen</li>
                </ol>
                <div style={{ background: '#d4edda', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                    <strong>Quick Fix:</strong> Open Windows Camera app first. If it works there, refresh this page and try again.
                </div>
            </div>
        </div>
    );
};

export default CameraTest;
