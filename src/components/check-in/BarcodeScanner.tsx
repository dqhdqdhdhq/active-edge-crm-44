
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Barcode, QrCode, Camera, X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (value: string) => void;
}

export const BarcodeScanner = ({ onScan }: BarcodeScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scanType, setScanType] = useState<'barcode' | 'qrcode'>('barcode');
  const [mockScanValues, setMockScanValues] = useState({
    barcode: 'MEM-1001',
    qrcode: 'MEM-1002',
  });
  
  // This is a mock implementation since we can't access real camera/scanner
  const handleMockScan = () => {
    const value = scanType === 'barcode' ? mockScanValues.barcode : mockScanValues.qrcode;
    onScan(value);
    setIsOpen(false);
  };
  
  return (
    <>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => {
            setScanType('barcode');
            setIsOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Barcode className="h-4 w-4" />
          Scan Barcode
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => {
            setScanType('qrcode');
            setIsOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <QrCode className="h-4 w-4" />
          Scan QR Code
        </Button>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {scanType === 'barcode' ? 'Scan Barcode' : 'Scan QR Code'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-md h-64 w-full flex items-center justify-center bg-muted/30">
              {scanType === 'barcode' ? (
                <Barcode className="h-16 w-16 text-muted-foreground" />
              ) : (
                <QrCode className="h-16 w-16 text-muted-foreground" />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-1 bg-red-500 opacity-50 animate-pulse" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Position the {scanType === 'barcode' ? 'barcode' : 'QR code'} in the center of the screen
            </p>
            
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setIsOpen(false)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleMockScan}
              >
                <Camera className="mr-2 h-4 w-4" />
                Mock Scan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
