
/**
 * Service to handle PDF streaming and security
 */

// We're using a mock API endpoint for now
const API_BASE_URL = '/api/pdf';

export interface PDFDocument {
  id: string;
  title: string;
  pageCount: number;
}

/**
 * Get a list of available PDF documents
 */
export const getAvailablePDFs = async (): Promise<PDFDocument[]> => {
  // In a real implementation, this would fetch from your backend
  return [
    { id: '1', title: 'Sample Document', pageCount: 5 },
    { id: '2', title: 'Confidential Report', pageCount: 12 },
    { id: '3', title: 'User Manual', pageCount: 24 },
  ];
};

/**
 * Stream a PDF page as a blob
 * Using page-by-page streaming for better security
 */
export const streamPDFPage = async (documentId: string, pageNumber: number): Promise<Blob> => {
  // In a real implementation, this would fetch from your backend with proper authentication
  // For now, we'll simulate a delay and return a placeholder
  return new Promise((resolve) => {
    setTimeout(() => {
      // This is a placeholder. In a real implementation, you'd stream the actual page
      // from your backend with proper authentication and security measures
      fetch(`${API_BASE_URL}/${documentId}/page/${pageNumber}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch PDF page');
          }
          return response.blob();
        })
        .then(blob => resolve(blob))
        .catch(() => {
          // For demo purposes, we'll resolve with a placeholder image
          // In real implementation, this would properly handle errors
          fetch('/placeholder.svg')
            .then(response => response.blob())
            .then(blob => resolve(blob));
        });
    }, 500); // Simulate network delay
  });
};

/**
 * Get a thumbnail for a PDF page
 */
export const getPDFThumbnail = async (documentId: string, pageNumber: number): Promise<string> => {
  // In a real implementation, this would fetch thumbnails from your backend
  // For now, we'll return a placeholder
  return `/placeholder.svg`;
};

/**
 * Applies security measures to the PDF viewer
 */
export const applySecurityMeasures = (): void => {
  // Disable right-click on the document
  document.addEventListener('contextmenu', (e) => {
    if (e.target instanceof HTMLElement && 
        (e.target.closest('.pdf-container') || e.target.classList.contains('pdf-page'))) {
      e.preventDefault();
      return false;
    }
  });

  // Disable keyboard shortcuts that could be used for saving
  document.addEventListener('keydown', (e) => {
    // Prevent Ctrl+S, Ctrl+P, Ctrl+Shift+S
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'S')) {
      e.preventDefault();
      return false;
    }
  });

  // Disable drag and drop for images (which could be used to save)
  document.addEventListener('dragstart', (e) => {
    if (e.target instanceof HTMLElement && 
        (e.target.closest('.pdf-container') || 
         e.target.classList.contains('pdf-page') || 
         e.target.tagName === 'IMG')) {
      e.preventDefault();
      return false;
    }
  });
};
