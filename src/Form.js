import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function CSRForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [readyToUpload, setReadyToUpload] = useState(false);

  const onChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(event.target.files[0]);
    if (file.type == 'application/pkcs10') {
      setReadyToUpload(true)
    } else {
      setReadyToUpload(false)
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append(
      "csrFile",
      selectedFile,
      selectedFile.name
    );
    fetch("api/cert-request", {
      method: 'POST',
      body: formData,
    }).then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(
          new Blob([blob]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `client_certificate_for_devops_wiki.crt`,
        );
        // Append to html link element page
        document.body.appendChild(link);
        // Start download
        link.click();
        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  };

  const fileData = () => {
    if (selectedFile) {
      return (
        <>
          <Typography component="h4" variant="h7">
            <p> File name: {selectedFile.name} </p>
          </Typography>
          <Typography component="h4" variant="h7">
            <p> File type: {selectedFile.type} </p>
          </Typography>
          <Typography component="h4" variant="h7">
            <p> Last Modified: {selectedFile.lastModifiedDate.toDateString()} </p>
          </Typography>
        </>
      );
    } else {
      return (
        <>
          <Typography component="h4" variant="h7">
            <p> File name: </p>
          </Typography>
          <Typography component="h4" variant="h7">
            <p> File type: </p>
          </Typography>
          <Typography component="h4" variant="h7">
            <p> Last Modified: </p>
          </Typography>
        </>
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <input
             color="primary"
             accept="application/pkcs10"
             type="file"
             onChange={onChange}
             id="csrFile"
             style={{ display: 'none', }}
            />
            {fileData()}
            <label htmlFor="csrFile">
              <Button
                variant="contained"
                component="span"
                fullWidth
                variant="contained"
                color="primary"
              >
                Choose your CSR file
              </Button>
            </label>
            <Button
              type="submit "
              fullWidth
              variant="contained"
              disabled={!readyToUpload}
              sx={{ mt: 3, mb: 2 }}
            >
              Send CSR 
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
