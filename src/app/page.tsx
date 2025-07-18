"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
  type MotionValue,
} from "framer-motion";
import {
  FiAperture,
  FiImage,
  FiLayers,
  FiSettings,
  FiDownload,
  FiStar,
  FiCheck,
  FiArrowRight,
  FiGithub,
  FiTwitter,
  FiInstagram,
  FiX,
  FiHeart,
  FiUser,
} from "react-icons/fi";

interface GalleryItem {
  id: number;
  category: string;
  title: string;
  image: string;
  height: string;
}

interface PricingPlan {
  id: string;
  title: string;
  price: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

interface MousePosition {
  x: number;
  y: number;
}

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel&display=swap');

  .font-cinzel {
    font-family: 'Cinzel', serif;
  }
  
  .heading-cinzel {
    font-family: 'Cinzel', serif;
    letter-spacing: 0.02em;
  }

html {
  scroll-behavior: smooth;
}

/* For Safari and older browsers */
@media screen and (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

.will-change-transform {
  will-change: transform;
}

.will-change-opacity {
  will-change: opacity;
}

@media (max-width: 640px) {
  html {
    font-size: 14px;
  }
  
  .heading-cinzel {
    letter-spacing: 0.01em;
  }
}

/* Improve touch targets for mobile */
@media (max-width: 640px) {
  button, 
  a.button,
  .interactive-element {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Optimize animations for mobile */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      ease: "easeOut",
    },
  },
};

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    category: "portrait",
    title: "AI Portrait Study",
    image:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    height: "h-64",
  },
  {
    id: 2,
    category: "landscape",
    title: "Digital Landscape",
    image:
      "https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    height: "h-80",
  },
  {
    id: 3,
    category: "abstract",
    title: "Abstract Composition",
    image:
      "https://images.unsplash.com/photo-1637611331620-51149c7ceb94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    height: "h-72",
  },
  {
    id: 4,
    category: "portrait",
    title: "Character Design",
    image:
      "https://images.unsplash.com/photo-1626544827763-d516dce335e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    height: "h-96",
  },
  {
    id: 5,
    category: "landscape",
    title: "Futuristic Cityscape",
    image:
      "https://images.unsplash.com/photo-1655635949212-1d8f4f103ea1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    height: "h-64",
  },
  {
    id: 6,
    category: "abstract",
    title: "Geometric Patterns",
    image:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80",
    height: "h-80",
  },
  {
    id: 7,
    category: "abstract",
    title: "Abstract Waves",
    image:
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    height: "h-72",
  },
  {
    id: 8,
    category: "landscape",
    title: "Fantasy World",
    image:
      "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    height: "h-96",
  },
  {
    id: 9,
    category: "portrait",
    title: "Cyberpunk Character",
    image:
      "https://images.unsplash.com/photo-1624395213232-ea2bcd36b865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    height: "h-88",
  },
];
const additionalGalleryItems: GalleryItem[] = [
  {
    id: 10,
    category: "portrait",
    title: "Digital Self Portrait",
    image:
      "https://images.unsplash.com/photo-1618172193763-c511deb635ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
    height: "h-72",
  },
  {
    id: 11,
    category: "landscape",
    title: "Neon City",
    image:
      "https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    height: "h-80",
  },
  {
    id: 12,
    category: "abstract",
    title: "Fluid Dynamics",
    image:
      "https://images.unsplash.com/photo-1614851099511-773084f6911d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    height: "h-64",
  },
];

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    title: "Starter",
    price: "$9",
    features: [
      "10 AI paintings per month",
      "Basic editing tools",
      "720p resolution",
      "Email support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    id: "pro",
    title: "Pro",
    price: "$29",
    features: [
      "100 AI paintings per month",
      "Advanced editing tools",
      "4K resolution",
      "Style transfer",
      "Priority support",
    ],
    cta: "Try Pro",
    highlighted: true,
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: "$99",
    features: [
      "Unlimited AI paintings",
      "All Pro features",
      "API access",
      "Custom model training",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function AIPaintingTool() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [scrolled, setScrolled] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userName, setUserName] = useState("");

  const [savedItems, setSavedItems] = useState<GalleryItem[]>([]);
  const [showMoreGallery, setShowMoreGallery] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [promptText, setPromptText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("realistic");

  const cursorRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const { scrollYProgress: featuresYProgress } = useScroll({
    target: featuresRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: galleryYProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"],
  });

  const useParallax = (value: MotionValue<number>, distance: number) => {
    return useTransform(value, [0, 1], [-distance, distance]);
  };

  const featuresParallax = useParallax(featuresYProgress, 100);
  const galleryParallax = useParallax(galleryYProgress, 100);
  const allGalleryItems = useMemo(
    () =>
      showMoreGallery
        ? [...galleryItems, ...additionalGalleryItems]
        : galleryItems,
    [showMoreGallery]
  );

  const filteredGallery = useMemo(
    () =>
      activeTab === "all"
        ? allGalleryItems
        : allGalleryItems.filter((item) => item.category === activeTab),
    [activeTab, allGalleryItems]
  );

  const cursorVariants: Variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      opacity: 0.5,
    },
    button: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 40,
      width: 40,
      opacity: 0.8,
      backgroundColor: "rgba(168, 85, 247, 0.5)",
      mixBlendMode: "difference" as const,
    },
    text: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 64,
      width: 64,
      opacity: 0.2,
      backgroundColor: "rgba(168, 85, 247, 0.2)",
      mixBlendMode: "difference" as const,
    },
  };

  const enterButton = useCallback(() => setCursorVariant("button"), []);
  const enterText = useCallback(() => setCursorVariant("text"), []);
  const leaveButton = useCallback(() => setCursorVariant("default"), []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  }, []);

  const handleSaveItem = useCallback(
    (item: GalleryItem) => {
      if (!isLoggedIn) {
        setShowLoginModal(true);
        return;
      }

      if (savedItems.some((savedItem) => savedItem.id === item.id)) {
        setSavedItems(
          savedItems.filter((savedItem) => savedItem.id !== item.id)
        );
        showToast("Removed from saved items");
      } else {
        setSavedItems([...savedItems, item]);
        showToast("Added to saved items");
      }
    },
    [isLoggedIn, savedItems, showToast]
  );

  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (userEmail && userPassword) {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        showToast("Successfully logged in");
      }
    },
    [userEmail, userPassword, showToast]
  );

  const handleSignup = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (userEmail && userPassword && userName) {
        setIsLoggedIn(true);
        setShowSignupModal(false);
        showToast("Account created successfully");
      }
    },
    [userEmail, userPassword, userName, showToast]
  );

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    showToast("Successfully logged out");
  }, [showToast]);

  const handleCreateArt = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!promptText) {
        showToast("Please enter a prompt");
        return;
      }

      showToast("Creating your artwork...");
      setTimeout(() => {
        setShowCreateModal(false);
        showToast("Your artwork has been created!");
      }, 2000);
    },
    [promptText, showToast]
  );

  const handleSelectPlan = useCallback(
    (plan: PricingPlan) => {
      if (!isLoggedIn) {
        setShowLoginModal(true);
        return;
      }

      setSelectedPlan(plan);
      setShowPricingModal(true);
    },
    [isLoggedIn]
  );
  const handlePurchasePlan = useCallback(() => {
    if (selectedPlan) {
      showToast(`Successfully subscribed to ${selectedPlan.title} plan!`);
      setShowPricingModal(false);
    }
  }, [selectedPlan, showToast]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <style jsx global>
        {fontStyles}
      </style>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
              "radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
              "radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
              "radial-gradient(circle at 60% 20%, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
              "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
            ],
          }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        />

        <div className="absolute inset-0">
          <motion.div
            className="absolute top-[10%] left-[20%] w-64 h-64 rounded-full border border-purple-200/20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />

          <motion.div
            className="absolute top-[60%] left-[70%] w-48 h-48 border border-pink-200/20"
            animate={{
              rotate: [0, 180, 360],
              opacity: [0.1, 0.2, 0.1],
              borderRadius: ["0%", "25%", "0%"],
            }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />

          <svg
            className="absolute top-[30%] right-[10%] w-56 h-56 opacity-10"
            viewBox="0 0 100 100"
          >
            <motion.path
              d="M50 15 L90 85 L10 85 Z"
              stroke="rgba(219, 39, 119, 0.2)"
              strokeWidth="1"
              fill="none"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />
          </svg>
        </div>

        <svg className="absolute inset-0 w-full h-full opacity-[0.05]">
          <motion.path
            d="M0,100 Q250,50 500,100 T1000,100"
            stroke="url(#gradient1)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              d: [
                "M0,100 Q250,50 500,100 T1000,100",
                "M0,100 Q250,150 500,100 T1000,100",
                "M0,100 Q250,50 500,100 T1000,100",
              ],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.path
            d="M0,300 Q250,250 500,300 T1000,300"
            stroke="url(#gradient2)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              d: [
                "M0,300 Q250,250 500,300 T1000,300",
                "M0,300 Q250,350 500,300 T1000,300",
                "M0,300 Q250,250 500,300 T1000,300",
              ],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 2,
            }}
          />
          <motion.path
            d="M0,500 Q250,450 500,500 T1000,500"
            stroke="url(#gradient3)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              d: [
                "M0,500 Q250,450 500,500 T1000,500",
                "M0,500 Q250,550 500,500 T1000,500",
                "M0,500 Q250,450 500,500 T1000,500",
              ],
            }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 4,
            }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>

        {[...Array(15)].map((_, index) => {
          const size = 4 + (index % 4) * 2;
          const positions = [
            { x: "10%", y: "20%" },
            { x: "20%", y: "40%" },
            { x: "30%", y: "70%" },
            { x: "40%", y: "30%" },
            { x: "50%", y: "60%" },
            { x: "60%", y: "20%" },
            { x: "70%", y: "50%" },
            { x: "80%", y: "30%" },
            { x: "90%", y: "70%" },
            { x: "15%", y: "80%" },
            { x: "25%", y: "10%" },
            { x: "35%", y: "50%" },
            { x: "45%", y: "90%" },
            { x: "55%", y: "30%" },
            { x: "65%", y: "60%" },
          ];

          return (
            <motion.div
              key={`dot-${index}`}
              className={`absolute rounded-full bg-purple-300/10`}
              style={{
                left: positions[index].x,
                top: positions[index].y,
                width: size,
                height: size,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + (index % 4),
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            />
          );
        })}
      </div>

      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full bg-purple-500 pointer-events-none z-50 hidden md:block"
        variants={cursorVariants}
        animate={cursorVariant}
      />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-purple-600 z-50 origin-left"
        style={{ scaleX }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-gradient-to-r from-purple-300/10 to-blue-300/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-[40%] right-[10%] w-96 h-96 rounded-full bg-gradient-to-l from-pink-300/10 to-purple-300/10 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[20%] w-80 h-80 rounded-full bg-gradient-to-tr from-blue-300/10 to-teal-300/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 22,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </div>

      <nav
        className={`${
          scrolled
            ? "bg-white/70 backdrop-blur-lg shadow-sm"
            : "bg-white/80 backdrop-blur-sm"
        } border-b border-gray-100 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 z-40 transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between h-16">
            <div className="flex items-center w-1/4 md:w-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="flex-shrink-0 flex items-center"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <FiAperture className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </motion.div>
                <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900 font-cinzel">
                  ArtifyAI
                </span>
              </motion.div>
            </div>

            <div className="hidden sm:flex sm:items-center sm:justify-center sm:space-x-4 md:space-x-8 w-2/4 font-cinzel">
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("features");
                }}
                className="border-transparent text-gray-500 hover:border-purple-500 hover:text-purple-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                onMouseEnter={enterButton}
                onMouseLeave={leaveButton}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("how-it-works");
                }}
                className="border-transparent text-gray-500 hover:border-purple-500 hover:text-purple-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                onMouseEnter={enterButton}
                onMouseLeave={leaveButton}
              >
                How It Works
              </a>
              <a
                href="#gallery"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("gallery");
                }}
                className="border-transparent text-gray-500 hover:border-purple-500 hover:text-purple-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                onMouseEnter={enterButton}
                onMouseLeave={leaveButton}
              >
                Gallery
              </a>
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("pricing");
                }}
                className="border-transparent text-gray-500 hover:border-purple-500 hover:text-purple-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                onMouseEnter={enterButton}
                onMouseLeave={leaveButton}
              >
                Pricing
              </a>
            </div>

            <div className="hidden sm:flex items-center">
              {isLoggedIn ? (
                <div className="relative group">
                  <button
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                    onMouseEnter={enterButton}
                    onMouseLeave={leaveButton}
                  >
                    <FiUser className="h-5 w-5" />
                    <span className="text-sm">Account</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full text-left"
                    >
                      Create Artwork
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="inline-flex items-center px-4 py-2 text-xs uppercase tracking-widest font-medium rounded-full text-black bg-white border-none shadow-[0px_8px_15px_rgba(0,0,0,0.1)] hover:bg-purple-600 hover:text-white hover:shadow-[0px_15px_20px_rgba(124,58,237,0.4)] transition-all duration-300 ease-in-out"
                  onMouseEnter={enterButton}
                  onMouseLeave={leaveButton}
                >
                  Sign In
                </button>
              )}
            </div>

            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="sm:hidden overflow-hidden"
            >
              <div className="pt-2 pb-3 space-y-1">
                <a
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("features");
                    setIsMenuOpen(false);
                  }}
                  className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-purple-500 hover:text-purple-700"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("how-it-works");
                    setIsMenuOpen(false);
                  }}
                  className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-purple-500 hover:text-purple-700"
                >
                  How It Works
                </a>
                <a
                  href="#gallery"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("gallery");
                    setIsMenuOpen(false);
                  }}
                  className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-purple-500 hover:text-purple-700"
                >
                  Gallery
                </a>
                <a
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("pricing");
                    setIsMenuOpen(false);
                  }}
                  className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-purple-500 hover:text-purple-700"
                >
                  Pricing
                </a>
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="mt-3 space-y-1">
                  {isLoggedIn ? (
                    <>
                      <button
                        onClick={() => {
                          setShowCreateModal(true);
                          setIsMenuOpen(false);
                        }}
                        className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-purple-500 hover:text-purple-700 w-full text-left"
                      >
                        Create Artwork
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-purple-500 hover:text-purple-700 w-full text-left"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center px-8 py-4 text-xs uppercase tracking-widest font-medium rounded-full text-black bg-white border-none shadow-[0px_8px_15px_rgba(0,0,0,0.1)] hover:bg-purple-600 hover:text-white hover:shadow-[0px_15px_20px_rgba(124,58,237,0.4)] transition-all duration-300 ease-in-out"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section
        ref={heroRef}
        className="relative bg-white overflow-hidden pt-16 md:pt-20"
      >
        <div className="absolute inset-0 pointer-events-none z-0">
          <motion.div
            className="absolute top-20 left-[10%] w-12 h-12 sm:w-20 sm:h-20 rounded-full border-2 border-purple-200"
            initial={{ y: 0 }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-[20%] w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-blue-200"
            initial={{ y: 0 }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              delay: 0.5,
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-[30%] w-10 h-10 sm:w-16 sm:h-16 rounded-full border-2 border-pink-200"
            initial={{ y: 0 }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              delay: 1,
              duration: 4.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.svg
            className="absolute top-[20%] right-[5%] w-32 h-32 sm:w-64 sm:h-64 text-purple-100 opacity-30"
            viewBox="0 0 200 200"
            initial={{ rotate: 0 }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <path
              fill="currentColor"
              d="M44.5,-76.3C59.3,-69.9,74.1,-60.5,83.2,-46.7C92.3,-32.9,95.7,-14.6,93.8,2.8C91.9,20.2,84.8,36.6,74.1,50.8C63.4,65,49.1,77,33.1,82.5C17.1,88,0.3,87,-15.8,83.1C-31.9,79.2,-47.3,72.4,-60.1,61.5C-72.9,50.6,-83.1,35.7,-87.3,19.2C-91.6,2.7,-89.9,-15.3,-83.1,-30.9C-76.3,-46.5,-64.4,-59.7,-50,-68.4C-35.6,-77.1,-18.8,-81.3,-1.7,-78.8C15.5,-76.3,29.7,-82.7,44.5,-76.3Z"
              transform="translate(100 100)"
            />
          </motion.svg>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="sm:text-center lg:text-left"
                onMouseEnter={enterText}
                onMouseLeave={leaveButton}
              >
                <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl heading-cinzel">
                  <motion.span
                    className="block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    Transform your ideas into
                  </motion.span>
                  <motion.span
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-size-200 animate-gradient"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    stunning artwork with AI
                  </motion.span>
                </h1>
                <motion.p
                  className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 font-cinzel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Create beautiful, unique paintings in seconds with our
                  advanced AI technology. No artistic skills required - just
                  describe what you want, and watch the magic happen.
                </motion.p>
                <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                  <motion.div
                    whileHover={{ y: -7 }}
                    whileTap={{ y: -1 }}
                    className="transition-all duration-300 ease-in-out w-full sm:w-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <button
                      onClick={() => {
                        if (isLoggedIn) {
                          setShowCreateModal(true);
                        } else {
                          setShowLoginModal(true);
                        }
                      }}
                      className="w-full flex items-center justify-center px-8 py-4 sm:py-3 text-xs uppercase tracking-widest font-medium rounded-full text-black bg-white border-none shadow-[0px_8px_15px_rgba(0,0,0,0.1)] hover:bg-purple-600 hover:text-white hover:shadow-[0px_15px_20px_rgba(124,58,237,0.4)] cursor-pointer outline-none"
                      onMouseEnter={enterButton}
                      onMouseLeave={leaveButton}
                    >
                      Start Creating
                    </button>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -7 }}
                    whileTap={{ y: -1 }}
                    className="mt-3 sm:mt-0 transition-all duration-300 ease-in-out w-full sm:w-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <button
                      onClick={() => scrollToSection("gallery")}
                      className="w-full flex items-center justify-center px-8 py-4 sm:py-3 text-xs uppercase tracking-widest font-medium rounded-full text-black bg-white border-none shadow-[0px_8px_15px_rgba(0,0,0,0.1)] hover:bg-purple-600 hover:text-white hover:shadow-[0px_15px_20px_rgba(124,58,237,0.4)] cursor-pointer outline-none"
                      onMouseEnter={enterButton}
                      onMouseLeave={leaveButton}
                    >
                      View Gallery
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 mt-8 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full overflow-hidden"
          >
            <motion.img
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
              alt="AI art creation"
              initial={{ scale: 1.1 }}
              animate={{
                scale: 1,
                filter: ["brightness(1)", "brightness(1.05)", "brightness(1)"],
              }}
              transition={{
                scale: { duration: 1.5 },
                filter: {
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                },
              }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            />
          </motion.div>
        </div>
      </section>

      <section
        id="features"
        ref={featuresRef}
        className="py-12 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="absolute top-10 right-10 w-40 h-40 rounded-full bg-purple-100/30 blur-xl"
            style={{ y: featuresParallax }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="lg:text-center relative z-10"
          >
            <motion.h2
              className="text-base text-purple-600 font-semibold tracking-wide uppercase font-cinzel"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Features
            </motion.h2>
            <motion.p
              className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl heading-cinzel"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Everything you need to create stunning AI art
            </motion.p>
            <motion.p
              className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Our powerful AI understands your vision and brings it to life with
              precision and creativity.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mt-10"
          >
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <motion.div
                variants={fadeIn}
                className="relative px-4 py-4 sm:p-0"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <dt>
                  <motion.div
                    className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    whileHover={{ rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiImage className="h-6 w-6" />
                  </motion.div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 font-cinzel">
                    Style Variety
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Choose from dozens of artistic styles, from Renaissance to
                  Cyberpunk, or create your own unique blend.
                </dd>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="relative px-4 py-4 sm:p-0"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <dt>
                  <motion.div
                    className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    whileHover={{ rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiLayers className="h-6 w-6" />
                  </motion.div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 font-cinzel">
                    Layer Control
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Fine-tune your creations with advanced layer controls,
                  allowing for precise adjustments.
                </dd>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="relative px-4 py-4 sm:p-0"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <dt>
                  <motion.div
                    className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    whileHover={{ rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiSettings className="h-6 w-6" />
                  </motion.div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 font-cinzel">
                    Advanced Customization
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Control every aspect of your creation with intuitive sliders
                  for color, composition, and detail.
                </dd>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="relative px-4 py-4 sm:p-0"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <dt>
                  <motion.div
                    className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    whileHover={{ rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiDownload className="h-6 w-6" />
                  </motion.div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 font-cinzel">
                    High-Resolution Export
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Download your creations in ultra-high resolution, perfect for
                  printing or digital display.
                </dd>
              </motion.div>
            </dl>
          </motion.div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-16 bg-white overflow-hidden relative"
      >
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute left-0 top-0 h-48 w-48 text-purple-50"
            viewBox="0 0 200 200"
            fill="none"
          >
            <defs>
              <pattern
                id="pattern-circles"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern-circles)" />
          </svg>

          <svg
            className="absolute right-0 bottom-0 h-48 w-48 text-purple-50"
            viewBox="0 0 200 200"
            fill="none"
          >
            <defs>
              <pattern
                id="pattern-circles-2"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern-circles-2)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="lg:text-center mb-12"
          >
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">
              How It Works
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl heading-cinzel">
              Create masterpieces in three simple steps
            </p>
          </motion.div>

          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-lg font-medium text-gray-900">
                The Process
              </span>
            </div>
          </div>

          <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-3 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center relative"
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mx-auto"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="text-xl font-bold"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  1
                </motion.span>
              </motion.div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">
                Describe Your Vision
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Use natural language to describe the artwork you want to create.
                Be as detailed or abstract as you like.
              </p>
              <motion.div
                className="hidden lg:block absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-200 to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 lg:mt-0 text-center relative"
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mx-auto"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="text-xl font-bold"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.3,
                  }}
                >
                  2
                </motion.span>
              </motion.div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">
                AI Creates Your Artwork
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Our advanced AI processes your description and generates
                multiple variations of your artwork in seconds.
              </p>

              <motion.div
                className="hidden lg:block absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-200 to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 lg:mt-0 text-center"
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mx-auto"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="text-xl font-bold"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.6,
                  }}
                >
                  3
                </motion.span>
              </motion.div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">
                Refine and Download
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Fine-tune your favorite version with our intuitive editing
                tools, then download in your preferred format.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg overflow-hidden shadow-xl"
            whileHover={{
              y: -5,
              boxShadow: "0 25px 50px -12px rgba(124, 58, 237, 0.25)",
            }}
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Ready to create your first AI masterpiece?
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Join thousands of creators who are already using ArtifyAI
                      to bring their artistic visions to life.
                    </p>
                  </div>
                </div>
                <div className="md:w-1/3 flex justify-center md:justify-end">
                  <motion.button
                    whileHover={{ y: -7 }}
                    whileTap={{ y: -1 }}
                    onClick={() => {
                      if (isLoggedIn) {
                        setShowCreateModal(true);
                      } else {
                        setShowLoginModal(true);
                      }
                    }}
                    className="inline-flex items-center px-8 py-3 text-xs uppercase tracking-widest font-medium rounded-full text-black bg-white border-none shadow-[0px_8px_15px_rgba(0,0,0,0.1)] hover:bg-purple-600 hover:text-white hover:shadow-[0px_15px_20px_rgba(124,58,237,0.4)] transition-all duration-300 ease-in-out"
                    onMouseEnter={enterButton}
                    onMouseLeave={leaveButton}
                  >
                    Start Creating Now
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <FiArrowRight className="ml-2" />
                    </motion.div>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="gallery"
        ref={galleryRef}
        className="py-16 bg-gradient-to-br from-purple-50 via-gray-50 to-blue-50 relative overflow-hidden"
      >
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 blur-3xl"
          style={{ y: galleryParallax }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-200/20 to-purple-200/20 blur-3xl"
          style={{ y: galleryParallax }}
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 2,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">
              Gallery
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl heading-cinzel">
              Explore AI-generated masterpieces
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Browse through a collection of stunning artwork created with our
              AI technology.
            </p>
          </motion.div>

          <div className="flex justify-center mb-8 flex-wrap gap-2">
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ y: -1 }}
              onClick={() => setActiveTab("all")}
              className={`px-4 sm:px-6 py-2 text-xs uppercase tracking-widest font-medium rounded-full ${
                activeTab === "all"
                  ? "bg-purple-600 text-white shadow-[0px_8px_15px_rgba(124,58,237,0.4)]"
                  : "bg-white text-black shadow-[0px_8px_15px_rgba(0,0,0,0.1)] hover:bg-purple-600 hover:text-white hover:shadow-[0px_8px_15px_rgba(124,58,237,0.4)]"
              } border-none transition-all duration-300 ease-in-out`}
              onMouseEnter={enterButton}
              onMouseLeave={leaveButton}
            >
              All
            </motion.button>
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ y: -1 }}
              onClick={() => setActiveTab("portrait")}
              className={`px-4 sm:px-6 py-2 text-xs uppercase tracking-widest font-medium rounded-full ${
                activeTab === "portrait"
                  ? "bg-purple-600 text-white shadow-[0px_8px_15px_rgba(124,58,237,0.4)]"
                  : "bg-white text-black shadow-[0px_8px_15px_rgba(0,0,0,0.1)] hover:bg-purple-600 hover:text-white hover:shadow-[0px_8px_15px_rgba(124,58,237,0.4)]"
              } border-none transition-all duration-300 ease-in-out`}
              onMouseEnter={enterButton}
              onMouseLeave={leaveButton}
            >
              Portraits
            </motion.button>
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ y: -1 }}
              onClick={() => setActiveTab("landscape")}
              className={`px-4 sm:px-6 py-2 text-xs uppercase tracking-widest font-medium rounded-full ${
                activeTab === "landscape"
                  ? "bg-purple-600 text-white shadow-[0px_8px_15px_rgba(124,58,237,0.4)]"
                  : "bg-white text-black shadow-[0px_8px_15px_rgba(0,0,0,0.1)] hover:bg-purple-600 hover:text-white hover:shadow-[0px_8px_15px_rgba(124,58,237,0.4)]"
              } border-none transition-all duration-300 ease-in-out`}
              onMouseEnter={enterButton}
              onMouseLeave={leaveButton}
            >
              Landscapes
            </motion.button>
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ y: -1 }}
              onClick={() => setActiveTab("abstract")}
              className={`px-4 sm:px-6 py-2 text-xs uppercase tracking-widest font-medium rounded-full ${
                activeTab === "abstract"
                  ? "bg-purple-600 text-white shadow-[0px_8px_15px_rgba(124,58,237,0.4)]"
                  : "bg-white text-black shadow-[0px_8px_15px_rgba(0,0,0,0.1)] hover:bg-purple-600 hover:text-white hover:shadow-[0px_8px_15px_rgba(124,58,237,0.4)]"
              } border-none transition-all duration-300 ease-in-out`}
              onMouseEnter={enterButton}
              onMouseLeave={leaveButton}
            >
              Abstract
            </motion.button>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-8 space-y-4 sm:space-y-8 font-cinzel"
          >
            <AnimatePresence>
              {filteredGallery.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeIn}
                  className="break-inside-avoid mb-4 sm:mb-8 backdrop-blur-md bg-white/30 border border-white/20 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:bg-white/40 hover:-translate-y-1 will-change-transform"
                  style={{
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{
                    y: -8,
                    boxShadow:
                      "0 20px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
                    transition: { duration: 0.4, ease: "easeOut" },
                  }}
                >
                  <div className={`relative ${item.height} overflow-hidden`}>
                    <motion.img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="p-4 text-white">
                        <h3 className="text-lg font-medium">{item.title}</h3>
                        <p className="text-sm opacity-80 capitalize">
                          Style: {item.category}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  <div className="p-4 sm:p-6 backdrop-blur-lg bg-white/60 border-t border-white/40">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 capitalize">
                      Style: {item.category}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-purple-600 font-medium">
                        Created with ArtifyAI
                      </span>
                      <motion.button
                        whileHover={{ y: -3 }}
                        whileTap={{ y: -1 }}
                        onClick={() => handleSaveItem(item)}
                        className={`inline-flex items-center px-3 sm:px-4 py-1.5 text-xs uppercase tracking-widest font-medium rounded-full ${
                          savedItems.some(
                            (savedItem) => savedItem.id === item.id
                          )
                            ? "bg-purple-600/80 text-white"
                            : "bg-white/80 text-black"
                        } border-none shadow-[0px_4px_10px_rgba(0,0,0,0.1)] hover:bg-purple-600/80 hover:text-white hover:shadow-[0px_8px_15px_rgba(124,58,237,0.3)] transition-all duration-300 ease-in-out backdrop-blur-sm`}
                        onMouseEnter={enterButton}
                        onMouseLeave={leaveButton}
                      >
                        <motion.div
                          animate={{ rotate: [0, 15, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatDelay: 2,
                          }}
                        >
                          {savedItems.some(
                            (savedItem) => savedItem.id === item.id
                          ) ? (
                            <FiHeart className="mr-1 fill-current" />
                          ) : (
                            <FiStar className="mr-1" />
                          )}
                        </motion.div>
                        {savedItems.some(
                          (savedItem) => savedItem.id === item.id
                        )
                          ? "Saved"
                          : "Save"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="mt-12 text-center">
            <motion.button
              whileHover={{ y: -7 }}
              whileTap={{ y: -1 }}
              onClick={() => setShowMoreGallery(!showMoreGallery)}
              className="inline-flex items-center px-8 py-3 text-xs uppercase tracking-widest font-medium rounded-full text-black bg-white border-none shadow-[0px_8px_15px_rgba(0,0,0,0.1)] hover:bg-purple-600 hover:text-white hover:shadow-[0px_15px_20px_rgba(124,58,237,0.4)] transition-all duration-300 ease-in-out"
              onMouseEnter={enterButton}
              onMouseLeave={leaveButton}
            >
              {showMoreGallery ? "Show Less" : "View More Artwork"}
            </motion.button>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        ref={pricingRef}
        className="py-16 bg-white relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute right-0 top-0 h-64 w-64 text-purple-50 transform translate-x-1/3 -translate-y-1/3"
            viewBox="0 0 200 200"
          >
            <path
              fill="currentColor"
              d="M44.5,-76.3C59.3,-69.9,74.1,-60.5,83.2,-46.7C92.3,-32.9,95.7,-14.6,93.8,2.8C91.9,20.2,84.8,36.6,74.1,50.8C63.4,65,49.1,77,33.1,82.5C17.1,88,0.3,87,-15.8,83.1C-31.9,79.2,-47.3,72.4,-60.1,61.5C-72.9,50.6,-83.1,35.7,-87.3,19.2C-91.6,2.7,-89.9,-15.3,-83.1,-30.9C-76.3,-46.5,-64.4,-59.7,-50,-68.4C-35.6,-77.1,-18.8,-81.3,-1.7,-78.8C15.5,-76.3,29.7,-82.7,44.5,-76.3Z"
            />
          </svg>

          <svg
            className="absolute left-0 bottom-0 h-64 w-64 text-purple-50 transform -translate-x-1/3 translate-y-1/3"
            viewBox="0 0 200 200"
          >
            <path
              fill="currentColor"
              d="M39.5,-67.2C52.9,-60.2,66.8,-52.8,75.2,-41.2C83.6,-29.5,86.4,-14.8,83.9,-1.5C81.3,11.8,73.4,23.6,65.4,35.3C57.4,47,49.4,58.6,38.4,65.7C27.5,72.8,13.7,75.4,0.2,75.1C-13.3,74.8,-26.5,71.7,-38.7,65.2C-50.9,58.7,-62,48.9,-69.5,36.8C-77,24.7,-80.8,12.3,-79.8,0.6C-78.8,-11.2,-73,-22.4,-65.8,-32.6C-58.6,-42.8,-50,-52,-39.4,-59.1C-28.8,-66.2,-14.4,-71.1,-0.2,-70.8C14,-70.5,28,-74.1,39.5,-67.2Z"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">
              Pricing
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl heading-cinzel">
              Plans for every creative need
            </p>
          </motion.div>

          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none font-cinzel">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`${
                  plan.highlighted
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl lg:transform lg:scale-105 z-10"
                    : "bg-white text-gray-900 shadow-md hover:shadow-lg"
                } rounded-lg overflow-hidden flex flex-col transition-all duration-300 ease-in-out mb-6 lg:mb-0`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 py-8 sm:p-10 sm:pb-8">
                  <div>
                    <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-purple-100 text-purple-600">
                      {plan.title}
                    </h3>
                  </div>
                  <div className="mt-4 flex items-baseline text-4xl sm:text-6xl font-extrabold">
                    {plan.price}
                    <span className="ml-1 text-xl sm:text-2xl font-medium text-gray-500">
                      /month
                    </span>
                  </div>
                  <p className="mt-5 text-base sm:text-lg text-gray-500">
                    {plan.highlighted
                      ? "The most popular plan for serious creators."
                      : "Perfect for beginners looking to explore AI art."}
                  </p>
                </div>

                <ul className="mt-6 px-6 py-8 sm:p-10 space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className="flex-shrink-0">
                        <FiCheck
                          className={`${
                            plan.highlighted ? "text-white" : "text-purple-500"
                          } h-5 w-5`}
                          aria-hidden="true"
                        />
                      </div>
                      <p className="ml-3 text-sm text-gray-500">{feature}</p>
                    </li>
                  ))}
                </ul>

                <div className="px-6 py-4 sm:px-10 mt-auto">
                  <motion.button
                    whileHover={{ y: -3 }}
                    whileTap={{ y: -1 }}
                    onClick={() => handleSelectPlan(plan)}
                    className={`${
                      plan.highlighted
                        ? "bg-white text-purple-600 hover:bg-purple-100 hover:text-purple-700"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    } w-full flex items-center justify-center px-8 py-4 sm:py-3 text-xs uppercase tracking-widest font-medium rounded-full border-none shadow-[0px_8px_15px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out`}
                    onMouseEnter={enterButton}
                    onMouseLeave={leaveButton}
                  >
                    {plan.cta}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <footer className="bg-gray-50 py-8 sm:py-12 font-cinzel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} ArtifyAI. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-purple-500 transition-colors duration-200"
                aria-label="GitHub"
              >
                <FiGithub className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-500 transition-colors duration-200"
                aria-label="Twitter"
              >
                <FiTwitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-500 transition-colors duration-200"
                aria-label="Instagram"
              >
                <FiInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Sign In</h3>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-purple-600 hover:text-purple-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Sign in
                  </button>
                </div>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => {
                      setShowLoginModal(false);
                      setShowSignupModal(true);
                    }}
                    className="font-medium text-purple-600 hover:text-purple-500"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSignupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Create Account
                </h3>
                <button
                  onClick={() => setShowSignupModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="signup-email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="signup-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="signup-password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Create Account
                  </button>
                </div>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setShowSignupModal(false);
                      setShowLoginModal(true);
                    }}
                    className="font-medium text-purple-600 hover:text-purple-500"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Create AI Artwork
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleCreateArt} className="space-y-4">
                <div>
                  <label
                    htmlFor="prompt"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Describe your vision
                  </label>
                  <textarea
                    id="prompt"
                    rows={4}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="E.g., A serene landscape with mountains at sunset, painted in watercolor style"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="style"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Art Style
                  </label>
                  <select
                    id="style"
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="realistic">Realistic</option>
                    <option value="abstract">Abstract</option>
                    <option value="impressionist">Impressionist</option>
                    <option value="cubism">Cubism</option>
                    <option value="surrealism">Surrealism</option>
                    <option value="pop-art">Pop Art</option>
                    <option value="digital-art">Digital Art</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="anime">Anime</option>
                    <option value="watercolor">Watercolor</option>
                  </select>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Generate Artwork
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPricingModal && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Subscribe to {selectedPlan.title} Plan
                </h3>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600">
                  You&apos;re about to subscribe to the {selectedPlan.title}{" "}
                  plan at {selectedPlan.price}/month.
                </p>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900">Plan includes:</h4>
                  <ul className="mt-2 space-y-2">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FiCheck className="h-5 w-5 text-purple-500 mr-2" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handlePurchasePlan}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Confirm Subscription
                </button>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center z-50"
          >
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <FiCheck className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-gray-700">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
