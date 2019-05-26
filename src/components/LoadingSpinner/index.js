import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const LoadingSpinner = ({
  fullSize,
  style,
  small,
  white,
  isPageLoader,
}) => (
  <div
    className="spinner"
    style={{ height: fullSize ? '100vh' : isPageLoader ? '70vh' : 'auto', ...style }}
  >
    <div className="spinner__container">
      <div className={`spinner__inner${small ? ' spinner__inner_small' : ''}${`${white ? ' spinner__inner_white' : ''}`}`} />
    </div>
  </div>
);

LoadingSpinner.propTypes = {
  fullSize: PropTypes.bool,
  isPageLoader: PropTypes.bool,
  style: PropTypes.object,
  small: PropTypes.bool,
  white: PropTypes.bool,
};

LoadingSpinner.defaultProps = {
  fullSize: false,
  isPageLoader: false,
  style: {},
  small: false,
  white: false,
};

export default LoadingSpinner;
