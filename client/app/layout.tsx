'use client';

import { ReactNode, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Link as MuiLink,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6a1b9a', // Vibrant purple
    },
    secondary: {
      main: '#ab47bc', // Softer purple
    },
    background: {
      default: '#f3e5f5', // Light lavender background
    },
    text: {
      primary: '#000000', // Black for general text
      secondary: '#333333', // Slightly lighter black for less emphasis
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {/* Header Section */}
          <AppBar
            position="static"
            sx={{
              background: 'linear-gradient(to right, #f3e5f5, #e1bee7)',
              color: 'black',
              boxShadow: 'none',
              borderBottom: '1px solid #ddd',
            }}
          >
            <Toolbar
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {/* Title */}
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <Link href="/" passHref>
                  <MuiLink color="inherit" underline="none">
                    Online Auction System
                  </MuiLink>
                </Link>
              </Typography>

              {/* Desktop Navigation */}
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' }, // Hidden on small screens
                  gap: 3,
                }}
              >
                {[
                  { href: '/', label: 'Home' },
                  { href: '/auctions', label: 'Auctions' },
                  { href: '/create-auction', label: 'Create Auction' },
                  { href: '/profile', label: 'Profile' },
                ].map((link) => (
                  <Link key={link.href} href={link.href} passHref>
                    <MuiLink
                      color="text.primary"
                      underline="none"
                      sx={{
                        fontWeight: 'medium',
                        fontSize: '1rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        '&:hover': {
                          backgroundColor: '#d1c4e9',
                        },
                      }}
                    >
                      {link.label}
                    </MuiLink>
                  </Link>
                ))}
              </Box>

              {/* Mobile Navigation Toggle */}
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ display: { xs: 'flex', md: 'none' } }} // Hidden on large screens
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Mobile Drawer */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            sx={{
              '& .MuiDrawer-paper': {
                backgroundColor: theme.palette.background.default,
              },
            }}
          >
            <Box
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
              sx={{
                width: 250,
                padding: 2,
              }}
            >
              <List>
                {[
                  { href: '/', label: 'Home' },
                  { href: '/auctions', label: 'Auctions' },
                  { href: '/create-auction', label: 'Create Auction' },
                  { href: '/profile', label: 'Profile' },
                ].map((link) => (
                  <ListItem key={link.href} disablePadding>
                    <Link href={link.href} passHref>
                      <MuiLink
                        underline="none"
                        color="text.primary"
                        sx={{ width: '100%' }}
                      >
                        <ListItemText primary={link.label} />
                      </MuiLink>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>

          {/* Main Content Section */}
          <Box
            sx={{
              marginTop: 4,
              marginBottom: 4,
              padding: 3,
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: 3,
              maxWidth: '1200px',
              marginX: 'auto',
              color: 'text.primary', // Ensures text is black
            }}
          >
            {children}
          </Box>

          {/* Footer Section */}
          <Box
            component="footer"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              padding: 2,
              marginTop: 'auto',
            }}
          >
            <Typography variant="body2" align="center">
              &copy; {new Date().getFullYear()} Online Auction System. All Rights Reserved.
            </Typography>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
