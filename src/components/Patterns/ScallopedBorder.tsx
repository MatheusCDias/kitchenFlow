import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle } from 'react-native-svg';

interface ScallopedBorderProps {
    circleRadius?: number;      // Raio dos semicírculos
    circleSpacing?: number;     // Espaçamento entre os semicírculos
    topColor?: string;          // Cor do papel (ex: Cinza claro #EAE8E5)
    bottomColor?: string;       // Cor do fundo exterior (ex: Laranja #F07342)
    position?: 'top' | 'bottom';
    sidePadding?: number;       // Margem nas extremidades da cor do papel
}

export const ScallopedBorder: React.FC<ScallopedBorderProps> = ({
    circleRadius = 7,
    circleSpacing = 8,
    topColor = '#EAE8E5',
    bottomColor = '#F07342',
    position = 'bottom',
    sidePadding = 8,
}) => {
    const patternWidth = circleRadius * 2 + circleSpacing;
    const height = circleRadius * 2;

    const isTop = position === 'top';
    const circleY = isTop ? 0 : height;

    const cleanTop = topColor.replace('#', '');
    const cleanBottom = bottomColor.replace('#', '');
    const patternId = `scallop-${position}-${circleRadius}-${circleSpacing}-${cleanTop}-${cleanBottom}`;

    return (
        <View style={[styles.container, { height, backgroundColor: bottomColor }]} key={patternId}>
            <Svg width="100%" height={height}>
                <Defs>
                    <Pattern
                        id={patternId}
                        width={patternWidth}
                        height={height}
                        patternUnits="userSpaceOnUse"
                        // Desloca o início do padrão para alinhar exatamente com o padding
                        patternTransform={`translate(${sidePadding}, 0)`}
                    >
                        {/* Base retangular cinza */}
                        <Rect
                            x={0}
                            y={0}
                            width={patternWidth}
                            height={height}
                            fill={topColor}
                        />

                        {/* Circunferência/Mordida */}
                        <Circle
                            cx={patternWidth / 2}
                            cy={circleY}
                            r={circleRadius}
                            fill={bottomColor}
                        />
                    </Pattern>
                </Defs>

                {/* Faixa retangular contínua preenchendo o fundo total com a cor do papel */}
                <Rect x={0} y={0} width="100%" height={height} fill={topColor} />

                {/* Área central preenchida com o padrão repetitivo das mordidas */}
                <Rect
                    x={sidePadding}
                    y={0}
                    width={`calc(100% - ${sidePadding * 2}px)` as any}
                    height={height}
                    fill={`url(#${patternId})`}
                />
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