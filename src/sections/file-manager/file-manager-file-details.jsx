import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Drawer from '@mui/material/Drawer';
// utils
import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import FileThumbnail, { fileFormat } from 'src/components/file-thumbnail';
//
import FileManagerShareDialog from './file-manager-share-dialog';
import FileManagerInvitedItem from './file-manager-invited-item';

// ----------------------------------------------------------------------

export default function FileManagerFileDetails({
  item,
  open,
  favorited,
  //
  onFavorite,
  onCopyLink,
  onClose,
  onDelete,
  ...other
}) {
  const { name, size, url, type, shared, modifiedAt, user, instance } = item;

  const items = item?.tags?.map((tag) => tag.name);

  const hasShared = shared && !!shared.length;

  const toggleTags = useBoolean(true);
  const share = useBoolean();
  const properties = useBoolean(true);

  const [inviteEmail, setInviteEmail] = useState('');
  const [tags, setTags] = useState(items);

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleChangeTags = useCallback((newValue) => {
    setTags(newValue);
  }, []);

  const renderTags = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Tags
        <IconButton size="small" onClick={toggleTags.onToggle}>
          <Iconify
            icon={toggleTags.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

      {toggleTags.value && (
        <Autocomplete
          multiple
          freeSolo
          options={item?.tags?.map((option) => option)} //komen jika tidak ada tags nya
          getOptionLabel={(option) => option}
          defaultValue={item?.tags}
          value={tags}
          onChange={(event, newValue) => {
            handleChangeTags(newValue);
          }}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                size="small"
                variant="soft"
                label={option}
                key={option}
              />
            ))
          }
          renderInput={(params) => <TextField {...params} placeholder="#Add a tag" />}
        />
      )}
    </Stack>
  );

  const renderProperties = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Properties
        <IconButton size="small" onClick={properties.onToggle}>
          <Iconify
            icon={properties.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

      {properties.value && (
        <>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Size
            </Box>
            {fData(size)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Modified
            </Box>
            {fDateTime(modifiedAt)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Type
            </Box>
            {fileFormat(type)}
          </Stack>
        </>
      )}
    </Stack>
  );

  const renderShared = (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
        <Typography variant="subtitle2"> File Shared With </Typography>

        <IconButton
          size="small"
          color="primary"
          onClick={share.onTrue}
          sx={{
            width: 24,
            height: 24,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <Iconify icon="mingcute:add-line" />
        </IconButton>
      </Stack>

      {hasShared && (
        <Box sx={{ pl: 2.5, pr: 1 }}>
          {shared.map((person) => (
            <FileManagerInvitedItem key={person.id} person={person} />
          ))}
        </Box>
      )}
    </>
  );

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 320 },
        }}
        {...other}
      >
        <Scrollbar sx={{ height: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
            <Typography variant="h6"> Info </Typography>

            <Checkbox
              color="warning"
              icon={<Iconify icon="eva:star-outline" />}
              checkedIcon={<Iconify icon="eva:star-fill" />}
              checked={favorited}
              onChange={onFavorite}
            />
          </Stack>

          <Stack
            spacing={2.5}
            justifyContent="center"
            sx={{
              p: 2.5,
              bgcolor: 'background.neutral',
            }}
          >
            {/* Uncomment and use for displaying file thumbnail if needed */}
            {/* <FileThumbnail
              imageView
              file={type === 'folder' ? type : url}
              sx={{ width: 64, height: 64 }}
              imgSx={{ borderRadius: 1 }}
            /> */}

            <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
              {name}
            </Typography>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {renderTags}

            {renderProperties}

            {/* User and Instances Information */}
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" sx={{ typography: 'subtitle2' }}>
                Owner
              </Stack>
              <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
                <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                  Name
                </Box>
                {user?.name}
              </Stack>

              {/* <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
                <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                  Email
                </Box>
                {user?.email}
              </Stack> */}

              <Stack direction="row" alignItems="center" sx={{ typography: 'subtitle2' }}>
                Instansi
              </Stack>
              {instance && instance.length > 0 ? (
                instance.map((instanceItem) => (
                  <Stack
                    direction="row"
                    key={instanceItem.id}
                    sx={{ typography: 'caption', textTransform: 'capitalize' }}
                  >
                    <Box component="span" sx={{ width: 50, color: 'text.secondary', mr: 2 }}>
                      {instanceItem?.name}
                    </Box>
                  </Stack>
                ))
              ) : (
                <Typography>Tidak ada instansi</Typography>
              )}
            </Stack>

            {renderShared}
          </Stack>

          <FileManagerShareDialog
            open={share.value}
            onClose={share.onFalse}
            inviteEmail={inviteEmail}
            onChangeInvite={handleChangeInvite}
            onSendInvite={() => {}}
          />
        </Scrollbar>
      </Drawer>
    </>
  );
}

FileManagerFileDetails.propTypes = {
  item: PropTypes.object,
  open: PropTypes.bool,
  favorited: PropTypes.bool,
  onFavorite: PropTypes.func,
  onCopyLink: PropTypes.func,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};
