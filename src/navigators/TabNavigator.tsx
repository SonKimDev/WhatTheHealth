import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  AdviceScreen,
  HomeScreen,
  TrackingScreen,
  UserScreen,
} from '../screens/main';
import {Home2, Map, Map1, Message, User} from 'iconsax-react-native';
import {COLORS} from '../constans/themes';
import {View} from 'react-native';

export default function TabNavigator() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Home2
                  size={size}
                  color={color}
                  variant={focused ? 'Bold' : 'Outline'}
                />
                {focused && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: -8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 999,
                        backgroundColor: COLORS.PRIMARY,
                      }}
                    />
                  </View>
                )}
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="AdviceTab"
        component={AdviceScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Message
                  size={size}
                  color={color}
                  variant={focused ? 'Bold' : 'Outline'}
                />
                {focused && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: -8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 999,
                        backgroundColor: COLORS.PRIMARY,
                      }}
                    />
                  </View>
                )}
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="UserTab"
        component={UserScreen}
        options={{
          headerShown: true,
          headerTitle: 'Hồ Sơ',
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <User
                  size={size}
                  color={color}
                  variant={focused ? 'Bold' : 'Outline'}
                />
                {focused && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: -8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 999,
                        backgroundColor: COLORS.PRIMARY,
                      }}
                    />
                  </View>
                )}
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
