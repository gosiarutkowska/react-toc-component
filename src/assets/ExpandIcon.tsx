import React from 'react';

interface ExpandIconProps {
    isExpanded: boolean;
    className?: string;
}

export const ExpandIcon: React.FC<ExpandIconProps> = ({ isExpanded, className = '' }) => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s ease-in-out'
            }}
        >
            {/* Down arrow (when expanded) */}
            <path
                d="M12 6L8 10L4 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
};

export default ExpandIcon;