import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
// components
import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';
import { useMutationUploadFiles } from './view/folderDetail/useMutationUploadFiles';
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export default function FileManagerNewFolderDialog({
  title,
  open,
  onClose,
  //
  onCreate,
  onUpdate,
  //
  folderName,
  onChangeFolderName,
  refetch, // Tambahkan refetch prop
  ...other
}) {
  const [files, setFiles] = useState([]);
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (!open) {
      setFiles([]);
      reset(); // Reset form when dialog is closed
    }
  }, [open, reset]);

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

  const { mutate: UploadFiles, isPending: loadingUpload } = useMutationUploadFiles({
    onSuccess: () => {
      enqueueSnackbar('Files Uploaded Successfully');
      handleRemoveAllFiles();
      reset(); // Reset form after successful upload
      refetch(); // Trigger refetch after successful upload
      onClose(); // Close dialog after successful upload
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  const handleUpload = () => {
    if (!files.length) {
      enqueueSnackbar('Please select files to upload', { variant: 'warning' });
      return;
    }

    const formData = new FormData();

    // Append each file with the correct field name
    files.forEach((file) => {
      formData.append('file[]', file); // Adjust according to server-side expectations
    });

    // Debugging FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    UploadFiles(formData);
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>{title}</DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        <Upload multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
      </DialogContent>

      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
        >
          {loadingUpload ? 'loading...' : 'Upload Files'}
        </Button>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}

FileManagerNewFolderDialog.propTypes = {
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  refetch: PropTypes.func, // Tambahkan prop types untuk refetch
};
