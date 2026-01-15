"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import Image from "next/image";

// Confetti burst function with wedding theme colors
const fireConfetti = () => {
  const duration = 4000;
  const animationEnd = Date.now() + duration;
  const colors = ["#d4af37", "#f5e6c4", "#ffffff", "#ffd700", "#fffacd"];

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  // Initial big burst from center
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { x: 0.5, y: 0.5 },
    colors: colors,
    startVelocity: 45,
    gravity: 0.8,
    scalar: 1.2,
  });

  // Side bursts
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.6 },
      colors: colors,
    });
  }, 200);

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.6 },
      colors: colors,
    });
  }, 400);

  // Continuous rain effect
  frame();

  // Final celebration burst
  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { x: 0.5, y: 0.4 },
      colors: colors,
      startVelocity: 35,
      gravity: 0.6,
      scalar: 1.5,
      shapes: ["circle", "square"],
    });
  }, 2000);
};

// Pre-computed particle data with deterministic values to avoid hydration mismatches
const PARTICLE_DATA = [
  { initialX: 0.12, initialY: 0.34, animateX: 23, duration: 14, delay: 1.2 },
  { initialX: 0.87, initialY: 0.21, animateX: -31, duration: 18, delay: 0.5 },
  { initialX: 0.45, initialY: 0.78, animateX: 12, duration: 12, delay: 2.8 },
  { initialX: 0.23, initialY: 0.56, animateX: -45, duration: 16, delay: 0.3 },
  { initialX: 0.91, initialY: 0.12, animateX: 8, duration: 11, delay: 3.1 },
  { initialX: 0.34, initialY: 0.89, animateX: -22, duration: 19, delay: 1.7 },
  { initialX: 0.67, initialY: 0.43, animateX: 37, duration: 13, delay: 4.2 },
  { initialX: 0.15, initialY: 0.67, animateX: -15, duration: 17, delay: 0.8 },
  { initialX: 0.78, initialY: 0.31, animateX: 28, duration: 15, delay: 2.1 },
  { initialX: 0.52, initialY: 0.94, animateX: -38, duration: 10, delay: 3.6 },
  { initialX: 0.08, initialY: 0.18, animateX: 19, duration: 14, delay: 1.4 },
  { initialX: 0.95, initialY: 0.72, animateX: -27, duration: 18, delay: 4.8 },
  { initialX: 0.41, initialY: 0.05, animateX: 42, duration: 12, delay: 0.1 },
  { initialX: 0.29, initialY: 0.83, animateX: -9, duration: 16, delay: 2.5 },
  { initialX: 0.63, initialY: 0.39, animateX: 33, duration: 11, delay: 3.9 },
  { initialX: 0.18, initialY: 0.61, animateX: -48, duration: 19, delay: 1.0 },
  { initialX: 0.84, initialY: 0.27, animateX: 14, duration: 13, delay: 4.4 },
  { initialX: 0.56, initialY: 0.95, animateX: -35, duration: 17, delay: 0.6 },
  { initialX: 0.03, initialY: 0.48, animateX: 26, duration: 15, delay: 2.3 },
  { initialX: 0.72, initialY: 0.14, animateX: -41, duration: 10, delay: 3.3 },
];

