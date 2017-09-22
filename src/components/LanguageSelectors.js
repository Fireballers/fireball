import React, {Component} from 'react';
import { Text, View, Picker, Option } from 'react-native';



export default class LanguageSelectors extends Component{
  state = {
    fromLangauge: 'English',
    toLanguage: 'Indonesian'
 };


  render(){
    return (
      <View >
        <Text>LANGUAGE SELECTORS</Text>
        <Picker selectedValue={this.state.fromLanguage}
        onValueChange={(itemValue, itemIndex) => this.setState({fromLanguage: itemValue})}>
          <Picker.Item label="English" value="English" />
          <Picker.Item label="Swedish" value="Swedish" />
          <Picker.Item label="Indonesian" value="Indonesian" />
        </Picker>
        <Text>to</Text>
        <Picker selectedValue={this.state.toLanguage}
        onValueChange={(itemValue, itemIndex) => this.setState({toLanguage: itemValue})}>
          <Picker.Item label="English" value="English" />
          <Picker.Item label="Swedish" value="Swedish" />
          <Picker.Item label="Indonesian" value="Indonesian" />
        </Picker>
      </View>
    );
  }
}
