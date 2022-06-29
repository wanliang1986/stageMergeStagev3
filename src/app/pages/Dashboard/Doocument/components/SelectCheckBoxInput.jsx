import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import clsx from 'clsx';

const styles = {
  warp: {
    width: 250,
    maxWidth: 400,
    '& label': {
      display: 'inline-block',
      marginBottom: 8,
    },
    '& .MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot':
      {
        paddingRight: 24,
      },
  },
  inputWrapper: {
    width: 320,
    paddingLeft: 8,
    marginBottom: 10,
    border: `1px solid #cacaca`,
    transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
    '&.Mui-focused': {
      borderColor: `#8a8a8a`,
      boxShadow: `0 0 5px #cacaca`,
      transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
    },
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  anOr: {
    width: 82,
    height: 22,
    // borderRadius: 3,
    '& span': {
      width: 40,
      height: 20,
      textAlign: 'center',
      display: 'inline-block',
      fontSize: 13,
    },
  },
  left: {
    border: 'solid 1px #939393',
    borderRight: 'none',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    color: ' #939393',
    opacity: '0.4',
  },
  right: {
    border: 'solid 1px #3398dc',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    color: '#3398dc',
    backgroundColor: 'rgba(51, 152, 220, 0.1)',
    opacity: '0.6',
  },
};

class SelectCheckBoxInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prevFilters: [], //存放当前选中的内容
      placeholderValue: '',
      defultOptions: [
        {
          value: 'Complete',
          label: 'Complete',
        },
        {
          value: 'Incomplete',
          label: 'Incomplete',
        },
      ],
    };
  }

  componentDidMount() {
    const { packageValueList, documentValueList, type, nameStatus } =
      this.props;
    if (nameStatus === 'documentView') {
      documentValueList.forEach((item) => {
        if (item.key === type) {
          this.setState(
            {
              prevFilters: item.values,
            },
            () => {
              this.props.selectData(this.state.prevFilters);
            }
          );
        }
      });
    } else if (nameStatus === 'packageView') {
      packageValueList.forEach((item) => {
        if (item.key === type) {
          this.setState(
            {
              prevFilters: item.values,
            },
            () => {
              this.props.selectData(this.state.prevFilters);
            }
          );
        }
      });
    }

    // const { valueList, type } = this.props;
    // valueList.forEach((item) => {
    //   if (item.key === type) {
    //     this.setState({
    //       prevFilters: item.values,
    //     });
    //   }
    // });
  }
  // props改变
  componentWillReceiveProps(nextProps) {
    console.log(this.props);
  }
  // select中选中的change事件
  onchangeHandler = (value) => {
    this.setState({ prevFilters: value }, () => {
      this.props.selectData(this.state.prevFilters); //选中的选项回传到父组件
    });
  };

  render() {
    const { prevFilters, placeholderValue, defultOptions } = this.state;
    const { classes, optionList } = this.props;
    return (
      <div className={classes.warp}>
        <div className={classes.title}>
          <label></label>
        </div>
        <Autocomplete
          multiple
          limitTags={1}
          ChipProps={{ size: 'small' }}
          value={prevFilters}
          options={optionList}
          disableCloseOnSelect
          onChange={(e, value) => {
            this.onchangeHandler(value);
          }}
          getOptionSelected={(option, value) => option.label === value.label}
          getOptionLabel={(option) => option.label}
          renderOption={(option, { selected }) => (
            <React.Fragment>
              {console.log(selected)}
              <Checkbox
                color="primary"
                size="small"
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.label}
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              placeholder={prevFilters.length ? '' : placeholderValue}
              {...params}
              InputProps={{
                ...params.InputProps,
                className: clsx(
                  params.InputProps.className,
                  classes.inputWrapper
                ),
                disableUnderline: true,
              }}
            />
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let documentValueList =
    state.controller.documentView.toJS().searchDataList || [];
  let packageValueList =
    state.controller.documentView.toJS().packSearchDataList || [];
  return {
    documentValueList,
    packageValueList,
  };
};

export default connect(mapStateToProps)(
  withStyles(styles)(SelectCheckBoxInput)
);
