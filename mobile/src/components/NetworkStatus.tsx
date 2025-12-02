import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { WifiOff, RefreshCw } from 'lucide-react-native';

export const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? true;
      const reachable = state.isInternetReachable;
      
      // Only show offline if definitely not connected or definitely not reachable
      const isOffline = !connected || reachable === false;
      
      setIsConnected(!isOffline);
      setShowModal(isOffline);
    });

    // Initial check
    NetInfo.fetch().then((state) => {
      const connected = state.isConnected ?? true;
      const reachable = state.isInternetReachable;
      const isOffline = !connected || reachable === false;
      
      setIsConnected(!isOffline);
      setShowModal(isOffline);
    });

    return () => unsubscribe();
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    try {
      const state = await NetInfo.fetch();
      const connected = state.isConnected ?? true;
      const reachable = state.isInternetReachable;
      const isOffline = !connected || reachable === false;
      
      setIsConnected(!isOffline);
      if (!isOffline) {
        setShowModal(false);
      }
    } catch (error) {
      // Keep modal open if check fails
    }
    
    setIsRetrying(false);
  };

  return (
    <Modal
      visible={showModal}
      animationType="fade"
      transparent={true}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/70 items-center justify-center px-6">
        <View className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-sm items-center shadow-2xl">
          {/* Icon */}
          <View className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-900/20 items-center justify-center mb-6">
            {/* @ts-ignore */}
            <WifiOff size={40} color="#ef4444" />
          </View>
          
          {/* Title */}
          <Text className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-3">
            Hej! Nuk jeni të lidhur
          </Text>
          
          {/* Message */}
          <Text className="text-slate-500 dark:text-slate-400 text-center text-base leading-6 mb-8">
            Për të përdorur aplikacionin, ju duhet të lidheni me internetin.
          </Text>
          
          {/* Retry Button */}
          <TouchableOpacity
            onPress={handleRetry}
            disabled={isRetrying}
            activeOpacity={0.9}
            className="w-full bg-indigo-600 py-4 rounded-full flex-row items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            {isRetrying ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                {/* @ts-ignore */}
                <RefreshCw size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Provo përsëri
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          {/* Status indicator */}
          <View className="mt-6 flex-row items-center">
            <View className="h-2 w-2 rounded-full bg-red-500 mr-2" />
            <Text className="text-sm text-slate-400 dark:text-slate-500">
              Duke pritur për lidhje...
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};
