import { useState, useCallback, useMemo, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  useGlobal,
  QortalMetadata,
  QortalSearchParams,
  ResourceListDisplay,
  LoaderListStatus,
} from 'qapp-core';
import { ArticleCard } from '../components/ArticleCard';
import { LoaderState, LoaderItem } from '../components/LoaderState';
import {
  ENTITY_ROOT,
  ENTITY_ARTICLE,
  ENTITY_EPISODE,
} from '../utils/articleQdn';
import { SERVICE_DOCUMENT } from '../constants/qdn';

const PageHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6, 0, 4),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const SearchField = styled(TextField)(({ theme }) => ({
  maxWidth: 600,
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 3px ${theme.palette.mode === 'light' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(129, 140, 248, 0.15)'}`,
    },
  },
}));

const PublicationCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow:
      theme.palette.mode === 'light'
        ? '0 12px 24px rgba(0, 0, 0, 0.12)'
        : '0 12px 24px rgba(0, 0, 0, 0.6)',
    borderColor: theme.palette.primary.main,
  },
}));

const PublicationAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: theme.spacing(3, 'auto', 2),
  border: `3px solid ${theme.palette.background.paper}`,
}));

const SubscribeButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  textTransform: 'none',
  fontWeight: 600,
}));

// Mock data
const publications = [
  {
    id: 1,
    name: 'Tech Forward',
    description:
      'Exploring the intersection of technology, society, and innovation',
    author: 'Sarah Johnson',
    subscribers: '12.5K',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
    posts: 145,
  },
  {
    id: 2,
    name: "Writer's Corner",
    description:
      'Tips, tricks, and insights for aspiring and professional writers',
    author: 'Michael Chen',
    subscribers: '8.3K',
    category: 'Writing',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
    posts: 89,
  },
  {
    id: 3,
    name: 'Growth Hacks',
    description: 'Strategic insights for scaling your business and career',
    author: 'Emma Davis',
    subscribers: '15.2K',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    posts: 203,
  },
  {
    id: 4,
    name: 'Design Matters',
    description: 'Exploring design thinking, UX, and creative processes',
    author: 'Alex Rivera',
    subscribers: '9.7K',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    posts: 124,
  },
  {
    id: 5,
    name: 'Mindful Living',
    description: 'Wellness, mindfulness, and living with intention',
    author: 'Olivia Martinez',
    subscribers: '11.1K',
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    posts: 167,
  },
  {
    id: 6,
    name: 'Code & Coffee',
    description: 'Programming tutorials, best practices, and developer life',
    author: 'James Wilson',
    subscribers: '18.9K',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
    posts: 312,
  },
];

const categories = [
  'All',
  'Technology',
  'Writing',
  'Business',
  'Design',
  'Lifestyle',
];

export const DiscoverPage = () => {
  const navigate = useNavigate();
  const { identifierOperations } = useGlobal();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchPrefix, setSearchPrefix] = useState<string | null>(null);
  const [episodeSearchPrefix, setEpisodeSearchPrefix] = useState<string | null>(
    null
  );

  // Build the search prefix for articles and episodes
  useEffect(() => {
    const buildPrefix = async () => {
      if (!identifierOperations) return;

      try {
        const prefix = await identifierOperations.buildSearchPrefix(
          ENTITY_ARTICLE,
          ENTITY_ROOT
        );
        setSearchPrefix(prefix);

        const episodePrefix = await identifierOperations.buildSearchPrefix(
          ENTITY_EPISODE,
          ENTITY_ROOT
        );
        setEpisodeSearchPrefix(episodePrefix);
      } catch (error) {
        console.error('Failed to build search prefix:', error);
      }
    };

    buildPrefix();
  }, [identifierOperations]);

  const loaderItem = useCallback(() => {
    return <LoaderItem />;
  }, []);

  const loaderList = useCallback((status: LoaderListStatus) => {
    return (
      <LoaderState
        status={status}
        emptyIcon="📝"
        emptyTitle="No articles yet"
        emptyMessage="Be the first to publish an article!"
      />
    );
  }, []);

  const listItem = useCallback(
    (item: { qortalMetadata: QortalMetadata; data: any }, _index: number) => {
      return (
        <ArticleCard qortalMetadata={item.qortalMetadata} data={item.data} />
      );
    },
    []
  );

  const search = useMemo((): QortalSearchParams => {
    return {
      service: SERVICE_DOCUMENT,
      limit: 20,
      reverse: true,
      identifier: searchPrefix || '',
      prefix: true,
    };
  }, [searchPrefix]);

  const secondaryDataSources = useMemo((): any[] | undefined => {
    if (!episodeSearchPrefix) return undefined;

    return [
      {
        params: {
          service: 'DOCUMENT',
          identifier: episodeSearchPrefix,
          reverse: true,
          prefix: true,
        },
      },
    ];
  }, [episodeSearchPrefix]);

  const filteredPublications = publications.filter((pub) => {
    const matchesSearch =
      pub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 0 || pub.category === categories[selectedCategory];
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Header */}
      <PageHeader>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Discover Publications
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Find newsletters and writers that inspire you
          </Typography>

          <SearchField
            fullWidth
            placeholder="Search publications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Container>
      </PageHeader>

      {/* Category Tabs */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Tabs
            value={selectedCategory}
            onChange={(_, newValue) => setSelectedCategory(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {categories.map((category) => (
              <Tab
                key={category}
                label={category}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                }}
              />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* Publications Grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {selectedCategory === 0 ? (
          /* All Articles - Real data from blockchain */
          <>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ mb: 4 }}
            >
              All Articles
            </Typography>

            {!searchPrefix || !episodeSearchPrefix ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 4,
                }}
              >
                <LoaderItem />
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  maxWidth: 900,
                  margin: '0 auto',
                  width: '100%',
                }}
              >
                <ResourceListDisplay
                  styles={{
                    gap: 20,
                  }}
                  retryAttempts={3}
                  listName="ALL_ARTICLES"
                  direction="VERTICAL"
                  disableVirtualization
                  disablePagination
                  returnType="JSON"
                  loaderList={loaderList}
                  entityParams={{
                    entityType: ENTITY_ARTICLE,
                    parentId: ENTITY_ROOT,
                  }}
                  search={search}
                  listItem={listItem}
                  loaderItem={loaderItem}
                  filterDuplicateIdentifiers={{
                    enabled: true,
                  }}
                  secondaryDataSources={secondaryDataSources}
                />
              </Box>
            )}
          </>
        ) : (
          /* Other categories - Mock data for now */
          <>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {filteredPublications.length}{' '}
              {filteredPublications.length === 1
                ? 'Publication'
                : 'Publications'}
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
              {filteredPublications.map((publication) => (
                <Grid item xs={12} sm={6} md={4} key={publication.id}>
                  <PublicationCard
                    onClick={() => navigate(`/publication/${publication.id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={publication.image}
                      alt={publication.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                      <PublicationAvatar>
                        {publication.name[0]}
                      </PublicationAvatar>

                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {publication.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, minHeight: 40 }}
                      >
                        {publication.description}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={publication.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-around',
                          mb: 2,
                          color: 'text.secondary',
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {publication.subscribers}
                          </Typography>
                          <Typography variant="caption">Subscribers</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {publication.posts}
                          </Typography>
                          <Typography variant="caption">Posts</Typography>
                        </Box>
                      </Box>

                      <SubscribeButton
                        variant="contained"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle subscribe
                        }}
                      >
                        Subscribe
                      </SubscribeButton>
                    </CardContent>
                  </PublicationCard>
                </Grid>
              ))}
            </Grid>

            {filteredPublications.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No publications found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filters
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
};
