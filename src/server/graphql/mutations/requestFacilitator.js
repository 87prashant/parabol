import {GraphQLID, GraphQLNonNull} from 'graphql'
import RequestFacilitatorPayload from 'server/graphql/types/RequestFacilitatorPayload'
import {getUserId, isTeamMember} from 'server/utils/authorization'
import publish from 'server/utils/publish'
import {TEAM} from 'universal/utils/constants'
import toTeamMemberId from 'universal/utils/relay/toTeamMemberId'
import {sendTeamAccessError} from 'server/utils/authorizationErrors'
import {sendAlreadyCurrentFacilitatorError} from 'server/utils/alreadyMutatedErrors'

export default {
  name: 'RequestFacilitator',
  description: 'Request to become the facilitator in a meeting',
  type: RequestFacilitatorPayload,
  args: {
    teamId: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve: async (source, {teamId}, {authToken, dataLoader, socketId: mutatorId}) => {
    const operationId = dataLoader.share()
    const subOptions = {mutatorId, operationId}

    // AUTH
    const viewerId = getUserId(authToken)
    if (!isTeamMember(authToken, teamId)) {
      return sendTeamAccessError(authToken, teamId)
    }

    // VALIDATION
    const requestorId = toTeamMemberId(teamId, viewerId)
    const {activeFacilitator} = await dataLoader.get('teams').load(teamId)
    if (activeFacilitator === requestorId) {
      return sendAlreadyCurrentFacilitatorError(authToken, requestorId)
    }

    // RESOLUTION
    const [currentFacilitatorUserId] = activeFacilitator.split('::')

    const data = {requestorId}
    publish(TEAM, currentFacilitatorUserId, RequestFacilitatorPayload, data, subOptions)
    return data
  }
}
