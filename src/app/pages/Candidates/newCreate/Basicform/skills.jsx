import React from 'react';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { components } from 'react-select-5';
import CreatableSelect from 'react-select-5/creatable';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import clsx from 'clsx';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const styles = {
  fullWidth: {
    width: '100%',
    '&>div': {
      width: '100%',
    },
  },
  requiredSkill: {
    flex: ' 0 0 100%',
    maxWidth: '100%',
    paddingRight: '0.25rem',
    paddingLeft: '0.25rem',
    marginTop: 15,
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginRight: 10,
  },
};

const customSelectStyles = {
  input: (base) => {
    return {
      ...base,
      input: { boxShadow: 'none !important' },
    };
  },
};

function arrayMove(array, from, to) {
  const slicedArray = array.slice();
  slicedArray.splice(
    to < 0 ? array.length + to : to,
    0,
    slicedArray.splice(from, 1)[0]
  );
  return slicedArray;
}

const SortableSelect = SortableContainer(CreatableSelect);

const SortableMultiValue = SortableElement((props) => {
  // this prevents the menu from being opened/closed when the user clicks
  // on a value to begin dragging it. ideally, detecting a click (instead of
  // a drag) would still focus the control and toggle the menu, but that
  // requires some magic with refs that are out of scope for this example
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const innerProps = { ...props.innerProps, onMouseDown };
  return <components.MultiValue {...props} innerProps={innerProps} />;
});

const SortableMultiValueLabel = SortableHandle((props) => (
  <components.MultiValueLabel {...props} />
));

class Skills extends React.Component {
  constructor(props) {
    super(props);
    const paserBasicInfo = props.basicInfo ? props.basicInfo.toJS() : {};
    this.state = {
      skillFlag: paserBasicInfo.skills || false,
      skills: paserBasicInfo.skills || [],
      inputValue: '',
    };
  }

  addSkills = () => {
    this.setState({
      skillFlag: true,
    });
  };

  deleteSkills = () => {
    this.setState({
      skillFlag: false,
      skills: [],
    });
  };

  changeSetSkills = (skills) => {
    console.log('changeSetSkills', skills);
    this.setState({ skills });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const newValue = arrayMove(this.state.skills, oldIndex, newIndex);
    if (oldIndex !== newIndex) {
      newValue[newIndex].score = null;
      newValue[newIndex].parsedId = null;
    }

    this.setState({
      skills: newValue,
    });
    console.log(newValue, oldIndex, newIndex);
  };
  handleInputChange = (inputValue: string) => {
    this.setState({ inputValue });
  };
  handleKeyDown = (event) => {
    const { inputValue, skills } = this.state;
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (!skills.find(({ skillName }) => skillName === inputValue)) {
          this.setState({
            inputValue: '',
            skills: [
              ...skills,
              ...this.filterOptions(this.createOption(inputValue), skills),
            ],
          });
        }
        event.preventDefault();
    }
  };

  createOption = (value) => {
    if (!value) {
      return [];
    }
    if (value.includes(',')) {
      return value
        .split(',')
        .filter((v) => v)
        .map((v) => ({ skillName: v.trim(), score: Math.random() }));
    } else {
      return [{ skillName: value.trim(), score: Math.random() }];
    }
  };

  filterOptions = (options, oldOptions) => {
    const values = oldOptions.map(({ skillName }) => skillName.trim());
    return options.filter(({ skillName }) => !values.includes(skillName));
  };

  render() {
    const { t, classes } = this.props;
    const { skillFlag, skills, inputValue } = this.state;
    return (
      <div>
        <div className="flex-container align-justify align-middle">
          <Typography variant="h6"> {t('tab:Skills')}</Typography>
          {skillFlag ? (
            <div className={classes.flex} onClick={this.deleteSkills}>
              <DeleteOutlineIcon
                style={{ color: '#e85919', fontSize: '21px' }}
              />
              <p style={{ color: '#e85919', marginTop: 0 }}>
                {t('tab:Delete')}
              </p>
            </div>
          ) : (
            <div className={classes.flex} onClick={this.addSkills}>
              <AddIcon style={{ color: '#3398dc', fontSize: '21px' }} />
              <p style={{ color: '#3398dc', marginTop: 0 }}>{t('tab:Add')}</p>
            </div>
          )}
        </div>
        {skillFlag ? (
          <div className={clsx('small-12 columns', classes.requiredSkill)}>
            <FormReactSelectContainer label={t('tab:Skills')}>
              <SortableSelect
                styles={customSelectStyles}
                useDragHandle
                // react-sortable-hoc props:
                axis="xy"
                onSortEnd={this.onSortEnd}
                distance={4}
                // small fix for https://github.com/clauderic/react-sortable-hoc/pull/352:
                getHelperDimensions={({ node }) => node.getBoundingClientRect()}
                // react-select props:
                isMulti
                menuIsOpen={false}
                inputValue={inputValue}
                value={skills}
                getOptionValue={(option) => option.skillName}
                getOptionLabel={(option) => option.skillName}
                onChange={this.changeSetSkills}
                onInputChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                noOptionsMessage={() => null}
                components={{
                  // @ts-ignore We're failing to provide a required index prop to SortableElement
                  MultiValue: SortableMultiValue,
                  MultiValueLabel: SortableMultiValueLabel,
                  DropdownIndicator: null,
                }}
                placeholder={t('tab:Add Skills')}
              />
            </FormReactSelectContainer>
          </div>
        ) : null}
        <input
          type="hidden"
          name="skills"
          value={JSON.stringify(skills)}
          form="candidateBasic"
        />
        <Divider style={{ marginTop: 30, marginBottom: 30 }} />
      </div>
    );
  }
}

export default connect()(withStyles(styles)(Skills));
