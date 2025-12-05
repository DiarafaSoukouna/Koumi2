try {
    console.log('Resolving react-native-worklets/plugin...');
    const path = require.resolve('react-native-worklets/plugin');
    console.log('Success:', path);
} catch (e) {
    console.error('Failed:', e.message);
}
