import { useState, useCallback } from 'react';

export const useRefresh = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  return { refreshTrigger, triggerRefresh };
};