"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

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

// Floating particles component
const FloatingParticles = () => {
  const windowSize = useWindowSize();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {PARTICLE_DATA.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#d4af37] rounded-full opacity-40"
          initial={{
            x: particle.initialX * windowSize.width,
            y: particle.initialY * windowSize.height,
          }}
          animate={{
            y: [null, -100, windowSize.height + 100],
            x: [null, particle.animateX],
            opacity: [0.4, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};

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
                  className="text-2xl md:text-4xl font-bold gradient-text font-playfair"
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
              className="text-2xl md:text-4xl font-playfair gradient-text"
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
  mapUrl,
  delay = 0,
}: {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
  delay?: number;
}) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className="glass rounded-3xl p-6 md:p-8 border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all duration-500"
    >
      <motion.h3
        className="text-2xl md:text-3xl font-playfair gradient-text mb-6 text-center"
        whileHover={{ scale: 1.02 }}
      >
        {title}
      </motion.h3>

      <div className="space-y-4 mb-6">
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

      {/* Map */}
      <div className="map-container relative h-48 md:h-64 rounded-2xl overflow-hidden">
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
          address
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-[#d4af37]/30 hover:bg-[#d4af37]/10 transition-all duration-300"
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
          <span className="font-playfair text-lg gradient-text">
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
    const message = ` ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
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
        whileHover={{ scale: 1.1, color: "#d4af37" }}
        className="text-muted transition-colors"
      >
        <svg
          className="w-6 h-6"
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
            <span className="text-5xl">💍</span>
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
          className="text-4xl md:text-6xl font-playfair gradient-text mb-8"
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

  // Wedding details - UPDATE THESE
  const weddingDate = new Date("2025-02-15T10:00:00");
  const groomName = "Groom's Name";
  const brideName = "Bride's Name";

  return (
    <div ref={containerRef} className="min-h-screen bg-background relative">
      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && <WelcomeOverlay onEnter={handleEnter} />}
      </AnimatePresence>

      <FloatingParticles />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
        {/* Animated Background */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 opacity-20"
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37] rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d4af37] rounded-full blur-[150px]" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          {/* Wedding Invitation Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted uppercase tracking-[0.3em] text-sm md:text-base mb-8 font-inter"
          >
            We&apos;re Getting Married
          </motion.p>

          {/* Names */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair gradient-text leading-tight">
              {groomName}
            </h1>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="my-4 md:my-6"
            >
              <span className="text-4xl md:text-6xl text-[#d4af37] font-cormorant">
                &amp;
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair gradient-text leading-tight">
              {brideName}
            </h1>
          </motion.div>

          <Divider />

          {/* Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mb-12"
          >
            <p className="text-2xl md:text-3xl font-cormorant)] text-foreground">
              Saturday, February 15th, 2025
            </p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1.5, y: { repeat: Infinity, duration: 2 } }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border-2 border-[#d4af37]/50 flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 md:py-32 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-playfair gradient-text mb-4"
          >
            Counting Down To Forever
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted mb-12 font-cormorant text-xl"
          >
            The beginning of our beautiful journey together
          </motion.p>
          <CountdownTimer targetDate={weddingDate} />
        </div>
      </section>

      <div className="section-divider max-w-2xl mx-auto" />

      {/* Love Story Section */}
      <section className="py-20 md:py-32 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-playfair gradient-text mb-4">
              Our Love Story
            </h2>
            <p className="text-muted font-cormorant text-xl">
              A tale written in the stars
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12 border border-[#d4af37]/20"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                className="text-6xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                ❤️
              </motion.div>
            </div>
            <p className="text-center text-lg md:text-xl font-cormorant leading-relaxed text-foreground">
              &ldquo;Every love story is beautiful, but ours is my favorite.
              From the moment we met, we knew that something magical was
              beginning. Through laughter and tears, through challenges and
              triumphs, our love has only grown stronger. Now, we invite you to
              celebrate with us as we begin the next chapter of our journey
              together.&rdquo;
            </p>
          </motion.div>
        </div>
      </section>

      <div className="section-divider max-w-2xl mx-auto" />

      {/* Events Section */}
      <section className="py-20 md:py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-playfair gradient-text mb-4">
              Wedding Events
            </h2>
            <p className="text-muted font-cormorant text-xl">
              Join us for these special celebrations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <EventCard
              title="Wedding Ceremony"
              date="Saturday, February 15th, 2025"
              time="10:00 AM - 12:00 PM"
              venue="Grand Wedding Hall"
              address="123 Wedding Street, City, Country 12345"
              mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007!5e0!3m2!1sen!2sus!4v1645564756836!5m2!1sen!2sus"
              delay={0}
            />
            <EventCard
              title="Wedding Reception"
              date="Saturday, February 15th, 2025"
              time="6:00 PM - 11:00 PM"
              venue="Elegant Banquet Hall"
              address="456 Celebration Avenue, City, Country 12345"
              mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007!5e0!3m2!1sen!2sus!4v1645564756836!5m2!1sen!2sus"
              delay={0.2}
            />
          </div>

          {/* Save the Date Button */}
          <SaveTheDateButton
            eventDate={weddingDate}
            eventTitle={`${groomName} & ${brideName}'s Wedding`}
          />
        </div>
      </section>

      <div className="section-divider max-w-2xl mx-auto" />

      {/* Footer */}
      <footer className="py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-playfair gradient-text mb-6">
            {groomName} & {brideName}
          </h2>
          <p className="text-muted font-cormorant text-xl mb-4">
            February 15, 2025
          </p>
          <p className="text-muted text-sm font-inter">
            Made with ❤️ for a beautiful celebration
          </p>
          <div className="mt-8 flex justify-center gap-6 items-center">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, color: "#d4af37" }}
              className="text-muted transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, color: "#d4af37" }}
              className="text-muted transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </motion.a>
            {/* Share Button */}
            <ShareButton />
          </div>
        </motion.div>
      </footer>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Music Player */}
      <MusicPlayer
        audioRef={audioRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
    </div>
  );
}

// Theme Toggle Component
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

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
      className="fixed bottom-6 right-20 w-12 h-12 rounded-full glass border border-[#d4af37]/30 flex items-center justify-center z-50 hover:border-[#d4af37]/60 transition-colors"
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
