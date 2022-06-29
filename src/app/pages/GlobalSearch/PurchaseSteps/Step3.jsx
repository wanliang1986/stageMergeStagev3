import React from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import PotentialButton from '../../../components/particial/PotentialButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';

const Step3 = props => {
  const { credit, cancelPurchase } = props;
  console.log('popsssss', props);
  return (
    <div style={{ padding: '10px' }}>
      <Typography>
        You've been charged 1 <span style={{ color: '#3498DB' }}>credit</span>.
        You may check the talent's contact on Talent Profile Page.
      </Typography>
      <PrimaryButton
        type="button"
        style={{ minWidth: 120, marginTop: '15px' }}
        // disabled={this.state.creating}
        onClick={cancelPurchase}
        name="submit"
      >
        {'Back To Talent Profile'}
      </PrimaryButton>

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: 0,
          right: 0,
          textAlign: 'right'
        }}
      >
        <Divider style={{ marginBottom: 20 }} />
        <PotentialButton style={{ marginRight: '20px' }} type="button">
          {`You have ${credit} credit`}
        </PotentialButton>
      </div>
    </div>
  );
};

export default Step3;
