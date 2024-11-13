import React, { useState } from 'react'
import { 
  Typography, 
  Paper, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import useJournalStore from '../store/journalStore'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'

function TradeDialog({ open, onClose, trade }) {
  if (!trade) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Trade Details</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Pair: {trade.pair}</Typography>
        <Typography variant="body1">Date: {format(new Date(trade.date), 'MMMM d, yyyy')}</Typography>
        <Typography variant="body1">Direction: {trade.direction}</Typography>
        <Typography variant="body1">Result: {trade.result}</Typography>
        <Typography variant="body1">Notes: {trade.notes}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

function Trades() {
  const [selectedTrade, setSelectedTrade] = useState(null)
  const { trades, removeTrade } = useJournalStore()
  const navigate = useNavigate()

  const sortedTrades = [...trades].sort((a, b) => new Date(b.date) - new Date(a.date))

  const handleDelete = (tradeId) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      removeTrade(tradeId)
    }
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Trades
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Pair</TableCell>
              <TableCell>Direction</TableCell>
              <TableCell>Result</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTrades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>
                  {format(new Date(trade.date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{trade.pair}</TableCell>
                <TableCell>{trade.direction}</TableCell>
                <TableCell>{trade.result}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    size="small" 
                    onClick={() => setSelectedTrade(trade)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleDelete(trade.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        sx={{ mt: 2 }}
        onClick={() => navigate('/trade-entry')}
      >
        Create Trade Entry
      </Button>

      <TradeDialog
        open={Boolean(selectedTrade)}
        onClose={() => setSelectedTrade(null)}
        trade={selectedTrade}
      />
    </Paper>
  )
}

export default Trades
