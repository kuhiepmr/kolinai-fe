import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {statuses} from '@/constants/data';

interface StatusTooltipProps {
  status: string;
}

const StatusTooltip: React.FC<StatusTooltipProps> = ({status}) => {
  const statusOption = statuses.find(s => s.value === status);

  if (!statusOption) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {statusOption.svg({alt: statusOption.label, className: 'h-4 w-4'})}
        </TooltipTrigger>
        <TooltipContent className="bg-muted-foreground">
          <p>{statusOption.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StatusTooltip;
