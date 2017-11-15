import {GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString} from 'graphql';
import {globalIdField} from 'graphql-relay';
import getRethink from 'server/database/rethinkDriver';
import connectionFromProjects from 'server/graphql/queries/helpers/connectionFromProjects';
import GraphQLEmailType from 'server/graphql/types/GraphQLEmailType';
import GraphQLURLType from 'server/graphql/types/GraphQLURLType';
import {ProjectConnection} from 'server/graphql/types/Project';
import User from 'server/graphql/types/User';
import {Team} from '../models/Team/teamSchema';
import {forwardConnectionArgs} from 'graphql-relay';
import GraphQLISO8601Type from 'server/graphql/types/GraphQLISO8601Type';

const TeamMember = new GraphQLObjectType({
  name: 'TeamMember',
  description: 'A member of a team',
  fields: () => ({
    id: globalIdField('TeamMember', ({id}) => id),
    // id: {type: new GraphQLNonNull(GraphQLID), description: 'The unique team member ID'},
    isNotRemoved: {
      type: GraphQLBoolean,
      description: 'true if the user is a part of the team, false if they no longer are'
    },
    isLead: {type: GraphQLBoolean, description: 'Is user a team lead?'},
    isFacilitator: {type: GraphQLBoolean, description: 'Is user a team facilitator?'},
    hideAgenda: {
      type: GraphQLBoolean,
      description: 'hide the agenda list on the dashboard'
    },
    /* denormalized from User */
    email: {
      type: GraphQLEmailType,
      description: 'The user email'
    },
    picture: {
      type: GraphQLURLType,
      description: 'url of user’s profile picture'
    },
    preferredName: {
      type: GraphQLString,
      description: 'The name, as confirmed by the user'
    },
    /* Ephemeral meeting state */
    checkInOrder: {
      type: GraphQLInt,
      description: 'The place in line for checkIn, regenerated every meeting'
    },
    isCheckedIn: {
      type: GraphQLBoolean,
      description: 'true if present, false if absent, null before check-in'
    },
    /* Foreign keys */
    teamId: {
      type: GraphQLID,
      description: 'foreign key to Team table'
    },
    userId: {
      type: GraphQLID,
      description: 'foreign key to User table'
    },
    /* GraphQL sugar */
    team: {
      type: Team,
      description: 'The team this team member belongs to',
      resolve({teamId}) {
        const r = getRethink();
        return r.table('Team')
          .get(teamId)
          .run();
      }
    },
    user: {
      type: User,
      description: 'The user for the team member',
      resolve({userId}, args, {getDataLoader}) {
        return getDataLoader().users.load(userId);
      }
    },
    projects: {
      type: ProjectConnection,
      description: 'Projects owned by the team member',
      args: {
        ...forwardConnectionArgs,
        after: {
          type: GraphQLISO8601Type,
          description: 'the datetime cursor'
        }
        // private: {
        //  type: GraphQLBoolean,
        //  description: 'true if the result should include private cards'
        // }
      },
      resolve: async ({teamId, userId}, args, {getDataLoader}) => {
        const allProjects = await getDataLoader().projectsByTeamId.load(teamId);
        const projectsForUserId = allProjects.filter((project) => project.userId === userId);
        const publicProjectsForUserId = projectsForUserId.filter((project) => !project.tags.includes('private'));
        return connectionFromProjects(publicProjectsForUserId);
      }
    }
  })
});

export default TeamMember;
