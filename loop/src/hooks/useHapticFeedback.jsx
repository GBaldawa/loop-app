import { useCallback } from 'react';

// Simulate haptic feedback for web
const useHapticFeedback = () => {
  const trigger = useCallback((type = 'light') => {
    // Try to use the native haptic API if available (mobile browsers)
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(50);
          break;
        case 'success':
          navigator.vibrate([10, 10, 10]);
          break;
        case 'error':
          navigator.vibrate([50, 50, 50]);
          break;
        default:
          navigator.vibrate(10);
      }
    }
    
    // Visual feedback for desktop
    if (window.innerWidth > 768) {
      // Add a subtle visual effect
      document.body.style.transform = 'scale(0.999)';
      setTimeout(() => {
        document.body.style.transform = 'scale(1)';
      }, 50);
    }
  }, []);

  return { trigger };
};

export default useHapticFeedback;
