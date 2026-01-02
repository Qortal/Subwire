import { useState, useEffect } from 'react';

export interface GroupDetails {
  groupId: number;
  groupName: string;
  description?: string;
  owner: string;
  isOpen: boolean;
  memberCount?: number;
  [key: string]: any;
}

/**
 * Hook to fetch group details by group ID
 * @param groupId - The group ID to fetch details for
 * @returns Group details including member count
 */
export function useGroupDetails(groupId: number | null | undefined) {
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!groupId) {
        setGroupDetails(null);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/groups/${groupId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Group not found');
          }
          throw new Error(`Failed to fetch group: ${response.statusText}`);
        }

        const data = await response.json();
        setGroupDetails(data);
      } catch (err) {
        console.error('Error fetching group details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch group');
        setGroupDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  return {
    groupDetails,
    isLoading,
    error,
  };
}

