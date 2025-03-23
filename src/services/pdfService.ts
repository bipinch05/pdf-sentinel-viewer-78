/**
 * Service to handle PDF streaming and security
 */

// The provided PDF link for our demo - using a public PDF that's CORS-friendly
const DEMO_PDF_URL = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

/**
 * Stream the demo PDF as a blob
 */
export const streamPDF = async (): Promise<Blob> => {
  try {
    // Direct fetch from a CORS-friendly source
    const response = await fetch(DEMO_PDF_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error fetching PDF:', error);
    // Return an empty blob on error
    return new Blob([], { type: 'application/pdf' });
  }
};

/**
 * Stream a specific page of the PDF
 * For the demo, this just returns the whole PDF as we're not using PDF.js to split pages
 */
export const streamPDFPage = async (documentId: string, pageNumber: number): Promise<Blob> => {
  console.log(`Streaming page ${pageNumber} of document ${documentId}`);
  // In a real app, we would extract just the requested page
  // For the demo, we'll return the whole PDF
  return await streamPDF();
};

/**
 * Get a thumbnail for a PDF page
 * For the demo, this returns a placeholder image
 */
export const getPDFThumbnail = async (documentId: string, pageNumber: number): Promise<string> => {
  console.log(`Getting thumbnail for page ${pageNumber} of document ${documentId}`);
  // In a real app, we would generate thumbnails from the PDF
  // For the demo, we'll return a placeholder
  return `https://via.placeholder.com/100x140?text=Page+${pageNumber}`;
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
