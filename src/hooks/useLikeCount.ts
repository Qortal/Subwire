import { useState, useEffect } from 'react';
import { useGlobal, useListReturn, EnumCollisionStrength } from 'qapp-core';

/**
 * Hook to fetch and track like count for a specific article
 * @param articleIdentifier - The identifier of the article
 * @param shouldFetch - Whether to fetch the count (for lazy loading)
 * @returns The count of likes for the article
 */
export function useLikeCount(
  articleIdentifier: string,
  shouldFetch: boolean = true
): number {
  const { identifierOperations, lists } = useGlobal();
  const [likeIdentifier, setLikeIdentifier] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const listReturn = useListReturn(likeIdentifier || null);

  useEffect(() => {
    // Reset hasFetched when articleIdentifier changes
    setHasFetched(false);
    setLikeIdentifier(null);
  }, [articleIdentifier]);

  useEffect(() => {
    // Only fetch if shouldFetch is true and we haven't fetched yet
    if (!shouldFetch || hasFetched) return;

    const fetchLikeCount = async () => {
      try {
        if (!articleIdentifier || !identifierOperations) return;

        // Get the like identifier by hashing separately and concatenating
        const likeHash = await identifierOperations.hashString(
          'like',
          EnumCollisionStrength.HIGH
        );
        const articleHash = await identifierOperations.hashString(
          articleIdentifier,
          EnumCollisionStrength.HIGH
        );

        if (!likeHash || !articleHash) {
          console.error('Failed to create like identifier');
          return;
        }

        const likeIdentifier = likeHash + articleHash;
        setLikeIdentifier(likeIdentifier);

        // Search for all users who have published this like identifier
        const res = await lists.fetchResourcesResultsOnly({
          identifier: likeIdentifier,
          service: 'DOCUMENT',
          limit: 0,
        });
        lists.addList(likeIdentifier, res);
        setHasFetched(true);
      } catch (error) {
        console.error('Error fetching like count:', error);
        setHasFetched(true);
      }
    };

    fetchLikeCount();
  }, [articleIdentifier, identifierOperations, shouldFetch, hasFetched, lists]);

  return listReturn?.length || 0;
}

