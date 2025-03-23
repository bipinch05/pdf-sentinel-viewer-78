
/**
 * Service to handle PDF streaming and security
 */

// The provided PDF link for our demo
const DEMO_PDF_URL = "https://morth.nic.in/sites/default/files/dd12-13_0.pdf";

// We're using a mock API endpoint for now
const API_BASE_URL = '/api/pdf';

export interface PDFDocument {
  id: string;
  title: string;
  pageCount: number;
  sourceUrl?: string;
}

/**
 * Get a list of available PDF documents
 */
export const getAvailablePDFs = async (): Promise<PDFDocument[]> => {
  // In a real implementation, this would fetch from your backend
  return [
    { 
      id: '1', 
      title: 'Ministry of Road Transport Demo', 
      pageCount: 5, 
      sourceUrl: DEMO_PDF_URL 
    },
    { id: '2', title: 'Confidential Report', pageCount: 12 },
    { id: '3', title: 'User Manual', pageCount: 24 },
  ];
};

/**
 * Stream a PDF page as a blob
 * Using page-by-page streaming for better security
 */
export const streamPDFPage = async (documentId: string, pageNumber: number): Promise<Blob> => {
  // For our demo document (id: '1'), we'll use the actual PDF
  if (documentId === '1') {
    try {
      // Using a CORS proxy would be better in a real implementation
      // This is just for demo purposes
      const response = await fetch(DEMO_PDF_URL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }
      
      // In a real implementation, you would stream individual pages
      // For the demo, we're just returning the whole PDF as a blob
      // A proper backend would extract and serve individual pages
      return await response.blob();
    } catch (error) {
      console.error('Error fetching PDF:', error);
      // Fall back to placeholder on error
      return fetchPlaceholder();
    }
  }
  
  // For other documents, we'll use our original mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      fetch(`${API_BASE_URL}/${documentId}/page/${pageNumber}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch PDF page');
          }
          return response.blob();
        })
        .then(blob => resolve(blob))
        .catch(() => {
          // Resolve with a placeholder image
          fetchPlaceholder().then(blob => resolve(blob));
        });
    }, 500); // Simulate network delay
  });
};

/**
 * Helper function to fetch a placeholder image
 */
const fetchPlaceholder = async (): Promise<Blob> => {
  const response = await fetch('/placeholder.svg');
  return await response.blob();
};

/**
 * Get a thumbnail for a PDF page
 */
export const getPDFThumbnail = async (documentId: string, pageNumber: number): Promise<string> => {
  // In a real implementation, this would fetch thumbnails from your backend
  // For now, we'll return a placeholder
  if (documentId === '1') {
    // Generate a different color for each thumbnail to make them distinguishable
    const hue = (pageNumber * 30) % 360;
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='160' viewBox='0 0 120 160'%3E%3Crect width='120' height='160' fill='hsl(${hue}, 70%25, 80%25)' /%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23555'%3EPage ${pageNumber}%3C/text%3E%3C/svg%3E`;
  }
  
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
