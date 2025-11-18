import { ColumnMapping } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ColumnMapperProps {
  headers: string[];
  mapping: ColumnMapping;
  onMappingChange: (mapping: ColumnMapping) => void;
}

export function ColumnMapper({ headers, mapping, onMappingChange }: ColumnMapperProps) {
  const handlePhoneChange = (value: string) => {
    onMappingChange({ ...mapping, phone: value === 'none' ? null : value });
  };

  const handleBundleChange = (value: string) => {
    onMappingChange({ ...mapping, bundle: value === 'none' ? null : value });
  };

  const handleCostChange = (value: string) => {
    onMappingChange({ ...mapping, cost: value === 'none' ? null : value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Map Columns</CardTitle>
        <CardDescription>
          Match your CSV columns to the required fields
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone-column">Phone Number *</Label>
          <Select value={mapping.phone || 'none'} onValueChange={handlePhoneChange}>
            <SelectTrigger id="phone-column">
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {headers.map((header) => (
                <SelectItem key={header} value={header}>
                  {header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bundle-column">Bundle Size *</Label>
          <Select value={mapping.bundle || 'none'} onValueChange={handleBundleChange}>
            <SelectTrigger id="bundle-column">
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {headers.map((header) => (
                <SelectItem key={header} value={header}>
                  {header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost-column">Cost (Optional)</Label>
          <Select value={mapping.cost || 'none'} onValueChange={handleCostChange}>
            <SelectTrigger id="cost-column">
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {headers.map((header) => (
                <SelectItem key={header} value={header}>
                  {header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
