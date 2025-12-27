import { motion } from 'framer-motion';
import { Hexagon, Circle, Droplets, Dna, Network } from 'lucide-react';
import { useMemo } from 'react';

export const BeeBackground = () => {
    // 1. Generate Hexagon Grid
    // We create a grid larger than the screen to ensure coverage
    const hexGrid = useMemo(() => {
        const hexes = [];
        const rows = 12; // Number of rows
        const cols = 20; // Number of columns
        const hexWidth = 100;
        const hexHeight = 86.6; // hexWidth * sin(60deg)

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const xOffset = (r % 2) * (hexWidth / 2);
                const x = c * hexWidth + xOffset - 100; // Offset to cover edges
                const y = r * hexHeight * 0.75 - 100;

                // Add some random "active" nodes that are permanently lit/different
                const isPulse = Math.random() > 0.95;

                hexes.push({ id: `${r}-${c}`, x, y, isPulse });
            }
        }
        return hexes;
    }, []);

    // 2. Slow, ambient particles (Gold)
    const particles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        // Random starting position
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 20 + 20, // Slower for professional feel
    }));

    // 3. Floating Molecules (Subtle)
    const molecules = [
        { Icon: Hexagon, size: 40, x: 10, y: 20, delay: 0 },
        { Icon: Circle, size: 20, x: 80, y: 15, delay: 5 },
        { Icon: Dna, size: 45, x: 15, y: 75, delay: 2 },
        { Icon: Droplets, size: 25, x: 85, y: 65, delay: 7 },
        { Icon: Network, size: 35, x: 50, y: 40, delay: 10 },
    ];

    return (
        <div className="fixed inset-0 overflow-hidden bg-background/50 z-0">
            {/* Interactive Hex Grid */}
            <svg className="absolute inset-0 w-full h-full text-primary/20">
                {hexGrid.map((hex) => (
                    <g key={hex.id} className="group">
                        <path
                            d={`M${hex.x + 50} ${hex.y} L${hex.x + 100} ${hex.y + 25} L${hex.x + 100} ${hex.y + 75} L${hex.x + 50} ${hex.y + 100} L${hex.x} ${hex.y + 75} L${hex.x} ${hex.y + 25} Z`}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="1"
                            // CSS Interaction: Highlights on hover
                            className={`
                                transition-all duration-500 ease-out
                                hover:stroke-primary hover:stroke-[2px] hover:fill-primary/5
                                ${hex.isPulse ? 'animate-pulse stroke-primary/40' : 'opacity-20'}
                            `}
                        />
                        {/* Connection Points that appear on hover */}
                        <circle
                            cx={hex.x + 50}
                            cy={hex.y + 50}
                            r="2"
                            className="fill-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    </g>
                ))}
            </svg>

            {/* Ambient Particles */}
            {particles.map((p) => (
                <motion.div
                    key={`p-${p.id}`}
                    className="absolute rounded-full bg-[#FFD700]"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.initialX}%`,
                        top: `${p.initialY}%`,
                        opacity: 0.4,
                    }}
                    animate={{
                        y: [0, -50, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}

            {/* Floating Molecules - Slower, More Professional */}
            {molecules.map((m, i) => (
                <motion.div
                    key={`mol-${i}`}
                    className="absolute text-foreground/10"
                    style={{
                        left: `${m.x}%`,
                        top: `${m.y}%`,
                    }}
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 45, 0], // Subtle rotation
                    }}
                    transition={{
                        duration: 25, // Very slow
                        delay: m.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <m.Icon strokeWidth={1.5} size={m.size} />
                </motion.div>
            ))}
        </div>
    );
};
