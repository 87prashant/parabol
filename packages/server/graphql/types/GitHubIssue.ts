import {GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString} from 'graphql'
import connectionDefinitions from '../connectionDefinitions'
import {GQLContext} from '../graphql'
import GitHubRepository from './GitHubRepository'
import GraphQLURLType from './GraphQLURLType'
import PageInfoDateCursor from './PageInfoDateCursor'
import StandardMutationError from './StandardMutationError'

const GitHubIssue = new GraphQLObjectType<any, GQLContext>({
  name: 'GitHubIssue',
  description: 'The GitHub Issue that comes direct from GitHub',
  isTypeOf: ({repository, title}) => !!(repository && title),
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLID),
      description: 'The id of the issue as found in GitHub'
      // TODO fix me
      // resolve: ()
    },
    url: {
      type: GraphQLNonNull(GraphQLURLType),
      description: 'The url to access the issue'
    },
    nameWithOwner: {
      type: GraphQLNonNull(GraphQLString),
      description: 'The name of the repository with owner'
    },
    issueNumber: {
      type: GraphQLNonNull(GraphQLInt),
      description: 'The issue number'
    },
    repository: {
      type: GraphQLNonNull(GitHubRepository),
      description: 'The repository that the issue belongs to'
    },
    title: {
      type: GraphQLNonNull(GraphQLString),
      description: 'The title of the GitHub issue'
    }
  })
})

const {connectionType, edgeType} = connectionDefinitions({
  name: GitHubIssue.name,
  nodeType: GitHubIssue,
  edgeFields: () => ({
    cursor: {
      type: GraphQLString
    }
  }),
  connectionFields: () => ({
    pageInfo: {
      type: PageInfoDateCursor,
      description: 'Page info with cursors as unique ids straight from GitHub'
    },
    issueCount: {
      type: GraphQLNonNull(GraphQLInt),
      description: 'The total number of issues returned from the GitHub query'
    },
    error: {
      type: StandardMutationError,
      description: 'An error with the connection, if any'
    }
  })
})

export const GitHubIssueConnection = connectionType
export const GitHubIssueEdge = edgeType
export default GitHubIssue
