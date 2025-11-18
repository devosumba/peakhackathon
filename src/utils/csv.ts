// CSV import/export utilities

import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { Row, ColumnMapping } from '@/types';

/**
 * Parse a CSV file and return the raw data with headers
 */
export function parseCSV(file: File): Promise<{ headers: string[]; data: any[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        resolve({
          headers,
          data: results.data as any[],
        });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

/**
 * Auto-detect column mapping based on header names and data patterns
 */
export function autoDetectColumns(headers: string[], sampleData: any[]): ColumnMapping {
  const mapping: ColumnMapping = {
    phone: null,
    bundle: null,
    cost: null,
  };

  // Phone number detection patterns
  const phonePatterns = /phone|number|mobile|tel|contact|msisdn/i;
  const bundlePatterns = /bundle|data|size|mb|gb|package|plan/i;
  const costPatterns = /cost|price|amount|rate|charge|fee/i;

  headers.forEach((header) => {
    const lowerHeader = header.toLowerCase();

    if (!mapping.phone && phonePatterns.test(lowerHeader)) {
      mapping.phone = header;
    } else if (!mapping.bundle && bundlePatterns.test(lowerHeader)) {
      mapping.bundle = header;
    } else if (!mapping.cost && costPatterns.test(lowerHeader)) {
      mapping.cost = header;
    }
  });

  // If we didn't find phone by name, look for phone-like data in columns
  if (!mapping.phone && sampleData.length > 0) {
    for (const header of headers) {
      const sample = sampleData.slice(0, 5);
      const hasPhoneLikeData = sample.every((row) => {
        const value = String(row[header] || '').trim();
        // Check if it looks like a phone number (starts with common patterns)
        return /^[\+\d][\d\s\-\(\)]+$/.test(value) && value.length >= 9;
      });
      
      if (hasPhoneLikeData) {
        mapping.phone = header;
        break;
      }
    }
  }

  // If we didn't find bundle by name, look for numeric columns
  if (!mapping.bundle && sampleData.length > 0) {
    for (const header of headers) {
      if (header === mapping.phone) continue; // Skip phone column
      
      const sample = sampleData.slice(0, 5);
      const hasNumericData = sample.every((row) => {
        const value = row[header];
        return !isNaN(Number(value)) && Number(value) > 0;
      });
      
      if (hasNumericData) {
        mapping.bundle = header;
        break;
      }
    }
  }

  return mapping;
}

/**
 * Export rows to CSV file
 * @param rows - Rows to export
 * @param validOnly - Only export valid rows (default: true)
 * @param filename - Output filename
 */
export function exportToCSV(
  rows: Row[],
  validOnly: boolean = true,
  filename: string = 'cleaned_data.csv'
) {
  const filteredRows = validOnly ? rows.filter((row) => row.errors.length === 0) : rows;

  const csvData = filteredRows.map((row) => ({
    phone: row.phoneClean || row.phoneRaw,
    bundle_size: row.bundleSize,
    cost: row.cost || '',
    telco: row.telco || '',
    status: row.errors.length === 0 ? 'valid' : 'invalid',
    errors: row.errors.join('; '),
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}

/**
 * Format data for API submission
 */
export function prepareForAPI(rows: Row[]) {
  const validRows = rows.filter((row) => row.errors.length === 0);

  return validRows.map((row) => ({
    phone: row.phoneClean,
    bundleSize: row.bundleSize,
    cost: row.cost,
    telco: row.telco,
  }));
}

/**
 * Calculate CSV statistics
 */
export function calculateStats(rows: Row[]) {
  const validRows = rows.filter((row) => row.errors.length === 0);
  const invalidRows = rows.filter((row) => row.errors.length > 0);
  const duplicates = rows.filter((row) => row.isDuplicate);

  return {
    total: rows.length,
    valid: validRows.length,
    invalid: invalidRows.length,
    duplicates: duplicates.length,
    totalBundleUnits: validRows.reduce((sum, row) => sum + (row.bundleSize || 0), 0),
    totalCost: validRows.reduce((sum, row) => sum + (row.cost || 0), 0),
  };
}
