import { useContext } from 'react'; // Tambahkan import useContext
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useState, useCallback } from 'react';

// hooks dan komponen lainnya
import { useSettingsContext } from 'src/components/settings';
import { AuthContext } from 'src/auth/context/jwt/auth-context'; // Import AuthContext
import { SeoIllustration } from 'src/assets/illustrations';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';
import AppAreaInstalled from '../app-area-installed';
import { useBoolean } from 'src/hooks/use-boolean';
import Stack from '@mui/material/Stack';
import AppWelcome from '../app-welcome';
import { _folders, _files } from 'src/_mock';
import { paths } from 'src/routes/paths';
import FileManagerPanel from 'src/sections/file-manager/file-manager-panel';
import Scrollbar from 'src/components/scrollbar';
import FileManagerFolderItem from 'src/sections/file-manager/file-manager-folder-item';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useContext(AuthContext); // Mengambil data pengguna dari AuthContext
  const theme = useTheme();
  const settings = useSettingsContext();
  const newFolder = useBoolean();
  const [files, setFiles] = useState([]);

  const [folderName, setFolderName] = useState('');
  const handleCreateNewFolder = useCallback(() => {
    newFolder.onFalse();
    setFolderName('');
    console.info('CREATE NEW FOLDER');
  }, [newFolder]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={14}>
          <AppWelcome
            title={`Welcome back 👋 ${user?.name}`} // Menggunakan user?.name dari AuthContext
            img={<SeoIllustration />}
          />
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
            title="Total Installed"
            percent={0.2}
            total={4876}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
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

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Current Download"
            chart={{
              series: [
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Area Installed"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Asia',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'America',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Asia',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'America',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
          <FileManagerPanel
            title="Folders"
            link={paths.dashboard.fileManager}
            onOpen={newFolder.onTrue}
            sx={{ mt: 5 }}
          />
          <Scrollbar>
            <Stack direction="row" spacing={3} sx={{ pb: 3 }}>
              {_folders.map((folder) => (
                <FileManagerFolderItem
                  key={folder.id}
                  folder={folder}
                  onDelete={() => console.info('DELETE', folder.id)}
                  sx={{
                    ...(_folders.length > 3 && {
                      minWidth: 222,
                    }),
                  }}
                />
              ))}
            </Stack>
          </Scrollbar>
        </Grid>
      </Grid>
    </Container>
  );
}
