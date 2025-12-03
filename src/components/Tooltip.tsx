import React, { useState } from 'react';
import clsx from 'clsx';

interface TooltipProps {
    children: React.ReactNode;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, content, position = 'bottom' }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}

            <div
                className={clsx(
                    "absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900/90 border border-white/10 rounded-lg shadow-xl backdrop-blur-md whitespace-nowrap transition-all duration-200 pointer-events-none",
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
                    position === 'bottom' && "top-full mt-2 left-1/2 -translate-x-1/2 origin-top",
                    position === 'top' && "bottom-full mb-2 left-1/2 -translate-x-1/2 origin-bottom",
                    position === 'left' && "right-full mr-2 top-1/2 -translate-y-1/2 origin-right",
                    position === 'right' && "left-full ml-2 top-1/2 -translate-y-1/2 origin-left"
                )}
            >
                {content}
            </div>
        </div>
    );
}
