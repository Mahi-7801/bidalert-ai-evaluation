import React, { useEffect, useState } from 'react';
import { testAuthAndDatabase } from './test-auth';

const TestDatabase = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const runTest = async () => {
      setLoading(true);
      const testResult = await testAuthAndDatabase();
      setResult(testResult);
      setLoading(false);
    };

    runTest();
  }, []);

  if (loading) {
    return <div>Testing authentication and database connection...</div>;
  }

  return (
    <div>
      <h2>Authentication and Database Connection Test</h2>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};

export default TestDatabase;