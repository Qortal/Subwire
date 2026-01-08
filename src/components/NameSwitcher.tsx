import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import {
  Typography,
  Menu,
  MenuItem,
  CircularProgress,
  Avatar,
  Box,
  Chip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';
import { useGlobal, showError, showSuccess, useAuth } from 'qapp-core';
import { useNavigate } from 'react-router-dom';
import { useAtom, useSetAtom } from 'jotai';
import { preferredNamesMapAtom } from '../state/global/profile';
import {
  userNamesAtom,
  isLoadingUserNamesAtom,
} from '../state/global/userNames';

const NameSwitcherButton = styled('button')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 1.5),
  borderRadius: '10px',
  border: 'none',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.05)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.08)',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

const NameInfo = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flex: 1,
  minWidth: 0,
});

const NameDetails = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  minWidth: 0,
  overflow: 'hidden',
});

const ArrowIcon = styled(KeyboardArrowDownIcon)(() => ({
  transition: 'transform 0.2s ease',
  flexShrink: 0,
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
  minWidth: '240px',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(99, 102, 241, 0.15)'
        : 'rgba(99, 102, 241, 0.1)',
  },
}));

const PrimaryBadge = styled(Chip)(({ theme }) => ({
  height: '20px',
  fontSize: '11px',
  fontWeight: 600,
  borderRadius: '10px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 193, 7, 0.2)'
      : 'rgba(255, 193, 7, 0.15)',
  color: theme.palette.mode === 'dark' ? '#ffc107' : '#f57c00',
  '& .MuiChip-icon': {
    fontSize: '14px',
    marginLeft: '4px',
    color: 'inherit',
  },
}));

