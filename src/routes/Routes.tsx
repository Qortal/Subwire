import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppWrapper } from '../AppWrapper';
import { Layout } from '../components/Layout';
import {
  HomePage,
  DiscoverPage,
  ArticlePage,
  WritePage,
  PostTypeSelectionPage,
  EditArticlePage,
  MyPublicationsPage,
  ProfilePage,
} from '../pages';

interface CustomWindow extends Window {
  _qdnBase: string;
}
const customWindow = window as unknown as CustomWindow;
const baseUrl = customWindow?._qdnBase || '';

export function Routes() {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <AppWrapper />,
        children: [
          {
            element: <Layout />,
            children: [
              {
                index: true,
                element: <HomePage />,
              },
              {
                path: 'discover',
                element: <DiscoverPage />,
              },
              {
                path: 'edit/:name/:identifier',
                element: <EditArticlePage />,
              },
              {
                path: 'my-publications',
                element: <MyPublicationsPage />,
              },
              {
                path: 'write',
                element: <PostTypeSelectionPage />,
              },
              {
                path: 'write/:type',
                element: <WritePage />,
              },
            ],
          },
          {
            // Profile page without Layout - feels like author's personal site
            path: 'author/:name',
            element: <ProfilePage />,
          },
          {
            // Article pages without Layout - immersive reading experience
            path: 'publication/:name/:identifier',
            element: <ArticlePage />,
          },
          {
            path: 'article/:name/:identifier',
            element: <ArticlePage />,
          },
        ],
      },
    ],
    {
      basename: baseUrl,
    }
  );

  return <RouterProvider router={router} />;
}
