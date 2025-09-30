'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PersonalAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
  screenshotUrl: string | null;
}

interface AnalysisSection {
  title: string;
  fields: {
    label: string;
    placeholder: string;
  }[];
}

const analysisSections: AnalysisSection[] = [
  {
    title: 'Investment Prediction',
    fields: [
      { label: 'Prediction', placeholder: 'Bearish' },
      { label: 'Price Target', placeholder: '$160 (down from $184.25)' },
      { label: 'Timeframe', placeholder: 'Short-term (1-2 week)' },
      { label: 'Reasoning Behind Prediction', placeholder: 'The inverted V-shape indicates a potential reversal. RSI is above 70 (overbought), and MACD shows signs of divergence.' }
    ]
  },
  {
    title: 'Retrospective Analysis',
    fields: [
      { label: 'Outcome', placeholder: '73% (the price declined)' },
      { label: 'What went Wrong', placeholder: 'No significant error was noted, but external market news might have caused a slight delay in the expected time.' },
      { label: 'Indicator Accuracy', placeholder: 'RSI and MACD proved useful, though volume was not as voluminous as expected.' },
      { label: 'Changes for Next Time', placeholder: 'Watch for volume changes more closely.' }
    ]
  },
  {
    title: 'Psychological Mindset',
    fields: [
      { label: 'Initial Thoughts', placeholder: 'Cautious optimism mixed with some skepticism about the sudden inverted V reversal.' },
      { label: 'Market Influence', placeholder: 'The broader bull market made me second-guess the reversal, but the sharp peak was hard to ignore.' },
      { label: 'Psychology Bias', placeholder: 'The inverted V-shape indicates a potential reversal. RSI is above 70 (overbought), and MACD shows signs of divergence.' },
      { label: 'Reasoning Behind Prediction', placeholder: 'Loss of leaving too soon meant I held the binary medium so sell. Despite the technical card.' }
    ]
  },
  {
    title: 'Historical Comparison',
    fields: [
      { label: 'Previous Encounter', placeholder: 'I saw a similar inverted V pattern in early 2023, which also followed by a major price drop.' },
      { label: 'Outcome', placeholder: 'The market reversed as expected after the inverted peak.' },
      { label: 'Lessons Learned', placeholder: 'I need to trust the technical signals more and not get swayed by general market sentiment.' }
    ]
  },
  {
    title: 'Future Strategy',
    fields: [
      { label: 'Future Approach', placeholder: 'I\'ll wait for confirmation of the reversal (e.g., MACD cross, volume picks) before committing too hard.' },
      { label: 'What Would I Do Differently', placeholder: 'I will focus more on volume and price action around key levels, and not hesitate to exit early if conditions change.' }
    ]
  }
];

export default function PersonalAnalysis({ isOpen, onClose, screenshotUrl }: PersonalAnalysisProps) {
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>('Investment Prediction');

  if (!isOpen) return null;

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSection(expandedSection === sectionTitle ? null : sectionTitle);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-100">
      <div className="relative w-full max-w-[430px] h-screen max-h-[932px] bg-white flex flex-col">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <button onClick={onClose} className="text-gray-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-black">Personal Analysis</h1>
          <div className="w-6"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-6">
          {/* Title Section */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Chart Analysis</h2>
            <p className="text-lg text-gray-700">for Individuals</p>
          </div>

          {/* Chart Preview */}
          {screenshotUrl && (
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-32 rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50 shadow-sm">
                <Image
                  src={screenshotUrl}
                  alt="Chart preview"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Analysis Sections */}
          <div className="space-y-4 mb-8">
            {analysisSections.map((section) => (
              <div key={section.title} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{section.title}</span>
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 20 20" 
                    fill="none"
                    className={`transform transition-transform ${expandedSection === section.title ? 'rotate-180' : ''}`}
                  >
                    <path d="M5 7L10 12L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {expandedSection === section.title && (
                  <div className="p-4 space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.label}>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          {field.label}
                        </label>
                        <textarea
                          placeholder={field.placeholder}
                          value={formData[section.title]?.[field.label] || ''}
                          onChange={(e) => handleInputChange(section.title, field.label, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC470] focus:border-transparent resize-none bg-white hover:border-gray-400 transition-colors min-h-[40px]"
                          rows={
                            field.label.includes('Reasoning') || 
                            field.label.includes('Thoughts') || 
                            field.label.includes('Wrong') ||
                            field.label.includes('Influence') ||
                            field.label.includes('Learned') ||
                            field.label.includes('Differently') ? 4 : 
                            field.label.includes('Bias') || 
                            field.label.includes('Approach') ? 3 : 2
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Create New Item Button */}
          <button className="w-full py-3 border-2 border-[#FFC470] text-[#FFC470] rounded-lg font-semibold mb-4 hover:bg-[#FFC470] hover:text-white transition-colors">
            create new item
          </button>

          {/* Store In Database Button */}
          <button className="w-full py-4 bg-[#4CAF50] text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#45a049] transition-colors">
            Store In Database
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 10L10 10M10 10L13 10M10 10L10 7M10 10L10 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5 17L15 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}