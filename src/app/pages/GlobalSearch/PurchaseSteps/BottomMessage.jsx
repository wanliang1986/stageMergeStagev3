import React from 'react';

const BottomMessage = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        color: '#fff',
        marginBottom: '20px',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          backgroundColor: '#505050',
          borderRadius: '5px',
          padding: '8px 10px',
          fontSize: '14px',
        }}
      >
        {' '}
        {props.content}
      </span>
    </div>
  );
};

export default BottomMessage;
