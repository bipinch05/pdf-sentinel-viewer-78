
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading document...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] w-full">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-primary/20 animate-pulse-subtle"></div>
        </div>
      </div>
      <p className="mt-4 text-muted-foreground animate-pulse-subtle">{message}</p>
    </div>
  );
};

export default LoadingState;
