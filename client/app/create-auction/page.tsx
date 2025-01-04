'use client';

import { useState } from 'react';
import {
    TextField,
    Button,
    Container,
    Typography,
    Alert,
    Box,
} from '@mui/material';

export default function CreateAuctionPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startingPrice, setStartingPrice] = useState('');
    const [endTime, setEndTime] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to create an auction');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/auctions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    startingPrice: parseFloat(startingPrice),
                    endTime,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create auction');
            }

            const data = await response.json();
            setSuccess(`Auction "${data.title}" created successfully!`);
            setTitle('');
            setDescription('');
            setStartingPrice('');
            setEndTime('');
        } catch (err: unknown) {  // Use 'unknown' instead of 'any'
            if (err instanceof Error) {
                setError(err.message || 'An error occurred');
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Create Auction
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    required
                />
                <TextField
                    label="Starting Price"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    type="number"
                    required
                />
                <TextField
                    label="End Time"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    type="datetime-local"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Create Auction
                </Button>
            </Box>
        </Container>
    );
}