// Custom hook for window size that satisfies strict lint rules
function useWindowSize() {
  const getSize = () => ({
    width: typeof window !== "undefined" ? window.innerWidth : 1000,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getSize());
    };

    // Dispatch resize to get initial size on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

// Floating rose petals component
const FloatingParticles = () => {
  const windowSize = useWindowSize();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Rose petal colors - mix of gold and real rose colors
  const petalColors = [
    { outer: "#d4af37", inner: "#d4af37" }, // Gold
    { outer: "#FF69B4", inner: "#FFB6C1" }, // Hot Pink / Light Pink
    { outer: "#DC143C", inner: "#FF69B4" }, // Crimson / Hot Pink
    { outer: "#C71585", inner: "#FF1493" }, // Medium Violet Red / Deep Pink
    { outer: "#FF1493", inner: "#FFB6C1" }, // Deep Pink / Light Pink
    { outer: "#d4af37", inner: "#f5e6c4" }, // Gold / Light Gold
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {PARTICLE_DATA.map((particle, i) => {
        const colorSet = petalColors[i % petalColors.length];
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: "14px",
              height: "14px",
            }}
            initial={{
              x: particle.initialX * windowSize.width,
              y: particle.initialY * windowSize.height,
              rotate: i * 45,
            }}
            animate={{
              y: [null, -100, windowSize.height + 100],
              x: [null, particle.animateX],
              rotate: [
                null,
                particle.animateX * 3 + i * 45,
                particle.animateX * 6 + i * 45,
              ],
              opacity: [0.15, 0.4, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
              {/* Rose petal shape - more rounded and petal-like */}
              <path
                d="M12 2 C10 3, 8.5 5, 8 7.5 C7.5 10, 8 12.5, 9.5 14.5 C10.5 15.5, 11.5 16, 12 16 C12.5 16, 13.5 15.5, 14.5 14.5 C16 12.5, 16.5 10, 16 7.5 C15.5 5, 14 3, 12 2 Z"
                fill={colorSet.outer}
                opacity="0.6"
              />
              <path
                d="M12 3 C10.5 3.8, 9.5 5.5, 9 7.5 C8.7 9, 9 11, 10 12.5 C10.7 13.3, 11.3 13.7, 12 13.7 C12.7 13.7, 13.3 13.3, 14 12.5 C15 11, 15.3 9, 15 7.5 C14.5 5.5, 13.5 3.8, 12 3 Z"
                fill={colorSet.inner}
                opacity="0.4"
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

// Modern Corner Decorations - Top Left (for sections)
const CornerDecorationTopLeft = () => (
  <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 pointer-events-none overflow-visible z-0">
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      fill="none"
      stroke="#d4af37"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.2"
    >
      <path d="M0 40 Q30 20, 60 35 T120 50 T180 40" />
      <path d="M20 0 Q0 30, 25 60" />
      <path d="M0 100 Q40 80, 80 95" />
    </svg>
  </div>
);

// Modern Corner Decorations - Bottom Right (for sections)
const CornerDecorationBottomRight = () => (
  <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 pointer-events-none overflow-visible z-0">
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      fill="none"
      stroke="#d4af37"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.2"
    >
      <path d="M200 160 Q170 180, 140 165 T80 150 T20 160" />
      <path d="M180 200 Q200 170, 175 140" />
      <path d="M200 100 Q160 120, 120 105" />
    </svg>
  </div>
);

// Subtle Background Accessories
const BackgroundAccessories = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.06]">
    {/* Top center subtle arc */}
    <svg
      className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 hidden md:block"
      viewBox="0 0 400 400"
      fill="none"
      stroke="#8B0000"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M50 200 Q200 100, 350 200" opacity="0.4" />
      <path d="M100 250 Q200 150, 300 250" opacity="0.3" />
    </svg>

    {/* Left side soft curve */}
    <svg
      className="absolute left-10 top-1/3 w-64 h-64 hidden lg:block"
      viewBox="0 0 200 200"
      fill="none"
      stroke="#d4af37"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M0 100 Q50 50, 100 80 T200 100" opacity="0.3" />
    </svg>

    {/* Right side subtle curve */}
    <svg
      className="absolute right-10 bottom-1/4 w-56 h-56 hidden lg:block"
      viewBox="0 0 200 200"
      fill="none"
      stroke="#8B0000"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M200 120 Q150 150, 100 130 T0 120" opacity="0.3" />
    </svg>
  </div>
);

// Countdown Timer Component
const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hasEnded, setHasEnded] = useState(false);
  const confettiFired = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else if (!confettiFired.current) {
        // Countdown reached zero - fire confetti!
        setHasEnded(true);
        confettiFired.current = true;
        fireConfetti();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {timeBlocks.map((block, index) => (
          <motion.div
            key={block.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="w-16 h-16 md:w-24 md:h-24 rounded-2xl glass flex items-center justify-center border border-[#d4af37]/30"
              whileHover={{
                scale: 1.05,
                borderColor: "rgba(212, 175, 55, 0.6)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={block.value}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-2xl md:text-4xl font-bold text-[#d4af37] font-playfair"
                >
                  {String(block.value).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </motion.div>
            <span className="mt-2 text-xs md:text-sm text-muted uppercase tracking-widest font-inter">
              {block.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Celebration Message when countdown ends */}
      <AnimatePresence>
        {hasEnded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-center"
          >
            <motion.p
              className="text-2xl md:text-4xl font-playfair text-[#d4af37]"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              The Big Day is Here!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Button */}
      {/* <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={fireConfetti}
        className="mt-8 px-6 py-3 rounded-full border border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300 flex items-center gap-2 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-2xl group-hover:animate-bounce">🎉</span>
        <span className="font-inter text-sm text-muted group-hover:text-foreground transition-colors">
          Preview Celebration
        </span>
        <span className="text-2xl group-hover:animate-bounce">🎊</span>
      </motion.button> */}
    </div>
  );
};

// Decorative Divider
const Divider = () => (
  <div className="flex items-center justify-center gap-4 my-12">
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: 80 }}
      transition={{ duration: 0.8 }}
      className="h-px bg-linear-to-r from-transparent to-[#d4af37]"
    />
    <motion.div
      initial={{ scale: 0, rotate: 0 }}
      whileInView={{ scale: 1, rotate: 45 }}
      transition={{ duration: 0.5 }}
      className="w-3 h-3 border-2 border-[#d4af37]"
    />
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: 80 }}
      transition={{ duration: 0.8 }}
      className="h-px bg-linear-to-l from-transparent to-[#d4af37]"
    />
  </div>
);

// Event Card Component
const EventCard = ({
  title,
  date,
  time,
  venue,
  address,
  delay = 0,
}: {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className="glass rounded-3xl p-6 md:p-8 border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all duration-500"
    >
      <motion.h3
        className="text-2xl md:text-3xl font-playfair text-[#d4af37] mb-6 text-center"
        whileHover={{ scale: 1.02 }}
      >
        {title}
      </motion.h3>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#d4af37]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-muted">Date</p>
            <p className="font-cormorant text-lg">{date}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#d4af37]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-muted">Time</p>
            <p className="font-cormorant text-lg">{time}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#d4af37]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-muted">Venue</p>
            <p className="font-cormorant text-lg">{venue}</p>
            <p className="text-sm text-muted">{address}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Venue Map Component
const VenueMap = ({
  mapUrl,
  venue,
  address,
}: {
  mapUrl: string;
  venue: string;
  address: string;
}) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      viewport={{ once: true }}
      className="glass rounded-3xl p-6 md:p-8 border border-[#d4af37]/20"
    >
      <motion.h3
        className="text-2xl md:text-3xl font-playfair text-[#d4af37] mb-4 text-center"
        whileHover={{ scale: 1.02 }}
      >
        Venue Location
      </motion.h3>

      <div className="flex items-center gap-3 mb-6 justify-center">
        <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-[#d4af37]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-cormorant text-lg md:text-xl font-semibold">
            {venue}
          </p>
          <p className="text-sm text-muted">{address}</p>
        </div>
      </div>

      {/* Map */}
      <div className="map-container relative h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
        {!isMapLoaded && (
          <div className="absolute inset-0 bg-accent-light animate-pulse flex items-center justify-center">
            <span className="text-muted">Loading map...</span>
          </div>
        )}
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsMapLoaded(true)}
          className={`transition-opacity duration-500 ${
            isMapLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <motion.a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${venue}, ${address}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-[#d4af37]/30 hover:bg-[#d4af37]/10 transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg
          className="w-5 h-5 text-[#d4af37]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <span className="font-inter text-sm">Get Directions</span>
      </motion.a>
    </motion.div>
  );
};

// Save the Date Button Component (for Events section)
const SaveTheDateButton = ({
  eventTitle,
  eventDate,
}: {
  eventTitle: string;
  eventDate: Date;
}) => {
  const [showOptions, setShowOptions] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowOptions(false);
    };

    if (showOptions) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showOptions]);

  // Format date for calendar
  const formatDateForCalendar = (date: Date) => {
    return date
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "")
      .slice(0, -1);
  };

  const startDate = formatDateForCalendar(eventDate);
  const endDate = formatDateForCalendar(
    new Date(eventDate.getTime() + 4 * 60 * 60 * 1000)
  );
  const eventDescription = `You're invited to celebrate with us!`;
  const eventLocation = "Wedding Venue";

  // Google Calendar URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle
  )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
    eventDescription
  )}&location=${encodeURIComponent(eventLocation)}`;

  // Generate ICS file
  const generateICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${eventTitle}
DESCRIPTION:${eventDescription}
LOCATION:${eventLocation}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "save-the-date.ics";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 flex justify-center"
    >
      <div className="relative">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
          className="px-8 py-4 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 hover:bg-[#d4af37]/20 hover:border-[#d4af37] transition-all duration-300 flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            className="w-5 h-5 text-[#d4af37]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-playfair text-lg text-[#d4af37]">
            Save the Date
          </span>
          <svg
            className={`w-4 h-4 text-[#d4af37] transition-transform ${
              showOptions ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.button>

        {/* Calendar Options Dropdown */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 rounded-xl border border-[#d4af37]/30 overflow-hidden z-100 bg-background shadow-xl shadow-black/20"
            >
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/20 transition-colors"
                onClick={() => setShowOptions(false)}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#d4af37">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                <span className="text-sm">Google Calendar</span>
              </a>
              <button
                onClick={() => {
                  generateICS();
                  setShowOptions(false);
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/20 transition-colors w-full"
              >
                <svg
                  className="w-5 h-5 text-[#d4af37]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">Apple Calendar</span>
              </button>
              <button
                onClick={() => {
                  generateICS();
                  setShowOptions(false);
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/20 transition-colors w-full"
              >
                <svg
                  className="w-5 h-5 text-[#d4af37]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 5H3a2 2 0 00-2 2v10a2 2 0 002 2h18a2 2 0 002-2V7a2 2 0 00-2-2zm-9 10a4 4 0 110-8 4 4 0 010 8z" />
                </svg>
                <span className="text-sm">Outlook</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Share Button Component (for footer)
const ShareButton = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setShowOptions(false);
    if (showOptions) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showOptions]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareWhatsApp = () => {
    const message = `${shareUrl}`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setShowOptions(!showOptions);
        }}
        whileHover={{ scale: 1.05, color: "#d4af37" }}
        className="flex items-center gap-1.5 text-muted transition-colors text-xs font-cormorant"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        <span>Share</span>
      </motion.button>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-44 rounded-xl border border-[#d4af37]/30 overflow-hidden z-100 bg-background shadow-xl shadow-black/20"
          >
            <button
              onClick={() => {
                shareWhatsApp();
                setShowOptions(false);
              }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/20 transition-colors w-full"
            >
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="text-sm">WhatsApp</span>
            </button>
            <button
              onClick={() => {
                copyLink();
                setShowOptions(false);
              }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/20 transition-colors w-full"
            >
              <svg
                className="w-5 h-5 text-[#d4af37]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm">
                {copied ? "Copied!" : "Copy Link"}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Welcome Overlay Component
const WelcomeOverlay = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-100 bg-background flex items-center justify-center"
    >
      <div className="text-center px-6">
        {/* Decorative ring */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="mb-8 mx-auto w-32 h-32 rounded-full border-2 border-[#d4af37]/50 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border border-dashed border-[#d4af37]/30 flex items-center justify-center"
          >
            <Image
              src="/heart.webp"
              alt="Heart"
              width={60}
              height={60}
              className="object-contain"
            />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted uppercase tracking-[0.3em] text-sm mb-4 font-inter"
        >
          You&apos;re Invited
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-4xl md:text-6xl font-playfair text-[#d4af37] mb-8"
        >
          Wedding Celebration
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={onEnter}
          className="px-8 py-4 rounded-full bg-[#d4af37] text-black font-semibold text-lg font--inter hover:bg-[#c4a030] transition-colors flex items-center gap-3 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Open Invitation</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Main Page Component
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [showWelcome, setShowWelcome] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lock body scroll when welcome overlay is shown
  useEffect(() => {
    if (showWelcome) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showWelcome]);

  const handleEnter = async () => {
    setShowWelcome(false);

    // Fire confetti boom effect
    setTimeout(() => {
      fireConfetti();
    }, 300);

    // Start music on enter - Royalty-free romantic song with vocals
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3"
      );
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      console.log("Autoplay failed, user can use music button");
    }
  };
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Wedding details
  const weddingDate = new Date("2026-02-03T12:00:00");
  const groomName = "Vikram";
  const brideName = "Shagun";

  return (
    <div ref={containerRef} className="min-h-screen bg-background relative">
      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && <WelcomeOverlay onEnter={handleEnter} />}
      </AnimatePresence>

      <FloatingParticles />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden md:py-16">
        {/* Ambient Gold Glow */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 opacity-20"
        >
          <div className="absolute top-1/6 left-1/4 w-md h-80 bg-[#d4af37] rounded-full blur-[180px]" />
          <div className="absolute top-1/6 right-1/4 w-md h-80 bg-[#d4af37] rounded-full blur-[180px]" />
        </motion.div>

        <BackgroundAccessories />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-4xl w-full text-center"
        >
          {/* Sacred Verse */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-5 font-playfair text-[#d4af37]/80 leading-relaxed tracking-wide"
            style={{ fontSize: "var(--fs-sacred)" }}
          >
            वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
            <br />
            निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
          </motion.p>

          {/* Narrative */}
          <div className="">
            <p
              className="font-cormorant text-foreground leading-relaxed"
              style={{ fontSize: "var(--fs-body)" }}
            >
              With the divine blessings of Lord Ganesha,
            </p>

            <p
              className="font-cormorant text-foreground leading-relaxed"
              style={{ fontSize: "var(--fs-body)" }}
            >
              and the loving remembrance of our revered grandparents
            </p>

            <p
              className="font-cormorant text-muted leading-relaxed"
              style={{ fontSize: "var(--fs-lead)" }}
            >
              <span className="font-semibold text-foreground whitespace-nowrap">
                Late Smt. Ram Devi
              </span>
              <br />
              <span className="font-semibold text-foreground whitespace-nowrap">
                Late Sh. Bhoop Ram Shan
              </span>
            </p>

            <p
              className="pt-4 font-cormorant text-foreground leading-relaxed"
              style={{ fontSize: "var(--fs-body)" }}
            >
              <span className="font-semibold text-foreground">
                Mrs. Koshaliya Devi & Mr. Chamail Singh
              </span>
              <br />
              cordially invite you and your esteemed family
            </p>

            <p
              className="font-cormorant text-foreground leading-relaxed"
              style={{ fontSize: "var(--fs-body)" }}
            >
              to grace the auspicious wedding ceremony of their beloved son
            </p>
          </div>

          {/* Names */}
          <div className="my-6 space-y-6">
            <p
              className="font-playfair text-[#d4af37] font-bold tracking-wide"
              style={{ fontSize: "var(--fs-name)" }}
            >
              {groomName}
            </p>

            <p className="font-cormorant text-muted tracking-widest uppercase text-sm">
              with
            </p>

            <p
              className="font-playfair text-[#d4af37] font-bold tracking-wide"
              style={{ fontSize: "var(--fs-name)" }}
            >
              {brideName}
            </p>
          </div>

          {/* Bride Parents */}
          <p
            className="pt-4 font-cormorant text-foreground leading-relaxed"
            style={{ fontSize: "var(--fs-body)" }}
          >
            beloved daughter of <br />
            <span className="font-semibold text-foreground">
              Smt. Madhu Bala Dubey & Sh. Desh Rattan Dubey
            </span>
          </p>
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="p-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <CountdownTimer targetDate={weddingDate} />
        </div>
      </section>

      <div className="section-divider max-w-2xl mx-auto" />

      {/* Events Section */}
      <section className="px-4 relative">
        {/* Subtle Corner Decorations */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 pointer-events-none z-0"
        >
          <div className="absolute top-0 right-0 w-40 h-40 md:w-56 md:h-56 overflow-visible">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              fill="none"
              stroke="#d4af37"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.2"
            >
              <path d="M200 30 Q170 20, 150 40 T110 50 T80 40" />
              <path d="M200 0 Q185 25, 175 55" />
            </svg>
          </div>
        </motion.div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <p className="text-2xl md:text-3xl text-[#d4af37] font-cormorant">
                ⸻
              </p>
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-playfair text-[#d4af37] mb-4">
              Wedding Festivities
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <EventCard
              title="Mehendi Ceremony & Lunch"
              date="3rd February 2026"
              time="12:00 PM"
              venue="Sahib Guest House"
              address=""
              delay={0}
            />
            <EventCard
              title="Haldi (Saant) Ceremony & Lunch"
              date="4th February 2026"
              time="11:00 AM"
              venue="Sahib Guest House"
              address=""
              delay={0.2}
            />
          </div>

          {/* Venue Map Section */}
          <VenueMap
            mapUrl="https://www.google.com/maps?q=Sahib+Guest+House+Jammu&output=embed"
            venue="Sahib Guest House"
            address="Jammu"
          />

          {/* Parking Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-base md:text-lg font-cormorant text-foreground mb-2">
              Separate parking area available
            </p>
            <a
              href="https://maps.app.goo.gl/tY1KEge2BgufRSi27?g_st=iw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm md:text-base font-cormorant text-[#d4af37] hover:text-[#c4a030] transition-colors underline"
            >
              View Parking Location
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 md:py-24 px-4 text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#d4af37] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#8B0000] rounded-full blur-[100px]" />
        </div>

        {/* Modern Corner Decorations */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 pointer-events-none z-0"
        >
          <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 overflow-visible">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              fill="none"
              stroke="#8B0000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.2"
            >
              <path d="M0 50 Q40 30, 70 45 T140 50" />
              <path d="M30 0 Q0 35, 25 65" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 overflow-visible">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              fill="none"
              stroke="#d4af37"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.2"
            >
              <path d="M200 150 Q160 170, 130 155 T60 150" />
              <path d="M170 200 Q200 165, 175 135" />
            </svg>
          </div>
        </motion.div>

        {/* Subtle Background Accessories */}
        <BackgroundAccessories />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#d4af37]" />
            <div className="w-2 h-2 rounded-full bg-[#d4af37] rotate-45" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 flex flex-wrap items-center justify-center gap-3 md:gap-4"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair text-[#d4af37] leading-tight">
              {groomName}
            </h2>
            <motion.span
              initial={{ scale: 0, rotate: -45 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="text-2xl md:text-4xl text-[#d4af37] font-cormorant font-light italic"
            >
              &amp;
            </motion.span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair text-[#d4af37] leading-tight">
              {brideName}
            </h2>
          </motion.div>

          {/* Presence Message */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <p className="text-lg md:text-xl font-cormorant text-foreground leading-relaxed mb-6">
              Your gracious presence and heartfelt blessings
            </p>
            <p className="text-lg md:text-xl font-cormorant text-foreground leading-relaxed">
              will add joy, warmth, and meaning to our celebration.
            </p>
          </motion.div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#d4af37]" />
            <div className="w-2 h-2 rounded-full bg-[#d4af37] rotate-45" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <p className="text-base md:text-lg font-cormorant text-muted mb-4">
              For queries reach out to:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-base md:text-lg font-cormorant">
              <a
                href="tel:+919906016244"
                className="text-foreground hover:text-[#d4af37] transition-colors"
              >
                9906016244
              </a>
              <span className="text-muted">•</span>
              <a
                href="tel:+917006751473"
                className="text-foreground hover:text-[#d4af37] transition-colors"
              >
                7006751473
              </a>
            </div>
          </motion.div>

          {/* Social links */}
          <div className="mt-4 flex justify-center gap-6 items-center">
            <motion.a
              href="https://www.instagram.com/dr_vvvs/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, color: "#d4af37" }}
              className="text-muted transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </motion.a>
            {/* Share Button */}
            <ShareButton />
          </div>
        </motion.div>
      </footer>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-36 right-6 flex flex-col items-center gap-2 z-50"
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#d4af37]/50 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"
          />
        </div>
        <span className="text-xs font-cormorant text-muted uppercase tracking-wider">
          Scroll
        </span>
      </motion.div>

      {/* Music Player */}
      <MusicPlayer
        audioRef={audioRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
}

// Theme Toggle Component
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      onClick={() => setIsDark(!isDark)}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full glass border border-[#d4af37]/30 flex items-center justify-center z-50 hover:border-[#d4af37]/60 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.svg
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            className="w-5 h-5 text-[#d4af37]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </motion.svg>
        ) : (
          <motion.svg
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            className="w-5 h-5 text-[#d4af37]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Music Player Component
const MusicPlayer = ({
  audioRef,
  isPlaying,
  setIsPlaying,
}: {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}) => {
  const toggleMusic = async () => {
    // Create audio on first click (required for mobile browsers)
    if (!audioRef.current) {
      // Royalty-free romantic song with vocals
      audioRef.current = new Audio(
        "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3"
      );
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log("Playback error:", error);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2 }}
      onClick={toggleMusic}
      className="fixed bottom-20 right-6 w-12 h-12 rounded-full glass border border-[#d4af37]/30 flex items-center justify-center z-50 hover:border-[#d4af37]/60 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.div
            key="playing"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-0.5"
          >
            {/* Animated sound bars */}
            {[1, 2, 3].map((bar) => (
              <motion.div
                key={bar}
                className="w-1 bg-[#d4af37] rounded-full"
                animate={{
                  height: ["8px", "16px", "8px"],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: bar * 0.1,
                }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.svg
            key="paused"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-5 h-5 text-[#d4af37]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
