import { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@mui/material';
import { styled } from '@mui/system';

const ImageWrapper = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
});

const StyledImage = styled('img')<{ isLoaded: boolean }>(({ isLoaded }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: isLoaded ? 1 : 0,
  transition: 'opacity 0.3s ease-in-out',
  willChange: 'opacity',
  transform: 'translateZ(0)',
}));

const ImageSkeleton = styled(Skeleton)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  transform: 'none',
});

interface LazyImageProps {
  src: string;
  alt: string;
  threshold?: number;
  rootMargin?: string;
  minHeight?: string;
}

export function LazyImage({
  src,
  alt,
  threshold = 0.01,
  rootMargin = '150px',
  minHeight = '200px',
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  // Intersection Observer to detect when image enters viewport
  useEffect(() => {
    if (!wrapperRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(wrapperRef.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  // Handle image loading
  useEffect(() => {
    if (!isInView || !imgRef.current || !src) return;

    const img = imgRef.current;

    const handleLoad = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      setError(true);
      setIsLoaded(true);
    };

    // Check if image is already loaded
    if (img.complete) {
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        handleError();
      } else {
        handleLoad();
      }
    } else {
      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);

      return () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
      };
    }
  }, [isInView, src]);

  return (
    <ImageWrapper ref={wrapperRef} sx={{ minHeight }}>
      {!isLoaded && !error && (
        <ImageSkeleton
          variant="rectangular"
          animation="wave"
          sx={{ minHeight }}
        />
      )}
      {isInView && src && (
        <StyledImage
          ref={imgRef}
          src={src}
          alt={alt}
          isLoaded={isLoaded}
          loading="lazy"
          decoding="async"
        />
      )}
      {error && (
        <ImageSkeleton
          variant="rectangular"
          animation={false}
          sx={{
            minHeight,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&::after': {
              content: '"Failed to load"',
              color: 'text.secondary',
              fontSize: '12px',
            },
          }}
        />
      )}
    </ImageWrapper>
  );
}

