import { insforge } from './src/lib/insforge';

async function testUpload() {
  try {
    // Create a simple text file for testing
    const content = 'This is a test file for upload';
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], 'test.txt', { type: 'text/plain' });
    
    console.log('Attempting to upload file to bid-documents bucket...');
    
    // Try to upload the file
    const { data, error } = await insforge.storage
      .from('bid-documents')
      .upload('test-file.txt', file);
    
    if (error) {
      console.error('Upload failed:', error);
      return;
    }
    
    console.log('Upload successful:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testUpload();