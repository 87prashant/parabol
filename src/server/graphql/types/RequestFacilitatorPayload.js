import {GraphQLObjectType} from 'graphql';
import TeamMember from 'server/graphql/types/TeamMember';
import StandardMutationError from 'server/graphql/types/StandardMutationError';

const RequestFacilitatorPayload = new GraphQLObjectType({
  name: 'RequestFacilitatorPayload',
  fields: () => ({
    error: {
      type: StandardMutationError
    },
    requestor: {
      type: TeamMember,
      description: 'The team member that wants to be the facilitator',
      resolve: ({requestorId}, args, {dataLoader}) => {
        return dataLoader.get('teamMembers').load(requestorId);
      }
    }
  })
});

export default RequestFacilitatorPayload;
