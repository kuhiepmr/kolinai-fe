import InsightFailed from '@/assets/insight-failed.svg';
import InsightGenerated from '@/assets/insight-generated.svg';
import InsightGenerating from '@/assets/insight-generating.svg';
import InsightNone from '@/assets/insight-none.svg';
import {
  AlertCircleIcon,
  BrainIcon,
  CheckCircleIcon,
  CircleIcon,
  FolderKanbanIcon,
  GaugeCircleIcon,
  HeartHandshakeIcon,
  PercentCircleIcon,
  Share2Icon,
  UserCircle2Icon,
  UsersIcon,
} from 'lucide-react';
import {ClassAttributes, ImgHTMLAttributes} from 'react';
import {JSX} from 'react/jsx-runtime';

export const statuses = [
  {
    value: 'new',
    label: 'New',
    icon: CircleIcon,
    svg: (
      props: JSX.IntrinsicAttributes &
        ClassAttributes<HTMLImageElement> &
        ImgHTMLAttributes<HTMLImageElement>,
    ) => <img {...props} src={InsightNone} />,
  },
  {
    value: 'insight-generating',
    label: 'Insight Generating',
    icon: GaugeCircleIcon,
    svg: (
      props: JSX.IntrinsicAttributes &
        ClassAttributes<HTMLImageElement> &
        ImgHTMLAttributes<HTMLImageElement>,
    ) => <img {...props} src={InsightGenerating} />,
  },
  {
    value: 'insight-generated',
    label: 'Insight Generated',
    icon: CheckCircleIcon,
    svg: (
      props: JSX.IntrinsicAttributes &
        ClassAttributes<HTMLImageElement> &
        ImgHTMLAttributes<HTMLImageElement>,
    ) => <img {...props} src={InsightGenerated} />,
  },
  {
    value: 'insight-failed',
    label: 'Insight Failed',
    icon: AlertCircleIcon,
    svg: (
      props: JSX.IntrinsicAttributes &
        ClassAttributes<HTMLImageElement> &
        ImgHTMLAttributes<HTMLImageElement>,
    ) => <img {...props} className="fill-red-500" src={InsightFailed} />,
  },
  //   {
  //     value: 'insight-rejected',
  //     label: 'Insight Rejected',
  //     icon: CheckCircleIcon,
  //   },
  //   {
  //     value: 'insight-archived',
  //     label: 'Insight Archived',
  //     icon: CheckCircleIcon,
  //   },
];

export const types = [
  {
    value: 'mentoring-coaching',
    label: 'Mentoring or Coaching',
    description:
      'Reflecting on the advice and guidance received for personal or professional growth.',
    icon: UsersIcon,
  },
  {
    value: 'therapy-counseling',
    label: 'Therapy or Counseling',
    description:
      'Reflecting on the insights gained and strategies discussed for mental well-being.',
    icon: BrainIcon,
  },
  {
    value: 'conflict-resolution',
    label: 'Conflict Resolution',
    description:
      'Going over resolutions, compromises, or agreements to ensure they are followed through.',
    icon: HeartHandshakeIcon,
  },
  {
    value: 'interview',
    label: 'Interview',
    description:
      'Revisiting the interview questions and answers to prepare for follow-up interviews or assessments.',
    icon: UserCircle2Icon,
  },
  {
    value: 'work-discussion',
    label: 'Work-related Discussion',
    description:
      'Reviewing project details, action items, and decisions made during work meetings.',
    icon: FolderKanbanIcon,
  },
  {
    value: 'networking',
    label: 'Networking',
    description:
      'Reviewing potential collaborations or opportunities discussed during networking events.',
    icon: Share2Icon,
  },
  {
    value: 'sales-negotiation',
    label: 'Sales or Negotiation',
    description:
      'Revisiting the terms and conditions of a business deal or sales agreement.',
    icon: PercentCircleIcon,
  },
];
