import Image from 'next/image';
import FloatingCropButton from '@/components/FloatingCropButton';

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black">
      <div className="relative w-full max-w-[430px] h-screen max-h-[932px]">
        <Image
          src="/iPhone 14 & 15 Pro Max - 3.png"
          alt="App Background"
          fill
          className="object-contain"
          priority
        />
        <FloatingCropButton />
      </div>
    </main>
  );
}