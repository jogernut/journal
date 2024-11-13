import React, { useState } from 'react'
import { 
  Typography, 
  Paper, 
  Grid, 
  Tabs, 
  Tab, 
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
  DialogActions,
  TextField,
  CardMedia
} from '@mui/material'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import useJournalStore from '../store/journalStore'

function MarkupDialog({ open, onClose, markup, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedMarkup, setEditedMarkup] = useState({
    pair: markup?.pair || '',
    notes: markup?.notes || ''
  })

  // Update state when markup prop changes
  React.useEffect(() => {
    if (markup) {
      setEditedMarkup({
        pair: markup.pair || '',
        notes: markup.notes || ''
      })
    }
  }, [markup])

  if (!markup) return null

  const handleSaveEdit = () => {
    onEdit(markup.date, markup.id, editedMarkup)
    setIsEditing(false)
    onClose()
  }

  const renderMediaPreview = () => {
    const mediaTypes = ['news', 'fourHour', 'fifteenMin', 'fiveMin', 'video']
    
    return mediaTypes.flatMap((type) => {
      const files = markup.files?.[type] || []
      return files.map((file, index) => {
        const preview = URL.createObjectURL(file)
        
        return (
          <Grid item xs={12} sm={6} key={`${type}-${index}`}>
            {type === 'video' ? (
              <video 
                src={preview} 
                controls 
                style={{ width: '100%', height: 200, objectFit: 'cover' }} 
              />
            ) : (
              <CardMedia
                component="img"
                height="200"
                image={preview}
                alt={`${type} preview`}
                sx={{ objectFit: 'cover' }}
              />
            )}
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              {type.replace(/([A-Z])/g, ' $1').trim()}
            </Typography>
          </Grid>
        )
      })
    })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>Daily Markup Details</Grid>
          <Grid item>
            {!isEditing ? (
              <IconButton onClick={() => setIsEditing(true)}>
                <EditIcon />
              </IconButton>
            ) : (
              <Button onClick={handleSaveEdit} color="primary">
                Save
              </Button>
            )}
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        {isEditing ? (
          <>
            <TextField
              fullWidth
              label="Pair"
              value={editedMarkup.pair}
              onChange={(e) => setEditedMarkup(prev => ({ ...prev, pair: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes"
              value={editedMarkup.notes}
              onChange={(e) => setEditedMarkup(prev => ({ ...prev, notes: e.target.value }))}
            />
          </>
        ) : (
          <>
            <Typography variant="h6">Pair: {markup.pair}</Typography>
            <Typography variant="body1">Date: {format(new Date(markup.date), 'MMMM d, yyyy')}</Typography>
            <Typography variant="body1">Notes: {markup.notes || 'No notes'}</Typography>
          </>
        )}

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {renderMediaPreview()}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => onDelete('markup', markup.date, markup.id)}>Delete</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

function TradeDialog({ open, onClose, trade, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTrade, setEditedTrade] = useState(trade || {})

  // Update state when trade prop changes
  React.useEffect(() => {
    if (trade) {
      setEditedTrade(trade)
    }
  }, [trade])

  if (!trade) return null

  const handleSaveEdit = () => {
    onEdit(trade.id, editedTrade)
    setIsEditing(false)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>Trade Details</Grid>
          <Grid item>
            {!isEditing ? (
              <IconButton onClick={() => setIsEditing(true)}>
                <EditIcon />
              </IconButton>
            ) : (
              <Button onClick={handleSaveEdit} color="primary">
                Save
              </Button>
            )}
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        {isEditing ? (
          <Grid container spacing={2}>
            {/* Add editable fields here similar to TradeEntry form */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Pair"
                value={editedTrade.pair || ''}
                onChange={(e) => setEditedTrade(prev => ({ ...prev, pair: e.target.value }))}
              />
            </Grid>
            {/* Add more editable fields as needed */}
          </Grid>
        ) : (
          <>
            <Typography variant="h6">Pair: {trade.pair}</Typography>
            <Typography variant="body1">Direction: {trade.direction || 'Not specified'}</Typography>
            <Typography variant="body1">Entry Time: {trade.entryTime ? format(new Date(trade.entryTime), 'MMM dd, yyyy HH:mm') : 'Not specified'}</Typography>
            <Typography variant="body1">Exit Time: {trade.exitTime ? format(new Date(trade.exitTime), 'MMM dd, yyyy HH:mm') : 'Not specified'}</Typography>
            <Typography variant="body1">Result: {trade.result || 'Not specified'}</Typography>
            <Typography variant="body1">Notes: {trade.notes || 'No notes'}</Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => onDelete('trade', null, trade.id)}>Delete</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedMarkup, setSelectedMarkup] = useState(null)
  const [selectedTrade, setSelectedTrade] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const { dailyMarkups, trades, removeDailyMarkup, removeTrade, updateDailyMarkup, updateTrade } = useJournalStore()
  const navigate = useNavigate()

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const formattedDate = format(selectedDate, 'yyyy-MM-dd')
  
  const markups = (dailyMarkups[formattedDate] || []).map(markup => ({
    ...markup,
    date: formattedDate
  }))

  const dayTrades = trades
    .filter(trade => format(new Date(trade.date), 'yyyy-MM-dd') === formattedDate)

  const handleDelete = (type, date, identifier) => {
    if (type === 'markup') {
      if (window.confirm('Are you sure you want to delete this markup?')) {
        removeDailyMarkup(date, identifier)
      }
    } else {
      if (window.confirm('Are you sure you want to delete this trade?')) {
        removeTrade(identifier)
      }
    }
  }

  const handleEditMarkup = (date, markupId, updatedData) => {
    updateDailyMarkup(date, markupId, updatedData)
  }

  const handleEditTrade = (tradeId, updatedData) => {
    updateTrade(tradeId, updatedData)
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Select Date
          </Typography>
          <DateCalendar 
            value={selectedDate} 
            onChange={handleDateChange} 
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Daily Markup" />
            <Tab label="Trades" />
          </Tabs>
          
          {activeTab === 0 ? (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Pair</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {markups.map((markup) => (
                      <TableRow key={markup.id}>
                        <TableCell>
                          {format(new Date(markup.date), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>{markup.pair}</TableCell>
                        <TableCell align="right">
                          <IconButton 
                            size="small" 
                            onClick={() => setSelectedMarkup(markup)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDelete('markup', markup.date, markup.id)}
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
                onClick={() => navigate('/daily-markup')}
              >
                Create Daily Markup
              </Button>
            </>
          ) : (
            <>
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
                    {dayTrades.map((trade) => (
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
                            onClick={() => handleDelete('trade', trade.date, trade.id)}
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
                Record Trade
              </Button>
            </>
          )}
        </Paper>
      </Grid>

      <MarkupDialog
        open={Boolean(selectedMarkup)}
        onClose={() => setSelectedMarkup(null)}
        markup={selectedMarkup}
        onEdit={handleEditMarkup}
        onDelete={handleDelete}
      />

      <TradeDialog
        open={Boolean(selectedTrade)}
        onClose={() => setSelectedTrade(null)}
        trade={selectedTrade}
        onEdit={handleEditTrade}
        onDelete={handleDelete}
      />
    </Grid>
  )
}

export default Dashboard
