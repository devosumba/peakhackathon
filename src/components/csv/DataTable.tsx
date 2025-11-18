import { useState } from 'react';
import { Row, FilterMode, SortDirection } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trash2, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DataTableProps {
  rows: Row[];
  filterMode: FilterMode;
  sortBy: 'bundle' | null;
  sortDirection: SortDirection;
  onFilterChange: (mode: FilterMode) => void;
  onSortChange: (by: 'bundle') => void;
  onRowUpdate: (rowId: string, field: 'phoneRaw' | 'bundleSize' | 'cost', value: any) => void;
  onRowDelete: (rowId: string) => void;
}

export function DataTable({
  rows,
  filterMode,
  sortBy,
  sortDirection,
  onFilterChange,
  onSortChange,
  onRowUpdate,
  onRowDelete,
}: DataTableProps) {
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);

  const getTelcoBadgeColor = (telco: string | undefined) => {
    switch (telco) {
      case 'Safaricom':
        return 'bg-success';
      case 'Airtel':
        return 'bg-destructive';
      case 'Telkom':
        return 'bg-warning';
      default:
        return 'bg-muted';
    }
  };

  const handleCellEdit = (rowId: string, field: 'phoneRaw' | 'bundleSize' | 'cost', value: string) => {
    if (field === 'bundleSize' || field === 'cost') {
      onRowUpdate(rowId, field, value ? parseFloat(value) : null);
    } else {
      onRowUpdate(rowId, field, value);
    }
    setEditingCell(null);
  };

  if (rows.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No data to display. Upload a CSV file to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={filterMode} onValueChange={(v) => onFilterChange(v as FilterMode)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="valid">Valid</TabsTrigger>
            <TabsTrigger value="invalid">Invalid</TabsTrigger>
            <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="text-sm text-muted-foreground">
          Showing {rows.length} row{rows.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead className="min-w-[200px]">Phone Number</TableHead>
                <TableHead className="min-w-[150px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSortChange('bundle')}
                    className="h-8 px-2"
                  >
                    Bundle Size
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="min-w-[120px]">Cost</TableHead>
                <TableHead className="min-w-[120px]">Telco</TableHead>
                <TableHead className="min-w-[200px]">Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={row.isDuplicate ? 'bg-warning/10' : undefined}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {editingCell?.rowId === row.id && editingCell?.field === 'phone' ? (
                      <Input
                        autoFocus
                        defaultValue={row.phoneRaw}
                        onBlur={(e) => handleCellEdit(row.id, 'phoneRaw', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCellEdit(row.id, 'phoneRaw', e.currentTarget.value);
                          }
                        }}
                        className={row.errors.some(e => e.includes('phone')) ? 'border-destructive' : ''}
                      />
                    ) : (
                      <div
                        onClick={() => setEditingCell({ rowId: row.id, field: 'phone' })}
                        className={`cursor-pointer p-2 rounded ${
                          row.errors.some(e => e.includes('phone')) ? 'bg-destructive/10 border border-destructive' : ''
                        }`}
                      >
                        {row.phoneClean || row.phoneRaw}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCell?.rowId === row.id && editingCell?.field === 'bundle' ? (
                      <Input
                        autoFocus
                        type="number"
                        defaultValue={row.bundleSize || ''}
                        onBlur={(e) => handleCellEdit(row.id, 'bundleSize', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCellEdit(row.id, 'bundleSize', e.currentTarget.value);
                          }
                        }}
                        className={row.errors.some(e => e.includes('bundle')) ? 'border-destructive' : ''}
                      />
                    ) : (
                      <div
                        onClick={() => setEditingCell({ rowId: row.id, field: 'bundle' })}
                        className={`cursor-pointer p-2 rounded ${
                          row.errors.some(e => e.includes('bundle')) ? 'bg-destructive/10 border border-destructive' : ''
                        }`}
                      >
                        {row.bundleSize || '-'}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCell?.rowId === row.id && editingCell?.field === 'cost' ? (
                      <Input
                        autoFocus
                        type="number"
                        defaultValue={row.cost || ''}
                        onBlur={(e) => handleCellEdit(row.id, 'cost', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCellEdit(row.id, 'cost', e.currentTarget.value);
                          }
                        }}
                      />
                    ) : (
                      <div
                        onClick={() => setEditingCell({ rowId: row.id, field: 'cost' })}
                        className="cursor-pointer p-2 rounded"
                      >
                        {row.cost ? `KSh ${row.cost.toFixed(2)}` : '-'}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.telco && (
                      <Badge variant="secondary" className={getTelcoBadgeColor(row.telco)}>
                        {row.telco}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {row.errors.length === 0 ? (
                        <Badge variant="secondary" className="bg-success text-success-foreground">
                          Valid
                        </Badge>
                      ) : (
                        row.errors.map((error, i) => (
                          <Badge key={i} variant="destructive" className="mr-1">
                            {error}
                          </Badge>
                        ))
                      )}
                      {row.isDuplicate && (
                        <Badge variant="secondary" className="bg-warning text-warning-foreground">
                          Duplicate
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRowDelete(row.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
