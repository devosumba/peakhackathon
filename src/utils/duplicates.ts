// Duplicate detection utilities

import { Row } from '@/types';

/**
 * Detects duplicate phone numbers across rows
 * Marks rows as duplicates if they share the same cleaned phone number
 */
export function detectDuplicates(rows: Row[]): Row[] {
  const phoneCountMap = new Map<string, number>();

  // Count occurrences of each cleaned phone number
  rows.forEach((row) => {
    if (row.phoneClean) {
      const count = phoneCountMap.get(row.phoneClean) || 0;
      phoneCountMap.set(row.phoneClean, count + 1);
    }
  });

  // Mark rows as duplicates if their phone number appears more than once
  return rows.map((row) => ({
    ...row,
    isDuplicate: row.phoneClean ? (phoneCountMap.get(row.phoneClean) || 0) > 1 : false,
  }));
}

/**
 * Get groups of duplicate rows for display/analysis
 */
export function getDuplicateGroups(rows: Row[]): Map<string, Row[]> {
  const groups = new Map<string, Row[]>();

  rows.forEach((row) => {
    if (row.isDuplicate && row.phoneClean) {
      const existing = groups.get(row.phoneClean) || [];
      groups.set(row.phoneClean, [...existing, row]);
    }
  });

  return groups;
}

/**
 * Remove duplicate rows, keeping the first occurrence
 */
export function removeDuplicates(rows: Row[]): Row[] {
  const seenPhones = new Set<string>();
  const uniqueRows: Row[] = [];

  rows.forEach((row) => {
    if (row.phoneClean && !seenPhones.has(row.phoneClean)) {
      seenPhones.add(row.phoneClean);
      uniqueRows.push({ ...row, isDuplicate: false });
    } else if (!row.phoneClean) {
      // Keep rows with invalid phone numbers
      uniqueRows.push(row);
    }
  });

  return uniqueRows;
}
