/**
 * Created by chenghui on 7/20/17.
 */
import * as Colors from './../../styles/Colors';

export const style = {
  group: {
    backgroundColor: '#669df6',
    color: 'white',
    textAlign: 'center',
  },
  headerCell0: {
    position: 'relative',
    '&:before': {
      content: '""',
      width: 1,
      height: 24,
      backgroundColor: '#c3c3c3',
      display: 'block',
      position: 'absolute',
      right: 0,
      top: 6,
    },
  },
  indexCell: {
    borderRight: '1px solid #c3c3c3',
  },

  headerCell: {
    fontSize: 15,
    fontWeight: 500,
    color: Colors.TEXT,
  },
  displayCell: {
    fontSize: 15,
    color: Colors.TEXT,
    textTransform: 'capitalize',
    paddingLeft: 4,
  },
  headerText: {
    borderRight: `1px solid ${Colors.GRAY_3}`,
    paddingRight: 10,
    marginRight: -8,
    paddingLeft: 2,
  },
  checkboxContainer: {
    width: 24,
    overflow: 'hidden',
  },
  checkbox: {
    height: 24,
    width: 24,
  },
  checked: {
    color: Colors.PRIMARY,
  },
  favoriteRoot: {
    '&$favoriteChecked': {
      color: Colors.YELLOW,
    },
  },
  favoriteChecked: {},
  actionContainer: {
    // position: 'relative',
    left: 6,
  },
  buttonLink: {
    lineHeight: 'inherit',
    color: '#1779ba',
    textDecoration: 'none',
    cursor: 'pointer',
    outline: 'none',
  },
};

export const HEADER_HEIGHT = 40;
export const ROW_HEIGHT = 47;
export const ROW_HEIGHT_2 = 60;
export const HEADER_WITHFILTER_HEIGHT = 64;

export const styles = {
  inFocus: {
    '&:focus': {
      outline: 'none',
    },
  },
  jobCell: {},
  headerCell: {
    fontSize: 14,
    fontWeight: 500,
    color: Colors.TEXT,
    backgroundColor: '#F5F5F5',
  },
  sortIcon: {
    marginLeft: 12,
    fontSize: 15,
    fill: Colors.ALUMINUM,
    '&$active': {
      fill: Colors.PRIMARY,
    },
  },
  active: {},
  dataCell: {
    fontSize: 14,
    color: Colors.TEXT,
    backgroundColor: 'white',
    tableLayout: 'fixed',
    // textTransform: 'capitalize',
    '& .public_fixedDataTableCell_cellContent': {
      padding: '5px 8px',
    },
  },

  footerCell: {
    fontSize: 14,
    fontWeight: 500,
    color: Colors.TEXT,
    backgroundColor: 'white',
  },

  headerText: {
    // borderLeft: `1px solid ${Colors.GRAY_3}`,
    // paddingLeft: 10,
    // marginLeft: -8,
    // marginRight: 2
  },
  checkboxContainer: {
    width: 24,
    overflow: 'hidden',
  },
  checkbox: {
    height: 24,
    width: 24,
  },
  checked: {
    color: Colors.PRIMARY,
  },
  favoriteRoot: {
    '&$favoriteChecked': {
      color: Colors.YELLOW,
    },
  },
  favoriteChecked: {},
  actionContainer: {
    // position: 'relative',
    left: 6,
  },
  buttonLink: {
    lineHeight: 'inherit',
    color: '#1779ba',
    textDecoration: 'none',
    cursor: 'pointer',
    outline: 'none',
  },
};
