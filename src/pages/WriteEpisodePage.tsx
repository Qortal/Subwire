import { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Chip,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  FormControl,
  Select,
  MenuItem as SelectMenuItem,
  FormControlLabel,
  Switch,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Videocam as VideocamIcon,
  AudioFile as AudioFileIcon,
  Close as CloseIcon,
  Save,
  Publish,
  MoreVert,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Image as ImageIcon,
  Undo,
  Redo,
  Lock as LockIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  useGlobal,
  showError,
  showSuccess,
  showLoading,
  dismissToast,
  usePublish,
} from 'qapp-core';
import {
  publishArticle,
  VideoMetadata,
  MediaAttachment,
} from '../utils/articleQdn';
import { VideoMetadataDialog } from '../components/VideoMetadataDialog';
import { CATEGORIES } from '../constants/categories';
import {
  saveDraft,
  deleteDraft,
  generateDraftId,
  getDraft,
  type ArticleDraft,
} from '../utils/draftStorage';
import { fileToBase64, base64ToFile } from '../utils/mapHelpers';
import { useAtomValue, useAtom } from 'jotai';
import { profileDataAtom, encryptionPreferenceAtom, encryptMetadataPreferenceAtom } from '../state/global/profile';
import { useGroupDetails } from '../hooks/useGroupDetails';

const EditorContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const EditorHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2, 3),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const TitleField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    fontSize: '2.5rem',
    fontWeight: 700,
    border: 'none',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiInputBase-root': {
      fontSize: '2rem',
    },
  },
}));

const SubtitleField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    fontSize: '1.25rem',
    color: theme.palette.text.secondary,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

const ContentField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    fontSize: '1.125rem',
    lineHeight: 1.8,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

const EditorToolbar = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  left: '50%',
  transform: 'translateX(-50%)',
  padding: theme.spacing(1, 2),
  display: 'flex',
  gap: theme.spacing(0.5),
  alignItems: 'center',
  flexWrap: 'wrap',
  borderRadius: 10,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1000,
  boxShadow: theme.palette.mode === 'light'
    ? '0 4px 20px rgba(0, 0, 0, 0.15)'
    : '0 4px 20px rgba(0, 0, 0, 0.6)',
  maxWidth: 'calc(100vw - 32px)',
}));

const ToolbarDivider = styled(Box)(({ theme }) => ({
  width: 1,
  height: 24,
  backgroundColor: theme.palette.divider,
  margin: theme.spacing(0, 1),
}));

const PublishButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 3),
}));

const UploadZone = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: 16,
  padding: theme.spacing(6),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-2px)',
  },
}));

const MediaPreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(3),
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.error.main,
    color: 'white',
  },
  zIndex: 1,
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  maxWidth: 680,
  margin: '0 auto',
  padding: theme.spacing(4, 0),
  '& h1': {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: theme.spacing(2),
  },
  '& h2': {
    fontSize: '1.25rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
  },
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(2, 0),
  },
}));

