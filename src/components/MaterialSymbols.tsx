import React from 'react';

// Tipagem para os 3 estilos suportados
export type IconVariant = 'outlined' | 'rounded' | 'sharp';

interface MaterialSymbolProps {
    name: string;
    variant?: IconVariant;
    fill?: boolean;
    size?: number;
    className?: string;
}

export const MaterialSymbol: React.FC<MaterialSymbolProps> = ({
    name,
    variant = 'outlined',
    fill = false,
    size = 24,
    className = '',
}) => {
    const variantClass = `material-symbols-${variant}`;

    return (
        <span
            className={`${variantClass} ${className}`}
            style={{
                fontSize: `${size}px`,
                fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
            }}
        >
            {name}
        </span>
    );
};