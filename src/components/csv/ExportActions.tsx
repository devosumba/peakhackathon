import { Row } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Send, Trash2 } from 'lucide-react';
import { exportToCSV } from '@/utils/csv';
import { toast } from 'sonner';

interface ExportActionsProps {
  rows: Row[];
  onRemoveDuplicates: () => void;
}

export function ExportActions({ rows, onRemoveDuplicates }: ExportActionsProps) {
  const validRows = rows.filter((row) => row.errors.length === 0);
  const duplicateRows = rows.filter((row) => row.isDuplicate);

  const handleExport = (validOnly: boolean) => {
    try {
      exportToCSV(rows, validOnly, `cleaned_data_${Date.now()}.csv`);
      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error('Failed to export CSV');
      console.error(error);
    }
  };

  const handleSendToAPI = () => {
    // Placeholder for API integration
    toast.info('API integration coming soon!', {
      description: `Ready to send ${validRows.length} valid rows`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export & Actions</CardTitle>
        <CardDescription>
          Download cleaned data or send to backend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          className="w-full" 
          onClick={() => handleExport(true)}
          disabled={validRows.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Valid Rows ({validRows.length})
        </Button>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => handleExport(false)}
          disabled={rows.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Download All Rows ({rows.length})
        </Button>

        {duplicateRows.length > 0 && (
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={onRemoveDuplicates}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Duplicates ({duplicateRows.length})
          </Button>
        )}

        <div className="pt-3 border-t">
          <Button 
            variant="default" 
            className="w-full bg-accent hover:bg-accent/90" 
            onClick={handleSendToAPI}
            disabled={validRows.length === 0}
          >
            <Send className="mr-2 h-4 w-4" />
            Send to Backend API
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
