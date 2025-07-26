import React from 'react';
import './index.scss';

interface LoadingProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'medium', text }) => {
    return (
        <div className={`loading-container size-${size}`}>
            <div className="loading-spinner"></div>
            {text && <p className="loading-text">{text}</p>}
        </div>
    );
};

export default Loading;