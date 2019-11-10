import ApolloClient from 'apollo-boost'
import Vue from 'vue'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)

const apolloClient = new ApolloClient({
  uri: '',
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
