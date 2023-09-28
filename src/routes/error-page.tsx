import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Link, useRouteError} from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError() as Error;
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="flex w-full max-w-md flex-col space-y-4 rounded-lg bg-white p-4 shadow-xl">
        <p className="my-8 text-center italic text-primary/70">
          {error?.message ?? 'An unknown error occurred.'}
        </p>
        <Link to="/" className="flex justify-center">
          <Button className="mx-auto bg-accent text-secondary-foreground hover:bg-background">
            Return to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
}
