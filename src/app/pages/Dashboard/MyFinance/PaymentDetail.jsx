import React from 'react';
import { Divider } from '@material-ui/core';

const currencyMap = {
  USD: '$',
  CNY: '¥',
  null: '',
  undefined: '',
};

export default function PaymentDetail(props) {
  const currency = props.data.currency || 'USD';
  const data = props.data.activities || [
    { paidAmount: 0, paymentDate: '2020-01-01' },
  ];

  return (
    <div style={{ padding: '8px 10px 8px' }}>
      {data.map((ele, index) => (
        <section key={index}>
          <p
            style={{ color: '#8e8e8e', fontSize: '13px', marginBottom: '-2px' }}
          >
            Payment Amount
          </p>
          <p
            style={{ color: '#505050', fontSize: '14px', marginBottom: '6px' }}
          >
            {currencyMap[currency]}
            {ele.paidAmount.toLocaleString()}
          </p>
          <Divider style={{ marginBottom: '8px' }} />
          <p
            style={{ color: '#8e8e8e', fontSize: '13px', marginBottom: '-2px' }}
          >
            Payment Date
          </p>
          <p
            style={{ color: '#505050', fontSize: '14px', marginBottom: '2px' }}
          >
            {ele.paymentDate}
          </p>
        </section>
      ))}
    </div>
  );
}
