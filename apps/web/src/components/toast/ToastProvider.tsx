import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  title: string;
  description: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (title: string, description: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((title: string, description: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((current) => [...current, { id, title, description, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info;
            
            return (
              <motion.div
                key={toast.id}
                className={`toast toast-${toast.type}`}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                layout
              >
                <div className="toast-icon">
                  <Icon size={18} />
                </div>
                <div className="toast-content">
                  <p className="toast-title">{toast.title}</p>
                  <p className="toast-description">{toast.description}</p>
                </div>
                <button className="toast-close" onClick={() => removeToast(toast.id)}>
                  <X size={14} />
                </button>
                <div className="toast-progress">
                  <motion.div 
                    className="toast-progress-bar"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 4, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
