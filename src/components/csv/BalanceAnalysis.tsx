import { useState } from 'react';
import { Row } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface BalanceAnalysisProps {
  rows: Row[];
}

export function BalanceAnalysis({ rows }: BalanceAnalysisProps) {
  const [availableUnits, setAvailableUnits] = useState<string>('');

  const validRows = rows.filter((row) => row.errors.length === 0);
  const totalBundleUnits = validRows.reduce((sum, row) => sum + (row.bundleSize || 0), 0);

  const available = parseFloat(availableUnits) || 0;
  const difference = available - totalBundleUnits;
  const isBalanced = available >= totalBundleUnits;
  const hasInput = availableUnits.trim() !== '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Analysis</CardTitle>
        <CardDescription>
          Check if you have enough units for all allocations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="available-units">Available Units</Label>
          <Input
            id="available-units"
            type="number"
            placeholder="Enter available units"
            value={availableUnits}
            onChange={(e) => setAvailableUnits(e.target.value)}
          />
        </div>

        {hasInput && (
          <>
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Units</span>
                <span className="font-semibold">{available.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Required Units</span>
                <span className="font-semibold">{totalBundleUnits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Balance</span>
                <span className={difference >= 0 ? 'text-success' : 'text-destructive'}>
                  {difference >= 0 ? '+' : ''}{difference.toLocaleString()}
                </span>
              </div>
            </div>

            {isBalanced ? (
              <Alert className="bg-success/10 border-success">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  You have sufficient units. Surplus: {difference.toLocaleString()} units
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Insufficient units. Short by: {Math.abs(difference).toLocaleString()} units
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
