import { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"], // Ensure WebSocket is used
});

// eslint-disable-next-line react/prop-types
const LiveStream = ({ room }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null); // Use a ref for persistent peer connection

  useEffect(() => {
    // Create PeerConnection
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Save PeerConnection in ref
    peerConnectionRef.current = pc;

    // ICE Candidate handling
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate, room);
      }
    };

    // Remote stream handling
    pc.ontrack = (event) => {
      console.log("Remote track received:", event.streams[0]);
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // Room join
    socket.emit("join-room", room);

    // Signaling Handlers
    socket.on("offer", async (offer) => {
      try {
        console.log("Offer received:", offer);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", answer, room);
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    });

    socket.on("answer", async (answer) => {
      try {
        console.log("Answer received:", answer);
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    });

    socket.on("ice-candidate", (candidate) => {
      console.log("ICE candidate received:", candidate);
      pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((error) => {
        console.error("Error adding ICE candidate:", error);
      });
    });

    return () => {
      pc.close();
      socket.disconnect();
    };
  }, [room]);

  const startBroadcast = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = stream;

      const pc = peerConnectionRef.current;

      // Add tracks to PeerConnection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", offer, room);
    } catch (error) {
      console.error("Error starting broadcast:", error);
    }
  };

  return (
    <div>
      <h1>Live Stream Room: {room}</h1>
      <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "100%" }} />
      <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "100%" }} />
      <button onClick={startBroadcast}>Go Live</button>
    </div>
  );
};

export default LiveStream;
