import {GraphQLID, GraphQLNonNull} from 'graphql'
import RemoveSlackAuthPayload from '../types/RemoveSlackAuthPayload'
import {getUserId, isTeamMember} from '../../utils/authorization'
import publish from '../../utils/publish'
import standardError from '../../utils/standardError'
import {SubscriptionChannel} from 'parabol-client/types/constEnums'
import removeUserSlackAuth from './helpers/removeUserSlackAuth'

export default {
  name: 'RemoveSlackAuth',
  type: new GraphQLNonNull(RemoveSlackAuthPayload),
  description: 'Disconnect a team member from Slack',
  args: {
    teamId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'the teamId to disconnect from the token'
    }
  },
  resolve: async (_source, {teamId}, {authToken, socketId: mutatorId, dataLoader}) => {
    const operationId = dataLoader.share()
    const subOptions = {mutatorId, operationId}
    const viewerId = getUserId(authToken)

    // AUTH
    if (!isTeamMember(authToken, teamId)) {
      return standardError(new Error('Team not found'), {userId: viewerId})
    }

    // RESOLUTION
    const {authId, error} = await removeUserSlackAuth(viewerId, teamId, true)
    if (error) {
      return standardError(error, {userId: viewerId})
    }

    const data = {authId, teamId, userId: viewerId}
    publish(SubscriptionChannel.TEAM, teamId, 'RemoveSlackAuthPayload', data, subOptions)
    return data
  }
}
