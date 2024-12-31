"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const response = await fetch('http://localhost:5001/api/auctions');
        const data = await response.json();
        setAuctions(data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    }
    fetchAuctions();
  }, []);

  if (auctions.length === 0) return <div>No auctions available.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Available Auctions</h1>
      <ul className="space-y-4">
        {auctions.map((auction) => (
          <li key={auction._id} className="bg-gray-100 p-4 rounded shadow">
            <Link href={`/auctions/${auction._id}`}>
              <h2 className="text-xl font-semibold">{auction.title}</h2>
            </Link>
            <p className="text-gray-700">{auction.description}</p>
            <p className="text-sm text-gray-500">Ends at: {new Date(auction.endTime).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
