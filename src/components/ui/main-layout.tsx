import {auth} from '@/lib/firebase';
import {cn} from '@/lib/utils';
import React from 'react';
import TopBar from './top-bar';
import WaveLoading from './wave-loading';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({children, className}) => {
  const [authReady, setAuthReady] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      await auth.authStateReady();
      setAuthReady(true);
    };
    checkAuth();
  }, [auth]);

  return (
    <div
      className={cn(
        'h-full min-h-[calc(100vh-var(--navbar-height))] w-full pb-[var(--navbar-height)]',
        className,
      )}
    >
      <TopBar />
      {authReady && children ? (
        <div className="mx-auto max-w-screen-2xl">{children}</div>
      ) : (
        <div className="flex h-screen flex-col items-center pt-32">
          <div className="h-24 w-24">
            <WaveLoading />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
