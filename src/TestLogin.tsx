import React, { useState } from 'react';
import { insforge } from './lib/insforge';
import { toast } from 'sonner';

const TestLogin = () => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { data, error } = await insforge.auth.signInWithOAuth({
        provider: 'google',
        redirectTo: window.location.origin + '/dashboard',
        skipBrowserRedirect: true
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentUser = async () => {
    try {
      setLoading(true);
      const { data, error } = await insforge.auth.getCurrentUser();
      
      if (error) {
        console.error('Get current user error:', error);
        toast.error('Failed to get current user');
        setCurrentUser(null);
      } else {
        console.log('Current user:', data);
        setCurrentUser(data);
        toast.success('Successfully got current user');
      }
    } catch (error) {
      console.error('Get current user error:', error);
      toast.error('Failed to get current user');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await insforge.auth.signOut();
      setCurrentUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Authentication Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
        
        <button
          onClick={checkCurrentUser}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Current User'}
        </button>
        
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          {loading ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
      
      {currentUser && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold mb-2">Current User:</h3>
          <pre>{JSON.stringify(currentUser, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestLogin;