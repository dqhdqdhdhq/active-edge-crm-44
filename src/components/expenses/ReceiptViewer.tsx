
import { EyeIcon, Download, X } from 'lucide-react';
import { Receipt } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface ReceiptViewerProps {
  receipts: Receipt[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceiptViewer({ receipts, isOpen, onOpenChange }: ReceiptViewerProps) {
  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  const isPdfFile = (fileType: string) => {
    return fileType === 'application/pdf';
  };

  const handleDownload = (receipt: Receipt) => {
    // In a real app, this would download the file using the URL
    // For demo purposes, we're just showing a mock download action
    alert(`Downloading: ${receipt.fileName}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Receipt Viewer</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-2">
          {receipts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No receipts attached to this expense.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {receipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="border rounded-md overflow-hidden flex flex-col"
                >
                  <div className="p-2 bg-muted flex items-center justify-between text-sm">
                    <div className="truncate flex-1" title={receipt.fileName}>
                      {receipt.fileName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDownload(receipt)}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center p-4 bg-accent/10">
                    {isImageFile(receipt.fileType) ? (
                      <img
                        src={receipt.fileUrl}
                        alt={receipt.fileName}
                        className="max-h-60 object-contain"
                      />
                    ) : isPdfFile(receipt.fileType) ? (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-2"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span>PDF Document</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => window.open(receipt.fileUrl, '_blank')}
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View PDF
                        </Button>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-center">
                        File preview not available
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
