import { useContext } from 'react';
import { ToastContext } from '@core/components/Toast';

export  function useToast() {
  return useContext(ToastContext);
}
