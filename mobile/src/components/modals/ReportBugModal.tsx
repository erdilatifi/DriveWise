import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { X, Bug } from 'lucide-react-native';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ReportBugModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ReportBugModal = ({ visible, onClose }: ReportBugModalProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description) {
        Alert.alert('Kujdes', 'Ju lutemi plotësoni titullin dhe përshkrimin.');
        return;
    }
    setIsLoading(true);

    try {
      const { error } = await supabase.from('bug_reports').insert({
        user_id: user?.id,
        title,
        description,
        status: 'open',
        location: 'mobile-profile',
      } as any);

      if (error) throw error;

      Alert.alert('Faleminderit', 'Raportimi juaj u dërgua me sukses!');
      setTitle('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert('Gabim', 'Ndodhi një gabim gjatë dërgimit. Ju lutemi provoni përsëri.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center bg-black/50 px-4">
        <View className="rounded-3xl bg-white p-6 shadow-xl">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Bug size={24} color="#35565f" className="mr-2" />
              <Text className="text-lg font-bold text-[#35565f]">Raporto Problem</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <Text className="mb-4 text-sm text-gray-600">
            Hasët ndonjë problem? Na tregoni detajet që ta rregullojmë sa më shpejt.
          </Text>

          <View className="gap-4">
            <View>
                <Text className="text-xs font-bold text-gray-500 mb-1">TITULLI</Text>
                <TextInput
                    placeholder="P.sh. Nuk hapet testi..."
                    value={title}
                    onChangeText={setTitle}
                    className="rounded-xl border border-gray-200 p-3 text-sm text-[#35565f]"
                />
            </View>

            <View>
                <Text className="text-xs font-bold text-gray-500 mb-1">PËRSHKRIMI</Text>
                <TextInput
                    placeholder="Përshkruani çfarë ndodhi..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    className="rounded-xl border border-gray-200 p-3 text-sm text-[#35565f] h-32"
                    textAlignVertical="top"
                />
            </View>
          </View>

          <View className="mt-6 gap-3">
            <Button
              label={isLoading ? "Duke dërguar..." : "Dërgo"}
              onPress={handleSubmit}
              className="bg-[#ce76c9] w-full"
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
