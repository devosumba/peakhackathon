import { useState } from 'react';
import { useCsvData } from '@/hooks/useCsvData';
import { FileUpload } from '@/components/csv/FileUpload';
import { ColumnMapper } from '@/components/csv/ColumnMapper';
import { DataTable } from '@/components/csv/DataTable';
import { SummaryDashboard } from '@/components/csv/SummaryDashboard';
import { BalanceAnalysis } from '@/components/csv/BalanceAnalysis';
import { SmartSuggestions } from '@/components/csv/SmartSuggestions';
import { ExportActions } from '@/components/csv/ExportActions';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Database, ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const {
    rows,
    headers,
    columnMapping,
    filterMode,
    sortBy,
    sortDirection,
    canUndo,
    loadCSV,
    updateColumnMapping,
    updateRow,
    deleteRow,
    setFilterMode,
    setSortBy,
    applyAutoFix,
    removeAllDuplicates,
    undo,
    getFilteredRows,
  } = useCsvData();

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    try {
      const result = await loadCSV(file);
      if (result.success) {
        toast.success(`Loaded ${result.rowCount} rows successfully`);
        setCurrentStep(2);
      } else {
        toast.error('Failed to load CSV: ' + result.error);
      }
    } catch (error) {
      toast.error('Failed to load CSV file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingComplete = () => {
    if (columnMapping.phone && columnMapping.bundle) {
      setCurrentStep(3);
      toast.success('Column mapping complete');
    } else {
      toast.error('Please map required columns (Phone and Bundle)');
    }
  };

  const filteredRows = getFilteredRows();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3 justify-center w-full">
            <img
              src="/logo1.svg"
              alt="Smart CSV Data Cleaner logo"
              className="h-[32px] w-auto object-contain"
              decoding="async"
            />
            <div>
              <h1 className="text-2xl font-bold">Smart CSV Data Cleaner</h1>
              <p className="text-sm text-muted-foreground">
                Peak Mobile Hackathon - Bundle Allocation Tool
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <StepIndicator number={1} label="Upload CSV" active={currentStep >= 1} completed={currentStep > 1} />
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <StepIndicator number={2} label="Map Columns" active={currentStep >= 2} completed={currentStep > 2} />
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <StepIndicator number={3} label="Review & Export" active={currentStep >= 3} completed={false} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
          </div>
        )}

        {currentStep === 2 && headers.length > 0 && (
          <div className="max-w-2xl mx-auto space-y-4">
            <ColumnMapper
              headers={headers}
              mapping={columnMapping}
              onMappingChange={updateColumnMapping}
            />
            <button
              onClick={handleMappingComplete}
              className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Continue to Review
            </button>
          </div>
        )}

        {currentStep === 3 && rows.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Table */}
            <div className="lg:col-span-2 space-y-6">
              <DataTable
                rows={filteredRows}
                filterMode={filterMode}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onFilterChange={setFilterMode}
                onSortChange={setSortBy}
                onRowUpdate={updateRow}
                onRowDelete={deleteRow}
              />
              {/* Smart Suggestions below the main table */}
              <div className="mt-4">
                <SmartSuggestions
                  rows={rows}
                  onApplyFix={applyAutoFix}
                  onUndo={undo}
                  canUndo={canUndo}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <SummaryDashboard rows={rows} />
                <BalanceAnalysis rows={rows} />
                <ExportActions rows={rows} onRemoveDuplicates={removeAllDuplicates} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Step indicator component
function StepIndicator({ number, label, active, completed }: { 
  number: number; 
  label: string; 
  active: boolean; 
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm
          ${completed ? 'bg-success text-success-foreground' : ''}
          ${active && !completed ? 'bg-primary text-primary-foreground' : ''}
          ${!active && !completed ? 'bg-muted text-muted-foreground' : ''}
        `}
      >
        {completed ? <CheckCircle className="h-5 w-5" /> : number}
      </div>
      <span className={`text-sm font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
        {label}
      </span>
    </div>
  );
}

export default Index;
