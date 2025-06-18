import { Animated, Easing } from "react-native";
import { useEffect, useRef, useState } from "react";
import { openers } from "../utils/constants";
import { theme } from "./theme";
const ROTATE_INTERVAL = 4000;

export const AnimatedRotatingText = () => {
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const animateText = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(ROTATE_INTERVAL - 1000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIndex((prev) => (prev + 1) % openers.length);
    });
  };

  useEffect(() => {
    animateText();
  }, [index]);

  return (
    <Animated.Text
      style={[
        theme.fonts.body,
        theme.styles.centeredText,
        {
          marginTop: 12,
          color: theme.colors.brown[600],
          opacity: fadeAnim,
          fontStyle: "italic",
        },
      ]}
    >
      {openers[index]}
    </Animated.Text>
  );
};
