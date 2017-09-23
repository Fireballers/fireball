/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import { cloudVision } from './secrets';
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

// import Tts from 'react-native-tts';
// import { Examples } from '@shoutem/ui';

export default class fireball extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: null,
      text: 'Loading...'
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
    );
  }

  renderImage() {
    return (
      <View>
        <Text style={{margin: 60}} >{this.state.text}</Text>
        <Image
          source={{ uri: this.state.path }}
          style={styles.preview}
        />
        <Text
          style={styles.cancel}
          onPress={() => this.setState({ path: null })}
        >Cancel
        </Text>
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
          text: `We're ${res.data.responses[0].labelAnnotations[0].score}% sure that you captured: ${res.data.responses[0].labelAnnotations[0].description}!`
        })
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
    margin: 40
  }
});

AppRegistry.registerComponent('fireball', () => fireball);
