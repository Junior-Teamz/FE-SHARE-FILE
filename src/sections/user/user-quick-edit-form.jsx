import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEditUser } from './view/UserManagement';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function UserQuickEditForm({ currentUser, open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  // Validation Schema with password, confirm password, role, and company fields
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
    // company: Yup.string().required('Company is required'),
    // role: Yup.string().required('Role is required'),
    password: Yup.string()
      .nullable()
      .min(8, 'Password should be at least 8 characters'),
    confirmPassword: Yup.string()
      .nullable()
      .when('password', {
        is: (password) => password && password.length > 0,
        then: Yup.string()
          .required('Please confirm your password')
          .oneOf([Yup.ref('password')], 'Passwords must match'),
      }),
  });

  // Default form values
  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      // company: currentUser?.company || '',
      // role: currentUser?.role || '',
      password: '', // Password field remains empty for user to fill
      confirmPassword: '', // Confirm password field remains empty
    }),
    [currentUser]
  );

  // API call for editing user
  const { mutate: editUser, isLoading: loadingEditUser } = useEditUser({
    onSuccess: () => {
      enqueueSnackbar('User berhasil diupdate', { variant: 'success' });
      onClose(); // Close dialog after successful update
    },
    onError: (error) => {
      enqueueSnackbar(`Gagal update user: ${error.message}`, { variant: 'error' });
    },
  });

  // React Hook Form methods
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Form submission handler
  const onSubmit = (data) => {
    const userData = {
      name: data.name,
      email: data.email,
      // company: data.company,
      // role: data.role,
      ...(data.password ? { password: data.password } : {}) // Only send password if it's filled
    };
    editUser(userData); // Submit form data to editUser API
    reset();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="name" label="Full Name" />
            <RHFTextField name="email" label="Email Address" />
            {/* <RHFTextField name="company" label="Company" />
            <RHFTextField name="role" label="Role" /> */}
            <RHFTextField name="password" label="Password (Leave empty if not changing)" type="password" />
            <RHFTextField name="confirmPassword" label="Confirm Password" type="password" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting || loadingEditUser}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

UserQuickEditForm.propTypes = {
  currentUser: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
