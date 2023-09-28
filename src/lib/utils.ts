import {clsx, type ClassValue} from 'clsx';
import {User} from 'firebase/auth';
import {twMerge} from 'tailwind-merge';
import {Conversation} from './models';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFileSizeInMB = (fileSize: number) => {
  return Math.round((fileSize / 1024 / 1024) * 100) / 100;
};

export const getStoragePath = (
  currentUser?: User | null,
  conversation?: Conversation | null,
) => {
  const folder = currentUser ? currentUser.uid : 'public';
  const fileName = conversation?.fileName;
  const filePath = `${folder}/${fileName}`;
  return filePath;
};
