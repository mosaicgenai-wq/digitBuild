import { useEffect, useRef, useState } from 'react';

type CounterProps = {
  target: number;
  suffix?: string;
};

export function Counter({ target, suffix = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [started, setStarted] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node || started) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) {
      return;
    }

    const start = Date.now();
    const timer = window.setInterval(() => {
      const progress = Math.min((Date.now() - start) / 1800, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));

      if (progress >= 1) {
        window.clearInterval(timer);
        setValue(target);
      }
    }, 16);

    return () => window.clearInterval(timer);
  }, [started, target]);

  return (
    <span ref={ref} className="counter">
      {value}
      {suffix}
    </span>
  );
}
