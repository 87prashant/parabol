import React, {PropTypes} from 'react';
import {
  DashContent,
  DashHeader,
  DashHeaderInfo,
  DashMain,
  dashTimestamp
} from 'universal/components/Dashboard';
import look, {StyleSheet} from 'react-look';
import UserActions from 'universal/modules/userDashboard/components/UserActions/UserActions';
import UserColumnsContainer from 'universal/modules/userDashboard/containers/UserColumns/UserColumnsContainer';
import makeRandomCheckInQuestion from 'universal/modules/meeting/helpers/makeRandomCheckInQuestion';

const UserDashboard = () => {
  const {styles} = UserDashboard;
  return (
    <DashMain>
      <DashHeader>
        <DashHeaderInfo title="My Dashboard">
          {dashTimestamp} • Carpe diem! • {makeRandomCheckInQuestion('Terry')}
        </DashHeaderInfo>
      </DashHeader>
      <DashContent>
        <div className={styles.root}>
          <div className={styles.actionsLayout}>
            <UserActions />
          </div>
          <div className={styles.projectsLayout}>
            <UserColumnsContainer/>
          </div>
        </div>
      </DashContent>
    </DashMain>
  );
};

UserDashboard.propTypes = {
  projects: PropTypes.array
};

UserDashboard.styles = StyleSheet.create({
  root: {
    display: 'flex',
    flex: 1,
    padding: '1rem',
    width: '100%'
  },

  actionsLayout: {
    width: '20%'
  },

  projectsLayout: {
    width: '80%'
  }
});

export default look(UserDashboard);
