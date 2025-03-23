
/**
 * Service to handle PDF streaming and security
 */

// The provided PDF link for our demo
const DEMO_PDF_URL = "https://morth.nic.in/sites/default/files/dd12-13_0.pdf";

/**
 * Stream the demo PDF as a blob
 */
export const streamPDF = async (): Promise<Blob> => {
  try {
    // Using a CORS proxy would be better in a real implementation
    // For demo purposes, we'll try to fetch the PDF directly
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${DEMO_PDF_URL}`;
    
    try {
      // First try with CORS proxy
      const response = await fetch(proxyUrl);
      
      if (response.ok) {
        return await response.blob();
      }
      throw new Error('Failed to fetch with proxy');
    } catch (proxyError) {
      console.log('Proxy fetch failed, trying direct fetch');
      
      // If proxy fails, try direct fetch (may fail due to CORS)
      const directResponse = await fetch(DEMO_PDF_URL);
      
      if (!directResponse.ok) {
        throw new Error('Failed to fetch PDF directly');
      }
      
      return await directResponse.blob();
    }
  } catch (error) {
    console.error('Error fetching PDF:', error);
    // Return an empty blob on error
    return new Blob([], { type: 'application/pdf' });
  }
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
