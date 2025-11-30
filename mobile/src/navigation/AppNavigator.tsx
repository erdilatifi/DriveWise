import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { TestsScreen } from "../screens/main/TestsScreen";
import { DecisionTrainerScreen } from "../screens/main/DecisionTrainerScreen";
import { ProfileScreen } from "../screens/main/ProfileScreen";
import { AdminDashboardScreen } from "../screens/admin/AdminDashboardScreen";
import { LiteratureNavigator } from "./LiteratureNavigator";

import {
  BookOpen,
  BrainCircuit,
  FileText,
  User,
  Shield,
  LucideIcon,
} from "lucide-react-native";

import { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

// Default Theme Constants (Light Mode)
const BAR_BG_DEFAULT = "#f9fafb";
const BAR_BORDER_DEFAULT = "#e5e7eb";
const ICON_ACTIVE_BG_DEFAULT = "#4f46e5";

type IconKey = keyof MainTabParamList;
type IconMap = Record<IconKey, LucideIcon>;

const icons: Partial<IconMap> = {
  Testet: FileText,
  Trajneri: BrainCircuit,
  Literatura: BookOpen,
  Profili: User,
  Admin: Shield,
};

// ---------- CUSTOM TAB BAR ----------
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { isDark } = useTheme();
  // Single animated value for current index
  const position = useRef(new Animated.Value(state.index)).current;

  const BAR_BG = isDark ? "#1e293b" : "#f9fafb";
  const BAR_BORDER = isDark ? "#334155" : "#e5e7eb";
  const ICON_INACTIVE = isDark ? "#94a3b8" : "#9ca3af";
  const ICON_ACTIVE = "#ffffff";
  const ICON_ACTIVE_BG = isDark ? "#4f46e5" : "#4f46e5"; // Can vary if needed
  const LABEL_INACTIVE = isDark ? "#94a3b8" : "#9ca3af";
  const LABEL_ACTIVE = isDark ? "#f8fafc" : "#111827";

  useEffect(() => {
    Animated.spring(position, {
      toValue: state.index,
      stiffness: 220,
      damping: 26,
      mass: 0.7,
      useNativeDriver: false,
    }).start();
  }, [state.index, position]);

  return (
    <View style={styles.tabBarContainer}>
      <View style={[styles.tabBarInner, { backgroundColor: BAR_BG, borderColor: BAR_BORDER }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const IconComponent =
            icons[route.name as IconKey] ?? FileText;

          const inputRange = [index - 1, index, index + 1];

          // Circle + icon lifting
          const circleScale = position.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: "clamp",
          });

          const circleOpacity = position.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: "clamp",
          });

          // Move the whole circle+icon up a bit from the bar
          const iconTranslateY = position.interpolate({
            inputRange,
            outputRange: [0, -14, 0], // higher lift, but bar is lower, so it sits nicely
            extrapolate: "clamp",
          });

          const iconScale = position.interpolate({
            inputRange,
            outputRange: [1, 1.06, 1],
            extrapolate: "clamp",
          });

          // Label stays near the bar, doesn’t fly too high
          const labelOpacity = position.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: "clamp",
          });

          const labelTranslateY = position.interpolate({
            inputRange,
            outputRange: [4, 0, 4],
            extrapolate: "clamp",
          });

          const iconColor = isFocused ? ICON_ACTIVE : ICON_INACTIVE;
          const labelColor = isFocused ? LABEL_ACTIVE : LABEL_INACTIVE;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.9}
              style={styles.tabItem}
              hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
            >
              {/* ICON + CIRCLE */}
              <Animated.View
                style={[
                  styles.iconWrapper,
                  {
                    transform: [{ translateY: iconTranslateY }],
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.activeCircle,
                    {
                      backgroundColor: ICON_ACTIVE_BG,
                      shadowColor: ICON_ACTIVE_BG,
                      opacity: circleOpacity,
                      transform: [{ scale: circleScale }],
                    },
                  ]}
                />
                <Animated.View
                  style={{
                    transform: [{ scale: iconScale }],
                  }}
                >
                  <IconComponent size={20} color={iconColor} />
                </Animated.View>
              </Animated.View>

              {/* LABEL */}
              <Animated.Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.label,
                  {
                    color: labelColor,
                    opacity: labelOpacity,
                    transform: [{ translateY: labelTranslateY }],
                  },
                ]}
              >
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ---------- NAVIGATOR ----------
export const AppNavigator: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Testet"
        component={TestsScreen}
        options={{ tabBarLabel: "Testet" }}
      />
      <Tab.Screen
        name="Trajneri"
        component={DecisionTrainerScreen}
        options={{ tabBarLabel: "Trajneri" }}
      />
      <Tab.Screen
        name="Literatura"
        component={LiteratureNavigator}
        options={{ tabBarLabel: "Literatura" }}
      />
      <Tab.Screen
        name="Profili"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profili" }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminDashboardScreen}
          options={{ tabBarLabel: "Admin" }}
        />
      )}
    </Tab.Navigator>
  );
};

export default AppNavigator;

// ---------- STYLES ----------
const styles = StyleSheet.create({
  // Floating bar, centered horizontally, not attached to sides
  tabBarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: Platform.OS === "ios" ? 30 : 24,
    alignItems: "center",
    backgroundColor: "transparent", // your screen background shows behind
  },
  tabBarInner: {
    width: "86%",
    maxWidth: 420,
    backgroundColor: BAR_BG_DEFAULT,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BAR_BORDER_DEFAULT,

    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",

    paddingHorizontal: 22,
    paddingTop: 26, // more top space so circle can sit nicely in the middle of the top edge
    paddingBottom: 12,

    overflow: "visible",
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  // This wrapper is positioned so its center is on the top edge of the bar
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -25, // half of height -> center at the top edge of the card
  },
  activeCircle: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: ICON_ACTIVE_BG_DEFAULT,
    shadowColor: ICON_ACTIVE_BG_DEFAULT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },
});
