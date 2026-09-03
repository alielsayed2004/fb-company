'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function Counter({ value, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    // Extract numerical value
    const end = parseInt(value.replace(/,/g, ''), 10);
    if (isNaN(end)) return;

    const duration = 1500; // 1.5s
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= duration) {
        setCount(end);
        return;
      }

      // easeOutQuad transition
      const progress = elapsedTime / duration;
      const easeProgress = progress * (2 - progress);
      
      const currentVal = Math.round(start + easeProgress * (end - start));
      setCount(currentVal);
      requestAnimationFrame(updateCount);
    };

    requestAnimationFrame(updateCount);
  }, [isInView, value]);

  // Format count to locale string if original value had commas
  const formattedCount = value.includes(',') ? count.toLocaleString() : count;

  return (
    <span ref={ref} className="font-bold text-4xl md:text-5xl lg:text-6xl text-fb-green tabular-nums">
      {formattedCount}{suffix}
    </span>
  );
}

export default function ImpactNumbers() {
  const stats = [
    { value: "8", suffix: "+", label: "Fuel Stations" },
    { value: "60", suffix: "+", label: "Global Brands Secured" },
    { value: "500,000", suffix: "+", label: "SQM Managed" },
    { value: "98", suffix: "%", label: "Occupancy Rate" }
  ];

  return (
    <section className="bg-fb-teal py-16 text-fb-white border-b border-fb-bg-light/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-4 border border-fb-bg-light/5 bg-fb-teal-light/20 rounded-xl"
            >
              <div className="flex items-baseline mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-fb-bg-light/70 text-xs md:text-sm font-medium tracking-widest uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
