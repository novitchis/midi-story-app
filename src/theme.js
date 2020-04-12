const theme = {
  palette: {
    type: 'dark',
    primary: {
      main: '#BB86FC',
      contrastText: 'black',
    },
    secondary: {
      main: '#03DAC6',
      contrastText: 'black',
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
  },
};

export default theme;
