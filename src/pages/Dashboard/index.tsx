import React from 'react';
import { View, Text, Button } from 'react-native';

import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <View>
      <Text>Dashboard</Text>
      <Button title="sair" onPress={() => signOut()} />
    </View>
  );
};

export default Dashboard;
