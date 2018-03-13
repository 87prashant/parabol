import {GraphQLList, GraphQLObjectType} from 'graphql';
import User from 'server/graphql/types/User';
import {resolveFilterByTeam, resolveTeamMembers, resolveUser} from 'server/graphql/resolvers';
import TeamMember from 'server/graphql/types/TeamMember';
import StandardMutationError from 'server/graphql/types/StandardMutationError';

const UpdateUserProfilePayload = new GraphQLObjectType({
  name: 'UpdateUserProfilePayload',
  fields: () => ({
    error: {
      type: StandardMutationError
    },
    user: {
      type: User,
      resolve: resolveUser
    },
    teamMembers: {
      type: new GraphQLList(TeamMember),
      description: 'The updated team members',
      resolve: resolveFilterByTeam(resolveTeamMembers, ({teamId}) => teamId)
    }
  })
});

export default UpdateUserProfilePayload;
