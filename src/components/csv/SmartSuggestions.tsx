import { Row } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Undo2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SmartSuggestionsProps {
  rows: Row[];
  onApplyFix: (fixType: 'add-prefix' | 'normalize-all') => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function SmartSuggestions({ rows, onApplyFix, onUndo, canUndo }: SmartSuggestionsProps) {
  const invalidPhones = rows.filter((row) => !row.phoneClean && row.phoneRaw);
  
  // Count phones that might be fixable by adding prefix
  const missingPrefixCount = invalidPhones.filter((row) => {
    const cleaned = row.phoneRaw.replace(/[^\d]/g, '');
    return (cleaned.length === 9 || cleaned.length === 10) && 
           (cleaned.startsWith('7') || cleaned.startsWith('1') || 
            cleaned.startsWith('07') || cleaned.startsWith('01'));
  }).length;

  const suggestions = [];

  if (missingPrefixCount > 0) {
    suggestions.push({
      id: 'add-prefix',
      title: 'Add +254 Prefix',
      description: `${missingPrefixCount} number${missingPrefixCount !== 1 ? 's' : ''} missing country code`,
      action: () => onApplyFix('add-prefix'),
    });
  }

  if (suggestions.length === 0 && invalidPhones.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-warning" />
              Smart Suggestions
            </CardTitle>
            <CardDescription>
              Automatic fixes for common issues
            </CardDescription>
          </div>
          {canUndo && (
            <Button variant="outline" size="sm" onClick={onUndo}>
              <Undo2 className="h-4 w-4 mr-2" />
              Undo
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">{suggestion.title}</p>
                <p className="text-xs text-muted-foreground">{suggestion.description}</p>
              </div>
              <Button size="sm" onClick={suggestion.action}>
                Apply
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            {invalidPhones.length > 0 ? (
              <div>
                <p className="mb-2">
                  {invalidPhones.length} invalid phone number{invalidPhones.length !== 1 ? 's' : ''} found
                </p>
                <Badge variant="outline" className="text-xs">
                  Manual review required
                </Badge>
              </div>
            ) : (
              'All data looks good! 🎉'
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
