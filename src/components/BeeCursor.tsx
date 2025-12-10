import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const BeeCursor = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Mouse position values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth out the movement using springs
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener("mousemove", updateMousePosition);
        document.addEventListener("mouseenter", handleMouseEnter);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [mouseX, mouseY, isVisible]);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
            style={{
                x: smoothX,
                y: smoothY,
                translateX: "-50%",
                translateY: "-50%",
            }}
        >
            <motion.div
                animate={{
                    rotate: [0, 5, 0, -5, 0], // Subtle wobble "flying" effect
                    scale: [1, 1.1, 1], // Breathing effect
                }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                }}
            >
                {/* Custom Bee SVG Icon */}
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                >
                    <path
                        d="M8.5 8.5C8.5 8.5 7 7 5 7C3 7 1 8.5 1 10.5C1 12.5 3 14 5 14C7 14 8.5 12.5 8.5 12.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M15.5 8.5C15.5 8.5 17 7 19 7C21 7 23 8.5 23 10.5C23 12.5 21 14 19 14C17 14 15.5 12.5 15.5 12.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M12 19C14.7614 19 17 15.866 17 12C17 8.13401 14.7614 5 12 5C9.23858 5 7 8.13401 7 12C7 15.866 9.23858 19 12 19Z"
                        fill="currentColor"
                        fillOpacity="0.2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <path d="M10 5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M14 5L16 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M10 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </motion.div>
        </motion.div>
    );
};
