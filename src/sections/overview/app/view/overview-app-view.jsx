import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSettingsContext } from 'src/components/settings';
import { AuthContext } from 'src/auth/context/jwt/auth-context';
import { SeoIllustration } from 'src/assets/illustrations';
import AppWidgetSummary from '../app-widget-summary';
import AppWelcome from '../app-welcome';
import EmptyContent from 'src/components/empty-content';
import { Typography } from '@mui/material';
import { useFetchFolder } from './folders';
import { useTable } from 'src/components/table';
import imageFolder from '/assets/icons/files/ic_folder.svg';
// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const settings = useSettingsContext();
  const table = useTable({ defaultRowsPerPage: 10 });

  const { data, isLoading, isFetching } = useFetchFolder();

  if (isLoading || isFetching) {
    return <Typography variant="h3">Loading...</Typography>;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3} >
        <Grid xs={12} md={14}>
          <AppWelcome title={`Welcome back 👋 ${user?.name}`} img={<SeoIllustration />} />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Active Users"
            percent={2.6}
            total={18765}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total File Di Upload"
            percent={0.2}
            total={4876}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4} sx={{ paddingBottom: '20px' }}>
          <AppWidgetSummary
            title="Total Downloads"
            percent={-0.1}
            total={678}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>
        {!data ? (
          <EmptyContent
            filled
            title="Folder Kosong"
            sx={{
              py: 10,
            }}
          />
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Number</TableCell>
                    <TableCell>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((folder, idx) => (
                    <TableRow key={folder.folder_id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={imageFolder} alt="folder-svg-image" />
                        {folder.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Grid>
    </Container>
  );
}