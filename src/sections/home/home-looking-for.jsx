import { useState } from 'react';
import { m } from 'framer-motion';
// @mui
import { Stack, Container, Typography, Grid, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { MotionViewport, varFade } from 'src/components/animate';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function HomeLookingFor() {
  const [pdfToShow, setPdfToShow] = useState(null);

  const handleCardClick = (label) => {
    const pdfMap = {
      'Permen PANRB No. 43 Tahun 2022': 'Spppd.pdf',
      'Permen KOPUKM No. 03 Tahun 2023': 'kopukm.pdf'
    };
    setPdfToShow(pdfMap[label] || null);
  };

  const handleClose = () => setPdfToShow(null);

  const latestNews = [
    {
      id: 1,
      title: 'Pengumuman Ujian Nasional',
      summary: 'Persiapan untuk ujian nasional akan dilaksanakan pada akhir bulan.',
    },
    {
      id: 2,
      title: 'Informasi Libur Sekolah',
      summary: 'Sekolah akan diliburkan selama satu minggu untuk perayaan hari besar nasional.',
    },
  ];

  const cards = [
    { icon: <PictureAsPdfIcon fontSize="large" />, label: 'Permen PANRB No. 43 Tahun 2022' },
    { icon: <PictureAsPdfIcon fontSize="large" />, label: 'Permen KOPUKM No. 03 Tahun 2023' },
  ];

  return (
    <Container component={MotionViewport} sx={{ py: { xs: 10, md: 15 } }}>
      <Grid container spacing={4}>
        {/* Title: Informasi & Pengumuman */}
        <Grid item xs={12}>
          <m.div variants={varFade().inUp}>
            <Typography variant="h4" align="center" gutterBottom>
              Informasi & Pengumuman
            </Typography>
          </m.div>
        </Grid>

        {/* News Cards */}
        <Grid item xs={12}>
          <Grid container spacing={5} alignItems="flex-start">
            {latestNews.map((news) => (
              <Grid item xs={12} md={6} key={news.id}>
                <m.div variants={varFade().inUp}>
                  <Stack
                    alignItems="flex-start"
                    spacing={1}
                    sx={{
                      p: 4,
                      borderRadius: 2,
                      backgroundColor: 'primary.main',
                      color: 'common.white',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease-in-out, backgroundColor 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    <Typography variant="h6">{news.title}</Typography>
                    <Typography variant="body2">{news.summary}</Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => (window.location.href = `/berita/${news.id}`)}
                      sx={{
                        mt: 2,
                        backgroundColor: '#80b918',
                        '&:hover': {
                          backgroundColor: '#55a630',
                        },
                      }}
                    >
                      Baca Selengkapnya
                    </Button>
                  </Stack>
                </m.div>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* More... Button */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <m.div variants={varFade().inUp}>
            <Button
              variant="contained"
              onClick={() => (window.location.href = paths.informasi)}
              sx={{
                backgroundColor: 'primary.main',
                color: 'common.white',
                px: 4,
                py: 1,
                transition: 'transform 0.3s ease-in-out, backgroundColor 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              More...
            </Button>
          </m.div>
        </Grid>

        {/* Title: Dasar Hukum */}
        <Grid item xs={12}>
          <m.div variants={varFade().inUp}>
            <Typography variant="h4" align="center" gutterBottom>
              Dasar Hukum
            </Typography>
          </m.div>
        </Grid>

        {/* PDF Cards */}
        <Grid container spacing={4}>
          {cards.map((card) => (
            <Grid item xs={12} md={6} key={card.label}>
              <m.div variants={varFade().inUp}>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                  onClick={() => handleCardClick(card.label)}
                  sx={{
                    p: 3,
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
                  {card.icon}
                  <Typography variant="h6">{card.label}</Typography>
                </Stack>
              </m.div>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* PDF Preview Modal */}
      {pdfToShow && (
        <Grid item xs={12}>
          <div style={{ position: 'relative', marginTop: '16px' }}>
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
              style={{ border: 'none' }}
              title="PDF Preview"
            />
          </div>
        </Grid>
      )}
    </Container>
  );
}
