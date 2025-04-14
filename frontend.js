// const peerConnection = new RTCPeerConnection({
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }] // Use a STUN server
// });

// navigator.mediaDevices.getUserMedia({ audio: true })
//     .then(stream => {
//         stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
//     })
//     .catch(error => console.error("Error accessing microphone:", error));

// async function startSession() {
//     const response = await fetch('http://localhost:3000/start-webrtc-session', { method: "POST" });
//     const { sdp } = await response.json();
    
//     await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));

//     const answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer);
// }

