import React from 'react'
import GoogleButton from 'react-google-button'
import Animate, {
  RollIn,
  FadeIn,
  FadeInDown,
  ZoomIn,
  FadeInUp,
  RubberBand
} from 'animate-css-styled-components'
import { auth, provider } from 'services/firebase'
import {
  Wrapper,
  Background,
  GoogleContainer,
  Card,
  CookedChef,
  Description,
  VitosLogo
} from './styles'
import background from 'images/background2.jpg'
import cookedChefLogo from 'images/cookedChef.jpg'
import vitosLogo from 'images/vitosLogo.jpg'

function Login () {
  const handleLogin = () => {
    auth
      .signInWithPopup(provider)
      .then(result => {
        /** @type {firebase.auth.OAuthCredential} */
        const credential = result.credential

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken
        // The signed-in user info.
        var user = result.user
        // ...
      })
      .catch(error => {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
        // ...
      })
  }

  return (
    <Wrapper>
      {/* <Background src={background} /> */}
      <Animate Animation={[FadeInDown]} duration={['1s']} delay={['0.1s']}>
        <Card>
          <Animate Animation={[FadeIn]} duration={['1s']} delay={['0.8s']}>
            <CookedChef src={cookedChefLogo} />
          </Animate>
          <Animate Animation={[RollIn]} duration={['1s']} delay={['0.5s']}>
            <VitosLogo src={vitosLogo} />
          </Animate>
          <Animate Animation={[FadeInUp]} duration={['.1s']} delay={['1.2s']}>
            <Description>USER LOGIN</Description>
          </Animate>
          <Animate
            Animation={[ZoomIn, RubberBand]}
            duration={['.1s', '1s']}
            delay={['0.8s', '1.5s']}
          >
            <GoogleContainer>
              <GoogleButton onClick={handleLogin} type='light' />
            </GoogleContainer>
          </Animate>
        </Card>
      </Animate>
    </Wrapper>
  )
}

export default Login
