import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { throttle } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { searchLocation } from '../../../../../../apn-sdk/client';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
const styles = {
  root: {
    width: '100%',
    '& label': {
      display: 'inline-block',
    },
  },
  input: {
    padding: '5px',
  },
  inputWrapper: {
    borderRadius: 0,
    paddingLeft: 8,
    border: `1px solid #cacaca`,
    transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
    '&.Mui-focused': {
      borderColor: `#8a8a8a`,
      boxShadow: `0 0 5px #cacaca`,
      transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
    },
  },
  textfield: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& > div': {
      width: '100%',
    },
  },
};

// const throttle=(func,timer,timerId)=>{
//     console.log('timerId',timerId)
//     return function(){
//       if(timerId){
//         return;
//       }
//       timerId=setTimeout(()=>{
//         func.apply(this,arguments);
//         timerId=null;
//       },timer)
//     }
// }

// const top100Films = [
//   { title: 'The Shawshank Redemption', year: 1994 },
//   { title: 'The Godfather', year: 1972 },
//   { title: 'The Godfather: Part II', year: 1974 },
//   { title: 'The Dark Knight', year: 2008 },
//   { title: '12 Angry Men', year: 1957 },
//   { title: "Schindler's List", year: 1993 },
//   { title: 'Pulp Fiction', year: 1994 },
//   { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
//   { title: 'The Good, the Bad and the Ugly', year: 1966 },
//   { title: 'Fight Club', year: 1999 },
//   { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
//   { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
//   { title: 'Forrest Gump', year: 1994 },
//   { title: 'Inception', year: 2010 },
//   { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
//   { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
//   { title: 'Goodfellas', year: 1990 }
// ];

// const options = top100Films.map(option => {
//   const firstLetter = option.title[0].toUpperCase();
//   return {
//     firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
//     ...option
//   };
// });

// const filter = createFilterOptions();

class Name extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      curLocation: '',
      id: '0',
      timerId: null,
      newValues: null,
    };
    this.handleInputThrottled = throttle(this._search, 500);
  }

  componentWillMount() {
    this.setState({ curLocation: '', id: this.state.id + 1, newValues: '' });

    if (this.props.city) {
      this.changeFilter(this.props.city);
    }
  }

  // 根据query 去后台调用 联想数据
  _search = (query) => {
    searchLocation(query).then(({ response }) => {
      let data = response.reverse().sort(function (a, b) {
        if (a.similarity == 'city') {
          return -1;
        } else {
          return 1;
        }
      });
      console.log(data);
      data.map((ele) => {
        if (ele.similarity === 'city') {
          ele.show = `${ele.city}, ${ele.province}, ${ele.country}`;
        } else if (ele.similarity === 'province') {
          ele.show = `${ele.province}, ${ele.country}`;
        } else {
          ele.show = ele.country;
        }
        return ele;
      });

      this.setState({ locations: data });
    });
  };
  // 输入框输入
  fetchLocationList = (e) => {
    console.log(11111);
    const query = e.target.value;
    this.setState({ curLocation: query, newValues: '' }, () => {
      this.handleInputThrottled(query);
    });
  };

  closePopup = () => {
    this.setState({ locations: [] });
  };

  changeFilter = (newValue) => {
    let filters = this.props.filters;
    filters = filters ? filters.toJS() : [];
    console.log(newValue);
    let data;
    let msg;
    if (newValue) {
      let flag = false;
      filters.length > 0 &&
        filters.map((item) => {
          if (typeof newValue === 'string' && item.location == newValue) {
            flag = true;
          } else if (newValue.show == item.key) {
            flag = true;
          }
        });
      if (flag) {
        return;
      }

      if (typeof newValue === 'string') {
        data = { location: newValue, key: newValue };
        msg = newValue;
      } else if (newValue && newValue.inputValue) {
        data = { location: newValue.inputValue, key: newValue.inputValue };
        msg = newValue.inputValue;
      } else {
        if (newValue.similarity === 'city') {
          data = {
            city: newValue.city,
            province: newValue.province,
            country: newValue.country,
            key: newValue.show,
          };
          msg =
            newValue.city + ', ' + newValue.province + ', ' + newValue.country;
        } else if (newValue.similarity === 'province') {
          data = {
            province: newValue.province,
            country: newValue.country,
            key: newValue.show,
          };
          msg = newValue.city + ', ' + newValue.province;
        } else {
          data = {
            country: newValue.country,
            key: newValue.show,
          };
          msg = newValue.country;
        }
      }

      const locations = [...filters, data];
      this.setState({
        curLocation: msg,
        id: this.state.id + 1,
        newValues: newValue,
      });
      this.props.getLocation(newValue);
      // this.props.dispatch(getFilterData({ locations: locations }));
    }
  };
  getCurLocation = (data) => {};

  newChange = () => {
    console.log(this.state.newValues);
    if (this.state.newValues) {
      this.props.getLocation(this.state.newValues);
    } else {
      this.props.getLocation(this.state.curLocation);
    }
  };

  render() {
    const { locations, curLocation, city } = this.state;
    const { classes, open, errorMessage, removeErrorMsgHandler, placeholder } =
      this.props;

    return (
      <div className={classes.root}>
        <Autocomplete
          freeSolo
          value={this.state.id}
          disableClearable
          options={locations}
          // groupBy={option =>
          //   option.similarity.charAt(0).toUpperCase() +
          //   option.similarity.slice(1)
          // }
          style={{ width: '100%', marginBottom: '2px' }}
          inputValue={curLocation}
          onChange={(e, newValue) => {
            this.changeFilter(newValue);
          }}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.show;
          }}
          onClose={this.closePopup}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                className: clsx(
                  params.InputProps.className,
                  classes.inputWrapper
                ),
                disableUnderline: true,
              }}
              placeholder={placeholder}
              onChange={this.fetchLocationList}
              onBlur={() => {
                this.newChange();
              }}
            />
          )}
        />
        <span
          style={{
            color: '#cc4b37',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: 'Roboto',
          }}
        >
          {errorMessage && errorMessage.get('primaryAddressesCity')
            ? errorMessage.get('primaryAddressesCity')
            : null}
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    filters: state.controller.searchAudience.get('filters').get('locations'),
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Name));