export const WriteEpisodePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams<{ type: 'essay' | 'episode' }>();
  const { auth, identifierOperations, lists } = useGlobal();
  const { publishMultipleResources } = usePublish();
  const [currentTab, setCurrentTab] = useState(0);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<number>(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'audio' | 'video' | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const [showMetadataDialog, setShowMetadataDialog] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<Map<string, string>>(new Map());
  const [uploadedImageFiles, setUploadedImageFiles] = useState<Map<string, File>>(new Map());
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [draftId, setDraftId] = useState<string>('');
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Get profile data to check for attached group
  const profileData = useAtomValue(profileDataAtom);
  const hasSubscriptionGroup = !!profileData?.groupId;

  // Fetch group details if user has a group attached
  const { groupDetails } = useGroupDetails(profileData?.groupId);

  // Persistent encryption preference
  const [encryptionPreferences, setEncryptionPreferences] = useAtom(
    encryptionPreferenceAtom
  );
  const userEncryptionKey = auth?.address || 'default';
  const [isEncrypted, setIsEncrypted] = useState(false);

  // Persistent metadata encryption preference
  const [encryptMetadataPreferences, setEncryptMetadataPreferences] = useAtom(
    encryptMetadataPreferenceAtom
  );
  const [encryptMetadata, setEncryptMetadata] = useState(false);

  // Load saved preference when component mounts or preferences/user changes
  useEffect(() => {
    if (hasSubscriptionGroup && userEncryptionKey) {
      const savedPref = encryptionPreferences[userEncryptionKey];
      // Load saved preference or default to false
      setIsEncrypted(savedPref === true);
    } else {
      // Reset to false if no subscription group
      setIsEncrypted(false);
    }
    // Only run when dependencies change, not when isEncrypted changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSubscriptionGroup, userEncryptionKey, encryptionPreferences]);

  // Load saved metadata encryption preference
  useEffect(() => {
    if (hasSubscriptionGroup && userEncryptionKey && isEncrypted) {
      const savedMetadataPref = encryptMetadataPreferences[userEncryptionKey];
      // Load saved preference or default to false (keep metadata public)
      setEncryptMetadata(savedMetadataPref === true);
    } else {
      // Reset to false if no subscription or not encrypted
      setEncryptMetadata(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSubscriptionGroup, userEncryptionKey, isEncrypted, encryptMetadataPreferences]);

  // Save preference to storage when toggle changes (but only if user made the change)
  const handleEncryptionToggle = (checked: boolean) => {
    setIsEncrypted(checked);
    if (hasSubscriptionGroup && userEncryptionKey) {
      setEncryptionPreferences((prev) => ({
        ...prev,
        [userEncryptionKey]: checked,
      }));
    }
    // Reset metadata encryption when turning off encryption
    if (!checked) {
      setEncryptMetadata(false);
    }
  };

  // Save metadata encryption preference
  const handleMetadataEncryptionToggle = (checked: boolean) => {
    setEncryptMetadata(checked);
    if (hasSubscriptionGroup && userEncryptionKey && isEncrypted) {
      setEncryptMetadataPreferences((prev) => ({
        ...prev,
        [userEncryptionKey]: checked,
      }));
    }
  };
  const [lastSavedTime, setLastSavedTime] = useState<number | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Load draft on mount if draftId is provided in URL state
  useEffect(() => {
    const loadDraftData = async () => {
      const state = location.state as { draftId?: string };
      if (state?.draftId && auth?.name) {
        const draft = await getDraft(auth.name, state.draftId);
        if (draft) {
          setDraftId(draft.id);
          setTitle(draft.title);
          setSubtitle(draft.subtitle);
          setContent(draft.content);
          setTags(draft.tags);
          setCategory(draft.category);
          
          // Restore cover image from base64
          if (draft.coverImagePreview) {
            setCoverImagePreview(draft.coverImagePreview);
          }
          if (draft.coverImageData && draft.coverImageFilename && draft.coverImageMimeType) {
            const file = base64ToFile(
              draft.coverImageData,
              draft.coverImageFilename,
              draft.coverImageMimeType
            );
            setCoverImage(file);
          }
          
          // Restore uploaded images from base64
          if (draft.uploadedImages) {
            const imageMap = new Map<string, string>();
            const fileMap = new Map<string, File>();
            Object.entries(draft.uploadedImages).forEach(([name, imgData]) => {
              const file = base64ToFile(imgData.data, imgData.filename, imgData.mimeType);
              const url = URL.createObjectURL(file);
              imageMap.set(name, url);
              fileMap.set(name, file);
            });
            setUploadedImages(imageMap);
            setUploadedImageFiles(fileMap);
          }
          
          // Note: Video/audio files are NOT restored from drafts
          // User will need to re-select their media file if any
        }
      } else if (auth?.name) {
        // Generate new draft ID
        setDraftId(generateDraftId('episode'));
      }
    };
    loadDraftData();
  }, [location.state, auth?.name]);

  // Manual save draft function with media warning
  const handleSaveDraft = async () => {
    if (!auth?.name || !draftId) {
      showError('Please log in to save drafts');
      return;
    }

    setIsSavingDraft(true);
    try {
      // Convert cover image to base64 if present
      let coverImageData: string | undefined;
      let coverImageFilename: string | undefined;
      let coverImageMimeType: string | undefined;
      
      if (coverImage) {
        coverImageData = await fileToBase64(coverImage);
        coverImageFilename = coverImage.name;
        coverImageMimeType = coverImage.type;
      }
      
      // Convert uploaded images to base64
      const uploadedImagesData: Record<string, { data: string; filename: string; mimeType: string }> = {};
      for (const [name, file] of uploadedImageFiles.entries()) {
        const data = await fileToBase64(file);
        uploadedImagesData[name] = {
          data,
          filename: file.name,
          mimeType: file.type,
        };
      }

      await saveDraft(auth.name, {
        id: draftId,
        userName: auth.name,
        type: 'episode',
        title,
        subtitle,
        content,
        tags,
        category,
        coverImagePreview,
        coverImageData,
        coverImageFilename,
        coverImageMimeType,
        uploadedImages: uploadedImagesData,
        createdAt: lastSavedTime || Date.now(),
      });
      setLastSavedTime(Date.now());
      showSuccess('Draft saved successfully (video/audio files not included)');
    } catch (error) {
      console.error('Error saving draft:', error);
      showError('Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleDeleteDraft = async () => {
    if (!auth?.name || !draftId) return;

    try {
      await deleteDraft(auth.name, draftId);
      showSuccess('Draft deleted');
      navigate('/write');
    } catch (error) {
      console.error('Error deleting draft:', error);
      showError('Failed to delete draft');
    }
    handleMenuClose();
  };

  const handlePublish = async () => {
    if (!auth?.name || !identifierOperations) {
      showError('Please login to publish');
      return;
    }

    if (!title.trim()) {
      showError('Please enter a title for your episode');
      return;
    }

    if (!mediaFile) {
      showError('Please upload a video or audio file');
      return;
    }

    if (!videoMetadata) {
      showError('Please add metadata to your media file');
      return;
    }

    if (!coverImagePreview) {
      showError('Please upload a cover image');
      return;
    }

    let loadingId: string | undefined;

    try {
      setIsPublishing(true);
      loadingId = showLoading('Publishing episode to Qortal blockchain...');

      // Create media attachment with metadata
      const media: MediaAttachment[] = [
        {
          type: mediaType || 'video',
          file: mediaFile,
          videoMetadata,
        },
      ];

      // Publish episode
      const identifier = await publishArticle({
        title,
        subtitle,
        content,
        tags,
        category,
        coverImage,
        media,
        identifierOperations,
        userName: auth.name,
        uploadedImages,
        type: 'episode',
        publishMultipleResources,
        addNewResources: lists.addNewResources,
        updateNewResources: lists.updateNewResources,
        groupId: isEncrypted ? profileData?.groupId : undefined,
        encryptMetadata: isEncrypted ? encryptMetadata : false,
      });

      // Delete draft after successful publish
      if (draftId) {
        await deleteDraft(auth.name, draftId);
      }

      dismissToast(loadingId);
      showSuccess('Episode published successfully!');
      
      setTimeout(() => {
        navigate(`/article/${auth.name}/${identifier}`);
      }, 1000);
    } catch (error: any) {
      console.error('Error publishing episode:', error);
      if (loadingId) {
        dismissToast(loadingId);
      }
      showError(error.message || 'Failed to publish episode');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('File selected:', file);
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');
      console.log('File type:', file.type, 'isVideo:', isVideo, 'isAudio:', isAudio);
      
      if (isVideo || isAudio) {
        setMediaFile(file);
        setMediaType(isVideo ? 'video' : 'audio');
        
        // Open metadata dialog for video files only (audio doesn't need thumbnails)
        if (isVideo) {
          console.log('Opening video metadata dialog');
          setShowMetadataDialog(true);
        }
      }
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaType(null);
    setVideoMetadata(null);
  };

  const handleSaveMetadata = (metadata: VideoMetadata) => {
    setVideoMetadata(metadata);
    setShowMetadataDialog(false);
  };

  const handleCoverImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCoverImage(file);
      const imageUrl = URL.createObjectURL(file);
      setCoverImagePreview(imageUrl);
      event.target.value = '';
    }
  };

  const handleRemoveCoverImage = () => {
    if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverImagePreview);
    }
    setCoverImage(null);
    setCoverImagePreview('');
  };

  const applyFormatting = (before: string, after: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    const newText = beforeText + before + selectedText + after + afterText;
    setContent(newText);

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleBold = () => applyFormatting('**', '**');
  const handleItalic = () => applyFormatting('*', '*');
  const handleUnderline = () => applyFormatting('<u>', '</u>');
  const handleBulletList = () => applyFormatting('\n- ', '');
  const handleNumberedList = () => applyFormatting('\n1. ', '');
  const handleQuote = () => applyFormatting('\n> ', '');
  const handleCode = () => applyFormatting('`', '`');
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Create a temporary URL for the image
      const imageUrl = URL.createObjectURL(file);
      const imageName = file.name;
      
      // Store both the URL and the File object
      setUploadedImages(prev => new Map(prev).set(imageName, imageUrl));
      setUploadedImageFiles(prev => new Map(prev).set(imageName, file));
      
      // Insert markdown with the temporary URL
      applyFormatting(`![${imageName}](${imageUrl})`, '');
      
      // Reset the input
      event.target.value = '';
    }
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const updateContent = (newContent: string) => {
    setContent(newContent);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to save to history after 500ms of no typing
    typingTimeoutRef.current = setTimeout(() => {
      if (newContent !== lastSavedContentRef.current) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newContent);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        lastSavedContentRef.current = newContent;
      }
    }, 500);
  };

  const saveToHistory = () => {
    if (content !== lastSavedContentRef.current) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(content);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      lastSavedContentRef.current = content;
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setContent(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setContent(history[historyIndex + 1]);
      lastSavedContentRef.current = history[historyIndex + 1];
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <EditorContainer>
      <EditorHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            New Episode
          </Typography>
          <Chip label="Draft" size="small" color="warning" variant="outlined" />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            startIcon={isSavingDraft ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSaveDraft}
            disabled={isSavingDraft || !auth?.name}
            sx={{ textTransform: 'none' }}
          >
            {isSavingDraft ? 'Saving...' : 'Save Draft'}
          </Button>
          <PublishButton
            variant="contained"
            startIcon={isPublishing ? <CircularProgress size={20} /> : <Publish />}
            onClick={handlePublish}
            disabled={!mediaFile || isPublishing}
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </PublishButton>
          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleDeleteDraft}>Delete Draft</MenuItem>
          </Menu>
        </Box>
      </EditorHeader>

      <Box sx={{ 
        position: 'sticky',
        top: 64,
        zIndex: 10,
        borderBottom: 1, 
        borderColor: 'divider', 
        bgcolor: 'background.paper',
        boxShadow: (theme) => theme.palette.mode === 'light' 
          ? '0 1px 3px rgba(0, 0, 0, 0.05)' 
          : '0 1px 3px rgba(0, 0, 0, 0.3)',
      }}>
        <Container maxWidth="lg">
          <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
            <Tab label="Create" sx={{ textTransform: 'none', fontSize: '1rem' }} />
            <Tab label="Preview" sx={{ textTransform: 'none', fontSize: '1rem' }} />
          </Tabs>
        </Container>
      </Box>

      {currentTab === 0 && (
        <Container maxWidth="lg" sx={{ py: 4, pb: 12 }}>
          <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
            {/* Fixed Toolbar at bottom */}
            <EditorToolbar elevation={0}>
              <IconButton size="small" title="Undo (Ctrl+Z)" onClick={handleUndo} disabled={historyIndex === 0}>
                <Undo />
              </IconButton>
              <IconButton size="small" title="Redo (Ctrl+Y)" onClick={handleRedo} disabled={historyIndex === history.length - 1}>
                <Redo />
              </IconButton>

              <ToolbarDivider />

              <IconButton size="small" title="Bold" onClick={handleBold}>
                <FormatBold />
              </IconButton>
              <IconButton size="small" title="Italic" onClick={handleItalic}>
                <FormatItalic />
              </IconButton>
              <IconButton size="small" title="Underline" onClick={handleUnderline}>
                <FormatUnderlined />
              </IconButton>
              
              <ToolbarDivider />
              
              <IconButton size="small" title="Bullet List" onClick={handleBulletList}>
                <FormatListBulleted />
              </IconButton>
              <IconButton size="small" title="Numbered List" onClick={handleNumberedList}>
                <FormatListNumbered />
              </IconButton>
              
              <ToolbarDivider />
              
              <IconButton size="small" title="Quote" onClick={handleQuote}>
                <FormatQuote />
              </IconButton>
              <IconButton size="small" title="Code" onClick={handleCode}>
                <Code />
              </IconButton>
              
              <ToolbarDivider />
              
              <IconButton size="small" title="Insert Image" onClick={handleImageClick}>
                <ImageIcon />
              </IconButton>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </EditorToolbar>

            {!mediaFile && (
              <Alert severity="info" sx={{ mb: 3 }}>
                An episode requires either an audio or video file. Please upload your media below.
              </Alert>
            )}

            <Alert severity="warning" sx={{ mb: 3 }}>
              <strong>Note:</strong> Drafts will save your title, subtitle, content, and images, but <strong>video and audio files are not saved</strong>. You'll need to re-upload your media file when resuming the draft.
            </Alert>

            {mediaFile ? (
              <MediaPreview>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  {mediaType === 'video' ? (
                    <VideocamIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  ) : (
                    <AudioFileIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {mediaType === 'video' ? 'Video File' : 'Audio File'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {mediaFile.name}
                    </Typography>
                    {mediaType === 'video' && !videoMetadata && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setShowMetadataDialog(true)}
                        sx={{ mt: 1 }}
                      >
                        Add Metadata
                      </Button>
                    )}
                    {videoMetadata && (
                      <Chip
                        label="Metadata Added"
                        color="success"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                  <RemoveButton onClick={handleRemoveMedia} size="small">
                    <CloseIcon />
                  </RemoveButton>
                </Box>
              </MediaPreview>
            ) : (
              <UploadZone elevation={0} component="label">
                <input
                  type="file"
                  hidden
                  accept="video/*,audio/*"
                  onChange={handleFileUpload}
                />
                <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Upload Audio or Video
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click to browse or drag and drop your file here
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Supported formats: MP3, WAV, MP4, MOV, AVI
                </Typography>
              </UploadZone>
            )}

            {/* Cover Image */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Cover Image *
              </Typography>
              {coverImagePreview ? (
                <Box sx={{ position: 'relative', mb: 3 }}>
                  <img
                    src={coverImagePreview}
                    alt="Cover"
                    style={{
                      width: '100%',
                      maxHeight: 400,
                      objectFit: 'cover',
                      borderRadius: 12,
                    }}
                  />
                  <RemoveButton onClick={handleRemoveCoverImage} size="small">
                    <CloseIcon />
                  </RemoveButton>
                </Box>
              ) : (
                <UploadZone elevation={0} component="label" sx={{ height: 200, mb: 3 }}>
                  <input
                    ref={coverImageInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleCoverImageUpload}
                  />
                  <UploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body1" fontWeight={600} gutterBottom>
                    Upload Cover Image
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click to browse or drag and drop your image
                  </Typography>
                </UploadZone>
              )}
            </Box>

            {/* Category */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Category *
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as number)}
                >
                  {CATEGORIES.map((cat) => (
                    <SelectMenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Encryption Toggle */}
            {hasSubscriptionGroup && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(29, 155, 240, 0.1)'
                      : 'rgba(29, 155, 240, 0.05)',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LockIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Subscription Content
                    </Typography>
                    <Tooltip title="Publish this episode encrypted for your subscription group members only">
                      <InfoIcon fontSize="small" color="action" />
                    </Tooltip>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isEncrypted}
                        onChange={(e) => handleEncryptionToggle(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={isEncrypted ? 'Encrypted' : 'Public'}
                  />
                </Box>
                
                {/* Metadata Encryption Toggle - Only shown when content is encrypted */}
                {isEncrypted && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      p: 2,
                      backgroundColor: 'background.paper',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      mt: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                          Also encrypt title, subtitle & cover image
                        </Typography>
                        <Tooltip title="By default, title, subtitle and cover image remain public for discovery. Enable this to encrypt everything.">
                          <InfoIcon fontSize="small" color="action" />
                        </Tooltip>
                      </Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={encryptMetadata}
                            onChange={(e) => handleMetadataEncryptionToggle(e.target.checked)}
                            color="primary"
                            size="small"
                          />
                        }
                        label=""
                        sx={{ m: 0 }}
                      />
                    </Box>
                    <Alert severity={encryptMetadata ? "warning" : "info"} sx={{ py: 0.5 }}>
                      <Typography variant="caption">
                        {encryptMetadata 
                          ? "Episode will be completely hidden. Only subscribers will see it exists."
                          : "Title, subtitle and cover will be visible to everyone for discovery. Only content will be encrypted."}
                      </Typography>
                    </Alert>
                  </Box>
                )}
                
                {isEncrypted && groupDetails && (
                  <Box sx={{ mt: 1.5 }}>
                    <Alert severity="info" sx={{ py: 0.5 }}>
                      <Typography variant="caption">
                        Only members of <strong>{groupDetails.groupName}</strong>{' '}
                        ({groupDetails.memberCount || 0} subscribers) will be able to
                        view this episode
                      </Typography>
                    </Alert>
                  </Box>
                )}
              </Box>
            )}

            <TitleField
              fullWidth
              placeholder="Episode Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              sx={{ mb: 2, mt: 3 }}
            />

            <SubtitleField
              fullWidth
              placeholder="Episode description (optional)"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              variant="outlined"
              sx={{ mb: 3 }}
            />

            {/* Content */}
            <ContentField
              fullWidth
              multiline
              placeholder="Write about your episode, show notes, timestamps, or any additional context..."
              value={content}
              onChange={(e) => updateContent(e.target.value)}
              variant="outlined"
              minRows={15}
              inputRef={contentRef}
              onKeyDown={(e) => {
                // Save to history on space or punctuation
                if (e.key === ' ' || e.key === '.' || e.key === ',' || e.key === '!' || e.key === '?' || e.key === 'Enter') {
                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                  }
                  saveToHistory();
                }
                
                // Handle undo/redo
                if (e.ctrlKey || e.metaKey) {
                  if (e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    handleUndo();
                  } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
                    e.preventDefault();
                    handleRedo();
                  }
                }
              }}
            />

            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => setTags(tags.filter((_, i) => i !== index))}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <TextField
                size="small"
                placeholder="Add a tag..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      setTags([...tags, input.value.trim()]);
                      input.value = '';
                    }
                  }
                }}
                sx={{ maxWidth: 300 }}
              />
            </Box>
          </Box>
        </Container>
      )}

      {currentTab === 1 && (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <PreviewContainer>
            {mediaFile && (
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Chip
                  icon={mediaFile.type === 'video' ? <VideocamIcon /> : <AudioFileIcon />}
                  label={mediaFile.type === 'video' ? 'Video Episode' : 'Audio Episode'}
                  color="primary"
                  sx={{ mb: 2 }}
                />
              </Box>
            )}
            
            {title && <h1>{title}</h1>}
            {subtitle && <h2>{subtitle}</h2>}
            {content && (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                    .replace(/`(.*?)`/g, '<code>$1</code>')
                    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
                    .replace(/^- (.*$)/gim, '<li>$1</li>')
                    .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
                    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
                    .replace(/\n/g, '<br />')
                }}
              />
            )}

            {!title && !subtitle && !content && !mediaFile && (
              <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                <Typography variant="h6">Nothing to preview yet</Typography>
                <Typography variant="body2">
                  Upload media and add details to see a preview
                </Typography>
              </Box>
            )}

            {tags.length > 0 && (
              <Box sx={{ mt: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </Box>
            )}
          </PreviewContainer>
        </Container>
      )}

      {/* Video Metadata Dialog */}
      {console.log('Dialog state - open:', showMetadataDialog, 'mediaFile:', mediaFile)}
      <VideoMetadataDialog
        open={showMetadataDialog}
        onClose={() => setShowMetadataDialog(false)}
        onSave={handleSaveMetadata}
        videoFile={mediaFile}
      />
    </EditorContainer>
  );
};

