import React from 'react';
import {GestureResponderEvent, Pressable, PressableProps} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface OpacityPressableProps extends PressableProps {}

const OpacityPressable: React.FC<OpacityPressableProps> = ({
  children,
  onPressIn,
  onPressOut,
  ...rest
}) => {
  const opacityAnimated = useSharedValue(1);
  const fadeIn = () => {
    opacityAnimated.value = withTiming(0.7, {duration: 150});
  };

  const fadeOut = () => {
    opacityAnimated.value = withTiming(1, {duration: 200});
  };

  const handleOnPressIn = (event: GestureResponderEvent) => {
    fadeIn();
    onPressIn?.(event);
  };

  const handleOnPressOut = (event: GestureResponderEvent) => {
    fadeOut();
    onPressOut?.(event);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityAnimated.value,
  }));

  return (
    <AnimatedPressable
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}
      style={animatedStyle}
      {...rest}>
      {children}
    </AnimatedPressable>
  );
};

export default OpacityPressable;
