'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Node {
  id: string;
  x: number;
  y: number;
  type: 'screenshot' | 'trend' | 'terminology' | 'personal' | 'relation' | 'userNotes';
  label: string;
  color: string;
  imageUrl?: string;
}

interface DatabaseProps {
  isOpen: boolean;
  onClose: () => void;
  screenshotUrl: string | null;
}

export default function Database({ isOpen, onClose, screenshotUrl }: DatabaseProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      console.log('Database opened with screenshot URL:', screenshotUrl);
      // Initialize nodes when database opens
      const initialNodes: Node[] = [
        {
          id: 'screenshot',
          x: 200,
          y: 200,
          type: 'screenshot',
          label: 'Chart',
          color: '#FF7F50',
          imageUrl: screenshotUrl || undefined
        },
        {
          id: 'trend1',
          x: 100,
          y: 350,
          type: 'trend',
          label: 'Trend Analysis',
          color: '#FF7F50'
        },
        {
          id: 'terminology1',
          x: 300,
          y: 350,
          type: 'terminology',
          label: 'Terminology',
          color: '#FF7F50'
        },
        {
          id: 'personal1',
          x: 350,
          y: 100,
          type: 'personal',
          label: 'Investment Signal',
          color: '#FFB6C1'
        },
        {
          id: 'personal2',
          x: 350,
          y: 450,
          type: 'personal',
          label: 'Strategic Recommendations',
          color: '#FFB6C1'
        },
        {
          id: 'relation',
          x: 80,
          y: 150,
          type: 'relation',
          label: 'Relation',
          color: '#4ECDC4'
        },
        {
          id: 'userNotes',
          x: 320,
          y: 50,
          type: 'userNotes',
          label: 'User Notes',
          color: '#2ECC71'
        }
      ];
      setNodes(initialNodes);
    }
  }, [isOpen, screenshotUrl]);

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDraggingNode(nodeId);
    setOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - offset.x;
    const newY = e.clientY - rect.top - offset.y;

    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === draggingNode
          ? { ...node, x: newX, y: newY }
          : node
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black">
      <div className="relative w-full max-w-[430px] h-screen max-h-[932px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/iPhone 14 & 15 Pro Max - 13.png"
            alt="Database Background"
            fill
            className="object-cover"
          />
          {/* Dark overlay mask */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* White Canvas Overlay */}
        <div className="absolute inset-4 bottom-20 bg-white/95 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="relative z-10 p-4 flex items-center justify-between border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Chart Analysis Database</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Draggable Canvas */}
          <div
            ref={canvasRef}
            className="relative flex-1 h-[calc(100%-140px)] overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Render connections */}
            <svg className="absolute inset-0 pointer-events-none">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3, 0 6"
                    fill="#3B82F6"
                  />
                </marker>
              </defs>
              {nodes.map((node) => {
                // Draw connections based on node relationships
                if (node.id !== 'screenshot') {
                  const screenshotNode = nodes.find(n => n.id === 'screenshot');
                  if (screenshotNode) {
                    // Calculate direction for arrow
                    const dx = screenshotNode.x - node.x;
                    const dy = screenshotNode.y - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const offsetX = (dx / distance) * 48; // Half of screenshot node size (96px/2)
                    const offsetY = (dy / distance) * 48;
                    
                    return (
                      <g key={`line-${node.id}`}>
                        <line
                          x1={node.x}
                          y1={node.y}
                          x2={screenshotNode.x - offsetX}
                          y2={screenshotNode.y - offsetY}
                          stroke="#3B82F6"
                          strokeWidth="2"
                          strokeOpacity="0.5"
                          markerEnd="url(#arrowhead)"
                        />
                        {/* Add labels on connections */}
                        {node.type === 'trend' && (
                          <text
                            x={(node.x + screenshotNode.x) / 2}
                            y={(node.y + screenshotNode.y) / 2 - 5}
                            fill="#3B82F6"
                            fontSize="10"
                            textAnchor="middle"
                          >
                            HAS_PATTERN
                          </text>
                        )}
                      </g>
                    );
                  }
                }
                return null;
              })}
            </svg>

            {/* Render nodes */}
            {nodes.map(node => (
              <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move select-none"
                style={{
                  left: node.x,
                  top: node.y,
                }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
              >
                {node.type === 'screenshot' && node.imageUrl ? (
                  <div
                    className="relative w-24 h-24 rounded-full shadow-lg flex items-center justify-center overflow-hidden transition-transform hover:scale-110 border-4 bg-white"
                    style={{ borderColor: node.color }}
                  >
                    <div className="relative w-full h-full p-1">
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <Image
                          src={node.imageUrl}
                          alt={node.label}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 px-6 py-3 min-w-[80px]"
                    style={{ 
                      backgroundColor: node.color,
                    }}
                  >
                    <span className="text-white text-sm font-semibold text-center whitespace-nowrap">
                      {node.label}
                    </span>
                  </div>
                )}
                {/* Connection dot */}
                <div className="absolute top-1/2 left-full w-2 h-2 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2" />
              </div>
            ))}

            {/* Add new connection button */}
            <button className="absolute bottom-4 right-4 bg-[#FFC470] text-white p-3 rounded-full shadow-lg hover:bg-[#FFB347] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex items-center justify-around py-2">
            <button className="flex flex-col items-center p-2 text-gray-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 19V20H15V19M12 2L2 7V11C2 16.5 6 21.2 12 22C18 21.2 22 16.5 22 11V7L12 2Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="text-xs mt-1">Asking</span>
            </button>
            <button className="flex flex-col items-center p-2 text-gray-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="text-xs mt-1">Dashboard</span>
            </button>
            <button className="flex flex-col items-center p-2 text-gray-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H7L10 20L14 4L17 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs mt-1">Analysis</span>
            </button>
            <button className="flex flex-col items-center p-2 text-[#FFC470]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 4C16.4 4 20 7.6 20 12C20 16.4 16.4 20 12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4ZM8 8V16H16V8H8ZM10 10H14V14H10V10Z"/>
              </svg>
              <span className="text-xs mt-1">Database</span>
            </button>
            <button className="flex flex-col items-center p-2 text-gray-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M19.4 15C19.2 15.4 19.1 15.8 19.1 16.2L21 17.5L19.5 20L17.2 19.2C16.7 19.7 16.2 20 15.6 20.3L15.2 22.7H12.2L11.8 20.3C11.2 20 10.7 19.7 10.2 19.2L7.9 20L6.4 17.5L8.3 16.2C8.3 15.8 8.2 15.4 8 15C8.2 14.6 8.3 14.2 8.3 13.8L6.4 12.5L7.9 10L10.2 10.8C10.7 10.3 11.2 10 11.8 9.7L12.2 7.3H15.2L15.6 9.7C16.2 10 16.7 10.3 17.2 10.8L19.5 10L21 12.5L19.1 13.8C19.1 14.2 19.2 14.6 19.4 15Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="text-xs mt-1">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}