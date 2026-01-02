import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Header } from './Header';

const RootContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.palette.background.default,
}));

export const Layout = () => {
  return (
    <RootContainer>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
    </RootContainer>
  );
};

