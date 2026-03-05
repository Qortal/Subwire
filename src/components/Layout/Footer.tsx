import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Link } from '@mui/material';
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(6, 0),
  marginTop: 'auto',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  fontSize: '0.875rem',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
}));

const SocialIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

export const Footer = () => {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(5, 1fr)'
          },
          gap: 4
        }}>
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Subwire
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A home for writers and readers. Share your thoughts and discover
              amazing stories.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FooterLink href="/discover">Discover</FooterLink>
              <FooterLink href="/write">Start Writing</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/features">Features</FooterLink>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/guidelines">Guidelines</FooterLink>
              <FooterLink href="/terms">Terms</FooterLink>
              <FooterLink href="/privacy">Privacy</FooterLink>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Connect
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <SocialIcon>
                <TwitterIcon />
              </SocialIcon>
              <SocialIcon>
                <FacebookIcon />
              </SocialIcon>
              <SocialIcon>
                <InstagramIcon />
              </SocialIcon>
              <SocialIcon>
                <LinkedInIcon />
              </SocialIcon>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            mt: 4,
            pt: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Subwire. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};
