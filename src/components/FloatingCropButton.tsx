'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import AnalysisModal from './AnalysisModal';
import PersonalAnalysis from './PersonalAnalysis';

interface SelectionArea {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface FloatingCropButtonProps {
  onScreenshotTaken?: (url: string) => void;
}

export default function FloatingCropButton({ onScreenshotTaken }: FloatingCropButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState<SelectionArea | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isPersonalAnalysisOpen, setIsPersonalAnalysisOpen] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isModalOpen || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const img = containerRef.current.querySelector('img');
    if (!rect || !img) return;

    // Get the actual display area of the image
    const imgRect = img.getBoundingClientRect();
    
    // Calculate click position relative to container
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Calculate image position within container
    const imgOffsetX = imgRect.left - rect.left;
    const imgOffsetY = imgRect.top - rect.top;
    
    // Check if click is within image bounds and no selection exists
    if (!selection && 
        clickX >= imgOffsetX && clickX <= imgOffsetX + imgRect.width &&
        clickY >= imgOffsetY && clickY <= imgOffsetY + imgRect.height) {
      setIsSelecting(true);
      setSelection({
        startX: clickX,
        startY: clickY,
        endX: clickX,
        endY: clickY,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting || !selection || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const img = containerRef.current.querySelector('img');
    if (!rect || !img) return;

    // Get the actual display area of the image
    const imgRect = img.getBoundingClientRect();
    
    // Calculate image position within container
    const imgOffsetX = imgRect.left - rect.left;
    const imgOffsetY = imgRect.top - rect.top;
    
    // Calculate mouse position and constrain within image bounds
    const mouseX = Math.max(imgOffsetX, Math.min(e.clientX - rect.left, imgOffsetX + imgRect.width));
    const mouseY = Math.max(imgOffsetY, Math.min(e.clientY - rect.top, imgOffsetY + imgRect.height));

    setSelection({
      ...selection,
      endX: mouseX,
      endY: mouseY,
    });
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const handleCrop = async () => {
    if (!selection || !containerRef.current) return;
    
    const img = containerRef.current.querySelector('img') as HTMLImageElement;
    if (!img) return;

    // Get the actual display information of the image
    const rect = containerRef.current.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    
    // Calculate image offset within container
    const imgOffsetX = imgRect.left - rect.left;
    const imgOffsetY = imgRect.top - rect.top;
    
    // Calculate selection area coordinates relative to image
    const x = Math.min(selection.startX, selection.endX) - imgOffsetX;
    const y = Math.min(selection.startY, selection.endY) - imgOffsetY;
    const width = Math.abs(selection.endX - selection.startX);
    const height = Math.abs(selection.endY - selection.startY);

    // Calculate scale ratio (original image size vs display size)
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    // Create a temporary canvas to store the screenshot
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to actual crop dimensions
    tempCanvas.width = width * scaleX;
    tempCanvas.height = height * scaleY;

    // Draw selected area to canvas (using original image coordinates)
    ctx.drawImage(
      img, 
      x * scaleX, 
      y * scaleY, 
      width * scaleX, 
      height * scaleY, 
      0, 
      0, 
      tempCanvas.width, 
      tempCanvas.height
    );

    // Convert canvas to blob and store it
    tempCanvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      setScreenshotUrl(url);
      
      // Notify parent component
      if (onScreenshotTaken) {
        onScreenshotTaken(url);
      }
      
      // Close the crop modal and open analysis modal
      setSelection(null);
      setIsModalOpen(false);
      setIsAnalysisModalOpen(true);
    });
  };

  useEffect(() => {
    if (!isModalOpen || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    // Set the actual canvas dimensions
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!selection) return;
    
    ctx.strokeStyle = '#FFC470';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    const x = Math.min(selection.startX, selection.endX);
    const y = Math.min(selection.startY, selection.endY);
    const width = Math.abs(selection.endX - selection.startX);
    const height = Math.abs(selection.endY - selection.startY);
    
    ctx.strokeRect(x, y, width, height);
    
    ctx.fillStyle = 'rgba(255, 196, 112, 0.1)';
    ctx.fillRect(x, y, width, height);
  }, [selection, isModalOpen]);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-[120px] right-[30px] w-16 h-16 z-50 flex items-center justify-center"
      >
        <Image
          src="/Group 1000004610.png"
          alt="Crop Tool"
          width={64}
          height={64}
          className="p-2"
        />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-[430px] h-screen max-h-[932px]">
            <div 
              ref={containerRef}
              className="relative w-full h-full cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <Image
                src="/iPhone 14 & 15 Pro Max - 3.png"
                alt="Screenshot Target"
                fill
                className="object-contain select-none"
                priority
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                style={{ width: '100%', height: '100%' }}
              />
              
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded-lg z-10">
                <p className="text-sm">Drag to select area for screenshot</p>
              </div>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelection(null);
                }}
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl bg-black/50 w-10 h-10 rounded-full flex items-center justify-center z-10"
              >
                ×
              </button>

              {selection && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                  <button
                    onClick={() => setSelection(null)}
                    className="px-6 py-2 bg-white/20 backdrop-blur text-white border border-white/30 rounded-lg hover:bg-white/30"
                  >
                    Reselect
                  </button>
                  <button
                    onClick={handleCrop}
                    className="px-6 py-2 bg-[#FFC470] text-white rounded-lg hover:bg-[#FFB347]"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <AnalysisModal 
        isOpen={isAnalysisModalOpen}
        onClose={() => {
          setIsAnalysisModalOpen(false);
          // Clean up the blob URL when closing
          if (screenshotUrl) {
            URL.revokeObjectURL(screenshotUrl);
            setScreenshotUrl(null);
          }
        }}
        onGoToPersonalAnalysis={() => {
          setIsAnalysisModalOpen(false);
          setIsPersonalAnalysisOpen(true);
        }}
        screenshotUrl={screenshotUrl}
      />
      
      <PersonalAnalysis
        isOpen={isPersonalAnalysisOpen}
        onClose={() => {
          setIsPersonalAnalysisOpen(false);
          // Clean up the blob URL when closing
          if (screenshotUrl) {
            URL.revokeObjectURL(screenshotUrl);
            setScreenshotUrl(null);
          }
        }}
        onStoreInDatabase={() => {
          setIsPersonalAnalysisOpen(false);
          // Navigate to database - need to call parent function
          if (onScreenshotTaken) {
            // Trigger database navigation through parent
            window.dispatchEvent(new CustomEvent('navigateToDatabase'));
          }
        }}
        screenshotUrl={screenshotUrl}
      />
    </>
  );
}