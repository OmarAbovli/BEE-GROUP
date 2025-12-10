import { motion } from 'framer-motion';

export const BeeBackground = () => {
    // Create 20 bees with completely random paths
    const bees = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        // Random starting position anywhere on screen
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        // Random ending position anywhere on screen
        endX: Math.random() * 100,
        endY: Math.random() * 100,
        size: 12 + Math.random() * 10,
        duration: 20 + Math.random() * 20,
        delay: i * 2
    }));

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30 z-0">
            {bees.map((bee) => {
                // Create waypoints across the screen
                const waypoints = [];
                for (let i = 0; i < 6; i++) {
                    waypoints.push({
                        x: Math.random() * 100,
                        y: Math.random() * 100
                    });
                }

                return (
                    <motion.div
                        key={bee.id}
                        className="absolute"
                        style={{
                            fontSize: `${bee.size}px`,
                            filter: 'drop-shadow(0 0 4px rgba(234, 179, 8, 0.6))',
                            left: 0,
                            top: 0
                        }}
                        initial={{
                            x: `${bee.startX}vw`,
                            y: `${bee.startY}vh`,
                            rotate: 0
                        }}
                        animate={{
                            x: [
                                `${bee.startX}vw`,
                                ...waypoints.map(w => `${w.x}vw`),
                                `${bee.endX}vw`,
                                `${bee.startX}vw`
                            ],
                            y: [
                                `${bee.startY}vh`,
                                ...waypoints.map(w => `${w.y}vh`),
                                `${bee.endY}vh`,
                                `${bee.startY}vh`
                            ],
                            rotate: [0, 45, -45, 30, -30, 15, -15, 0]
                        }}
                        transition={{
                            duration: bee.duration,
                            delay: bee.delay,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        🐝
                    </motion.div>
                );
            })}

            {/* Hexagon pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="hexagons-bg" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(3)">
                        <polygon
                            points="25,0 50,14.4 50,43.4 25,57.7 0,43.4 0,14.4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            className="text-primary"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hexagons-bg)" />
            </svg>
        </div>
    );
};
