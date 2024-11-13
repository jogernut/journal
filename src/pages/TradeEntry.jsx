import React, { useState } from 'react'
import { 
  Typography, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  TextField, 
  Checkbox, 
  FormControlLabel,
  Snackbar,
  Alert
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import useJournalStore from '../store/journalStore'
import FileUpload from '../components/FileUpload'
import { TRADING_OPTIONS } from '../constants/tradingOptions'

function TradeEntry() {
  const [tradeData, setTradeData] = useState({
    pair: '',
    direction: '',
    htfPoi: '',
    htfConfluences: [],
    mtfLiquidity: [],
    mtfReasoning: '',
    mtfCaveats: [],
    entryModel: '',
    entryModelOptions: [],
    entryTime: null,
    exitTime: null,
    result: '',
    notes: '',
    images: []
  })
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [errorSnackbar, setErrorSnackbar] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const addTrade = useJournalStore((state) => state.addTrade)

  const handleChange = (e) => {
    const { name, value } = e.target
    setTradeData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleMultiSelectChange = (name) => (e) => {
    const { value } = e.target
    setTradeData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDateTimeChange = (name) => (newValue) => {
    setTradeData(prev => ({
      ...prev,
      [name]: newValue
    }))
  }

  const handleEntryModelChange = (e) => {
    const { value } = e.target
    setTradeData(prev => ({
      ...prev,
      entryModel: value,
      entryModelOptions: []
    }))
  }

  const handleFileUpload = (uploadedFiles) => {
    setTradeData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedFiles]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!tradeData.pair) {
      setErrorMessage('Pair is required')
      setErrorSnackbar(true)
      return
    }

    try {
      addTrade(tradeData)
      setOpenSnackbar(true)
      
      // Reset form
      setTradeData({
        pair: '',
        direction: '',
        htfPoi: '',
        htfConfluences: [],
        mtfLiquidity: [],
        mtfReasoning: '',
        mtfCaveats: [],
        entryModel: '',
        entryModelOptions: [],
        entryTime: null,
        exitTime: null,
        result: '',
        notes: '',
        images: []
      })
    } catch (error) {
      setErrorMessage('Failed to save trade. Please try again.')
      setErrorSnackbar(true)
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
    setErrorSnackbar(false)
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Trade Entry
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Pair Selection - REQUIRED */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Pair</InputLabel>
              <Select
                name="pair"
                value={tradeData.pair}
                onChange={handleChange}
                label="Pair"
              >
                {TRADING_OPTIONS.pairs.map(pair => (
                  <MenuItem key={pair} value={pair}>{pair}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Direction - Optional */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Direction</InputLabel>
              <Select
                name="direction"
                value={tradeData.direction}
                onChange={handleChange}
                label="Direction"
              >
                {TRADING_OPTIONS.directions.map(direction => (
                  <MenuItem key={direction} value={direction}>{direction}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* HTF POI - Single Select */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>HTF POI</InputLabel>
              <Select
                name="htfPoi"
                value={tradeData.htfPoi}
                onChange={handleChange}
                label="HTF POI"
              >
                {TRADING_OPTIONS.htfPoi.map(poi => (
                  <MenuItem key={poi} value={poi}>{poi}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* HTF Confluences - Multi-select */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>HTF Confluences</InputLabel>
              <Select
                multiple
                name="htfConfluences"
                value={tradeData.htfConfluences}
                onChange={handleMultiSelectChange('htfConfluences')}
                label="HTF Confluences"
                renderValue={(selected) => selected.join(', ')}
              >
                {TRADING_OPTIONS.htfConfluences.map(confluence => (
                  <MenuItem key={confluence} value={confluence}>
                    <Checkbox checked={tradeData.htfConfluences.includes(confluence)} />
                    {confluence}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* MTF Liquidity - Multi-select */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>MTF Liquidity</InputLabel>
              <Select
                multiple
                name="mtfLiquidity"
                value={tradeData.mtfLiquidity}
                onChange={handleMultiSelectChange('mtfLiquidity')}
                label="MTF Liquidity"
                renderValue={(selected) => selected.join(', ')}
              >
                {TRADING_OPTIONS.mtfLiquidity.map(liquidity => (
                  <MenuItem key={liquidity} value={liquidity}>
                    <Checkbox checked={tradeData.mtfLiquidity.includes(liquidity)} />
                    {liquidity}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* MTF Reasoning - Single Select */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>MTF Reasoning</InputLabel>
              <Select
                name="mtfReasoning"
                value={tradeData.mtfReasoning}
                onChange={handleChange}
                label="MTF Reasoning"
              >
                {TRADING_OPTIONS.mtfReasoning.map(reasoning => (
                  <MenuItem key={reasoning} value={reasoning}>{reasoning}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* MTF Caveats - Multi-select */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>MTF Caveats</InputLabel>
              <Select
                multiple
                name="mtfCaveats"
                value={tradeData.mtfCaveats}
                onChange={handleMultiSelectChange('mtfCaveats')}
                label="MTF Caveats"
                renderValue={(selected) => selected.join(', ')}
              >
                {TRADING_OPTIONS.mtfCaveats.map(caveat => (
                  <MenuItem key={caveat} value={caveat}>
                    <Checkbox checked={tradeData.mtfCaveats.includes(caveat)} />
                    {caveat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Entry Model */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Entry Model</InputLabel>
              <Select
                name="entryModel"
                value={tradeData.entryModel}
                onChange={handleEntryModelChange}
                label="Entry Model"
              >
                {TRADING_OPTIONS.entryModels.map(model => (
                  <MenuItem key={model} value={model}>{model}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Entry Model Options */}
          {tradeData.entryModel && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Entry Model Options</InputLabel>
                <Select
                  multiple
                  name="entryModelOptions"
                  value={tradeData.entryModelOptions}
                  onChange={handleMultiSelectChange('entryModelOptions')}
                  label="Entry Model Options"
                  renderValue={(selected) => selected.join(', ')}
                >
                  {(tradeData.entryModel === 'Risk Entry' 
                    ? TRADING_OPTIONS.riskEntryOptions 
                    : TRADING_OPTIONS.doubleBreakOptions).map(option => (
                    <MenuItem key={option} value={option}>
                      <Checkbox checked={tradeData.entryModelOptions.includes(option)} />
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Entry Time - Optional */}
          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Entry Time"
              value={tradeData.entryTime}
              onChange={handleDateTimeChange('entryTime')}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>

          {/* Exit Time - Optional */}
          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Exit Time"
              value={tradeData.exitTime}
              onChange={handleDateTimeChange('exitTime')}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>

          {/* Result - Optional */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Result</InputLabel>
              <Select
                name="result"
                value={tradeData.result}
                onChange={handleChange}
                label="Result"
              >
                {TRADING_OPTIONS.results.map(result => (
                  <MenuItem key={result} value={result}>{result}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Notes - Optional */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="notes"
              label="Notes"
              value={tradeData.notes}
              onChange={handleChange}
            />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Trade Images
            </Typography>
            <FileUpload
              onFileUpload={handleFileUpload}
              accept={{ 'image/*': [] }}
              title="Upload Trade Images"
            />
          </Grid>

          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
            >
              Save Trade Entry
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Trade saved successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={errorSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Paper>
  )
}

export default TradeEntry
