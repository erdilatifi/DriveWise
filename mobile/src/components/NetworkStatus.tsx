import React, { useEffect, useState } from 'react';
import { View, Text, Modal, AppState, AppStateStatus } from 'react-native';
import * as Network from 'expo-network';
import { WifiOff } from 'lucide-react-native';

export const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);

  const checkNetwork = async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      const connected = (state.isConnected && state.isInternetReachable !== false) ?? true;
      setIsConnected(connected);
      setShowModal(!connected);
    } catch (error) {
      // Assume connected if check fails
      setIsConnected(true);
      setShowModal(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkNetwork();

    // Re-check when app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkNetwork();
      }
    });

    // Poll every 5 seconds when offline
    const interval = setInterval(() => {
      if (!isConnected) {
        checkNetwork();
      }
    }, 5000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [isConnected]);

  if (isConnected) return null;

  return (
    <Modal
      visible={showModal}
      animationType="fade"
      transparent={true}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/70 items-center justify-center px-6">
        <View className="bg-white rounded-3xl p-8 w-full max-w-sm items-center shadow-2xl">
          <View className="h-20 w-20 rounded-full bg-red-100 items-center justify-center mb-6">
            <WifiOff size={40} color="#ef4444" />
          </View>
          
          <Text className="text-xl font-bold text-slate-900 text-center mb-3">
            Nuk ka lidhje interneti
          </Text>
          
          <Text className="text-slate-500 text-center leading-6 mb-2">
            Për të përdorur aplikacionin, ju nevojitet lidhje interneti. 
            Ju lutem kontrolloni lidhjen tuaj dhe provoni përsëri.
          </Text>

          <View className="mt-4 flex-row items-center">
            <View className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse" />
            <Text className="text-sm text-slate-400">Duke pritur për lidhje...</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};
