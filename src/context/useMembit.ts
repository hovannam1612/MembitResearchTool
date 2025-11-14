import { useContext } from 'react';
import { MembitContext } from './MembitContext';

export const useMembit = () => {
  const context = useContext(MembitContext);
  if (!context) {
    throw new Error('useMembit must be used within MembitProvider');
  }
  return context;
};
