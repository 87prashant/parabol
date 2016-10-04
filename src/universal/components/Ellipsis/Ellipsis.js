import React, {PropTypes} from 'react';
import withStyles from 'universal/styles/withStyles';
import {css} from 'aphrodite';

const Ellipsis = (props) => {
  const {
    isAnimated,
    styles
  } = props;
  const dotStyles1 = css(styles.dot, styles.dot1, isAnimated && styles.dotAnimated);
  const dotStyles2 = css(styles.dot, styles.dot2, isAnimated && styles.dotAnimated);
  const dotStyles3 = css(styles.dot, styles.dot3, isAnimated && styles.dotAnimated);
  return (
    <div className={css(styles.root)}>
      {isAnimated ?
        <span>
          <span className={dotStyles1}>.</span>
          <span className={dotStyles2}>.</span>
          <span className={dotStyles3}>.</span>
        </span> :
        <span>…</span>
      }
    </div>
  );
};

Ellipsis.propTypes = {
  isAnimated: PropTypes.bool,
  styles: PropTypes.object,
};

Ellipsis.defaultProps = {
  isAnimated: true
};

const keyframesOpacity = {
  '0%': {
    opacity: '1'
  },
  '100%': {
    opacity: '.25'
  }
};

const styleThunk = () => ({
  root: {
    display: 'inline'
  },

  dot: {
    display: 'inline'
  },

  dotAnimated: {
    animationDuration: '.8s',
    animationIterationCount: 'infinite',
    animationName: keyframesOpacity,
    display: 'inline-block',
    fontSize: '1.2em',
    fontWeight: 700,
    lineHeight: 'inherit',
    verticalAlign: 'baseline'
  },

  dot1: {
    animationDelay: '0ms',
  },

  dot2: {
    animationDelay: '200ms',
  },

  dot3: {
    animationDelay: '400ms',
  }
});

export default withStyles(styleThunk)(Ellipsis);
