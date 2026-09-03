import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle } from 'react-native-svg';

interface ScallopedBorderProps {
    circleRadius?: number;      
    circleSpacing?: number;     
    topColor?: string;          
    bottomColor?: string;       
    position?: 'top' | 'bottom';
    sidePadding?: number;       
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
                        patternTransform={`translate(${sidePadding}, 0)`}
                    >
                        <Rect
                            x={0}
                            y={0}
                            width={patternWidth}
                            height={height}
                            fill={topColor}
                        />

                        <Circle
                            cx={patternWidth / 2}
                            cy={circleY}
                            r={circleRadius}
                            fill={bottomColor}
                        />
                    </Pattern>
                </Defs>

                <Rect x={0} y={0} width="100%" height={height} fill={topColor} />

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