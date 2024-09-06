import { useParams } from 'react-router';
import { useFetchDetail } from './folderDetail';
import { Typography } from '@mui/material';
import { Box, Container, Stack } from '@mui/system';
import { _files } from 'src/_mock';
import FileRecentItem from '../file-recent-item';
import EmptyContent from 'src/components/empty-content';

export const FIleManagerDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useFetchDetail(id);
  const { files } = data;
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container>
        <Box sx={{ my: 5 }}>
          <Typography variant="h6">Folder Saya &raquo; {data.folder_info.name}</Typography>
        </Box>
        {files.length === 0 ? (
          <EmptyContent filled title="Folder Kosong" sx={{ py: 10 }} />
        ) : (
          <Stack spacing={2}>
            {files.map((file) => (
              <FileRecentItem
                key={file.id}
                file={file}
                onDelete={() => console.info('DELETE', file.id)}
              />
            ))}
          </Stack>
        )}
      </Container>
    </>
  );
};
