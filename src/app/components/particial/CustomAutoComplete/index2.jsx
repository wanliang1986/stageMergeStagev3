/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import NoSsr from '@material-ui/core/NoSsr';
import { styled } from '@material-ui/core/styles';

import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';

const Label = styled('label')({
  fontSize: '0.75rem',
  padding: '0 0 4px',
  lineHeight: 1.5,
  display: 'block',
});

const InputWrapper = styled('div')({
  width: '100%',
  border: '1px solid #cacaca',
  backgroundColor: '#ffffff',
  borderRadius: 0,
  // padding: 1px;
  display: 'flex',
  alignItems: 'center',
  transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
  marginBottom: '0.75em',
  '&.focused': {
    borderColor: '#8a8a8a',
    boxShadow: '0 0 5px #cacaca',
    transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
  },

  '& input': {
    fontSize: 15,
    height: 30,
    boxSizing: 'border-box',
    padding: '4px 6px',
    width: 0,
    minWidth: 30,
    flexGrow: 1,
    border: 0,
    margin: 0,
    outline: 0,
    background: 'transparent',
  },
});

const Tag = styled(({ label, onDelete, ...props }) => (
  <div {...props}>
    <span>{label}</span>
    <CloseIcon onClick={onDelete} />
  </div>
))({
  display: 'flex',
  alignItems: 'center',
  height: 24,
  margin: 2,
  lineHeight: '22px',
  backgroundColor: '#fafafa',
  border: '1px solid #e8e8e8',
  borderRadius: 2,
  boxSizing: 'content-box',
  padding: '0 4px 0 10px',
  outline: 0,
  overflow: 'hidden',
  '&:focus': {
    borderColor: '#40a9ff',
    backgroundColor: '#e6f7ff',
  },

  '& span': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  '& svg': {
    fontSize: 12,
    cursor: 'pointer',
    padding: 4,
    width: 20,
    height: 20,
  },
});

const Listbox = styled(Paper)({
  margin: '2px 0 0',
  padding: 0,
  listStyle: 'none',
  backgroundColor: '#ffffff',
  overflow: 'auto',
  maxHeight: 250,
  borderRadius: 4,
  '& li': {
    padding: '5px 12px',
    display: 'flex',
    '& span': {
      flexGrow: 1,
    },
    '& svg': {
      color: 'transparent',
    },
  },
  "& li[aria-selected='true']": {
    backgroundColor: '#fafafa',
    fontWeight: 600,
    '& svg': {
      color: '#1890ff',
    },
  },
  "& li[data-focus='true']": {
    backgroundColor: '#e6f7ff',
    cursor: 'pointer',

    '& svg': {
      color: '#000000',
    },
  },
});

export default function CustomizedHook({
  label,
  disabled,
  value: defaultValue,
  options,
  onChange,
  placeholder,
  getOptionLabel = (option) => option.label || option,
}) {
  const [value, setValue] = React.useState(
    defaultValue.split(',').filter((e) => e) || []
  );

  useEffect(() => {
    setValue(defaultValue.split(',').filter((e) => e) || []);
  }, [defaultValue]);

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    getClearProps,
    groupedOptions,
    focused,
    popupOpen,
    anchorEl,
    setAnchorEl,
  } = useAutocomplete(
    {
      freeSolo: true,
      filterSelectedOptions: true,
      value,
      multiple: true,
      options: options.map((option) => option.value || option),
      getOptionLabel,
      disabled,
      onChange: (event, newValue) => {
        newValue.forEach((v) => {
          if (!options.includes(v)) {
            options.push(v);
          }
        });
        setValue(newValue);
        onChange(newValue.join());
      },
    },
    [options, defaultValue, onChange]
  );

  return (
    <NoSsr>
      <div>
        <div {...getRootProps()}>
          <Label {...getInputLabelProps()}>{label}</Label>
          <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
            <div
              className="flex-child-auto flex-container"
              style={{ flexWrap: 'wrap', overflow: 'hidden' }}
            >
              {value.map((option, index) => (
                <Tag
                  label={option.label || option}
                  {...getTagProps({ index })}
                />
              ))}

              <input
                {...getInputProps()}
                placeholder={placeholder}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    return false;
                  }
                }}
              />
            </div>
            {value.length > 0 && (
              <IconButton {...getClearProps()} size="small" color="primary">
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </InputWrapper>
        </div>
        <Popper open={popupOpen} anchorEl={anchorEl}>
          {groupedOptions.length > 0 ? (
            <Listbox
              {...getListboxProps()}
              style={{ width: anchorEl.clientWidth }}
            >
              {groupedOptions.map((option, index) => {
                console.log(
                  `getOptionProps-${index}:`,
                  getOptionProps({ option, index })
                );
                return (
                  <li {...getOptionProps({ option, index })}>
                    <span>{option.label || option}</span>
                  </li>
                );
              })}
            </Listbox>
          ) : (
            <div />
          )}
        </Popper>
      </div>
    </NoSsr>
  );
}
