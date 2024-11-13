import React, { useState, forwardRef, useImperativeHandle, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Typography, Paper, IconButton, Grid, Card, CardMedia } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

const FileUpload = forwardRef(({ onFileUpload, fileType = 'image', title }, ref) => {
  const [previews, setPreviews] = useState([])

  const onDrop = useCallback((acceptedFiles) => {
    const newPreviews = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    
    setPreviews(prev => [...prev, ...newPreviews])
    onFileUpload(acceptedFiles)
  }, [onFileUpload])

  const handleRemove = useCallback((index) => {
    setPreviews(prev => {
      // Revoke previous object URLs to prevent memory leaks
      const removedPreview = prev[index]
      if (removedPreview) {
        URL.revokeObjectURL(removedPreview.preview)
      }
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  const resetFiles = useCallback(() => {
    // Revoke all existing object URLs
    previews.forEach(preview => URL.revokeObjectURL(preview.preview))
    setPreviews([])
  }, [previews])

  useImperativeHandle(ref, () => ({
    resetFiles
  }), [resetFiles])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileType === 'image' 
      ? { 'image/*': [] } 
      : { 'video/*': [] },
    multiple: true
  })

  return (
    <Box>
      {previews.length > 0 ? (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {previews.map((item, index) => (
            <Grid item xs={6} key={index} sx={{ position: 'relative' }}>
              <Card>
                {fileType === 'image' ? (
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.preview}
                    alt={`Preview ${index}`}
                  />
                ) : (
                  <video 
                    src={item.preview} 
                    style={{ width: '100%', height: 140, objectFit: 'cover' }}
                  />
                )}
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => handleRemove(index)}
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    bgcolor: 'rgba(0,0,0,0.5)' 
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Card>
            </Grid>
          ))}
          <Grid item xs={6}>
            <IconButton 
              {...getRootProps()}
              size="small" 
              color="primary"
              sx={{ 
                border: '1px dashed', 
                width: 40, 
                height: 40 
              }}
            >
              <input {...getInputProps()} />
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>
      ) : (
        <Paper
          {...getRootProps()}
          sx={{
            p: 2,
            textAlign: 'center',
            cursor: 'pointer',
            border: '2px dashed',
            borderColor: 'divider'
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography>{title}</Typography>
        </Paper>
      )}
    </Box>
  )
})

FileUpload.displayName = 'FileUpload'

export default FileUpload
