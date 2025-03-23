
import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Maximize,
  Minimize,
  Search
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PDFControlsProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  isFullscreen: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onToggleFullscreen: () => void;
  onSearch: () => void;
}

const PDFControls: React.FC<PDFControlsProps> = ({
  currentPage,
  totalPages,
  zoom,
  isFullscreen,
  onPreviousPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onRotate,
  onToggleFullscreen,
  onSearch,
}) => {
  return (
    <div className="pdf-controls">
      <TooltipProvider>
        <div className="flex items-center gap-2 mr-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="control-button" 
                onClick={onPreviousPage}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className={`w-5 h-5 ${currentPage <= 1 ? 'text-muted-foreground' : 'text-primary'}`} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Previous page</TooltipContent>
          </Tooltip>
          
          <div className="text-sm font-medium px-2">
            {currentPage} / {totalPages}
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="control-button" 
                onClick={onNextPage}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className={`w-5 h-5 ${currentPage >= totalPages ? 'text-muted-foreground' : 'text-primary'}`} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Next page</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="h-8 w-px bg-border mx-2"></div>
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="control-button" onClick={onZoomOut} disabled={zoom <= 0.5}>
                <ZoomOut className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Zoom out</TooltipContent>
          </Tooltip>
          
          <div className="text-sm font-medium px-2">
            {Math.round(zoom * 100)}%
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="control-button" onClick={onZoomIn} disabled={zoom >= 2}>
                <ZoomIn className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Zoom in</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="h-8 w-px bg-border mx-2"></div>
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="control-button" onClick={onRotate}>
                <RotateCw className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Rotate</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="control-button" onClick={onToggleFullscreen}>
                {isFullscreen ? 
                  <Minimize className="w-5 h-5" /> : 
                  <Maximize className="w-5 h-5" />
                }
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="control-button" onClick={onSearch}>
                <Search className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default PDFControls;
