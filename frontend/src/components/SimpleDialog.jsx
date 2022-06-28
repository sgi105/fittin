import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material'

function SimpleDialog({ open, onClose, question, yesText, noText }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id='alert-dialog-title'></DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {question}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ fontWeight: 'bold' }} value='no'>
          {noText}
        </Button>
        <Button onClick={onClose} sx={{ fontWeight: 'bold' }} value='yes'>
          {yesText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SimpleDialog
