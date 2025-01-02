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
import { Typography, Box, Button, Grid, Card, CardContent } from '@mui/material';



export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <Box sx={{ textAlign: 'center', padding: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Welcome to the Online Auction Platform!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Discover amazing deals, bid on your favorite items, or host your own auctions.
      </Typography>

      <Box sx={{ marginY: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginX: 1 }}
          onClick={() => router.push('/auctions')}
        >
          View Auctions
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ marginX: 1 }}
          onClick={() => router.push('/create-auction')}
        >
          Create Auction
        </Button>
      </Box>

      {/* Example Cards Section */}
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Active Auctions
              </Typography>
              <Typography color="textSecondary">
                Explore live auctions happening now.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Create Auction
              </Typography>
              <Typography color="textSecondary">
                Host your own auction and attract bidders.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
