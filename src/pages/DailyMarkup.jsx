import React, { useState, useRef } from 'react'
import { 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Snackbar, 
  Alert 
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import useJournalStore from '../store/journalStore'
import FileUpload from '../components/FileUpload'
import { format } from 'date-fns'

const PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'XAU/USD']

function DailyMarkup() {
  const [date, setDate] = useState(new Date())
  const [pair, setPair] = useState('')
  const [notes, setNotes] = useState('')
  const [files, setFiles] = useState({
    news: [],
    fourHour: [],
    fifteenMin: [],
    fiveMin: [],
    video: []
  })
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const addDailyMarkup = useJournalStore((state) => state.addDailyMarkup)
  
  // Refs for FileUpload components
  const fileUploadRefs = {
    news: useRef(null),
    fourHour: useRef(null),
    fifteenMin: useRef(null),
    fiveMin: useRef(null),
    video: useRef(null)
  }

  const handleFileUpload = (type) => (uploadedFiles) => {
    setFiles(prev => ({
      ...prev,
      [type]: [...prev[type], ...uploadedFiles]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!pair) {
      alert('Please select a pair')
      return
    }

    const formattedDate = format(date, 'yyyy-MM-dd')
    
    addDailyMarkup(formattedDate, { 
      pair, 
      notes, 
      files,
      date: formattedDate
    })
    
    setOpenSnackbar(true)
    
    // Reset form
    setDate(new Date())
    setPair('')
    setNotes('')
    setFiles({
      news: [],
      fourHour: [],
      fifteenMin: [],
      fiveMin: [],
      video: []
    })

    // Reset FileUpload components
    Object.values(fileUploadRefs).forEach(ref => {
      if (ref.current) {
        ref.current.resetFiles()
      }
    })
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Daily Markup
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Pair</InputLabel>
              <Select
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                label="Pair"
                required
              >
                {PAIRS.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">News Events</Typography>
                <FileUpload 
                  ref={fileUploadRefs.news}
                  onFileUpload={handleFileUpload('news')} 
                  fileType="image"
                  title="Upload News Events"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">4-Hour Chart</Typography>
                <FileUpload 
                  ref={fileUploadRefs.fourHour}
                  onFileUpload={handleFileUpload('fourHour')} 
                  fileType="image"
                  title="Upload 4-Hour Chart"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">15-Minute Chart</Typography>
                <FileUpload 
                  ref={fileUploadRefs.fifteenMin}
                  onFileUpload={handleFileUpload('fifteenMin')} 
                  fileType="image"
                  title="Upload 15-Minute Chart"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">5-Minute Chart</Typography>
                <FileUpload 
                  ref={fileUploadRefs.fiveMin}
                  onFileUpload={handleFileUpload('fiveMin')} 
                  fileType="image"
                  title="Upload 5-Minute Chart"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">End-of-Day Video</Typography>
                <FileUpload 
                  ref={fileUploadRefs.video}
                  onFileUpload={handleFileUpload('video')} 
                  fileType="video"
                  title="Upload End-of-Day Video"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Daily Markup
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Daily markup saved successfully!
        </Alert>
      </Snackbar>
    </Paper>
  )
}

export default DailyMarkup
