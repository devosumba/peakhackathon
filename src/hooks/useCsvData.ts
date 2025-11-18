// Custom hook for managing CSV data state

import { useState, useCallback } from 'react';
import { Row, ColumnMapping, FilterMode, SortDirection } from '@/types';
import { cleanPhoneNumber, detectTelco, validateBundleSize, validateCost } from '@/utils/validation';
import { detectDuplicates, removeDuplicates } from '@/utils/duplicates';
import { parseCSV, autoDetectColumns } from '@/utils/csv';

export function useCsvData() {
  const [rows, setRows] = useState<Row[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    phone: null,
    bundle: null,
    cost: null,
  });
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [sortBy, setSortBy] = useState<'bundle' | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [history, setHistory] = useState<Row[][]>([]);

  // Parse and load CSV file
  const loadCSV = useCallback(async (file: File) => {
    try {
      const { headers: csvHeaders, data } = await parseCSV(file);
      setHeaders(csvHeaders);

      // Auto-detect column mapping
      const mapping = autoDetectColumns(csvHeaders, data);
      setColumnMapping(mapping);

      // Process rows
      const processedRows = processRawData(data, mapping);
      setRows(processedRows);
      setHistory([processedRows]);

      return { success: true, rowCount: processedRows.length };
    } catch (error) {
      console.error('Error loading CSV:', error);
      return { success: false, error: String(error) };
    }
  }, []);

  // Process raw CSV data into Row objects
  const processRawData = useCallback(
    (data: any[], mapping: ColumnMapping): Row[] => {
      const processed = data.map((rawRow, index) => {
        const phoneRaw = mapping.phone ? String(rawRow[mapping.phone] || '') : '';
        const bundleRaw = mapping.bundle ? rawRow[mapping.bundle] : null;
        const costRaw = mapping.cost ? rawRow[mapping.cost] : null;

        const phoneClean = cleanPhoneNumber(phoneRaw);
        const bundleValidation = validateBundleSize(bundleRaw);
        const costValidation = validateCost(costRaw);

        const errors: string[] = [];
        if (!phoneClean) {
          errors.push('Invalid phone number format');
        }
        if (!bundleValidation.valid && bundleValidation.error) {
          errors.push(bundleValidation.error);
        }
        if (!costValidation.valid && costValidation.error) {
          errors.push(costValidation.error);
        }

        const telco = detectTelco(phoneClean);

        return {
          id: `row-${index}-${Date.now()}`,
          original: rawRow,
          phoneRaw,
          phoneClean,
          bundleSize: bundleValidation.parsed,
          cost: costValidation.parsed,
          telco,
          errors,
          isDuplicate: false,
        } as Row;
      });

      // Detect duplicates
      return detectDuplicates(processed);
    },
    []
  );

  // Update column mapping and reprocess data
  const updateColumnMapping = useCallback(
    (newMapping: ColumnMapping) => {
      setColumnMapping(newMapping);
      if (rows.length > 0) {
        const rawData = rows.map((row) => row.original);
        const processedRows = processRawData(rawData, newMapping);
        setRows(processedRows);
      }
    },
    [rows, processRawData]
  );

  // Update a single row
  const updateRow = useCallback(
    (rowId: string, field: 'phoneRaw' | 'bundleSize' | 'cost', value: any) => {
      setRows((prev) => {
        const updated = prev.map((row) => {
          if (row.id !== rowId) return row;

          const updatedRow = { ...row };

          if (field === 'phoneRaw') {
            updatedRow.phoneRaw = value;
            updatedRow.phoneClean = cleanPhoneNumber(value);
            updatedRow.telco = detectTelco(updatedRow.phoneClean);
          } else if (field === 'bundleSize') {
            const validation = validateBundleSize(value);
            updatedRow.bundleSize = validation.parsed;
          } else if (field === 'cost') {
            const validation = validateCost(value);
            updatedRow.cost = validation.parsed;
          }

          // Recalculate errors
          updatedRow.errors = [];
          if (!updatedRow.phoneClean) {
            updatedRow.errors.push('Invalid phone number format');
          }
          if (updatedRow.bundleSize === null || updatedRow.bundleSize <= 0) {
            updatedRow.errors.push('Invalid bundle size');
          }

          return updatedRow;
        });

        return detectDuplicates(updated);
      });
    },
    []
  );

  // Delete a row
  const deleteRow = useCallback((rowId: string) => {
    setRows((prev) => {
      const filtered = prev.filter((row) => row.id !== rowId);
      return detectDuplicates(filtered);
    });
  }, []);

  // Auto-fix suggestions
  const applyAutoFix = useCallback(
    (fixType: 'add-prefix' | 'normalize-all') => {
      setRows((prev) => {
        const updated = prev.map((row) => {
          if (fixType === 'add-prefix' && !row.phoneClean && row.phoneRaw) {
            // Try to fix by adding prefix
            const cleaned = cleanPhoneNumber(row.phoneRaw);
            if (cleaned) {
              return {
                ...row,
                phoneClean: cleaned,
                telco: detectTelco(cleaned),
                errors: row.errors.filter((e) => !e.includes('phone')),
              };
            }
          }
          return row;
        });

        return detectDuplicates(updated);
      });
    },
    []
  );

  // Remove all duplicates
  const removeAllDuplicates = useCallback(() => {
    setHistory((prev) => [...prev, rows]);
    setRows((prev) => removeDuplicates(prev));
  }, [rows]);

  // Undo last operation
  const undo = useCallback(() => {
    if (history.length > 1) {
      const previous = history[history.length - 2];
      setRows(previous);
      setHistory((prev) => prev.slice(0, -1));
    }
  }, [history]);

  // Get filtered rows based on filter mode
  const getFilteredRows = useCallback(() => {
    let filtered = [...rows];

    if (filterMode === 'invalid') {
      filtered = filtered.filter((row) => row.errors.length > 0);
    } else if (filterMode === 'duplicates') {
      filtered = filtered.filter((row) => row.isDuplicate);
    } else if (filterMode === 'valid') {
      filtered = filtered.filter((row) => row.errors.length === 0);
    }

    // Apply sorting
    if (sortBy === 'bundle') {
      filtered.sort((a, b) => {
        const aVal = a.bundleSize || 0;
        const bVal = b.bundleSize || 0;
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return filtered;
  }, [rows, filterMode, sortBy, sortDirection]);

  return {
    rows,
    headers,
    columnMapping,
    filterMode,
    sortBy,
    sortDirection,
    canUndo: history.length > 1,
    loadCSV,
    updateColumnMapping,
    updateRow,
    deleteRow,
    setFilterMode,
    setSortBy,
    setSortDirection,
    applyAutoFix,
    removeAllDuplicates,
    undo,
    getFilteredRows,
  };
}
