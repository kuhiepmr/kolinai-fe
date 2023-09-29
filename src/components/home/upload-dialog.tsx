import AudioWaves from '@/assets/audio-waves.svg';
import {getFileSizeInMB} from '@/lib/utils';
import {createConversation} from '@/queries/createConversation';
import {UploadTask} from 'firebase/storage';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '../ui/button';
import {Card, CardContent} from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {Progress} from '../ui/progress';
import {toast, toastJSON} from '../ui/use-toast';

export interface UploadingFile {
  file: File;
  filePath: string;
  task: UploadTask;
}

interface UploadDialogProps {
  uploadingFile: UploadingFile | null;
  onCancelUpload: () => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  uploadingFile,
  onCancelUpload,
}) => {
  const [progress, setProgress] = useState<number | null>(50);
  const navigate = useNavigate();

  useEffect(() => {
    if (!uploadingFile) return;

    const {task, file, filePath} = uploadingFile;

    const unsubscribe = task.on(
      'state_changed',
      snapshot =>
        setProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        ),
      error => {
        onCancelUpload();

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
            onCancelUpload();
            toastJSON('Failed to upload file', error);
          });
      },
    );

    return () => {
      unsubscribe();
    };
  }, [uploadingFile, navigate, onCancelUpload]);

  return (
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
            onClick={onCancelUpload}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
