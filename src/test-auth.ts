import { insforge } from './lib/insforge';

// Test authentication and database connectivity
export const testAuthAndDatabase = async () => {
  try {
    console.log('Testing authentication and database connection...');
    
    // Test getting current user
    const { data: userData, error: userError } = await insforge.auth.getCurrentUser();
    
    if (userError) {
      console.error('Authentication error:', userError);
      return { success: false, error: userError, type: 'auth' };
    }
    
    console.log('Current user:', userData);
    
    // Test simple database query
    const { data, error } = await insforge.database
      .from('documents')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('Database query error:', error);
      return { success: false, error, type: 'database', user: userData };
    }
    
    console.log('Database query successful:', data);
    return { success: true, data, user: userData };
  } catch (err) {
    console.error('Test failed:', err);
    return { success: false, error: err, type: 'exception' };
  }
};