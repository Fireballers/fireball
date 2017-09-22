import React from 'react';
import { Text, View, Button} from 'react-native';
import Header from './Header'
import LanguageSelectors from './LanguageSelectors'
import {Actions} from 'react-native-router-flux'

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  }
};

export default function Camera() {
  const { container } = styles;
  const takePhotoAndRedirect = function () {
    Actions.cardHolder();
  }

    return (
      <View style={container}>
        <Header headerText={'Subheader'} />
        <LanguageSelectors />
        <Text>CAMERA</Text>
        <Button onPress={takePhotoAndRedirect} title="go to cardHolder" />
      </View>
    );
  }

