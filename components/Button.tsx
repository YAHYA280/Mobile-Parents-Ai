import type {
    StyleProp,
    ViewStyle,
    TouchableOpacityProps} from 'react-native';

import React from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import { SIZES, COLORS } from '../constants';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    color?: string;
    textColor?: string;
    filled?: boolean;
    isLoading?: boolean;
    style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = (props) => {
    const {
        title,
        color,
        textColor,
        filled = false,
        isLoading = false,
        style,
        onPress,
        ...rest
    } = props;
    const filledBgColor = color || COLORS.primary;
    const outlinedBgColor = COLORS.white;
    const bgColor = filled ? filledBgColor : outlinedBgColor;
    const resolvedTextColor = filled ? COLORS.white || textColor : textColor || COLORS.primary;

    return (
        <TouchableOpacity
            style={[styles.btn, { backgroundColor: bgColor }, style]}
            onPress={onPress}
            {...rest}>
            {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
                <Text style={[styles.text, { color: resolvedTextColor }]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
    },
    text: {
        fontSize: 18,
        fontFamily: "semiBold",
    },
});

export default Button;