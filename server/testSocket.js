const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Connected to WebSocket server");

    // Join an auction room
    const auctionId = "12345";
    socket.emit("joinAuction", auctionId);
    console.log(`Joined auction room: ${auctionId}`);

    // Simulate placing a bid
    setTimeout(() => {
        const bid = 150;
        socket.emit("placeBid", { auctionId, bid });
        console.log(`Placed a bid of ${bid} in auction ${auctionId}`);
    }, 2000);
});

// Listen for bid updates
socket.on("bidUpdate", (data) => {
    console.log("Bid Update Received:", data);
});

socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
});
