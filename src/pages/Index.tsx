
import React, { useState, useEffect } from 'react';
import { streamPDF, applySecurityMeasures } from '@/services/pdfService';
import LoadingState from '@/components/LoadingState';
import { RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        // Apply security measures
        applySecurityMeasures();
        
        // Get the PDF blob
        const blob = await streamPDF();
        
        // Create a URL from the blob
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Failed to load PDF:', error);
        toast({
          title: "Error",
          description: "Failed to load PDF. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPDF();
    
    // Clean up the URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, []);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Loading PDF document..." />
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium mb-2">PDF Not Available</h1>
          <p className="text-muted-foreground">
            The PDF could not be loaded. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pdf-container flex flex-col">
      {/* Simple controls */}
      <div className="p-4 flex justify-center gap-4 bg-background/80 backdrop-blur-sm fixed top-0 left-0 w-full z-10">
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-full bg-background hover:bg-muted transition"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <span className="flex items-center px-2">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-full bg-background hover:bg-muted transition"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleRotate}
          className="p-2 rounded-full bg-background hover:bg-muted transition"
          aria-label="Rotate"
        >
          <RotateCw className="w-5 h-5" />
        </button>
      </div>

      {/* PDF display */}
      <div className="flex-1 flex items-center justify-center mt-16">
        <div 
          className="max-w-full max-h-full transition-all duration-300"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
          }}
        >
          <iframe 
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-screen h-screen border-none"
            title="PDF Viewer"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
