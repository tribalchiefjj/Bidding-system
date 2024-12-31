'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PlaceBidProps {
  auctionId: string;
  currentHighestBid: number;
}

export default function PlaceBid({ auctionId, currentHighestBid }: PlaceBidProps) {
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  async function handlePlaceBid() {
    if (bidAmount <= currentHighestBid) {
      setError('Bid must be higher than the current highest bid');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:5001/api/auctions/place-bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          auctionId,
          bidAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log('Bid placed successfully:', data);
      // Optionally, you can redirect or show success message
    } catch (err) {
      console.error('Error placing bid:', err);
      setError('Failed to place bid');
    }
  }

  return (
    <div>
      <h3>Place a Bid</h3>
      <input
        type="number"
        placeholder="Bid Amount"
        value={bidAmount}
        onChange={(e) => setBidAmount(Number(e.target.value))}
      />
      <button onClick={handlePlaceBid}>Place Bid</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
