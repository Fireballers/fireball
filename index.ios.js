/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import { cloudVision, translateApi} from './secrets';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Dimensions,
  View,
  Image,
  NativeModules,
  Picker,
  TouchableHighlight
} from 'react-native';
import Camera from 'react-native-camera';
import Axios from 'axios'
import RNFS from 'react-native-fs'
import Header from './Header'
import Tts from 'react-native-tts'

// import Tts from 'react-native-tts';
// import { Examples } from '@shoutem/ui';

export default class fireball extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeLang: true,
      path: null,
      text: 'Loading...',
      score: null,
      description: null,
      translatedText: null,
      selectedLanguage: 'Indonesian',
      selectedLangCode: 'id'
    };
    this.takePicture.bind(this)
    this.convertPictureToString.bind(this)
    this.detectTheThing.bind(this)

    this.codes = {
      English: 'en',
      French: 'fr',
      German: 'de',
      Hebrew: 'iw',
      Indonesian: 'id',
      Japanese: 'ja',
      Korean: 'ko',
      Polish: 'pl',
      Russian: 'ru',
      Spanish: 'es',
      Swedish: 'sv',
      Yiddish: 'yi'
    };

  }

  takePicture() {
    this.camera.capture()
      .then((data) => {
        console.log(data)
        this.setState({ path: data.path })
        return this.convertPictureToString(this.state.path);
      })
      .then((base64Photo) => this.detectTheThing(base64Photo))
      .catch(err => console.error(err));
  }

  renderCamera() {
    return (
      <View>
        <Header />
        <View style={styles.container}>
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}
            captureTarget={Camera.constants.CaptureTarget.disk}
            >
            <TouchableHighlight onPress={this.takePicture.bind(this)}>
              <Image style={{maxHeight: 150, maxWidth: 150}} source={require('./fireball_icon.jpg')} />
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.setState({changeLang: true})}>
              <Image style={{height: 25, width: 25, marginTop: 10, marginRight: 300}} source={require('./arrow.png')} />
            </TouchableHighlight>
          </Camera>
        </View>
      </View>
    );
  }

  renderImage() {
    return (
      <View style={{backgroundColor: '#BBB'}}>
        <Header />
        <Image
          source={{ uri: this.state.path }}
          style={styles.preview}
        />
        <Text style={styles.text} onPress={() => this.setState({changeLang: true})}>{this.state.text}</Text>
        <Text
          style={styles.cancel}
          onPress={() => this.setState({
              path: null,
              text: 'Loading...',
              score: null,
              description: null,
              translatedText: null
          })}
        >Back to Camera</Text>
      </View>
    );
  }

  renderPicker(){
    return (
      <View style={{backgroundColor: 'black', padding: 100}}>
        <Header />
        <Text style={{fontSize: 17, color: '#fcad0f', textAlign: 'center'}}>Select Translation Language</Text>
        <View style={{backgroundColor: '#b7b1a5', margin: 50}}>
          <Picker
            selectedValue={this.state.selectedLanguage}
            onValueChange={(itemValue) => this.setState({selectedLanguage: itemValue, selectedLangCode: this.codes[itemValue]})}>
            {Object.keys(this.codes).map((lang, i) => {
              return <Picker.Item key={i} label={lang} value={lang} />
            })}
          </Picker>
          <Text style={styles.text} onPress={() => this.setState({changeLang: false})}>Take Photo</Text>
        </View>
      </View>
    )
  }

  convertPictureToString(uri){
    console.log('does it even run convertpictostring?')
    return RNFS.readFile( uri, 'base64' )
    .then(res => res)
    .catch(err => console.error(err))
  }

  detectTheThing(base64Photo){
    console.log('detect the thing', base64Photo)

    return Axios.post(cloudVision, {
      "requests":[
        {
          "image":{
            "content": base64Photo
          },
          "features":[
            {
              "type":"LABEL_DETECTION",
              "maxResults":1
            }
          ]
        }
      ]
    })
      .then(res => {
        console.log('res: ', res)
        this.setState({
          score: Math.floor(res.data.responses[0].labelAnnotations[0].score * 100),
          description: res.data.responses[0].labelAnnotations[0].description,
        })
      })
      .then(() => {
        return Axios.post(translateApi, {
          "q": this.state.description,
          "target": this.state.selectedLangCode
        })
      })
      .then(res => res.data)
      .then(res => {
        console.log(res.data.translations[0].translatedText)
        this.setState({
          translatedText: res.data.translations[0].translatedText,
          text: `We're ${this.state.score}% sure that you captured: ${this.state.description}! Its translation to ${this.state.selectedLanguage} is ${res.data.translations[0].translatedText}`
        })
      })
      .then(() => {
        console.log("speaking")
        Tts.speak(this.state.translatedText, "com.apple.ttsbundle.Damayanti-compact");
        return Tts.voices()
      })
      .then(voices => {
        console.log(voices)
      })
      .catch((err) => console.error('it\'s me! Not something else!', err))
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.path ? this.renderImage() : (this.state.changeLang ? this.renderPicker() : this.renderCamera()) }
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    paddingLeft: 80,
    paddingRight: 80,
    paddingBottom: 5,
    paddingTop: 5,
    fontSize: 16,
    margin: 0,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(249, 202, 107)'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: (Dimensions.get('window').height)/2,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: 'rgb(249, 202, 107)',
    borderRadius: 150,
    color: '#000',
    padding: 5,
    margin: 40,
    fontSize: 20,
  },
  cancel: {
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      height: 60,
      paddingTop: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      elevation: 2,
      position: 'relative',
      fontSize: 20,
      flex: 0,
  }
});

AppRegistry.registerComponent('fireball', () => fireball);
