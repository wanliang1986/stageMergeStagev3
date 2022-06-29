import React from 'react';
import { Divider } from '@material-ui/core';
import { currency as currencyOptions } from '../../../constants/formOptions';
import { useTranslation } from 'react-i18next';
const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

export default function PaymentDetail(props) {
  const currency = props.data.currency || 'USD';
  const data = props.data.activities || [
    { paidAmount: 0, paymentDate: '2020-01-01' },
  ];
  const [t] = useTranslation();
  return (
    <div style={{ padding: '8px 10px 8px' }}>
      {data.map((ele, index) => (
        <section key={index}>
          <p
            style={{ color: '#8e8e8e', fontSize: '13px', marginBottom: '-2px' }}
          >
            {t('tab:Payment Amount')}
          </p>
          <p
            style={{ color: '#505050', fontSize: '14px', marginBottom: '6px' }}
          >
            {currencyLabels[currency]}
            {ele.paidAmount.toLocaleString()}
          </p>
          <Divider style={{ marginBottom: '8px' }} />
          <p
            style={{ color: '#8e8e8e', fontSize: '13px', marginBottom: '-2px' }}
          >
            {t('tab:Payment Date')}
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
