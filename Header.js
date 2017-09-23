import React from 'react';
import { Text, View } from 'react-native';


const styles = {
  viewStyle: {
    backgroundColor: 'rgba(192, 192, 192, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
  textStyle: {
    fontSize: 20
  }
};


export default function Header() {
  const { textStyle, viewStyle } = styles;

  return (
    <View style={viewStyle}>
      <Text style={textStyle}>Fireball</Text>
    </View>
  );
}

