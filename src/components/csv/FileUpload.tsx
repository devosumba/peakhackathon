import { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function FileUpload({ onFileSelect, isLoading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const csvFile = files.find((file) => file.name.endsWith('.csv'));

      if (csvFile) {
        setSelectedFile(csvFile);
        onFileSelect(csvFile);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.name.endsWith('.csv')) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleClear = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <Card
      className={`border-2 border-dashed transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-12 text-center">
        {!selectedFile ? (
          <>
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload CSV File</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your CSV file here, or click to browse
            </p>
            <label htmlFor="file-upload">
              <Button variant="default" asChild>
                <span className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  Choose File
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
              disabled={isLoading}
            />
          </>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <FileText className="h-8 w-8 text-success" />
            <div className="flex-1 text-left">
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClear} disabled={isLoading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
