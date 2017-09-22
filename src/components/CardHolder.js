import React from 'react';
import { Text, View, Button } from 'react-native';
import Card from './Card'
import Header from './Header'
import LanguageSelectors from './LanguageSelectors'
import {Actions} from 'react-native-router-flux'

const styles = {
  viewStyle: {
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  }
};


function CardHolder() {
  const { viewStyle } = styles;

  const redirectToCam = function () {
    Actions.camera();
  }

  return (
    <View style={viewStyle}>
      <Header headerText={'Subheader'} />
      <LanguageSelectors />
      <Text>CARDHOLDER</Text>
      <Button title="back to camera" onPress={redirectToCam} />
      <Card />
    </View>
  );
}


export default CardHolder;
