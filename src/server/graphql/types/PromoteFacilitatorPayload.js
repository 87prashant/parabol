import {GraphQLObjectType} from 'graphql';
import {resolveTeam} from 'server/graphql/resolvers';
import Team from 'server/graphql/types/Team';
import TeamMember from 'server/graphql/types/TeamMember';
import StandardMutationError from 'server/graphql/types/StandardMutationError';

const PromoteFacilitatorPayload = new GraphQLObjectType({
  name: 'PromoteFacilitatorPayload',
  fields: () => ({
    error: {
      type: StandardMutationError
    },
    team: {
      type: Team,
      description: 'Thea team currently running a meeting',
      resolve: resolveTeam
    },
    newFacilitator: {
      type: TeamMember,
      description: 'The new meeting facilitator',
      resolve: ({newFacilitatorId}, args, {dataLoader}) => {
        return dataLoader.get('teamMembers').load(newFacilitatorId);
      }
    },
    disconnectedFacilitator: {
      type: TeamMember,
      description: 'The team member that disconnected',
      resolve: ({disconnectedFacilitatorId}, args, {dataLoader}) => {
        return disconnectedFacilitatorId ? dataLoader.get('teamMembers').load(disconnectedFacilitatorId) : null;
      }
    }
  })
});

export default PromoteFacilitatorPayload;
