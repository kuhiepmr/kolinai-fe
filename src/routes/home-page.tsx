import {UploadingFile} from '@/components/home/upload-dialog';
import {Input} from '@/components/ui/input';
import Loader from '@/components/ui/loader';
import MainLayout from '@/components/ui/main-layout';
import {toast} from '@/components/ui/use-toast';
import {storage} from '@/lib/firebase';
import {useCurrentUser} from '@/queries/useCurrentUser';
import {Label} from '@radix-ui/react-label';
import {
  getMetadata,
  ref as storageRef,
  uploadBytesResumable,
} from 'firebase/storage';
import {PlusCircleIcon} from 'lucide-react';
import React, {Suspense, useRef, useState} from 'react';

const Conversations = React.lazy(
  () => import('@/components/home/conversations'),
);
const UploadDialog = React.lazy(
  () => import('@/components/home/upload-dialog'),
);

const HomePage: React.FC = () => {
  const [uploadingFile, setUploadingFile] = useState<UploadingFile | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = useCurrentUser();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Upload directly to Firebase Storage
    const file = e.target.files?.[0];

    // Check if file not exist
    if (!file) return;

    // Check if file is not WAV
    if (file.type !== 'audio/wav') {
      toast({title: 'Only WAV file is supported!'});
      return;
    }

    const now = Date.now();
    // Check if fileName is already exist in Firebase Storage
    const folder = currentUser ? currentUser.uid : 'public';
    const fileName = file.name;
    let filePath = `${folder}/${fileName}`;
    let fileRef = storageRef(storage, filePath);

    // If file is exist, then add prefix to fileName
    try {
      await getMetadata(fileRef);
      const newFileName = `${now}-${fileName}`;
      filePath = `${folder}/${newFileName}`;
      fileRef = storageRef(storage, filePath);
    } catch (error) {
      // If file is not exist, then do nothing
    }

    // Upload file to Firebase Storage
    const task = uploadBytesResumable(fileRef, file, {
      contentType: file.type,
      customMetadata: {
        originalName: fileName,
      },
    });

    setUploadingFile({file, filePath, task});
  };

  const handleCancelUpload = () => {
    if (uploadingFile?.task) {
      uploadingFile.task.cancel();
    }
    setUploadingFile(null);
  };

  return (
    <MainLayout>
      <div className="space-y-8 px-16 py-8">
        <div className="w-full space-y-2 bg-background p-8">
          <h3 className="text-xl font-semibold tracking-wide">Get Started</h3>
          <p className="text-base font-light">
            Start exploring the insight behind your conversation.
          </p>
          <div className="flex border-spacing-1 cursor-pointer flex-col items-center justify-center border-2 border-dashed">
            <Label
              htmlFor="file"
              className="absolute flex cursor-pointer flex-col items-center justify-center space-y-2 text-center"
            >
              <PlusCircleIcon />
              <p>
                Drag & drop your file here
                <br></br>
                or <span className="text-blue-500">browse</span>
              </p>
              <p className="font-light text-muted-foreground">Supports: WAV</p>
            </Label>
            <Input
              type="file"
              id="file"
              name="file"
              className="flex w-full cursor-pointer items-center justify-center border-none p-24 text-center opacity-0"
              accept=".wav"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <Suspense fallback={<Loader />}>
          <UploadDialog
            uploadingFile={uploadingFile}
            onCancelUpload={handleCancelUpload}
          />
          <Conversations />
        </Suspense>
      </div>
    </MainLayout>
  );
};

export default HomePage;
