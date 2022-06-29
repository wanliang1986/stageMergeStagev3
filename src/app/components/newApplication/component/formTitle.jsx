import React from 'react';

export default function FormTitle({ title }) {
  return (
    <div
      style={{
        color: '#505050',
        fontSize: 16,
        fontWeight: 600,
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      {title}
    </div>
  );
}
