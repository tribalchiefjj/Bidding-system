'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchProfileAndBids() {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          setError('You are not logged in.');
          router.push('/login'); // Redirect to login if no token
          return;
        }

        // Fetch user profile and bids in parallel
        const [profileResponse, bidsResponse] = await Promise.all([
          fetch('http://localhost:5001/api/auctions/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5001/api/auctions', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Check response status for errors
        if (profileResponse.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token'); // Clear token
          router.push('/login');
          return;
        }

        if (!profileResponse.ok || !bidsResponse.ok) {
          throw new Error('Failed to fetch data from server.');
        }

        const profileData = await profileResponse.json();
        const auctionsData = await bidsResponse.json();

        // Filter auctions to only those with user bids
        const userBids = auctionsData
          .filter((auction: any) =>
            auction.bids.some((bid: any) => bid.user === profileData._id)
          )
          .map((auction: any) => ({
            ...auction,
            userBids: auction.bids.filter((bid: any) => bid.user === profileData._id),
          }));

        setProfile(profileData);
        setBids(userBids);
      } catch (err: any) {
        console.error('Error fetching profile or bids:', err);
        setError('Failed to load profile or bids.');
      }
    }

    fetchProfileAndBids();
  }, [router]);

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile.username}'s Profile</h1>
      <p>Email: {profile.email}</p>

      <h2>Your Bids</h2>
      {bids.length === 0 ? (
        <p>You have not placed any bids yet.</p>
      ) : (
        <div>
          {bids.map((auction: any) => (
            <div key={auction._id}>
              <h3>{auction.title}</h3>
              <p>{auction.description}</p>
              <ul>
                {auction.userBids.map((bid: any, index: number) => (
                  <li key={index}>
                    <p>Bid Amount: ${bid.amount}</p>
                    <p>Placed At: {new Date(bid.timestamp).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
