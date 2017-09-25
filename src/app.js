/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import { cloudVision, translateApi, translateLang, selectedLanguage } from './secrets';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Dimensions,
  View,
  Image,
  NativeModules
} from 'react-native';
import Camera from 'react-native-camera';
import Axios from 'axios'
import RNFS from 'react-native-fs'
import Header from './Header'
import Tts from 'react-native-tts'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: null,
      text: 'Loading...',
      score: null,
      description: null,
      translatedText: null
    };
    this.takePicture.bind(this)
    this.convertPictureToString.bind(this)
    this.detectTheThing.bind(this)
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
            <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
          </Camera>
        </View>
      </View>
    );
  }

  renderImage() {
    return (
      <View>
        <Header />
        <Text style={styles.text} >{this.state.text}</Text>
        <Image
          source={{ uri: this.state.path }}
          style={styles.preview}
        />
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
        // DO SOMETHING WITH RESPONSE
        console.log('res: ', res)
        this.setState({
          score: Math.floor(res.data.responses[0].labelAnnotations[0].score * 100),
          description: res.data.responses[0].labelAnnotations[0].description,

        })
      })
      .then(() => {
        return Axios.post(translateApi, {
          "q": this.state.description,
          "target": translateLang
        })
      })
      .then(res => res.data)
      .then(res => {
        console.log(res.data.translations[0].translatedText)
        this.setState({
          translatedText: res.data.translations[0].translatedText,
          text: `We're ${this.state.score}% sure that you captured: ${this.state.description}! Its translation to ${selectedLanguage} is ${res.data.translations[0].translatedText}`
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
        {this.state.path ? this.renderImage() : this.renderCamera()}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    margin: 20,
    fontSize: 16,
    textAlign: 'center'
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
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
    fontSize: 20,
  },
  cancel: {
      backgroundColor: 'rgba(192, 192, 192, 0.4)',
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

export default App;