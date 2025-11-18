// Phone number validation and cleaning utilities for Kenyan numbers

import { Telco } from "@/types";

/**
 * Cleans and normalizes a Kenyan phone number to the format +2547XXXXXXXX or +2541XXXXXXXX
 * 
 * Accepted input patterns:
 * - 07XXXXXXXX → +2547XXXXXXXX
 * - 01XXXXXXXX → +2541XXXXXXXX
 * - 2547XXXXXXXX → +2547XXXXXXXX
 * - 7XXXXXXXX (9 digits) → +2547XXXXXXXX
 * - +2547XXXXXXXX (already formatted)
 * 
 * @param phone - Raw phone number string
 * @returns Cleaned phone number or null if invalid
 */
export function cleanPhoneNumber(phone: string): string | null {
  if (!phone) return null;

  // Remove all non-digit characters except leading +
  let cleaned = phone.trim();
  const hasPlus = cleaned.startsWith('+');
  cleaned = cleaned.replace(/[^\d]/g, '');

  // Handle different patterns
  if (cleaned.startsWith('254')) {
    // Already has country code
    if (cleaned.length === 12) {
      const formatted = '+' + cleaned;
      return isValidKenyanNumber(formatted) ? formatted : null;
    }
  } else if (cleaned.startsWith('07')) {
    // 07XXXXXXXX → +2547XXXXXXXX
    if (cleaned.length === 10) {
      return '+254' + cleaned.substring(1);
    }
  } else if (cleaned.startsWith('01')) {
    // 01XXXXXXXX → +2541XXXXXXXX
    if (cleaned.length === 10) {
      return '+254' + cleaned.substring(1);
    }
  } else if (cleaned.startsWith('7') && cleaned.length === 9) {
    // 7XXXXXXXX → +2547XXXXXXXX
    return '+254' + cleaned;
  } else if (cleaned.startsWith('1') && cleaned.length === 9) {
    // 1XXXXXXXX → +2541XXXXXXXX
    return '+254' + cleaned;
  }

  return null;
}

/**
 * Validates that a phone number is in the correct Kenyan format
 */
function isValidKenyanNumber(phone: string): boolean {
  if (!phone.startsWith('+254')) return false;
  if (phone.length !== 13) return false;
  
  const thirdDigit = phone.charAt(4);
  // Valid Kenyan numbers start with +2547 or +2541
  return thirdDigit === '7' || thirdDigit === '1';
}

/**
 * Detects the telco provider based on the phone number prefix
 * 
 * Safaricom: 7XX (except some ranges)
 * Airtel: 73X, 78X, 110, 111
 * Telkom: 77X
 */
export function detectTelco(phoneClean: string | null): Telco {
  if (!phoneClean || !phoneClean.startsWith('+254')) {
    return "Unknown";
  }

  const prefix = phoneClean.substring(4, 7); // Get 3 digits after +254

  // Safaricom prefixes: 70X, 71X, 72X, 74X, 75X, 76X, 79X
  if (['700', '701', '702', '703', '704', '705', '706', '707', '708', '709',
       '710', '711', '712', '713', '714', '715', '716', '717', '718', '719',
       '720', '721', '722', '723', '724', '725', '726', '727', '728', '729',
       '740', '741', '742', '743', '745', '746', '748',
       '757', '758', '759',
       '768', '769',
       '790', '791', '792', '793', '794', '795', '796', '797', '798', '799'].includes(prefix)) {
    return "Safaricom";
  }

  // Airtel prefixes: 73X, 78X, 110, 111
  if (prefix.startsWith('73') || prefix.startsWith('78') || 
      prefix === '110' || prefix === '111') {
    return "Airtel";
  }

  // Telkom prefixes: 77X
  if (prefix.startsWith('77')) {
    return "Telkom";
  }

  return "Unknown";
}

/**
 * Validates a bundle size value
 */
export function validateBundleSize(value: any): { valid: boolean; parsed: number | null; error?: string } {
  if (value === null || value === undefined || value === '') {
    return { valid: false, parsed: null, error: 'Bundle size is required' };
  }

  const num = Number(value);
  
  if (isNaN(num)) {
    return { valid: false, parsed: null, error: 'Bundle size must be a number' };
  }

  if (num <= 0) {
    return { valid: false, parsed: null, error: 'Bundle size must be greater than 0' };
  }

  return { valid: true, parsed: num };
}

/**
 * Validates a cost value (optional field)
 */
export function validateCost(value: any): { valid: boolean; parsed: number | null; error?: string } {
  // Cost is optional
  if (value === null || value === undefined || value === '') {
    return { valid: true, parsed: null };
  }

  const num = Number(value);
  
  if (isNaN(num)) {
    return { valid: false, parsed: null, error: 'Cost must be a number' };
  }

  if (num < 0) {
    return { valid: false, parsed: null, error: 'Cost cannot be negative' };
  }

  return { valid: true, parsed: num };
}

/**
 * Detects if a phone number might be fixable with common patterns
 */
export function suggestPhoneFix(phoneRaw: string): string | null {
  if (!phoneRaw) return null;

  const cleaned = phoneRaw.trim().replace(/[^\d]/g, '');

  // Check if it's a 9-digit number starting with 7 or 1
  if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('1'))) {
    return 'Add +254 prefix';
  }

  // Check if it's missing the country code but has 10 digits
  if (cleaned.length === 10 && (cleaned.startsWith('07') || cleaned.startsWith('01'))) {
    return 'Add +254 and remove leading 0';
  }

  // Check if it has the country code but missing +
  if (cleaned.length === 12 && cleaned.startsWith('254')) {
    return 'Add + symbol';
  }

  return null;
}
