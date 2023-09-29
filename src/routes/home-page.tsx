import AudioWaves from '@/assets/audio-waves.svg';
import Conversations from '@/components/home/conversations';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import MainLayout from '@/components/ui/main-layout';
import {Progress} from '@/components/ui/progress';
import {toast, toastJSON} from '@/components/ui/use-toast';
import {storage} from '@/lib/firebase';
import {getFileSizeInMB} from '@/lib/utils';
import {createConversation} from '@/queries/createConversation';
import {useCurrentUser} from '@/queries/useCurrentUser';
import {Label} from '@radix-ui/react-label';
import {
  UploadTask,
  getMetadata,
  ref as storageRef,
  uploadBytesResumable,
} from 'firebase/storage';
import {PlusCircleIcon} from 'lucide-react';
import {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';

interface UploadingFile {
  file: File;
  task: UploadTask;
}

const HomePage: React.FC = () => {
  const [uploadingFile, setUploadingFile] = useState<UploadingFile | null>(
    null,
  );
  const [progress, setProgress] = useState<number | null>(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

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
    const uploadTask = uploadBytesResumable(fileRef, file, {
      contentType: file.type,
      customMetadata: {
        originalName: fileName,
      },
    });

    setUploadingFile({file, task: uploadTask});

    uploadTask.on(
      'state_changed',
      snapshot =>
        setProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        ),
      error => {
        setUploadingFile(null);
        e.target.value = '';
        if (error.code === 'storage/canceled') {
          toast({
            description: (
              <p className="text-destructive">File upload canceled!</p>
            ),
          });
          return;
        }
        toastJSON('Failed to upload file', error);
      },
      () => {
        createConversation(file, filePath)
          .then(id => {
            navigate(`/conversations/${id}`);
            toast({title: 'File uploaded successfully'});
          })
          .catch(error => {
            setUploadingFile(null);
            e.target.value = '';
            toastJSON('Failed to upload file', error);
          });
      },
    );
  };

  const handleCancelUpload = () => {
    if (uploadingFile?.task) {
      uploadingFile.task.cancel();
    }
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
          <Dialog open={!!uploadingFile}>
            <DialogContent>
              <DialogHeader className="text-left">
                <DialogTitle className="text-2xl font-normal tracking-wide">
                  File Uploading
                </DialogTitle>
                <DialogDescription>
                  Please keep this open until upload completed.
                </DialogDescription>
              </DialogHeader>
              {!!uploadingFile?.file && (
                <Card
                  key={uploadingFile?.file.name}
                  className="w-full rounded-sm border-2 shadow-none"
                >
                  <CardContent className="flex w-full justify-start space-x-2 p-2">
                    <img
                      src={AudioWaves}
                      alt="audio waves"
                      className="h-10 w-10 rounded-sm border-2 border-secondary"
                    />
                    <div className="w-full space-y-1">
                      <p className="max-w-sm truncate font-light tracking-wide">
                        {uploadingFile?.file.name}
                      </p>
                      <div className="text-sm font-light text-muted-foreground">
                        {getFileSizeInMB(uploadingFile?.file.size ?? 10)} MB
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={progress} />
                        <span className="w-12 text-sm text-muted-foreground">{`${progress}%`}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              <DialogFooter className="sm:justify-center">
                <Button
                  className="border-2 bg-background px-12 font-normal text-primary shadow-none hover:bg-primary/10"
                  onClick={handleCancelUpload}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Conversations />
      </div>
    </MainLayout>
  );
};

export default HomePage;
