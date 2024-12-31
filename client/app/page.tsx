// export default function HomePage() {
//   return (
//     <div>
//       <h2>Welcome to the Online Auction System</h2>
//       <p>Explore ongoing auctions or create your own!</p>
//     </div>
//   );
// }

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return <div>Welcome to the Auction Platform!</div>;
}
