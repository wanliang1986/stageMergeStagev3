import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getActiveTenantUserList } from '../../../selectors/userSelector';

import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';

import FormReactSelectContainer from '../../particial/FormReactSelectContainer';

const styles = (theme) => ({
  formControl: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  label: {
    color: theme.palette.primary.main,
    marginRight: 10,
    fontSize: 13,
    minWidth: 60,
    fontWeight: 500,
  },
  textField: {
    fontSize: 14,
    border: '1px solid #cacaca',
    paddingLeft: 8,
    transition: 'box-shadow 0.5s, border-color 0.25s ease-in-out',
    '&:focus': {
      borderColor: '#8a8a8a',
      boxShadow: '0 0 5px #cacaca',
      background: 'transparent',
    },
  },
});

class Recipient extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      value: props.value,
      options: [].concat(props.userList, props.options),
    };
  }

  render() {
    const { classes, value, name, handleChange, label, placeholder } =
      this.props;

    return (
      <FormControl className={classes.formControl}>
        <label className={classes.label} htmlFor={name}>
          {label}:
        </label>
        <div className="flex-child-auto">
          <FormReactSelectContainer>
            <Select.Creatable
              value={value || ''}
              options={this.state.options}
              multi
              simpleValue
              onChange={(v) => handleChange(name, v)}
              // promptTextCreator={label => null}
              promptTextCreator={(label) => `add "${label}"`}
              noResultsText={false}
              placeholder={placeholder || ' '}
              arrowRenderer={null}
              tabSelectsValue={false}
            />
          </FormReactSelectContainer>
        </div>
      </FormControl>
    );
  }
}

function mapStoreStateToProps(state, { value }) {
  return {
    userList: getActiveTenantUserList(state)
      .toJS()
      .map((u) => ({ value: u.email, label: u.email })),
    options: value
      ? value
          .split(',')
          .filter((e) => e)
          .map((value) => ({ value, label: value }))
      : [],
  };
}

export default connect(mapStoreStateToProps)(withStyles(styles)(Recipient));
