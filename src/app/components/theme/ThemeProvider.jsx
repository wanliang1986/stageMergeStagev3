import React from 'react';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import * as Colors from './../../styles/Colors';
import CloseIcon from '@material-ui/icons/Close';
import CssBaseline from '@material-ui/core/CssBaseline';

export default function NextThemeProvider(props) {
  const themeConfig = {
    palette: {
      primary: {
        // light: '#73c9ff',
        main: Colors.PRIMARY,
        dark: '#006aa9',
        // dark: Colors.PRIMARY,
        contrastText: '#ffffff',
      },
      secondary: {
        light: '#ff79b0',
        main: Colors.SECONDARY,
        dark: '#c60055',
        contrastText: '#ffffff',
      },
      action: {
        active: Colors.GRAY,
      },
    },
    typography: {
      h5: {
        color: Colors.TEXT,
      },
      h6: {
        color: Colors.TEXT,
        fontSize: 18,
      },

      subtitle1: {
        color: Colors.TEXT,
      },
      subtitle2: {
        color: Colors.TEXT,
      },
      body2: {
        color: Colors.TEXT,
      },
      body1: {
        color: Colors.TEXT,
      },
      fontFamily: `/* Roman */ Roboto, Source Sans Pro, Helvetica, Arial, sans-serif,
             /* CJK */Noto Sans SC, Meiryo, Hiragino Sans GB W3,
              /* Arabic */ Noto Naskh Arabic, Droid Arabic Naskh, Geeza Pro, Simplified Arabic,
               /* Thai */ Noto Sans Thai, Thonburi, Dokchampa, Droid Sans Thai, 
               /* Sans Fallbacks */ -apple-system, '.SFNSDisplay-Regular',BlinkMacSystemFont,
                /* CJK Fallbacks */ Microsoft Yahei, Segoe UI,
                 "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`,
    },

    props: {
      // Name of the component ⚛️
      MuiButtonBase: {
        // The properties to apply
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
      MuiChip: {
        color: 'primary',
      },
      MuiDivider: {
        component: 'div',
      },
      MuiTabs: {
        scrollButtons: 'off',
        indicatorColor: 'primary',
        textColor: 'primary',
      },
    },
    overrides: {
      MuiCheckbox: {
        // Name of the component ⚛️ / style shee
        root: {
          // Name of the rule
          color: Colors.GRAY, // Some CSS,
          paddingTop: 6,
          paddingBottom: 6,
          backgroundColor: 'transparent !important',
        },
      },
      MuiFormControlLabel: {
        label: {
          color: Colors.TEXT,
        },
      },
      MuiDialog: {
        paper: {
          maxHeight: '90vh',
        },
      },
      MuiDialogContent: {
        root: {
          paddingBottom: 12,
        },
      },
      MuiDialogActions: {
        root: {
          justifyContent: 'flex-start',
          padding: '12px 24px 24px 24px',
          margin: 0,
        },
      },

      MuiButton: {
        root: {
          textTransform: 'capitalize',
        },
        label: {
          whiteSpace: 'nowrap',
        },
      },

      MuiTabs: {
        root: {
          flexShrink: 0,
          boxShadow: 'inset 0 -1px #e8e8e8',
        },
        indicator: {
          height: 3,
        },
      },

      MuiTab: {
        root: {
          textTransform: 'initial',
          marginRight: 12,
          '@media (min-width: 960px)': {
            minWidth: 100,
          },
        },
      },

      MuiToolbar: {
        root: {
          '@media (min-width: 600px)': {
            minHeight: 48,
          },
        },
      },

      MuiAppBar: {
        colorDefault: {
          color: Colors.TEXT,
          backgroundColor: '#ffffff',
        },
      },

      MuiStepper: {
        root: {
          flexShrink: 0,
        },
      },
    },
  };
  const theme = createTheme(themeConfig);
  console.log(theme);
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </MuiThemeProvider>
  );
}
