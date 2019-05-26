import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withState } from 'recompose';
import ClCamera from '../../components/ClCamera';

const HomeScreen = ({ offline }) => (
  <div className="home-layout">
    <ClCamera offline={offline} />
  </div>
);

HomeScreen.propTypes = {
  offline: PropTypes.bool.isRequired,
};

export default compose(
  withState('offline', 'setOffline', false),

  lifecycle({
    componentDidMount() {
      window.addEventListener('online', () => {
        this.props.setOffline(false);
      });

      window.addEventListener('offline', () => {
        this.props.setOffline(true);
      });
    },

    componentDidUpdate() {
      const offlineStatus = !navigator.onLine;
      if (this.props.offline !== offlineStatus) {
        this.props.setOffline(offlineStatus);
      }
    },
  }),
)(HomeScreen);
