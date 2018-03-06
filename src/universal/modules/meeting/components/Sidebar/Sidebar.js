import {css} from 'aphrodite-local-styles/no-important';
import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer} from 'react-relay';
import {Link} from 'react-router-dom';
import actionMeeting from 'universal/modules/meeting/helpers/actionMeeting';
import inAgendaGroup from 'universal/modules/meeting/helpers/inAgendaGroup';
import AgendaListAndInput from 'universal/modules/teamDashboard/components/AgendaListAndInput/AgendaListAndInput';
import {textOverflow} from 'universal/styles/helpers';
import logoMark from 'universal/styles/theme/images/brand/mark-primary.svg';
import appTheme from 'universal/styles/theme/appTheme';
import ui from 'universal/styles/ui';
import withStyles from 'universal/styles/withStyles';
import {AGENDA_ITEMS, CHECKIN, FIRST_CALL, phaseArray, SUMMARY, UPDATES} from 'universal/utils/constants';
import makeHref from 'universal/utils/makeHref';

const Sidebar = (props) => {
  const {
    gotoItem,
    gotoAgendaItem,
    inSync,
    isFacilitating,
    localPhase,
    localPhaseItem,
    setAgendaInputRef,
    styles,
    team
  } = props;
  const {teamId, teamName, agendaItems, facilitatorPhase, facilitatorPhaseItem, meetingPhase} = team;

  const relativeLink = `/meeting/${teamId}`;
  const shortUrl = makeHref(relativeLink);
  const agendaPhaseItem = actionMeeting[meetingPhase].index >= actionMeeting[AGENDA_ITEMS].index ?
    agendaItems.findIndex((a) => a.isComplete === false) + 1 : 0;
  const canNavigateTo = (phase) => {
    const adjustForFacilitator = isFacilitating ? 1 : 0;
    const phaseInfo = actionMeeting[phase];
    const meetingPhaseInfo = actionMeeting[meetingPhase];
    return Boolean(meetingPhaseInfo.index >= (phaseInfo.index - adjustForFacilitator));
  };
  const checkInLinkStyles = css(
    styles.navListItemLink,
    localPhase === CHECKIN && styles.navListItemLinkActive,
    !canNavigateTo(CHECKIN) && styles.navListItemLinkDisabled
  );
  const updatesLinkStyles = css(
    styles.navListItemLink,
    localPhase === UPDATES && styles.navListItemLinkActive,
    !canNavigateTo(UPDATES) && styles.navListItemLinkDisabled
  );
  const agendaLinkStyles = css(
    styles.navListItemLink,
    inAgendaGroup(localPhase) && styles.navListItemLinkActive,
    !canNavigateTo(FIRST_CALL) && styles.navListItemLinkDisabled
  );
  const checkInNavItemStyles = css(styles.navListItem, facilitatorPhase === CHECKIN && !inSync && styles.navListItemMeetingMarker);
  const updatesNavItemStyles = css(styles.navListItem, facilitatorPhase === UPDATES && !inSync && styles.navListItemMeetingMarker);
  const agendaNavItemStyles = css(styles.navListItem, inAgendaGroup(facilitatorPhase) && !inSync && styles.navListItemMeetingMarker);
  const agendaListCanNavigate = canNavigateTo(AGENDA_ITEMS);
  const agendaListDisabled = meetingPhase === CHECKIN;
  // Phase labels
  const checkinLabel = actionMeeting.checkin.name;
  const updatesLabel = actionMeeting.updates.name;
  const agendaitemsLabel = actionMeeting.agendaitems.name;
  const summaryLabel = actionMeeting.summary.name;
  return (
    <div className={css(styles.sidebar)}>
      <div className={css(styles.sidebarHeader)}>
        <Link
          className={css(styles.teamName)}
          to={`/team/${teamId}`}
          title={`Go to the ${teamName} Team Dashboard`}
        >
          {teamName}
        </Link>
        <a className={css(styles.shortUrl)} href={relativeLink}>{shortUrl}</a>
      </div>
      <nav className={css(styles.nav)}>
        <ul className={css(styles.navList)}>
          <li className={checkInNavItemStyles}>
            <div
              className={checkInLinkStyles}
              onClick={() => gotoItem(null, CHECKIN)}
              title={checkinLabel}
            >
              <span className={css(styles.navItemBullet)}>{'1'}</span>
              <span className={css(styles.navItemLabel)}>{checkinLabel}</span>
            </div>
          </li>
          <li className={updatesNavItemStyles}>
            <div
              className={updatesLinkStyles}
              onClick={() => gotoItem(null, UPDATES)}
              title={updatesLabel}
            >
              <span className={css(styles.navItemBullet)}>{'2'}</span>
              <span className={css(styles.navItemLabel)}>{updatesLabel}</span>
            </div>
          </li>
          <li className={agendaNavItemStyles}>
            <div
              className={agendaLinkStyles}
              onClick={() => gotoItem(null, FIRST_CALL)}
              title={agendaitemsLabel}
            >
              <span className={css(styles.navItemBullet)}>{'3'}</span>
              <span className={css(styles.navItemLabel)}>{agendaitemsLabel}</span>
            </div>
          </li>
          {localPhase === SUMMARY &&
          <li className={css(styles.navListItem, styles.navListItemLinkActive)}>
            <div
              className={css(styles.navListItemLink, styles.navListItemLinkActive)}
              onClick={() => gotoItem(null, SUMMARY)}
              title={summaryLabel}
            >
              <span className={css(styles.navItemBullet)}>{' '}</span>
              <span className={css(styles.navItemLabel)}>{summaryLabel}</span>
            </div>
          </li>
          }
        </ul>
        {localPhase !== SUMMARY &&
        <div className={css(styles.agendaListBlock)}>
          <AgendaListAndInput
            agendaPhaseItem={agendaPhaseItem}
            canNavigate={agendaListCanNavigate}
            context={'meeting'}
            disabled={agendaListDisabled}
            facilitatorPhase={facilitatorPhase}
            facilitatorPhaseItem={facilitatorPhaseItem}
            gotoAgendaItem={gotoAgendaItem}
            localPhase={localPhase}
            localPhaseItem={localPhaseItem}
            setAgendaInputRef={setAgendaInputRef}
            team={team}
          />
        </div>
        }
      </nav>
      <div className={css(styles.brand)}>
        <img className={css(styles.logo)} src={logoMark} />
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  agenda: PropTypes.array,
  agendaPhaseItem: PropTypes.number,
  facilitatorPhase: PropTypes.oneOf(phaseArray),
  facilitatorPhaseItem: PropTypes.number,
  inSync: PropTypes.bool,
  isFacilitating: PropTypes.bool,
  gotoItem: PropTypes.func.isRequired,
  gotoAgendaItem: PropTypes.func.isRequired,
  localPhase: PropTypes.oneOf(phaseArray),
  localPhaseItem: PropTypes.number,
  meetingPhase: PropTypes.oneOf(phaseArray),
  setAgendaInputRef: PropTypes.func.isRequired,
  styles: PropTypes.object,
  team: PropTypes.object.isRequired
};

const styleThunk = () => ({
  logo: {
    display: 'inline-block',
    verticalAlign: 'top'
  },

  brand: {
    fontSize: 0,
    padding: '.75rem',
    textAlign: 'center'
  },

  navItemBullet: {
    backgroundColor: appTheme.palette.mid,
    borderRadius: '100%',
    color: ui.palette.white,
    display: 'inline-block',
    fontSize: '.6875rem',
    fontWeight: ui.typeSemiBold,
    height: '1.5rem',
    lineHeight: '1.5rem',
    marginLeft: '1.3125rem',
    marginRight: '.75rem',
    textAlign: 'center',
    verticalAlign: 'middle',
    width: '1.5rem'
  },

  navItemLabel: {
    display: 'inline-block',
    fontSize: ui.navMenuFontSize,
    verticalAlign: 'middle'
  },

  nav: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: '2rem 0 0',
    width: '100%'
  },

  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0
  },

  navListItem: {
    fontSize: 0,
    fontWeight: 600,
    lineHeight: '2.5rem'
  },

  navListItemLink: {
    borderLeft: `${ui.navMenuLeftBorderWidth} solid transparent`,
    color: appTheme.palette.dark60l,
    cursor: 'pointer',
    textDecoration: 'none',
    userSelect: 'none',

    ':hover': {
      color: appTheme.palette.dark
    },
    ':focus': {
      color: appTheme.palette.dark
    }
  },

  navListItemLinkDisabled: {
    color: appTheme.palette.dark60l,
    cursor: 'not-allowed',
    opacity: '.65',

    ':hover': {
      color: appTheme.palette.dark60l
    },
    ':focus': {
      color: appTheme.palette.dark60l
    }
  },

  navListItemMeetingMarker: {
    position: 'relative',

    '::after': {
      backgroundColor: appTheme.palette.warm,
      borderRadius: '100%',
      display: 'block',
      content: '""',
      height: '.75rem',
      marginTop: '-.375rem',
      position: 'absolute',
      right: '-.375rem',
      top: '50%',
      width: '.75rem'
    }
  },

  navListItemLinkActive: {
    backgroundColor: ui.navMenuLightBackgroundColorActive,
    borderLeftColor: ui.palette.mid,
    color: appTheme.palette.dark
  },

  agendaListBlock: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100%'
  },

  sidebar: {
    // backgroundColor: appTheme.palette.mid10l,
    backgroundColor: ui.palette.white,
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 0 0',
    maxWidth: ui.meetingSidebarWidth,
    minWidth: ui.meetingSidebarWidth
  },

  sidebarHeader: {
    paddingLeft: '3.75rem',
    position: 'relative'
  },

  shortUrl: {
    ...textOverflow,
    color: appTheme.palette.dark10d,
    display: 'block',
    fontSize: appTheme.typography.s2,
    lineHeight: appTheme.typography.sBase,
    paddingRight: '1.5rem',
    textDecoration: 'none',

    ':hover': {
      color: appTheme.palette.dark
    },
    ':focus': {
      color: appTheme.palette.dark
    }
  },

  teamName: {
    color: ui.copyText,
    cursor: 'pointer',
    fontSize: appTheme.typography.s5,
    fontWeight: 600,
    lineHeight: '1.5'
  }
});

export default createFragmentContainer(
  withStyles(styleThunk)(Sidebar),
  graphql`
    fragment Sidebar_team on Team {
      teamId: id
      teamName: name
      facilitatorPhase
      facilitatorPhaseItem
      meetingPhase
      agendaItems {
        isComplete
      }
      ...AgendaListAndInput_team
    }
  `
);
