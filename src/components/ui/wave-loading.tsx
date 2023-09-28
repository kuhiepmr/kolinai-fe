import AnimateData from '@/assets/animate.json';
import Lottie from 'react-lottie';

const WaveLoading: React.FC = () => (
  <Lottie
    options={{
      loop: true,
      autoplay: true,
      animationData: AnimateData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    }}
  />
);
export default WaveLoading;
