import React, {Suspense} from 'react';
import {createBrowserRouter} from 'react-router-dom';
import Loader from './components/ui/loader';

const HomePage = React.lazy(() => import('@/routes/home-page'));
const AuthPage = React.lazy(() => import('@/routes/auth-page'));
const ConversationPage = React.lazy(() => import('@/routes/conversation-page'));
const NotFoundPage = React.lazy(() => import('@/routes/not-found-page'));
const ErrorPage = React.lazy(() => import('@/routes/error-page'));

export const withSuspense = (
  Component: React.ComponentType<any>,
  props?: any,
) => {
  return (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(HomePage),
    errorElement: withSuspense(ErrorPage),
  },
  {
    path: '/notfound',
    element: withSuspense(NotFoundPage),
    errorElement: withSuspense(ErrorPage),
  },
  {
    path: '/login',
    element: withSuspense(AuthPage, {type: 'login'}),
    errorElement: withSuspense(ErrorPage),
  },
  {
    path: '/signup',
    element: withSuspense(AuthPage, {type: 'signup'}),
    errorElement: withSuspense(ErrorPage),
  },
  {
    path: '/conversations/:conversationId',
    element: withSuspense(ConversationPage, {type: 'signup'}),
    errorElement: withSuspense(ErrorPage),
  },
]);

export default router;
