/**
 * ZIP File Extraction Utility
 * Uses JSZip to extract files from ZIP archives
 */

import JSZip from 'jszip';
import { readFileAsText, isPDF } from './pdfExtractor';

export interface ExtractedFile {
  name: string;
  content: string;
  type: string;
}

/**
 * Extract all files from a ZIP archive
 */
export async function extractZipFile(file: File): Promise<ExtractedFile[]> {
  try {
    const zip = new JSZip();
    const zipContents = await zip.loadAsync(file);
    
    const extractedFiles: ExtractedFile[] = [];
    
    // Process each file in the ZIP
    const fileEntries = Object.entries(zipContents.files);
    
    for (const [relativePath, zipEntry] of fileEntries) {
      // Skip directories
      if (zipEntry.dir) continue;
      
      // Skip macOS metadata files
      if (relativePath.includes('__MACOSX') || relativePath.startsWith('.')) {
        continue;
      }
      
      try {
        // Get file content as ArrayBuffer
        const arrayBuffer = await zipEntry.async('arraybuffer');
        const blob = new Blob([arrayBuffer]);
        const extractedFile = new File([blob], zipEntry.name, { type: blob.type });
        
        // Extract text using appropriate method
        const content = await readFileAsText(extractedFile);
        
        extractedFiles.push({
          name: zipEntry.name,
          content: content,
          type: extractedFile.type || 'unknown'
        });
        
      } catch (error) {
        console.error(`Error extracting ${zipEntry.name}:`, error);
        // Continue with other files
      }
    }
    
    return extractedFiles;
  } catch (error) {
    console.error('Error extracting ZIP file:', error);
    throw new Error('Failed to extract ZIP file');
  }
}

/**
 * Check if a file is a ZIP archive
 */
export function isZipFile(file: File): boolean {
  return file.type === 'application/zip' || 
         file.type === 'application/x-zip-compressed' ||
         file.name.toLowerCase().endsWith('.zip');
}

/**
 * Combine text from multiple files
 */
export function combineFileContents(files: ExtractedFile[]): string {
  let combinedText = '';
  
  for (const file of files) {
    combinedText += `\n\n=== FILE: ${file.name} ===\n\n`;
    combinedText += file.content;
    combinedText += `\n\n=== END OF FILE: ${file.name} ===\n\n`;
  }
  
  return combinedText;
}

