'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import PlaceBid from '../../PlaceBid'; // Import the PlaceBid component

// Define Auction type
interface Auction {
  _id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentBid: number;
  endTime: string;
}

// Define Error type
interface ErrorResponse {
  message: string;
}

export default function AuctionDetailsPage() {
  const { id } = useParams();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const socket = io("http://localhost:5001"); // Replace with your backend URL if different

  useEffect(() => {
    // Fetch auction details
    async function fetchAuction() {
      try {
        const response = await fetch(`http://localhost:5001/api/auctions/${id}`);
        if (!response.ok) {
          throw new Error("Auction not found");
        }
        const data: Auction = await response.json();
        setAuction(data);
      } catch (error) {
        console.error("Error fetching auction:", error);
        setError("Failed to load auction details.");
      }
    }
    fetchAuction();

    // Set up Socket.IO listeners
    socket.emit("joinAuction", id);

    socket.on("bidUpdate", ({ newBid }: { newBid: number }) => {
      setAuction((prev) =>
        prev ? { ...prev, currentBid: newBid } : null
      );
    });

    return () => {
      socket.emit("leaveAuction", id);
      socket.disconnect();
    };
  }, [id, socket]);

  const handlePlaceBid = async () => {
    try {
      const bid = parseFloat(bidAmount);
      if (isNaN(bid) || (auction && bid <= auction.currentBid)) {
        setError("Bid must be a valid number and higher than the current bid.");
        return;
      }

      const response = await fetch(`http://localhost:5001/api/auctions/${id}/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bid }),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.message || "Failed to place bid.");
      }

      const updatedAuction: Auction = await response.json();
      setAuction(updatedAuction);
      setBidAmount("");
      setError("");
      setSuccessMessage("Bid placed successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  if (!auction) return <div>Loading auction details...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold">{auction.title}</h1>
      <p className="text-gray-600 mt-2">{auction.description}</p>
      <p className="mt-4">
        <span className="font-bold">Starting Price:</span> ${auction.startingPrice}
      </p>
      <p>
        <span className="font-bold">Current Bid:</span> ${auction.currentBid}
      </p>
      <p>
        <span className="font-bold">Ends At:</span> {new Date(auction.endTime).toLocaleString()}
      </p>
      <PlaceBid auctionId={auction._id} currentHighestBid={auction.currentBid} />

      <div className="mt-6">
        <input
          type="number"
          placeholder="Enter your bid"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="border p-2 rounded-lg mr-2"
        />
        <button
          onClick={handlePlaceBid}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Place Bid
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
    </div>
  );
}
