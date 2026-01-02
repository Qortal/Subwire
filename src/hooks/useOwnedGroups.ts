import { useAtom, useAtomValue } from 'jotai';
import { useGlobal } from 'qapp-core';
import {
  ownedGroupsAtom,
  isLoadingOwnedGroupsAtom,
  ownedGroupsErrorAtom,
  type OwnedGroup,
} from '../state/global/profile';

// Re-export the interface for backwards compatibility
export type { OwnedGroup };

/**
 * Hook to access owned groups from global state
 * Note: Groups are fetched once at app level via useInitializeOwnedGroups
 * This hook just provides access to the atom values
 */
export function useOwnedGroups() {
  const { auth } = useGlobal();
  const groups = useAtomValue(ownedGroupsAtom);
  const isLoading = useAtomValue(isLoadingOwnedGroupsAtom);
  const error = useAtomValue(ownedGroupsErrorAtom);
  const [, setOwnedGroups] = useAtom(ownedGroupsAtom);
  const [, setIsLoading] = useAtom(isLoadingOwnedGroupsAtom);
  const [, setError] = useAtom(ownedGroupsErrorAtom);

  const refetch = async () => {
    if (!auth?.address) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/groups/owner/${auth.address}`);

      if (!response.ok) {
        if (response.status === 404) {
          setOwnedGroups([]);
          return;
        }
        throw new Error(`Failed to fetch groups: ${response.statusText}`);
      }

      const data = await response.json();
      const groupsArray = Array.isArray(data) ? data : data.groups || [];
      setOwnedGroups(groupsArray.filter((group: any) => !group.isOpen));
    } catch (err) {
      console.error('Error fetching owned groups:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch groups');
      setOwnedGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    groups,
    isLoading,
    error,
    refetch,
  };
}

