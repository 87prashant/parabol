import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

const AuthTokenRole = new GraphQLEnumType({
  name: 'AuthTokenRole',
  description: 'A role describing super user privileges',
  values: {
    // superuser
    su: {}
  }
});

const AuthToken = new GraphQLObjectType({
  name: 'AuthToken',
  description: 'An auth token provided by Parabol to the client',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'A static ID so the location in the relay store is deterministic',
      resolve: () => 'AuthToken'
    },
    aud: {
      type: GraphQLString,
      description: 'audience. the target API used in auth0. Parabol does not use this.'
    },
    bet: {
      type: GraphQLInt,
      description: 'beta. 1 if enrolled in beta features. else absent'
    },
    exp: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'expiration. Time since unix epoch / 1000'
    },
    iat: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'issued at. Time since unix epoch / 1000'
    },
    iss: {
      type: GraphQLString,
      description: 'issuer. the url that gave them the token. useful for detecting environment'
    },
    sub: {
      type: GraphQLID,
      description: 'subscriber. userId'
    },
    rol: {
      type: AuthTokenRole,
      description: 'role. Any privileges associated with the account'
    },
    tms: {
      type: new GraphQLList(GraphQLID),
      description: 'teams. a list of teamIds where the user is active'
    }
  })
});

export default AuthToken;
