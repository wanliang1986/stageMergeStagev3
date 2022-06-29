/**
 * Created by chenghui on 7/20/17.
 */
import * as Colors from '../../styles/Colors';

export const styles = {
  root: {
    width: 308,
    margin: '4em auto',
    padding: 20,
  },
  loginBtn: {
    marginTop: 25,
  },
  link: {
    width: '50%',
    fontSize: 14,
    textAlign: 'right',
    marginTop: 15,
  },
  messageContainer: {
    padding: '16px 12px',
    margin: '10px -20px 0',
    backgroundColor: '#ffe6ec',
    color: '#5a5a5a',
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',

    '& $icon': {
      fontSize: 48,
      marginRight: 16,
      flexShrink: 0,
      fill: '#f5134f',
    },
    '&$hint': {
      backgroundColor: '#dff0d8',
    },
    '&$hint $icon': {
      fill: '#3c763d',
    },
  },
  hint: {},
  icon: {},
};
