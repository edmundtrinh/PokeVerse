// TODO: Replace with full implementation from Mac sync
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BinderPlanner: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Binder Planner coming soon</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16, color: '#666' },
});

export default BinderPlanner;
