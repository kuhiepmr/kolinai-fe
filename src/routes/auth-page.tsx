import Logo from '@/assets/insight-wave.svg';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import MainLayout from '@/components/ui/main-layout';
import {toastJSON} from '@/components/ui/use-toast';
import {auth} from '@/lib/firebase';
import {useCurrentUser} from '@/queries/useCurrentUser';
import {zodResolver} from '@hookform/resolvers/zod';
import {FirebaseError} from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {Loader2Icon} from 'lucide-react';
import {useEffect} from 'react';

import {useForm} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import {z} from 'zod';

interface AuthPageProps {
  type: 'login' | 'signup';
}

const AuthHandle = {
  login: signInWithEmailAndPassword,
  signup: createUserWithEmailAndPassword,
};

const LoginFormSchema = z.object({
  email: z.string(),
  password: z.string(),
});

const AuthPage: React.FC<AuthPageProps> = ({type}) => {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
  });

  const handleSubmit = async ({
    email,
    password,
  }: z.infer<typeof LoginFormSchema>) => {
    try {
      await AuthHandle[type](auth, email, password);
    } catch (error) {
      if (!(error instanceof FirebaseError)) {
        throw error;
      }
      form.setError('email', {type: 'max'}, {shouldFocus: true});
      toastJSON('There was an error.', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <MainLayout>
      <div className="flex min-h-screen justify-center bg-gradient-to-r pt-24">
        <div className="mx-4 h-fit w-full max-w-md space-y-8 rounded-lg bg-primary-foreground p-6 shadow-xl sm:mx-0">
          <div className="flex w-full items-center justify-center">
            <img alt="logo" className="h-12 w-12" src={Logo} />
            <h1 className="ml-4 text-center text-2xl font-bold">InsightWave</h1>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="mb-8 max-w-2xl space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col items-center justify-center py-4 sm:flex-row sm:justify-center sm:space-x-4">
                <Button
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
                  className="animate-pulse"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      <p className="ml-2">Submitting</p>
                    </>
                  ) : type === 'login' ? (
                    'Log In'
                  ) : (
                    `Let's get started!`
                  )}
                </Button>
                {type === 'login' ? (
                  <Link to="/signup">
                    <Button variant="secondary">Sign Up</Button>
                  </Link>
                ) : null}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </MainLayout>
  );
};

export default AuthPage;
