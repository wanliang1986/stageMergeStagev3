import React from 'react';

import Paper from '@material-ui/core/Paper';
import ImageIcon from '@material-ui/icons/Image';
import * as Colors from '../../../styles/Colors/index';

export default (props) => (
  <div style={{ minWidth: 200 }}>
    <label>
      <div>
        <input
          type="file"
          disabled={false}
          style={{ display: 'none' }}
          onChange={props.onNewImage}
        />
        {props.logoUrl ? (
          <img
            title={props.t('common:uploadLogo')}
            alt="logo"
            src={props.logoUrl}
            style={{
              width: 150,
              height: 150,
              margin: '0 2px',
              backgroundColor: 'white',
            }}
          />
        ) : (
          <Paper
            className="flex-container flex-dir-column align-center align-middle"
            style={{ width: 150, height: 150, margin: '0 2px' }}
          >
            <ImageIcon
              style={{
                fontSize: '4em',
                color: Colors.GRAY,
                textAlign: 'center',
              }}
            />

            <div
              style={{
                textAlign: 'center',
                color: Colors.SUB_TEXT,
              }}
            >
              {props.t('common:uploadLogo')}
            </div>
          </Paper>
        )}
      </div>
    </label>
  </div>
);
