import {GraphQLID, GraphQLNonNull} from 'graphql'
import makeSubscribeIter from 'server/graphql/makeSubscribeIter'
import AddProviderPayload from 'server/graphql/types/AddProviderPayload'
import {getUserId, isTeamMember} from 'server/utils/authorization'
import {SLACK} from 'universal/utils/constants'
import {sendTeamAccessError} from 'server/utils/authorizationErrors'

export default {
  type: new GraphQLNonNull(AddProviderPayload),
  args: {
    teamId: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  subscribe: (source, {teamId}, {authToken, dataLoader}) => {
    // AUTH
    if (!isTeamMember(authToken, teamId)) {
      return sendTeamAccessError(authToken, teamId)
    }
    const subscriberUserId = getUserId(authToken)

    // RESOLUTION
    const channelName = `providerAdded.${teamId}`
    const resolve = (value) => {
      const {providerAdded} = value
      const {
        provider: {service, userId},
        providerRow
      } = providerAdded
      // we know what the providerRow for slack will look like because everyone uses the same token
      if (service === SLACK || subscriberUserId === userId) {
        return value
      }
      // IMPORTANT! value should not be mutated, it is reused for every listener in the async iterator
      return {
        providerAdded: {
          ...providerAdded,
          provider: null,
          providerRow: {
            ...providerRow,
            accessToken: null
          }
        }
      }
    }
    return makeSubscribeIter(channelName, {resolve, dataLoader})
  }
}
