import AnimateData from '@/assets/animate.json';
import {Lottie} from '@alfonmga/react-lottie-light-ts/';
import {memo} from 'react';

const WaveLoading: React.FC = memo(() => (
  <Lottie
    config={{
      loop: true,
      autoplay: true,
      animationData: AnimateData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    }}
  />
));
export default WaveLoading;
