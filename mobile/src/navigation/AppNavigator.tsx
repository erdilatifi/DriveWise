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

import { useAuth } from "../contexts/AuthContext";
import { TestsScreen } from "../screens/main/TestsScreen";
import { DecisionTrainerScreen } from "../screens/main/DecisionTrainerScreen";
import { MaterialsScreen } from "../screens/main/MaterialsScreen";
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

// COLORS
const TAB_BG = "#1e1b4b";            // bar background (dark blue)
const TAB_ACTIVE_BG = "#312e81";     // active pill background (indigo-900/lighter)
const TAB_INACTIVE_ICON = "#94a3b8"; // slate-400
const TAB_ACTIVE_ICON = "#ffffff";   // white

type IconMap = Record<keyof MainTabParamList, LucideIcon>;

const icons: IconMap = {
  Testet: FileText,
  Trajneri: BrainCircuit,
  Literatura: BookOpen,
  Profili: User,
  Admin: Shield,
};

// ---------- CUSTOM TAB BAR ----------
const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  // One Animated.Value per tab
  const animatedValues = useRef(
    state.routes.map(
      (_, index) => new Animated.Value(state.index === index ? 1 : 0)
    )
  ).current;

  useEffect(() => {
    animatedValues.forEach((val, index) => {
      Animated.timing(val, {
        toValue: state.index === index ? 1 : 0,
        duration: 260,
        useNativeDriver: false, // width animation needs false
      }).start();
    });
  }, [state.index, animatedValues]);

  return (
    <View
      style={[
        styles.tabBarContainer,
        { bottom: Platform.OS === "ios" ? 24 : 16 },
      ]}
    >
      <View style={styles.tabBarInner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const IconComponent =
            icons[route.name as keyof MainTabParamList] ?? FileText;

          const anim = animatedValues[index];

          // pill width: icon-only -> expanded (but clamped by maxWidth)
          const pillWidth = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [40, 96],
          });

          // label "opening" width + opacity (delayed a bit)
          const labelWidth = anim.interpolate({
            inputRange: [0, 0.4, 1],
            outputRange: [0, 0, 60],
            extrapolate: "clamp",
          });

          const labelOpacity = anim.interpolate({
            inputRange: [0.4, 1],
            outputRange: [0, 1],
            extrapolate: "clamp",
          });

          const pillBgColor = anim.interpolate({
            inputRange: [0, 1],
            outputRange: ["rgba(255,255,255,0)", TAB_ACTIVE_BG],
          });

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

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              activeOpacity={0.9}
              style={styles.tabItem}
            >
              <Animated.View
                style={[
                  styles.pill,
                  {
                    width: pillWidth,
                    backgroundColor: pillBgColor as any,
                  },
                ]}
              >
                {/* ICON – always visible, on the left of the text */}
                <IconComponent
                  size={18}
                  color={isFocused ? TAB_ACTIVE_ICON : TAB_INACTIVE_ICON}
                />

                {/* TEXT – expands in when active */}
                <Animated.View
                  style={[
                    styles.labelWrapper,
                    { width: labelWidth, opacity: labelOpacity },
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="clip"
                    style={styles.label}
                  >
                    {label}
                  </Text>
                </Animated.View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ---------- NAVIGATOR ----------
export const AppNavigator = () => {
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

// ---------- STYLES ----------
const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    left: 16,
    right: 16,
  },
  tabBarInner: {
    flexDirection: "row",
    backgroundColor: TAB_BG,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#020617",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",          // icon then text = left → right
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: "100%",              // no overflow
  },
  labelWrapper: {
    marginLeft: 6,
    overflow: "hidden",            // so label reveals as width grows
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: TAB_ACTIVE_ICON,
  },
});

export default AppNavigator;