export function NameSwitcher() {
  const { auth } = useGlobal();
  const { switchName } = useAuth();
  const navigate = useNavigate();

  const [preferredNamesMap, setPreferredNamesMap] = useAtom(
    preferredNamesMapAtom
  );
  const [names] = useAtom(userNamesAtom);
  const [isLoading] = useAtom(isLoadingUserNamesAtom);
  const setUserNames = useSetAtom(userNamesAtom);
  const setIsLoadingUserNames = useSetAtom(isLoadingUserNamesAtom);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const menuOpen = Boolean(anchorEl);

  // Fetch names when component mounts or address changes
  useEffect(() => {
    const fetchNames = async () => {
      if (!auth?.address) {
        setUserNames([]);
        setIsLoadingUserNames(false);
        return;
      }

      setIsLoadingUserNames(true);
      try {
        const response = await fetch(`/names/address/${auth.address}`);
        if (!response.ok) {
          throw new Error('Failed to fetch names');
        }
        const data = await response.json();
        const fetchedNames = data?.map((item: any) => item?.name) || [];
        setUserNames(fetchedNames);
      } catch (error) {
        console.error('Error fetching names:', error);
        showError('Failed to load names');
        setUserNames([]);
      } finally {
        setIsLoadingUserNames(false);
      }
    };

    fetchNames();
  }, [auth?.address, setUserNames, setIsLoadingUserNames]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNameSwitch = async (name: string) => {
    if (!switchName || name === auth?.name) {
      handleMenuClose();
      return;
    }

    setIsSwitching(true);
    try {
      await switchName(name);
      // Save the preferred name for this address
      if (auth?.address) {
        setPreferredNamesMap({
          ...preferredNamesMap,
          [auth.address]: name,
        });
      }

      showSuccess(`Switched to ${name}`);
      handleMenuClose();

      // Navigate to the author's profile page
      setTimeout(() => {
        navigate(`/author/${name}`);
      }, 100);
    } catch (error) {
      console.error('Error switching name:', error);
      showError('Failed to switch name');
    } finally {
      setIsSwitching(false);
    }
  };

  const handleAuthenticate = async () => {
    if (!auth) return;

    setIsSwitching(true);
    try {
      await auth.authenticateUser();
      showSuccess('Authentication successful');
    } catch (error) {
      console.error('Authentication failed:', error);
      showError('Failed to authenticate');
    } finally {
      setIsSwitching(false);
    }
  };

  // If user is not authenticated, show Authenticate button
  if (!auth?.address) {
    return (
      <NameSwitcherButton
        onClick={handleAuthenticate}
        disabled={isSwitching || auth?.isLoadingUser}
      >
        <NameInfo>
          <Avatar sx={{ width: 32, height: 32 }}>
            <PersonIcon sx={{ fontSize: '18px' }} />
          </Avatar>
          <NameDetails>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{
                fontSize: '13px',
                color: 'text.primary',
              }}
            >
              Authenticate
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '11px',
                color: 'text.secondary',
              }}
            >
              {auth?.isLoadingUser ? 'Loading...' : 'Required to publish'}
            </Typography>
          </NameDetails>
        </NameInfo>
        {isSwitching || auth?.isLoadingUser ? (
          <CircularProgress size={16} />
        ) : null}
      </NameSwitcherButton>
    );
  }

  // If user is authenticated but has no name
  if (!auth?.name) {
    return (
      <NameSwitcherButton
        onClick={async () => {
          try {
            await qortalRequest({
              action: 'OPEN_NEW_TAB',
              qortalLink: 'qortal://APP/names',
            });
          } catch (error) {
            console.error('Error opening new tab:', error);
          }
        }}
      >
        <NameInfo>
          <Avatar sx={{ width: 32, height: 32 }}>
            <PersonIcon sx={{ fontSize: '18px' }} />
          </Avatar>
          <NameDetails>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{
                fontSize: '13px',
                color: 'text.primary',
              }}
            >
              No Name
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '11px',
                color: 'text.secondary',
              }}
            >
              Name required to publish
            </Typography>
          </NameDetails>
        </NameInfo>
      </NameSwitcherButton>
    );
  }

  const currentName = auth.name;

  return (
    <>
      <NameSwitcherButton onClick={handleMenuClick} disabled={isSwitching}>
        <NameInfo>
          <Avatar
            src={`/arbitrary/THUMBNAIL/${currentName}/qortal_avatar?async=true`}
            alt={`${currentName} avatar`}
            sx={{ width: 32, height: 32 }}
          >
            {currentName[0].toUpperCase()}
          </Avatar>
          <NameDetails>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{
                fontSize: '13px',
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '120px',
              }}
            >
              @{currentName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '11px',
                color: 'text.secondary',
              }}
            >
              {isLoading
                ? 'Loading...'
                : names.length > 1
                  ? `${names.length} names`
                  : 'Switch name'}
            </Typography>
          </NameDetails>
        </NameInfo>
        {isSwitching ? (
          <CircularProgress size={16} />
        ) : (
          <ArrowIcon
            sx={{
              transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        )}
      </NameSwitcherButton>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                : '0 8px 24px rgba(0, 0, 0, 0.15)',
            mt: -1,
          },
        }}
      >
        {isLoading ? (
          <StyledMenuItem>
            <CircularProgress size={20} />
          </StyledMenuItem>
        ) : names.length === 0 ? (
          <StyledMenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No names found
            </Typography>
          </StyledMenuItem>
        ) : (
          names.map((name) => {
            const isPrimary = name === auth?.primaryName;
            const isCurrent = name === currentName;

            return (
              <StyledMenuItem
                key={name}
                onClick={() => handleNameSwitch(name)}
                disabled={isSwitching}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={isCurrent ? 700 : 400}
                    sx={{ fontSize: '14px' }}
                  >
                    @{name}
                  </Typography>
                  {isPrimary && (
                    <PrimaryBadge
                      icon={<StarIcon />}
                      label="Primary"
                      size="small"
                    />
                  )}
                </Box>
                {isCurrent && (
                  <CheckIcon sx={{ fontSize: '18px', color: 'primary.main' }} />
                )}
              </StyledMenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
}

