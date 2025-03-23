
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { streamPDFPage, applySecurityMeasures } from '@/services/pdfService';
import LoadingState from './LoadingState';
import PDFControls from './PDFControls';
import PDFThumbnails from './PDFThumbnails';
import { toast } from '@/components/ui/use-toast';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface PDFViewerProps {
  documentId: string;
  title: string;
  pageCount: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ documentId, title, pageCount }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageBlobs, setPageBlobs] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to handle page changes with preloading
  const changePage = useCallback(async (newPage: number) => {
    if (newPage < 1 || newPage > pageCount) return;
    
    setCurrentPage(newPage);
    setLoading(true);
    
    try {
      // Check if we already have this page cached
      if (!pageBlobs.has(newPage)) {
        const blob = await streamPDFPage(documentId, newPage);
        const url = URL.createObjectURL(blob);
        setPageBlobs(prev => new Map(prev).set(newPage, url));
      }
      
      // Preload adjacent pages
      const pagesToPreload = [newPage - 1, newPage + 1].filter(p => p > 0 && p <= pageCount && !pageBlobs.has(p));
      
      for (const page of pagesToPreload) {
        streamPDFPage(documentId, page).then(blob => {
          const url = URL.createObjectURL(blob);
          setPageBlobs(prev => new Map(prev).set(page, url));
        });
      }
    } catch (error) {
      console.error('Error loading page:', error);
      toast({
        title: "Error",
        description: "Failed to load page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [documentId, pageBlobs, pageCount]);

  // Initial page load and security setup
  useEffect(() => {
    applySecurityMeasures();
    changePage(1);
    
    // Clean up blob URLs on unmount
    return () => {
      pageBlobs.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  // Handle rotation
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          changePage(currentPage - 1);
          break;
        case 'ArrowRight':
          changePage(currentPage + 1);
          break;
        case 'ArrowUp':
          changePage(currentPage - 1);
          break;
        case 'ArrowDown':
          changePage(currentPage + 1);
          break;
        case '+':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case 'f':
          toggleFullscreen();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, changePage]);

  // Mock search function for demo
  const handleSearch = () => {
    toast({
      title: "Search",
      description: "Search functionality will be implemented in a future version.",
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="pdf-container prevent-select"
      style={{
        perspective: '1000px'
      }}
    >
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>

      <div 
        className="relative w-full max-w-3xl mx-auto"
        style={{
          transform: `scale(${zoom}) rotate(${rotation}deg)`,
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        {loading ? (
          <LoadingState message={`Loading page ${currentPage}...`} />
        ) : (
          <img 
            src={pageBlobs.get(currentPage) || ''}
            alt={`Page ${currentPage}`}
            className="pdf-page w-full h-auto prevent-select"
            style={{
              boxShadow: '0 4px 25px rgba(0, 0, 0, 0.05), 0 1px 5px rgba(0, 0, 0, 0.1)',
              transformStyle: 'preserve-3d',
              animation: 'fade-in 0.3s ease-out'
            }}
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        )}
      </div>
      
      {/* Page navigation buttons for mobile */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-40 md:hidden">
        <button 
          className="control-button"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <div className="text-sm font-medium text-center bg-white/80 py-1 px-2 rounded">
          {currentPage}
        </div>
        <button 
          className="control-button"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage >= pageCount}
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
      
      {/* Thumbnails navigation */}
      <div className="hidden md:block">
        <PDFThumbnails 
          documentId={documentId}
          pageCount={pageCount}
          currentPage={currentPage}
          onPageSelect={changePage}
        />
      </div>
      
      {/* Controls */}
      <PDFControls 
        currentPage={currentPage}
        totalPages={pageCount}
        zoom={zoom}
        isFullscreen={isFullscreen}
        onPreviousPage={() => changePage(currentPage - 1)}
        onNextPage={() => changePage(currentPage + 1)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRotate={handleRotate}
        onToggleFullscreen={toggleFullscreen}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default PDFViewer;
