import AudioWaves from '@/assets/audio-waves.svg';
import Insight from '@/assets/insight.svg';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import MainLayout from '@/components/ui/main-layout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import WaveLoading from '@/components/ui/wave-loading';
import {types} from '@/constants/data';
import {generateInsight} from '@/queries/generateInsight';
import {useConversation} from '@/queries/useConversation';
import {useCurrentUser} from '@/queries/useCurrentUser';
import {useFileURL} from '@/queries/useFileURL';
import {zodResolver} from '@hookform/resolvers/zod';
import {AlertCircle, ArrowLeftIcon, CheckCircleIcon} from 'lucide-react';
import {useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {Link, useParams} from 'react-router-dom';
import {z} from 'zod';

const FormSchema = z.object({
  name: z.string().optional(),
  type: z.string(),
  context: z.string().optional(),
});

const ConversationPage: React.FC = () => {
  const {conversationId} = useParams<{conversationId: string}>();
  const conversation = useConversation({conversationId: conversationId ?? ''});
  const currentUser = useCurrentUser();
  const fileURL = useFileURL({conversation, currentUser});
  const insightRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: conversation?.name,
      type: conversation?.type,
      context: conversation?.context,
    },
  });

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!conversation) return;

    await generateInsight(
      {
        ...conversation,
        name: data.name || 'Untitled Conversation',
        context: data.context ?? '',
        type: data.type ?? '',
      },
      currentUser,
    );

    if (insightRef.current) {
      insightRef.current.scrollIntoView({behavior: 'smooth'});
    }
  };

  useEffect(() => {
    if (!conversation) {
      return;
    }
    const fields: (keyof z.infer<typeof FormSchema>)[] = [
      'name',
      'type',
      'context',
    ];

    fields.forEach(field => {
      if (conversation[field]) {
        form.setValue(field, conversation[field]);
        form.trigger(field);
      }
    });
  }, [conversation, form]);

  const disabled = form.formState.isSubmitting || !form.formState.isValid;

  return (
    <MainLayout>
      <Link to="/" className="flex flex-row items-center pb-4 pl-16 pt-8">
        <ArrowLeftIcon className="mr-2 h-4" />
        Back to home
      </Link>
      {conversation ? (
        <div className="space-y-8 px-16 pb-8">
          <div className="w-full space-y-2 bg-background p-8">
            <h3 className="text-xl font-semibold tracking-wide">
              Conversation Details
            </h3>
            <p className="text-base font-light">
              For better insight, tell us a bit more about your conversation.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="max-w-2xl space-y-2 pl-4"
              >
                <FormItem>
                  <FormLabel>Your uploaded file:</FormLabel>
                  <Card className="w-96 rounded-sm border-2 border-dashed shadow-none">
                    <CardContent className="flex flex-col space-y-2 p-4 text-center">
                      <img
                        src={AudioWaves}
                        alt="audio waves"
                        className="mx-auto h-12 w-12 rounded-sm border-2 border-secondary"
                      />
                      <p className="truncate font-light tracking-wide">
                        {conversation.fileName}
                      </p>
                      <div className="text-sm font-light text-muted-foreground">
                        <span>
                          {Math.round(conversation.fileSize / 1000) / 1000} MB
                        </span>
                        <span> - </span>
                        <span>
                          Uploaded on{' '}
                          {new Date(conversation.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            },
                          )}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <FormMessage />
                </FormItem>
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Give your conversation a name:</FormLabel>
                      <FormControl>
                        <Input placeholder="Untitled Conversation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>
                        Select an option that best describe the purpose of this
                        meeting:
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue />
                            ) : (
                              <p className="text-muted-foreground">
                                Select meeting purpose
                              </p>
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {types.map(({value, label, description}) => (
                            <SelectItem
                              key={value}
                              value={value}
                              placeholder={description}
                            >
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="context"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>
                        What you want the insight to focus on:
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a bit more about the conversation"
                          className="min-h-[180px] resize-none"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="-ml-4 flex items-center pt-4">
                  <Button
                    type="submit"
                    disabled={disabled}
                    className="bg-primaryBrand text-primary hover:bg-primaryBrand/60 disabled:cursor-not-allowed disabled:bg-primaryBrand/60 disabled:text-primary"
                  >
                    <img alt="submit" src={Insight} className="mr-2" />
                    Generate Insight
                  </Button>
                  {disabled && conversation.status !== 'insight-generating' ? (
                    <div className="ml-4 flex items-center space-x-1 text-sm">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <p>
                        Make sure you fill in all required fields - denoted with
                      </p>
                      <span className="text-destructive">*</span>
                    </div>
                  ) : (
                    <div className="ml-4 flex items-center space-x-1 text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-positive" />
                      <p>All is set, ready when you ready.</p>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </div>
          {conversation.status !== 'new' && (
            <div
              className="w-full space-y-2 bg-background p-8"
              ref={insightRef}
            >
              <h3 className="text-xl font-semibold tracking-wide">
                Conversation Insight
              </h3>
              <p className="text-base font-light">Based on the conversation</p>
              <div className="max-w-2xl">
                {fileURL && (
                  <audio controls className="w-full rounded-none">
                    <source src={fileURL} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {conversation.status === 'insight-generating' && (
                  <div className="mx-auto flex w-fit flex-col items-center justify-center">
                    <div className="h-24 w-24">
                      <WaveLoading />
                    </div>
                    <p className="text-center">Generating Insight...</p>
                  </div>
                )}
              </div>
              {conversation.status === 'insight-failed' && (
                <div className="flex items-center space-x-2 py-4">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="text-base font-light">
                    Failed to generate insight. Please try again later or
                    contact support!
                  </p>
                </div>
              )}
              {conversation.status === 'insight-generated' && (
                <>
                  <h4 className="text-lg font-semibold tracking-wide">
                    Sentiment
                  </h4>
                  <p className="text-base font-light">
                    Emotion tracked based on your conversation
                  </p>
                  <div className="h-24 w-24">
                    <WaveLoading />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-screen flex-col items-center space-y-4 pt-16">
          <div className="h-24 w-24">
            <WaveLoading />
          </div>
          <p>Loading Conversation</p>
        </div>
      )}
    </MainLayout>
  );
};

export default ConversationPage;
