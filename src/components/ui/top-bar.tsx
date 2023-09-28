import Logo from '@/assets/insight-wave.svg';
import {auth} from '@/lib/firebase';
import {useCurrentUser} from '@/queries/useCurrentUser';
import {User2Icon} from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom';
import {Button} from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const signOut = () => {
    navigate('/login');
    auth.signOut();
  };

  return (
    <div className="sticky top-0 z-0 flex h-[var(--topbar-height)] flex-row items-center justify-between bg-background p-4">
      <Link className="flex flex-1 items-center" to="/">
        <img alt="logo" className="h-8 w-8" src={Logo} />
        <h1 className="ml-4 text-left text-xl font-semibold">InsightWave</h1>
      </Link>
      {currentUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              <User2Icon className="mr-2 h-4 w-4" />
              <p>{currentUser.email}</p>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={signOut}>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div>
          <Link to="/login">
            <Button aria-label="login" variant="ghost">
              <p className="">Log In</p>
            </Button>
          </Link>
          <span>|</span>
          <Link to="/signup">
            <Button aria-label="login" variant="ghost">
              <p className="">Sign Up</p>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TopBar;
