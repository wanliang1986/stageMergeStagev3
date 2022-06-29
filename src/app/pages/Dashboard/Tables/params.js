/**
 * Created by chenghui on 7/20/17.
 */
import * as Colors from '../../../styles/Colors';

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

export const HEADER_HEIGHT = 40;
export const ROW_HEIGHT = 30;
export const HEADER_WITHFILTER_HEIGHT = 64;
