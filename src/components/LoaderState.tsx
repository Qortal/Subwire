import { Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { LoaderListStatus } from 'qapp-core';
import { memo } from 'react';

interface LoaderStateProps {
  status: LoaderListStatus;
  emptyIcon?: string;
  emptyTitle?: string;
  emptyMessage?: string;
}

export function LoaderState({
  status,
  emptyIcon = '📭',
  emptyTitle = 'No results',
  emptyMessage = 'Check back later for new content.',
}: LoaderStateProps) {
  if (status === 'NO_RESULTS') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 8,
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.03)',
            fontSize: '40px',
          }}
        >
          {emptyIcon}
        </Box>
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 400,
          }}
        >
          <Box
            sx={{
              fontSize: '20px',
              fontWeight: 600,
              mb: 1,
              color: (theme) => theme.palette.text.primary,
            }}
          >
            {emptyTitle}
          </Box>
          <Box
            sx={{
              fontSize: '15px',
              color: (theme) => theme.palette.text.secondary,
              lineHeight: 1.5,
            }}
          >
            {emptyMessage}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
      }}
    >
      <CircularProgress />
    </Box>
  );
}

const SkeletonArticleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: 0,
  width: '100%',
  height: 200,
  minHeight: 200,
  maxHeight: 200,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  contain: 'layout style paint',
  willChange: 'opacity',
  animation: 'pulse 2s ease-in-out infinite',
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.7,
    },
  },
  // Mobile: vertical layout
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: 'auto',
    minHeight: 'unset',
    maxHeight: 'unset',
  },
}));

const SkeletonBar = styled('div')<{ width?: string; height?: number }>(
  ({ theme, width = '100%', height = 16 }) => ({
    width,
    height,
    borderRadius: 4,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.11)'
        : 'rgba(0, 0, 0, 0.11)',
    animation: 'none',
  })
);

export const LoaderItem = memo(function LoaderItem() {
  return (
    <SkeletonArticleContainer>
      {/* Cover image skeleton - left side */}
      <Box
        sx={{
          width: 160,
          minWidth: 160,
          height: 200,
          flexShrink: 0,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.11)'
              : 'rgba(0, 0, 0, 0.11)',
          '@media (max-width: 900px)': {
            width: '100%',
            minWidth: 'unset',
            height: 240,
          },
        }}
      />

      {/* Content - right side */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          padding: 2.5,
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        {/* Title */}
        <Box>
          <SkeletonBar width="90%" height={24} />
        </Box>

        {/* Subtitle */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <SkeletonBar width="100%" height={16} />
          <SkeletonBar width="80%" height={16} />
        </Box>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <SkeletonBar width="60px" height={22} />
          <SkeletonBar width="70px" height={22} />
          <SkeletonBar width="50px" height={22} />
        </Box>

        {/* Author section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Avatar */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.11)'
                  : 'rgba(0, 0, 0, 0.11)',
            }}
          />
          {/* Author name and time */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <SkeletonBar width="100px" height={14} />
            <SkeletonBar width="80px" height={12} />
          </Box>
        </Box>
      </Box>
    </SkeletonArticleContainer>
  );
});
