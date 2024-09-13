import { useParams, Link } from 'react-router-dom';
import { useFetchDetail } from './folderDetail';
import { Typography } from '@mui/material';
import { Box, Container, Stack } from '@mui/system';
import FileRecentItem from '../file-recent-item';
import EmptyContent from 'src/components/empty-content';
import { useState, useEffect } from 'react';
import FileManagerPanel from '../file-manager-panel';
import { paths } from 'src/routes/paths';
import FileManagerNewDialogParent from '../file-manager-new-dialog-parent-id';
import { useMutationFolder } from 'src/sections/overview/app/view/folders';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

export const FIleManagerDetail = () => {
  const { id } = useParams();
  const { data, isLoading, refetch } = useFetchDetail(id);

  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openCreateFolderDialog, setOpenCreateFolderDialog] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [folderPath, setFolderPath] = useState('');

  useEffect(() => {
    if (data) {
      setFolderPath((prevPath) =>
        prevPath ? `${prevPath} / ${data.folder_info.name}` : data.folder_info.name
      );
    }
  }, [id, data]);

  const { mutate: createFolder, isLoading: isCreating } = useMutationFolder({
    onSuccess: () => {
      refetch();
      setOpenCreateFolderDialog(false);
      setFolderName('');
      setTagsInput('');
    },
    onError: (error) => {
      console.error('Error creating folder:', error);
    },
  });

  const handleFolderCreate = () => {
    const tagsArray = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const folderData = {
      name: folderName,
      tags: tagsArray,
      parent_id: id,
    };
    createFolder(folderData);
  };

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  const handleOpenCreateFolderDialog = () => {
    setOpenCreateFolderDialog(true);
  };

  const handleCloseCreateFolderDialog = () => {
    setOpenCreateFolderDialog(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container>
        <Box sx={{ my: 5 }}>
          <Typography variant="h6">Folder Saya &raquo; {folderPath}</Typography>
          <Button variant="contained" onClick={handleOpenCreateFolderDialog}>
            Create New Folder
          </Button>
        </Box>

        {data.subfolders.length === 0 && data.files.length === 0 ? (
          <>
            <FileManagerPanel
              title="Files"
              link={paths.dashboard.fileManager}
              onOpen={handleOpenUploadDialog}
              sx={{ mt: 5 }}
            />
            <EmptyContent filled title="Folder Kosong" sx={{ py: 10 }} />
          </>
        ) : (
          <>
            <FileManagerPanel
              title="Files"
              link={paths.dashboard.fileManager}
              onOpen={handleOpenUploadDialog}
              sx={{ mt: 5 }}
            />
            {data.subfolders.length > 0 && (
              <Box sx={{ mt: 5 }}>
                <Typography variant="h6">Subfolders</Typography>
                <Stack spacing={2}>
                  {data.subfolders.map((folder) => (
                    <Link key={folder.folder_id} to={`file-manager/infosubfolder/${folder.folder_id}`}>
                      <FileRecentItem
                        file={{ ...folder, type: 'folder' }}
                        onDelete={() => console.info('DELETE', folder.folder_id)}
                      />
                    </Link>
                  ))}
                </Stack>
              </Box>
            )}
            {data.files.length > 0 && (
              <Stack spacing={2} sx={{ mt: 5 }}>
                {data.files.map((file) => (
                  <FileRecentItem
                    key={file.id}
                    file={file}
                    onDelete={() => console.info('DELETE', file.id)}
                  />
                ))}
              </Stack>
            )}
          </>
        )}
      </Container>

      {/* Create Folder Dialog */}
      <Dialog open={openCreateFolderDialog} onClose={handleCloseCreateFolderDialog}>
        <DialogTitle>Create Folder</DialogTitle>
        <DialogContent>
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
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="tags"
            name="tags"
            label="Tags"
            type="text"
            fullWidth
            variant="outlined"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseCreateFolderDialog}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleFolderCreate} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Files Dialog */}
      <FileManagerNewDialogParent
        id={id}
        title="Upload Files"
        open={openUploadDialog}
        onClose={handleCloseUploadDialog}
        refetch={refetch}
      />
    </>
  );
};
