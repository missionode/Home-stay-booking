import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg animate-slide-up">
      {type === 'success' ? (
        <div className="bg-green-100 text-green-800 flex items-center gap-2 px-4 py-2 rounded-lg">
          <CheckCircle size={20} />
          <span>{message}</span>
        </div>
      ) : (
        <div className="bg-red-100 text-red-800 flex items-center gap-2 px-4 py-2 rounded-lg">
          <XCircle size={20} />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};