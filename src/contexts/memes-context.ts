import { createContext, useContext } from 'react';
import { Meme } from '../types/meme';

export const MemesContext = createContext<Meme[]>([]);

export const useMemes = () => {
  const context = useContext(MemesContext);

  if (context === undefined) {
    throw new Error('useMemes must be used within a MemesContext');
  }

  return context;
};
