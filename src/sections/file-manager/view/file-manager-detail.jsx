import { useParams } from 'react-router';
import { useFetchDetail } from './folderDetail';
import { Typography } from '@mui/material';
import { Box, Container, Stack } from '@mui/system';
import { _files } from 'src/_mock';
import FileRecentItem from '../file-recent-item';
import EmptyContent from 'src/components/empty-content';
import { useState } from 'react';
import FileManagerPanel from '../file-manager-panel';
import { paths } from 'src/routes/paths';
import FileManagerNewDialogParent from '../file-manager-new-dialog-parent-id';

export const FIleManagerDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useFetchDetail(id);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const { files } = data;
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container>
        <Box sx={{ my: 5 }}>
          <Typography variant="h6">Folder Saya &raquo; {data.folder_info.name}</Typography>
          <FileManagerNewDialogParent
            id={id}
            title="Upload Files"
            open={open} // Use the same state
            onClose={handleClose} // Ensure the dialog can close properly
          />
        </Box>

        {files.length === 0 ? (
          <>
            <FileManagerPanel
              title="Files"
              link={paths.dashboard.fileManager}
              onOpen={handleClickOpen}
              sx={{ mt: 5 }}
            />
            <EmptyContent filled title="Folder Kosong" sx={{ py: 10 }} />
          </>
        ) : (
          <>
            <FileManagerPanel
              title="Files"
              link={paths.dashboard.fileManager}
              onOpen={handleClickOpen}
              sx={{ mt: 5 }}
            />
            <Stack spacing={2}>
              {files.map((file) => (
                <FileRecentItem
                  key={file.id}
                  file={file}
                  onDelete={() => console.info('DELETE', file.id)}
                />
              ))}
            </Stack>
          </>
        )}
      </Container>
    </>
  );
};
