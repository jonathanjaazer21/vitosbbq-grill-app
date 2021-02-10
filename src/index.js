import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import store from './app/store'
import { ThemeProvider } from 'styled-components'

const theme = {
  primaryColor: '#444',
  secondaryColor: '#333',
  backgroundColor: '#eee',
  hoverColor: 'rgba(192,192,192,0.1)',
  whiteText: '#888',
  menuPadding: '1rem 0rem',
  headerSize: '1.5rem',
  textSize: '.5rem',
  borderRadius: '0.5rem',
  active: 'red'
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
