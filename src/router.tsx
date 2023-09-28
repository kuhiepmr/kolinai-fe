import {createBrowserRouter} from 'react-router-dom';
import AuthPage from './routes/auth-page';
import ConversationPage from './routes/conversation-page';
import ErrorPage from './routes/error-page';
import HomePage from './routes/home-page';
import NotFoundPage from './routes/not-found-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/notfound',
    element: <NotFoundPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <AuthPage type="login" />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/signup',
    element: <AuthPage type="signup" />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/conversations/:conversationId',
    element: <ConversationPage />,
    errorElement: <ErrorPage />,
  },
]);

export default router;
