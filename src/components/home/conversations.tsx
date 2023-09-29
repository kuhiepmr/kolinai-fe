import {statuses, types} from '@/constants/data';
import {getFileSizeInMB} from '@/lib/utils';
import {deleteConversation} from '@/queries/deleteConversation';
import {useConversations} from '@/queries/useConversations';
import {useCurrentUser} from '@/queries/useCurrentUser';
import {SearchIcon, Trash2Icon, XIcon} from 'lucide-react';
import {useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {Badge} from '../ui/badge';
import {Button} from '../ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '../ui/card';
import {FacetedFilter} from '../ui/faceted-filter';
import {Input} from '../ui/input';
import {Separator} from '../ui/separator';
import WaveLoading from '../ui/wave-loading';
import StatusTooltip from './status-tooltip';

const Conversations: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[] | undefined>();
  const [selectedStatuses, setSelectedStatuses] = useState<
    string[] | undefined
  >();
  const currentUser = useCurrentUser();
  const conversations = useConversations({
    searchText,
    types: selectedTypes,
    statuses: selectedStatuses,
  });

  const isFiltered = useMemo(
    () => !!searchText || selectedTypes?.length || selectedStatuses?.length,
    [selectedTypes, selectedStatuses, searchText],
  );

  const typesColumn = useMemo(
    () => ({
      getFilterValue: () => selectedTypes,
      setFilterValue: setSelectedTypes,
      getFacetedUniqueValues: () => new Map(),
    }),
    [selectedTypes, setSelectedTypes],
  );

  const statusesColumn = useMemo(
    () => ({
      getFilterValue: () => selectedStatuses,
      setFilterValue: setSelectedStatuses,
      getFacetedUniqueValues: () => new Map(),
    }),
    [selectedStatuses, setSelectedStatuses],
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleResetFilters = () => {
    setSearchText('');
    setSelectedTypes(undefined);
    setSelectedStatuses(undefined);
  };

  const handleDeleteConversation = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    conversation: any,
  ) => {
    e.preventDefault();
    deleteConversation(conversation, currentUser);
  };

  return (
    <div className="w-full space-y-2 bg-background p-8">
      <h3 className="flex items-center text-xl font-semibold tracking-wide">
        {!currentUser && (
          <Badge className="mr-2 bg-muted-foreground">Public</Badge>
        )}
        Conversations
      </h3>
      <p className="text-base font-light">Past Conversations uploaded.</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <SearchIcon className="h-4 w-4" />
            </div>
            <Input
              placeholder="Search"
              value={searchText}
              onChange={handleSearch}
              className="w-64 pl-12 pr-2 text-base font-light"
            />
          </div>
          <FacetedFilter column={typesColumn} title="Type" options={types} />
          <FacetedFilter
            column={statusesColumn}
            title="Status"
            options={statuses}
          />
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={handleResetFilters}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <XIcon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <Separator />
      {!conversations && (
        <div className="flex w-full flex-col items-center justify-center py-4">
          <div className="h-12 w-12">
            <WaveLoading />
          </div>
          <p className="ml-2">Loading Conversations ...</p>
        </div>
      )}
      {conversations && !conversations.length && (
        <p className="py-4 text-center text-base font-light">
          No conversations found. Upload a WAV file to get started.
        </p>
      )}
      <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {conversations?.map(conversation => (
          <Link to={`/conversations/${conversation.id}`} key={conversation.id}>
            <Card key={conversation.name} className="rounded-sm shadow-none">
              <CardHeader className="space-y-0 px-4 pt-4">
                <div className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="truncate font-medium tracking-wide">
                    {conversation.name}
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-background px-2"
                    aria-label="delete"
                    value={conversation.name}
                    onClick={e => handleDeleteConversation(e, conversation)}
                  >
                    <Trash2Icon className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <Badge className="w-fit bg-primary/20 text-sm font-light text-primary hover:bg-background">
                  {types.find(type => type.value === conversation.type)
                    ?.label ?? 'Unknown'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2 px-4 pb-4">
                <p className="truncate font-light tracking-wide">
                  {conversation.fileName}
                </p>
                <div className="flex justify-between">
                  <div className="text-sm font-light text-muted-foreground">
                    <span>{getFileSizeInMB(conversation.fileSize)} MB</span>
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
                  <StatusTooltip status={conversation.status} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Conversations;
