import makePlaceholderStyles from 'universal/styles/helpers/makePlaceholderStyles';
import appTheme from 'universal/styles/theme/appTheme';
import fontLoader from 'universal/styles/theme/fontLoader';
import ui from 'universal/styles/ui';

const placeholder = makePlaceholderStyles(ui.placeholderColor);

export default {
  '*': {
    boxSizing: 'border-box'
  },

  '*::before, *::after': {
    boxSizing: 'border-box'
  },

  html: {
    fontSize: '16px',
    fontFamily: fontLoader
  },

  body: {
    color: ui.colorText,
    fontFamily: appTheme.typography.sansSerif,
    '-moz-osx-font-smoothing': 'grayscale',
    '-webkit-font-smoothing': 'antialiased',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: 'normal',
    margin: 0,
    padding: 0
  },

  a: {
    color: ui.linkColor,
    textDecoration: 'none'
  },

  'a:hover, a:focus': {
    color: ui.linkColorHover,
    textDecoration: 'none'
  },

  input: {
    fontFamily: appTheme.typography.sansSerif,
    '-moz-osx-font-smoothing': 'grayscale',
    '-webkit-font-smoothing': 'antialiased'
  },

  ...placeholder,

  img: {
    maxWidth: '100%'
  },

  p: {
    margin: '0'
  },

  pre: {
    maxWidth: '100%',
    overflow: 'auto'
  },

  b: {
    fontWeight: 600
  },

  strong: {
    fontWeight: 600
  }
};
