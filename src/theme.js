import { grey } from '@material-ui/core/colors';

const theme = {
  palette: {
    type: 'dark',
    primary: {
      main: '#00bef9',
      900: '#0051a1',
      800: '#0070c2',
      700: '#0081d5',
      600: '#0094e8',
      500: '#00a2f6',
      400: '#00b0f7',
      300: '#00bef9',
      200: '#48d1fb',
      100: '#9ee4fc',
      50: '#daf5fe',
    },
    secondary: {
      main: '#4eccd2',
      900: '#0d5b58',
      800: '#0d7e81',
      700: '#0d9298',
      600: '#0aa7b1',
      500: '#08b7c3',
      400: '#2bc1ca',
      300: '#4eccd2',
      200: '#80dbde',
      100: '#b1e9ea',
      50: '#dff6f7',
    },
    error: {
      main: '#CF6679',
    },
    background: {
      default: '#181818',
      paper: '#181818',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#D0D0D0',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
  overrides: {
    MuiPaper: {
      root: {
        boxShadow: 'none',
      },
      elevation1: {
        background: '#1E1E1E',
        boxShadow: 'none',
      },
      elevation2: {
        background: '#212121',
        boxShadow: 'none',
      },
    },
    MuiDialogActions: {
      spacing: {
        padding: '16px 24px 16px 24px',
      },
    },
    MuiLinearProgress: {
      bar1Buffer: {},
      bar2Buffer: {
        background: grey[300],
        opacity: 0.3,
      },
      dashedColorPrimary: {
        background: grey[500],
        opacity: 0.3,
        backgroundImage: 'none',
        animation: 'none',
      },
      dashedColorSecondary: {
        background: grey[500],
        opacity: 0.3,
        backgroundImage: 'none',
        animation: 'none',
      },
    },
  },
};

export default theme;
