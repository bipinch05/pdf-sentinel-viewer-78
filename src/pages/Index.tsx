
import React, { useState, useEffect } from 'react';
import { getAvailablePDFs, PDFDocument } from '@/services/pdfService';
import PDFViewer from '@/components/PDFViewer';
import LoadingState from '@/components/LoadingState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const Index = () => {
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<PDFDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const pdfs = await getAvailablePDFs();
        setDocuments(pdfs);
      } catch (error) {
        console.error('Failed to load PDFs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDocuments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Loading available documents..." />
      </div>
    );
  }

  // Show document selection if no document is selected
  if (!selectedDocument) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-10 animate-slide-down">
            <h1 className="text-3xl font-bold mb-2">Secure PDF Viewer</h1>
            <p className="text-muted-foreground">
              Select a document to view in our secure PDF viewer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {documents.map((doc, index) => (
              <Card 
                key={doc.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-border/50"
                onClick={() => setSelectedDocument(doc)}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <CardContent className="p-0">
                  <div className="bg-muted p-4 flex justify-between items-center">
                    <div>
                      <h2 className="font-medium text-lg">{doc.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {doc.pageCount} {doc.pageCount === 1 ? 'page' : 'pages'}
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" className="rounded-full">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <div className="h-32 bg-secondary/50 rounded flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">Preview not available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show PDF viewer when a document is selected
  return (
    <div className="min-h-screen bg-background">
      <div className="relative w-full">
        <div className="fixed top-4 left-4 z-50">
          <Button 
            variant="outline" 
            onClick={() => setSelectedDocument(null)}
            className="glassmorphism hover:bg-white/90"
          >
            Back to Documents
          </Button>
        </div>
        
        <PDFViewer 
          documentId={selectedDocument.id}
          title={selectedDocument.title}
          pageCount={selectedDocument.pageCount}
        />
      </div>
    </div>
  );
};

export default Index;
