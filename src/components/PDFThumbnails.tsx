
import React, { useEffect, useState } from 'react';
import { getPDFThumbnail } from '@/services/pdfService';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PDFThumbnailsProps {
  documentId: string;
  pageCount: number;
  currentPage: number;
  onPageSelect: (pageNumber: number) => void;
}

const PDFThumbnails: React.FC<PDFThumbnailsProps> = ({
  documentId,
  pageCount,
  currentPage,
  onPageSelect,
}) => {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadThumbnails = async () => {
      setLoading(true);
      try {
        const thumbnailPromises = Array.from({ length: pageCount }, (_, i) => 
          getPDFThumbnail(documentId, i + 1)
        );
        const loadedThumbnails = await Promise.all(thumbnailPromises);
        setThumbnails(loadedThumbnails);
      } catch (error) {
        console.error('Failed to load thumbnails:', error);
      } finally {
        setLoading(false);
      }
    };

    loadThumbnails();
  }, [documentId, pageCount]);

  if (loading) {
    return (
      <div className="thumbnail-container">
        {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => (
          <div 
            key={i} 
            className="w-16 h-20 bg-muted rounded animate-pulse-subtle"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="thumbnail-container">
      <ScrollArea className="h-full w-full pr-2">
        <div className="flex flex-col gap-2 pb-1">
          {thumbnails.map((thumbnail, i) => (
            <div key={i} className="relative">
              <img
                src={thumbnail}
                alt={`Page ${i + 1}`}
                className={`thumbnail prevent-select ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => onPageSelect(i + 1)}
                loading="lazy"
              />
              <span className="absolute bottom-1 right-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded-sm">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PDFThumbnails;
