import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { X, AlertTriangle, CheckCircle2, Circle } from 'lucide-react-native';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
}

const REASONS = [
  { id: 'passed', label: 'Kam kaluar provimin' },
  { id: 'not-needed', label: 'Nuk më duhen më testet' },
  { id: 'duplicate', label: 'Kam hapur llogari tjetër' },
  { id: 'unsatisfied', label: 'Nuk jam i kënaqur me aplikacionin' },
  { id: 'other', label: 'Tjetër' },
];

export const DeleteAccountModal = ({ visible, onClose }: DeleteAccountModalProps) => {
  const { user, signOut } = useAuth();
  const [reason, setReason] = useState<string>('');
  const [customReason, setCustomReason] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!reason) return;
    setIsLoading(true);

    try {
      const finalReason = reason === 'other' ? customReason : REASONS.find(r => r.id === reason)?.label;
      const fullDescription = `Reason: ${finalReason}\nComment: ${comment}`;

      // Submit request to bug_reports as a deletion request (workaround for mobile)
      const { error } = await supabase.from('bug_reports').insert({
        user_id: user?.id,
        title: 'DELETE ACCOUNT REQUEST',
        description: fullDescription,
        status: 'open',
        location: 'mobile-profile',
      } as any);

      if (error) throw error;

      Alert.alert(
        'Kërkesa u dërgua',
        'Llogaria juaj është planifikuar për fshirje. Po ju çkyçim tani.',
        [{ text: 'OK', onPress: () => signOut() }]
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Gabim', 'Ndodhi një gabim gjatë dërgimit të kërkesës. Ju lutemi provoni përsëri.');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center bg-black/50 px-4">
        <View className="rounded-3xl bg-white p-6 shadow-xl max-h-[80%]">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <AlertTriangle size={24} color="#EF4444" className="mr-2" />
              <Text className="text-lg font-bold text-red-500">Fshij Llogarinë</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <Text className="mb-6 text-sm text-gray-600">
            Të gjitha progreset dhe të dhënat do të fshihen përgjithmonë. Ky veprim nuk mund të kthehet pas.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="mb-3 font-bold text-[#35565f]">Pse po largoheni?</Text>
            
            <View className="space-y-3 mb-4">
              {REASONS.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => setReason(r.id)}
                  className="flex-row items-center"
                >
                  {reason === r.id ? (
                    <CheckCircle2 size={20} color="#ce76c9" />
                  ) : (
                    <Circle size={20} color="#D1D5DB" />
                  )}
                  <Text className="ml-3 text-gray-700">{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {(reason === 'other' || reason === 'unsatisfied' || reason === 'passed') && (
              <View className="mb-4">
                {reason === 'other' && (
                  <TextInput
                    placeholder="Ju lutemi na tregoni më shumë..."
                    value={customReason}
                    onChangeText={setCustomReason}
                    className="mb-2 rounded-xl border border-gray-200 p-3 text-sm"
                  />
                )}
                <TextInput
                  placeholder={reason === 'passed' ? "Ndani eksperiencën tuaj (Opsionale)" : "Na tregoni çfarë nuk shkoi mirë (Opsionale)"}
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  numberOfLines={3}
                  className="rounded-xl border border-gray-200 p-3 text-sm h-24"
                  textAlignVertical="top"
                />
              </View>
            )}
          </ScrollView>

          <View className="mt-4 gap-3">
            <Button
              label={isLoading ? "Duke procesuar..." : "Fshij Llogarinë"}
              onPress={handleConfirm}
              className="bg-red-500 w-full"
              disabled={!reason || isLoading}
            />
            <Button
              label="Anulo"
              variant="ghost"
              onPress={onClose}
              className="w-full"
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
