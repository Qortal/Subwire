import { useState, useEffect } from 'react';
import { useGlobal } from 'qapp-core';
import { fetchProfileFromQdn, Profile } from '../utils/profileQdn';

interface UseFetchProfileReturn {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch a user's profile from QDN
 * @param qortalName - The Qortal name of the user whose profile to fetch
 * @returns Profile data, loading state, error state, and refetch function
 */
export function useFetchProfile(qortalName: string): UseFetchProfileReturn {
  const { identifierOperations } = useGlobal();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!qortalName) {
        setProfile(null);
        setIsLoading(false);
        setError('Qortal name is required');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { profile: fetchedProfile, error: fetchError } =
          await fetchProfileFromQdn(qortalName, identifierOperations);

        if (!isMounted) return;

        if (fetchError) {
          setError(fetchError);
          setProfile(null);
        } else {
          setProfile(fetchedProfile);
          setError(null);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        setProfile(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [qortalName, identifierOperations, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { profile, isLoading, error, refetch };
}

