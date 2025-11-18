import { Row } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Copy, Database, DollarSign } from 'lucide-react';

interface SummaryDashboardProps {
  rows: Row[];
}

export function SummaryDashboard({ rows }: SummaryDashboardProps) {
  const validRows = rows.filter((row) => row.errors.length === 0);
  const invalidRows = rows.filter((row) => row.errors.length > 0);
  const duplicates = rows.filter((row) => row.isDuplicate);

  const totalBundleUnits = validRows.reduce((sum, row) => sum + (row.bundleSize || 0), 0);
  const totalCost = validRows.reduce((sum, row) => sum + (row.cost || 0), 0);

  const telcoStats = {
    safaricom: validRows.filter((row) => row.telco === 'Safaricom').length,
    airtel: validRows.filter((row) => row.telco === 'Airtel').length,
    telkom: validRows.filter((row) => row.telco === 'Telkom').length,
    unknown: validRows.filter((row) => row.telco === 'Unknown').length,
  };

  const stats = [
    {
      title: 'Total Rows',
      value: rows.length,
      icon: Database,
      color: 'text-primary',
    },
    {
      title: 'Valid Rows',
      value: validRows.length,
      icon: CheckCircle,
      color: 'text-success',
    },
    {
      title: 'Invalid Rows',
      value: invalidRows.length,
      icon: XCircle,
      color: 'text-destructive',
    },
    {
      title: 'Duplicates',
      value: duplicates.length,
      icon: Copy,
      color: 'text-warning',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Summary</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Totals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Bundle Units</span>
            <span className="font-semibold">{totalBundleUnits.toLocaleString()}</span>
          </div>
          {totalCost > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Cost</span>
              <span className="font-semibold">KSh {totalCost.toLocaleString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Telco Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Safaricom</span>
            <span className="font-semibold text-success">{telcoStats.safaricom}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Airtel</span>
            <span className="font-semibold text-destructive">{telcoStats.airtel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Telkom</span>
            <span className="font-semibold text-warning">{telcoStats.telkom}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Unknown</span>
            <span className="font-semibold text-muted-foreground">{telcoStats.unknown}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
