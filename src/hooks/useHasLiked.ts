import { useState, useEffect } from 'react';
import { useGlobal, useListReturn, EnumCollisionStrength } from 'qapp-core';

/**
 * Hook to check if the current user has liked a specific article
 * @param articleIdentifier - The identifier of the article
 * @param shouldFetch - Whether to fetch the data (for lazy loading)
 * @returns Object with hasLiked (boolean) and isLoading (boolean)
 */
export function useHasLiked(
  articleIdentifier: string,
  shouldFetch: boolean = true
): {
  hasLiked: boolean;
  isLoading: boolean;
} {
  const { identifierOperations, auth, lists } = useGlobal();
  const [likeIdentifier, setLikeIdentifier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const listReturn = useListReturn(likeIdentifier || null);

  useEffect(() => {
    // Reset hasFetched when articleIdentifier changes
    setHasFetched(false);
    setLikeIdentifier(null);
    setIsLoading(true);
  }, [articleIdentifier]);

  useEffect(() => {
    // Only fetch if shouldFetch is true and we haven't fetched yet
    if (!shouldFetch || hasFetched) {
      setIsLoading(false);
      return;
    }

    const checkIfLiked = async () => {
      try {
        setIsLoading(true);
        if (!articleIdentifier || !identifierOperations || !auth?.name) {
          setIsLoading(false);
          setHasFetched(true);
          return;
        }

        // Create the like identifier by hashing separately and concatenating
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
          setIsLoading(false);
          setHasFetched(true);
          return;
        }

        const likeIdentifier = likeHash + articleHash;
        setLikeIdentifier(`${likeIdentifier}-${auth.name}`);

        // Try to fetch the like resource
        const res = await lists.fetchResourcesResultsOnly({
          identifier: likeIdentifier,
          service: 'DOCUMENT',
          name: auth.name,
          limit: 0,
        });
        lists.addList(`${likeIdentifier}-${auth.name}`, res);
        setIsLoading(false);
        setHasFetched(true);
      } catch (error) {
        setIsLoading(false);
        setHasFetched(true);
      }
    };

    checkIfLiked();
  }, [
    articleIdentifier,
    identifierOperations,
    auth?.name,
    shouldFetch,
    hasFetched,
    lists,
  ]);

  return { hasLiked: listReturn?.length > 0, isLoading };
}
