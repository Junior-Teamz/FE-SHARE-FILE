import { useContext, useState } from 'react';
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
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { useSettingsContext } from 'src/components/settings';
import { AuthContext } from 'src/auth/context/jwt/auth-context';
import { SeoIllustration } from 'src/assets/illustrations';
import AppWidgetSummary from '../app-widget-summary';
import AppWelcome from '../app-welcome';
import EmptyContent from 'src/components/empty-content';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { useDeleteFolder, useEditFolder, useFetchFolder, useMutationFolder } from './folders';
import imageFolder from '/assets/icons/files/ic_folder.svg';
import FileManagerPanel from 'src/sections/file-manager/file-manager-panel';
import { paths } from 'src/routes/paths';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
export default function OverviewAppView() {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editFolderId, setEditFolderId] = useState(null);

  const { register, handleSubmit, reset, setValue } = useForm();
  const { mutate: CreateFolder, isPending } = useMutationFolder({
    onSuccess: () => {
      enqueueSnackbar('Folder Created Successfully');
      refetch();
      handleClose();
    },
  });

  const { mutate: deleteFolder } = useDeleteFolder();
  const { mutate: editFolder } = useEditFolder();
  const { data, isLoading, refetch } = useFetchFolder(); // Fetch Folder

  if (isLoading) {
    return <Typography variant="h3">Loading...</Typography>;
  }

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDeleteConfirmOpen = () => setDeleteConfirmOpen(true);
  const handleDeleteConfirmClose = () => setDeleteConfirmOpen(false);

  const handleEditDialogOpen = (folderId, folderName) => {
    setEditFolderId(folderId);
    setValue('name', folderName);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditFolderId(null);
  };

  const handleDeleteSelected = () => {
    selected.forEach((folderId) => {
      deleteFolder(folderId, {
        onSuccess: () => {
          enqueueSnackbar('Folder Berhasil Dihapus', { variant: 'success' });
          refetch();
        },
        onError: (error) => {
          enqueueSnackbar(`Gagal menghapus folder: ${error.message}`, { variant: 'error' });
        },
      });
    });
    setSelected([]);
    handleDeleteConfirmClose();
  };

  const handleEditSubmit = (data) => {
    if (!data.name || data.name.trim() === '') {
      enqueueSnackbar('Nama folder harus diisi', {
        variant: 'warning',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
      return;
    }
    editFolder(
      { folderId: editFolderId, data: { name: data.name } },
      {
        onSuccess: () => {
          enqueueSnackbar('Folder Berhasil diupdate', { variant: 'success' });
          refetch();
        },
        onError: (error) => {
          enqueueSnackbar(`Gagal update folder: ${error.message}`, { variant: 'error' });
        },
      }
    );
    handleEditDialogClose();
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(data.map((folder) => folder.folder_id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (event, folderId) => {
    const selectedIndex = selected.indexOf(folderId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, folderId];
    } else {
      newSelected = selected.filter((id) => id !== folderId);
    }

    setSelected(newSelected);
  };

  const Onsubmit = (data) => {
    if (!data.name || data.name.trim() === '') {
      enqueueSnackbar('Nama folder harus diisi', {
        variant: 'warning',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
      return;
    }
    CreateFolder(data);
    reset();
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={14}>
          <AppWelcome title={`Welcome back 👋 ${user?.name}`} img={<SeoIllustration />} />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Active Users"
            percent={2.6}
            total={18765}
            chart={{ series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20] }}
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
          <EmptyContent filled title="Folder Kosong" sx={{ py: 10 }} />
        ) : (
          <Grid xs={12} md={12} lg={12}>
            <FileManagerPanel
              title="Folders"
              link={paths.dashboard.fileManager}
              onOpen={handleClickOpen}
              sx={{ mt: 5 }}
            />
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Create Folder</DialogTitle>
              <DialogContent>
                <form onSubmit={handleSubmit(Onsubmit)}>
                  <DialogContentText sx={{ mb: 3 }}>
                    Silahkan masukkan nama folder yang ingin dibuat disini.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    name="name"
                    label="Nama Folder"
                    type="text"
                    fullWidth
                    variant="outlined"
                    {...register('name')}
                  />
                  <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button variant="outlined" type="submit">
                      {isPending ? 'Creating...' : 'Create'}
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
              <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
              <DialogContent>
                <DialogContentText>Kamu yakin hapus folder-folder ini?</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteConfirmClose}>Batal</Button>
                <Button onClick={handleDeleteSelected} color="error">
                  Hapus
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
              <DialogTitle>Edit Folder</DialogTitle>
              <DialogContent>
                <form onSubmit={handleSubmit(handleEditSubmit)}>
                  <DialogContentText sx={{ mb: 3 }}>
                    Silahkan masukkan nama folder yang ingin diubah disini.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    name="name"
                    label="Nama Folder"
                    type="text"
                    fullWidth
                    variant="outlined"
                    {...register('name')}
                  />
                  <DialogActions>
                    <Button variant="outlined" onClick={handleEditDialogClose}>
                      Cancel
                    </Button>
                    <Button variant="outlined" type="submit">
                      Update
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {selected.length > 0 ? (
                      <>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selected.length > 0 && selected.length < data.length}
                            checked={data.length > 0 && selected.length === data.length}
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                        <TableCell colSpan={4}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1">{selected.length} selected</Typography>
                            <div>
                              <Tooltip
                                title={
                                  selected.length !== 1 ? 'Silakan pilih satu folder untuk diedit' : ''
                                }
                              >
                                <span>
                                  <IconButton
                                    onClick={() => handleEditDialogOpen(selected[0], data.find(folder => folder.folder_id === selected[0])?.name)}
                                    disabled={selected.length !== 1}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <IconButton onClick={handleDeleteConfirmOpen}>
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selected.length > 0 && selected.length < data.length}
                            checked={data.length > 0 && selected.length === data.length}
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                        <TableCell>Number</TableCell>
                        <TableCell>Name</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((folder, idx) => (
                    <TableRow
                      key={folder.folder_id}
                      selected={selected.indexOf(folder.folder_id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.indexOf(folder.folder_id) !== -1}
                          onChange={(event) => handleSelectOne(event, folder.folder_id)}
                        />
                      </TableCell>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={imageFolder} alt="folder" />
                        {folder.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
