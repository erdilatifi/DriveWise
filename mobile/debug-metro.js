try {
  console.log('Attempting to require expo/metro-config...');
  require('expo/metro-config');
  console.log('Success: expo/metro-config');
} catch (e) {
  console.error('Failed: expo/metro-config', e.message);
}

try {
  console.log('Attempting to require nativewind/metro...');
  require('nativewind/metro');
  console.log('Success: nativewind/metro');
} catch (e) {
  console.error('Failed: nativewind/metro', e.message);
}
