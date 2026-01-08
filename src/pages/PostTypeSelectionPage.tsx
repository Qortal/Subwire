import { styled } from '@mui/material/styles';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Alert,
  List,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Mic as MicIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from 'qapp-core';
import { useState, useEffect } from 'react';
import { loadDrafts, deleteDraft, type ArticleDraft } from '../utils/draftStorage';
import { formatDistanceToNow } from 'date-fns';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 64px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const ContentWrapper = styled(Box)(() => ({
  maxWidth: 800,
  width: '100%',
  textAlign: 'center',
}));

const CardsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

const TypeCard = styled(Card)(({ theme }) => ({
  height: '100%',
  border: `2px solid ${theme.palette.divider}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'light'
      ? '0 12px 24px rgba(99, 102, 241, 0.2)'
      : '0 12px 24px rgba(129, 140, 248, 0.3)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(3),
}));

const DraftsSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
}));

const DraftItem = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateX(4px)',
  },
}));

export const PostTypeSelectionPage = () => {
  const navigate = useNavigate();
  const { auth } = useGlobal();
  const [drafts, setDrafts] = useState<ArticleDraft[]>([]);

  useEffect(() => {
    const fetchDrafts = async () => {
      if (auth?.name) {
        const userDrafts = await loadDrafts(auth.name);
        // Sort by most recently updated
        userDrafts.sort((a, b) => b.updatedAt - a.updatedAt);
        setDrafts(userDrafts);
      } else {
        setDrafts([]);
      }
    };
    fetchDrafts();
  }, [auth?.name]);

  const handleSelectType = (type: 'essay' | 'episode') => {
    if (!auth?.name) {
      // They'll see the warning on the next page
    }
    navigate(`/write/${type}`);
  };

  const handleOpenDraft = (draft: ArticleDraft) => {
    if (draft.isEdit) {
      // Navigate to edit page
      navigate(`/article/${draft.userName}/${draft.originalIdentifier}/edit`);
    } else {
      // Navigate to write page with draft
      navigate(`/write/${draft.type}`, { state: { draftId: draft.id } });
    }
  };

  const handleDeleteDraft = async (
    e: React.MouseEvent,
    draftId: string
  ) => {
    e.stopPropagation();
    if (!auth?.name) return;

    try {
      await deleteDraft(auth.name, draftId);
      setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        {!auth?.name && (
          <Alert severity="warning" sx={{ mb: 4 }}>
            You need to authenticate with a Qortal name to publish. You can still explore the editor.
          </Alert>
        )}
        
        <Typography variant="h3" fontWeight={700} gutterBottom>
          What would you like to create?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Choose the type of post you want to publish
        </Typography>

        <CardsContainer>
          <TypeCard elevation={0}>
            <CardActionArea
              onClick={() => handleSelectType('essay')}
              sx={{ p: 4, height: '100%' }}
            >
              <CardContent>
                <IconWrapper>
                  <ArticleIcon sx={{ fontSize: 40 }} />
                </IconWrapper>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Essay
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Write a text-based article with rich formatting, images, and
                  embeds
                </Typography>
              </CardContent>
            </CardActionArea>
          </TypeCard>

          <TypeCard elevation={0}>
            <CardActionArea
              onClick={() => handleSelectType('episode')}
              sx={{ p: 4, height: '100%' }}
            >
              <CardContent>
                <IconWrapper>
                  <MicIcon sx={{ fontSize: 40 }} />
                </IconWrapper>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Episode
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create a podcast or video episode with audio or video content
                </Typography>
              </CardContent>
            </CardActionArea>
          </TypeCard>
        </CardsContainer>

        {/* Drafts Section */}
        {auth?.name && drafts.length > 0 && (
          <DraftsSection>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Your Drafts
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Continue working on your saved drafts
            </Typography>
            
            <List>
              {drafts.map((draft, index) => (
                <Box key={draft.id}>
                  <DraftItem elevation={0}>
                    <CardActionArea onClick={() => handleOpenDraft(draft)}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="h6" fontWeight={600}>
                              {draft.title || 'Untitled Draft'}
                            </Typography>
                            <Chip 
                              label={draft.type === 'essay' ? 'Essay' : 'Episode'} 
                              size="small" 
                              variant="outlined"
                            />
                            {draft.isEdit && (
                              <Chip 
                                label="Edit" 
                                size="small" 
                                color="warning"
                                variant="outlined"
                              />
                            )}
                          </Box>
                          {draft.subtitle && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {draft.subtitle}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            Last saved {formatDistanceToNow(draft.updatedAt, { addSuffix: true })}
                          </Typography>
                        </Box>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={(e) => handleDeleteDraft(e, draft.id)}
                          sx={{ 
                            '&:hover': { 
                              color: 'error.main',
                              backgroundColor: 'error.light',
                            } 
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardContent>
                    </CardActionArea>
                  </DraftItem>
                  {index < drafts.length - 1 && <Box sx={{ height: 8 }} />}
                </Box>
              ))}
            </List>
          </DraftsSection>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

