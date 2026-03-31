import { useEffect } from "react";
import toast from "react-hot-toast";

function useNotifications(userId, fetchOrders) {
  useEffect(() => {
    if (!userId) return;

    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsHost =
      window.location.port === "5173"
        ? `${window.location.hostname}:8000`
        : window.location.host;

    const socket = new WebSocket(
      `${wsProtocol}://${wsHost}/ws/notifications/${userId}/`
    );

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      console.log("Notification message:", event.data);

      const data = JSON.parse(event.data);
      toast.success(data.message);

      if (fetchOrders) {
        fetchOrders();
      }
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => socket.close();
  }, [userId, fetchOrders]);
}

export default useNotifications;
