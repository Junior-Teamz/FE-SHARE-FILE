// Import statements

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { _socials } from 'src/_mock';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Kemen from '../../../public/logo/kemen1.png';

const LINKS = [
  {
    headline: 'Minimal',
    children: [
      { name: 'About us', href: paths.about },
      { name: 'Contact us', href: paths.contact },
      { name: 'FAQs', href: paths.faqs },
    ],
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Terms and Condition', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  },
  {
    headline: 'Contact',
    children: [{ name: 'kemenkop@gmail.com', href: '#' }],
  },
];

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const mainFooter = (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
        mt: 3,
      }}
    >
      <Divider />

      <Container
        sx={{
          pt: 10,
          pb: 5,
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            alignItems: 'center',
            display: 'flex',
            justifyContent: { xs: 'center', lg: 'flex-start' },
            textAlign: { xs: 'center', lg: 'left' },
          }}
          color="text.secondary"
        >
          <Box
            sx={{ mr: 1, maxWidth: { xs: 40, md: 40 } }}
            component="img"
            alt="Kemenkop"
            src={Kemen}
          />
          FILE SHARING | KEMENKOPUKM
        </Typography>

        <Grid
          container
          justifyContent={{
            xs: 'center',
            md: 'space-between',
          }}
        >
          <Grid xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 270,
                mx: { xs: 'auto', md: 'unset' },
              }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est nesciunt sit aspernatur
              corporis fugit ea!
            </Typography>

            <Stack
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{
                mt: 3,
                mb: { xs: 5, md: 0 },
              }}
            >
              {_socials.map((social) => (
                <IconButton
                  key={social.name}
                  sx={{
                    '&:hover': {
                      bgcolor: alpha(social.color, 0.08),
                    },
                  }}
                >
                  <Iconify color={social.color} icon={social.icon} />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid xs={12} md={6}>
            <Stack spacing={5} direction={{ xs: 'column', md: 'row' }}>
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  alignItems={{ xs: 'center', md: 'flex-start' }}
                  sx={{ width: 1 }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 10, textAlign: 'center' }}>
          © 2024. All rights reserved
        </Typography>
      </Container>
    </Box>
  );

  return mainFooter;
}
