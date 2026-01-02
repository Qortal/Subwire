import { useState, useEffect, useMemo } from 'react';
import { usePublish } from 'qapp-core';

export interface AudioMetadataDocument {
  title: string;
  version: number;
  description: string;
  audioReference: {
    name: string;
    identifier: string;
    service: string;
  };
  mimeType: string;
  filename: string;
  fileSize: number;
  duration?: number;
}

export interface AudioWithMetadata {
  audioUrl: string;
  metadata: AudioMetadataDocument;
  metadataIdentifier: string;
  metadataName: string;
}

/**
 * Hook to fetch audio metadata documents and return audio URLs with metadata
 * @param audios - Array of audio references with metadata identifiers
 * @returns Array of audios with fetched metadata
 */
export function useAudioMetadata(
  audios:
    | Array<{
        identifier: string;
        name: string;
        service: string;
      }>
    | undefined
): { audiosWithMetadata: AudioWithMetadata[]; isLoading: boolean } {
  const [audiosWithMetadata, setAudiosWithMetadata] = useState<
    AudioWithMetadata[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchPublish } = usePublish();

  // Create stable identifiers string for dependency array
  const audioIdentifiers = useMemo(
    () =>
      audios?.map((a) => `${a.name}-${a.identifier}-${a.service}`).join('|') ||
      '',
    [audios]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchMetadata = async () => {
      try {
        // No audios to fetch
        if (!audios || audios.length === 0) {
          if (isMounted) {
            setAudiosWithMetadata([]);
          }
          return;
        }

        setIsLoading(true);
        const results: AudioWithMetadata[] = [];

        for (const audio of audios) {
          try {
            const response = await fetchPublish({
              name: audio.name,
              service: audio.service as any, // Should be 'DOCUMENT'
              identifier: audio.identifier,
            });

            if (
              isMounted &&
              response &&
              response.hasResource &&
              response?.resource?.data
            ) {
              const metadata = response.resource.data as AudioMetadataDocument;

              // Construct the audio URL from the audioReference
              const audioUrl = `/arbitrary/${metadata.audioReference.service}/${metadata.audioReference.name}/${metadata.audioReference.identifier}`;

              results.push({
                audioUrl,
                metadata,
                metadataIdentifier: audio.identifier,
                metadataName: audio.name,
              });
            } else {
              console.warn(
                'useAudioMetadata: No resource found or invalid response:',
                response
              );
            }
          } catch (error) {
            console.error('Error fetching audio metadata:', error);
            // Continue fetching other audios even if one fails
          }
        }

        if (isMounted) {
          setAudiosWithMetadata(results);
        }
      } catch (error) {
        console.error('Error in audio metadata fetch:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMetadata();

    return () => {
      isMounted = false;
    };
  }, [audioIdentifiers, fetchPublish]);

  return { audiosWithMetadata, isLoading };
}

