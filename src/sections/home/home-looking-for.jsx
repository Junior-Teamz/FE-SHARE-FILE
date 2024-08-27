import { useState } from 'react';
import { m } from 'framer-motion';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Modal from '@mui/material/Modal';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
// components
import InfoIcon from '@mui/icons-material/Info';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeLookingFor() {
  const mdUp = useResponsive('up', 'md');
  const [openModal, setOpenModal] = useState(false);
  const [pdfToShow, setPdfToShow] = useState(null);

  const handleCardClick = (label) => {
    if (label.includes('Permen PANRB') || label.includes('Permen KOPUKM')) {
      setPdfToShow(label === 'Permen PANRB No. 43 Tahun 2022' ? 'Spppd.pdf' : 'kopukm.pdf');
      setOpenModal(true);
    } else {
      window.location.href = paths.informasi; // Navigates to the "Informasi & Pengumuman" page
    }
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
      <Grid container spacing={3}>
        {/* Top Grid: Pengumuman & Informasi */}
        <Grid xs={12}>
          <m.div variants={varFade().inUp}>
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              onClick={() => handleCardClick(cards[0].label)}
              sx={{
                p: 4, // Increased padding for larger card size
                borderRadius: 2,
                backgroundColor: 'primary.main',
                color: 'common.white',
                textAlign: 'center',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out, backgroundColor 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              {cards[0].icon} {/* Render the icon */}
              <Typography variant="h5">{cards[0].label}</Typography> {/* Larger font size */}
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
                  p: 4, // Increased padding for larger card size
                  borderRadius: 2,
                  backgroundColor: 'primary.main',
                  color: 'common.white',
                  textAlign: 'center',
                  height: '100%',
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
      </Grid>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: { xs: '90%', md: '70%', lg: '60%' }, // Responsive modal width
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6">PDF Preview: {pdfToShow}</Typography>
          <iframe
            loading="lazy"
            src={`/assets/pdf/${pdfToShow}`}
            width="100%"
            height={mdUp ? '600px' : '400px'} // Reduced height on mobile
            style={{ border: 'none' }}
          />

          <Button onClick={() => setOpenModal(false)} variant="contained" sx={{ mt: 2 }}>
            Close
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}
