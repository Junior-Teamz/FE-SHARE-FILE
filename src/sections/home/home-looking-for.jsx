import { useState } from 'react';
import { m } from 'framer-motion';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeLookingFor() {
  const [pdfToShow, setPdfToShow] = useState(null);

  const handleCardClick = (label) => {
    if (label.includes('Permen PANRB') || label.includes('Permen KOPUKM')) {
      setPdfToShow(label === 'Permen PANRB No. 43 Tahun 2022' ? 'Spppd.pdf' : 'kopukm.pdf');
    } else {
      window.location.href = paths.informasi; // Navigates to the "Informasi & Pengumuman" page
    }
  };

  const handleClose = () => {
    setPdfToShow(null);
  };

  const cards = [
    { icon: <InfoIcon fontSize="large" />, label: 'Pengumuman & Informasi' },
    { icon: <PictureAsPdfIcon fontSize="large" />, label: 'Permen PANRB No. 43 Tahun 2022' },
    { icon: <PictureAsPdfIcon fontSize="large" />, label: 'Permen KOPUKM No. 03 Tahun 2023' },
  ];

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      <Grid container spacing={4}>
        {/* Top Grid: Pengumuman & Informasi */}
        <Grid xs={12}>
          <m.div variants={varFade().inUp}>
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              onClick={() => handleCardClick(cards[0].label)}
              sx={{
                p: 4,
                borderRadius: 2,
                backgroundColor: 'primary.main',
                color: 'common.white',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out, backgroundColor 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              {cards[0].icon} {/* Render the icon */}
              <Typography variant="h5">{cards[0].label}</Typography>
            </Stack>
          </m.div>
        </Grid>

        {/* Bottom Grid: PDF Cards */}
        {cards.slice(1).map((card, index) => (
          <Grid xs={12} md={6} key={index}>
            <m.div variants={varFade().inUp}>
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={2}
                onClick={() => handleCardClick(card.label)}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  backgroundColor: 'primary.main',
                  color: 'common.white',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease-in-out, backgroundColor 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {card.icon} {/* Render the icon */}
                <Typography variant="h6">{card.label}</Typography>
              </Stack>
            </m.div>
          </Grid>
        ))}

        {/* PDF Preview Display */}
        {pdfToShow && (
          <Grid xs={12} md={12}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '16px',
                padding: '0 16px',
              }}
            >
              {/* Close Button */}
              <IconButton
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>

              <iframe
                src={`/assets/pdf/${pdfToShow}`}
                width="100%"
                height="600px"
                style={{ border: '10px' }}
                title="PDF Preview"
              />
            </div>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
