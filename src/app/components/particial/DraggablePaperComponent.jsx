import React from 'react';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

function DraggablePaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default DraggablePaperComponent;
