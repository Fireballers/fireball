import React from 'react';
import { Scene, Router} from 'react-native-router-flux';
import Camera from './components/Camera'
import CardHolder from './components/CardHolder'

const RouterComponent = () => {
  return (
    <Router sceneStyle ={{ paddingTop: 165 }}>
      <Scene key="camera" component={Camera} title="Take Photo" initial />
      <Scene key="cardHolder" component={CardHolder} title="see cards" />
    </Router>
  )
};

export default RouterComponent;
