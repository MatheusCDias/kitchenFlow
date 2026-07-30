import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';

interface CheckeredBorderProps {
    squareSize?: number;
    primaryColor?: string;
    secondaryColor?: string;
}

export const CheckeredBorder: React.FC<CheckeredBorderProps> = ({
    squareSize = 16,
    primaryColor = '#F07342',
    secondaryColor = '#EAE8E5'
}) => {
    const patternSize = squareSize * 2;
    const height = squareSize * 2;

    const cleanPrimary = primaryColor.replace('#', '');
    const cleanSecondary = secondaryColor.replace('#', '');

    const patternId = `checkered-${squareSize}-${cleanPrimary}-${cleanSecondary}`;

    return (
        <View style={[styles.container, { height }]} key={patternId}>
            <Svg width="100%" height={height}>
                <Defs>
                    <Pattern
                        id={patternId}
                        width={patternSize}
                        height={patternSize}
                        patternUnits="userSpaceOnUse"
                    >
                        {/* Fundo Claro */}
                        <Rect
                            width={patternSize}
                            height={patternSize}
                            fill={primaryColor}
                        />

                        {/* Quadradinhos Principais */}
                        <Rect
                            width={squareSize}
                            height={squareSize}
                            fill={secondaryColor}
                        />
                        <Rect
                            x={squareSize}
                            y={squareSize}
                            width={squareSize}
                            height={squareSize}
                            fill={secondaryColor}
                        />
                    </Pattern>
                </Defs>

                {/* Aponta para o ID dinâmico recém-criado */}
                <Rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
});