import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Container,
  Typography,
  Box,
  Button,
  Avatar,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const PublicationAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: '0 auto',
  marginBottom: theme.spacing(3),
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[4],
}));

const SubscribeButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
}));

const StatsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  justifyContent: 'center',
  marginTop: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2),
  },
}));

const StatItem = styled(Box)({
  textAlign: 'center',
});

const ArticleCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'light'
      ? '0 8px 16px rgba(0, 0, 0, 0.1)'
      : '0 8px 16px rgba(0, 0, 0, 0.5)',
    borderColor: theme.palette.primary.main,
  },
}));

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

// Mock data
const publicationData = {
  name: 'Tech Forward',
  description: 'Exploring the intersection of technology, society, and innovation. Weekly insights on AI, blockchain, and the future of digital life.',
  author: 'Sarah Johnson',
  subscribers: '12.5K',
  posts: 145,
  image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
};

const posts = [
  {
    id: 1,
    title: 'The Future of Decentralized Publishing',
    excerpt: 'Exploring how blockchain technology is reshaping the way we share and monetize content in the digital age.',
    date: 'Dec 20, 2025',
    readTime: '8 min read',
    likes: 234,
    comments: 45,
  },
  {
    id: 2,
    title: 'AI and the Creator Economy',
    excerpt: 'How artificial intelligence is empowering creators while raising important ethical questions.',
    date: 'Dec 15, 2025',
    readTime: '6 min read',
    likes: 189,
    comments: 32,
  },
  {
    id: 3,
    title: 'Building Trust in Digital Communities',
    excerpt: 'The essential ingredients for creating authentic, engaged online communities that last.',
    date: 'Dec 10, 2025',
    readTime: '5 min read',
    likes: 156,
    comments: 28,
  },
];

const aboutContent = `Sarah Johnson is a technology journalist and digital strategist with over 10 years of experience covering innovation and its impact on society. 

Previously, she worked as a senior editor at TechCrunch and consulted for various startups on content strategy. Her work has been featured in Wired, The Verge, and MIT Technology Review.

Tech Forward explores the evolving relationship between technology and humanity, with a focus on decentralization, AI ethics, and the future of creative work.`;

export const PublicationPage = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <PublicationAvatar>
            {publicationData.name[0]}
          </PublicationAvatar>
          
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {publicationData.name}
          </Typography>
          
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
          >
            {publicationData.description}
          </Typography>

          <SubscribeButton
            variant="contained"
            size="large"
            startIcon={<EmailIcon />}
            onClick={() => setIsSubscribed(!isSubscribed)}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </SubscribeButton>

          <StatsBox>
            <StatItem>
              <Typography variant="h5" fontWeight={600}>
                {publicationData.subscribers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Subscribers
              </Typography>
            </StatItem>
            <StatItem>
              <Typography variant="h5" fontWeight={600}>
                {publicationData.posts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Posts
              </Typography>
            </StatItem>
          </StatsBox>

          {/* Social Links */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <Button startIcon={<TwitterIcon />} size="small">
              Twitter
            </Button>
            <Button startIcon={<FacebookIcon />} size="small">
              Facebook
            </Button>
            <Button startIcon={<LinkIcon />} size="small">
              Website
            </Button>
          </Box>
        </Container>
      </HeroSection>

      {/* Content Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setCurrentTab(newValue)}
            centered
          >
            <Tab label="Posts" sx={{ textTransform: 'none', fontSize: '1rem' }} />
            <Tab label="About" sx={{ textTransform: 'none', fontSize: '1rem' }} />
          </Tabs>
        </Container>
      </Box>

      {/* Tab Panels */}
      <Container maxWidth="md" sx={{ minHeight: '50vh' }}>
        <TabPanel value={currentTab} index={0}>
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} key={post.id}>
                <ArticleCard onClick={() => navigate(`/post/${post.id}`)}>
                  <CardContent>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {post.excerpt}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Chip label={post.date} size="small" variant="outlined" />
                        <Chip label={post.readTime} size="small" variant="outlined" />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary' }}>
                        <Typography variant="body2">
                          {post.likes} likes
                        </Typography>
                        <Typography variant="body2">
                          {post.comments} comments
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </ArticleCard>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Box sx={{ py: 2 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              About {publicationData.name}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {aboutContent.split('\n\n').map((paragraph, index) => (
              <Typography key={index} variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                {paragraph}
              </Typography>
            ))}

            <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Written by {publicationData.author}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Technology journalist, digital strategist, and advocate for ethical innovation.
              </Typography>
              <SubscribeButton variant="outlined" sx={{ mt: 1 }}>
                Follow
              </SubscribeButton>
            </Box>
          </Box>
        </TabPanel>
      </Container>
    </>
  );
};

