import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Link, useSearchParams} from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const [searchParam] = useSearchParams();

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="flex w-full max-w-md flex-col space-y-4 rounded-lg bg-white p-4 shadow-xl">
        <p className="text-center italic text-primary/70">Resource not found</p>
        <code>
          <pre className="rounded-md bg-slate-950 p-4 text-left">
            <code className="text-white">
              {JSON.stringify(
                {
                  resource: searchParam.get('resource'),
                  id: searchParam.get('id'),
                },
                null,
                2,
              )}
            </code>
          </pre>
        </code>
        <Link to="/" className="flex justify-center">
          <Button className="mx-auto bg-accent text-secondary-foreground hover:bg-background">
            Return to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFoundPage;
