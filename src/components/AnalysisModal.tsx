'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenshotUrl: string | null;
  onGoToPersonalAnalysis: () => void;
}

export default function AnalysisModal({ isOpen, onClose, screenshotUrl, onGoToPersonalAnalysis }: AnalysisModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal container aligned with main image */}
      <div className="relative w-full max-w-[430px] h-screen max-h-[932px] flex items-end pointer-events-none">
        <div className="relative w-full bg-white rounded-t-[30px] max-h-[85%] overflow-y-auto animate-slide-up pointer-events-auto">
          <div className="relative">
            {/* Header with white background */}
            <div className="bg-white px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-black">Chart Analysis</h2>
                <button className="bg-[#FFC470] text-white px-4 py-2 rounded-full font-semibold text-xs flex items-center gap-1.5">
                  AI generate ChartAnalysis
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4L10 8L6 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-[#FFC470] rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-600 text-lg animate-pulse">AI Analyzing...</p>
              </div>
            ) : (
              <div className="px-6 py-6">
                {/* Target Chart Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-[#FFC470] mb-4 flex items-center">
                    <div className="w-6 h-6 bg-[#FFC470] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-normal">i</span>
                    </div>
                    <span className="ml-2">Target Chart</span>
                  </h3>
                  {screenshotUrl && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={screenshotUrl}
                        alt="Screenshot"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Price Action Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-[#FFC470] mb-4 flex items-center">
                    <div className="w-6 h-6 bg-[#FFC470] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-normal">i</span>
                    </div>
                    <span className="ml-2">Price Action</span>
                  </h3>
                  <p className="text-gray-700 text-sm leading-6">
                    The inverted V-shape indicates a potential price reversal.
                  </p>
                </div>

                {/* Investment Signal Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-[#FFC470] mb-4 flex items-center">
                    <div className="w-6 h-6 bg-[#FFC470] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-normal">i</span>
                    </div>
                    <span className="ml-2">Investment Signal</span>
                  </h3>
                  <p className="text-gray-700 text-sm leading-6">
                    The inverted V-shape is a reversal signal, suitable for selling or taking profits, with caution due to the risk of overbought conditions.
                  </p>
                </div>

                {/* Strategic Recommendations Section */}
                <div className="mb-8">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#FFC470] flex items-center">
                      <div className="w-6 h-6 bg-[#FFC470] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-normal">i</span>
                      </div>
                      <span className="ml-2">Strategic Recommendations</span>
                    </h3>
                    <button className="bg-[#EE896B] text-black px-4 py-1 rounded-full text-xs font-medium">
                      Learn Technical Indicators
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-6">
                    RSI, MACD, Bollinger Bands, and volume can all help confirm the validity of the inverted V-shape reversal, assisting investors in making informed decisions.
                  </p>
                </div>

                {/* Bottom Button */}
                <button 
                  onClick={onGoToPersonalAnalysis}
                  className="w-full bg-[#FFC470] text-white py-4 rounded-full font-semibold text-lg"
                >
                  Go to Personal Analysis
                </button>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-6 text-gray-400 hover:text-gray-600 text-2xl z-10"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}