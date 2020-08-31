import { useEffect } from 'react';

export function useIntersectionObserver({
  root,
  targets,
  onIntersect,
  threshold = 1.0,
  rootMargin = '0px',
  enabled = true
}) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => entry.isIntersecting && onIntersect(entry))
      },
      {
        root: root?.current,
        rootMargin,
        threshold
      }
    );

    const elements = targets.map(t => t?.current).filter(Boolean);

    elements.forEach(el => {
      observer.observe(el);
    })
    
    return () => {
      elements.forEach(el => {
        observer.unobserve(el);
      })
    };
  }, [enabled, root, rootMargin, threshold, targets, onIntersect]);
}
