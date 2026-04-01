import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import App from './App'
import './index.css'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://127.0.0.1:8000/graphql',
  }),
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)