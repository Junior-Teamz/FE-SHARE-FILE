import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Tooltip,
  Container,
  TableBody,
  IconButton,
  TableContainer,
} from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { useIndexUser, useDeleteUser } from './UserManagement';
import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 180 },
  { id: 'email', label: 'Email', width: 240 },
  { id: 'company', label: 'Company', width: 180 },
  { id: 'role', label: 'Role', width: 180 },
  { id: 'action', label: 'Action', width: 120 },
];

export default function UserListView() {
  const table = useTable();
  const settings = useSettingsContext();
  const confirm = useBoolean();
  const { data, isLoading, refetch } = useIndexUser();
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data?.data?.length) {
      setTableData(data.data);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: table.filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;
  const notFound = !dataFiltered.length;

  const { mutate: deleteUser } = useDeleteUser({
    onSuccess: () => {
      refetch();
      confirm.onFalse();
    },
    onError: (error) => console.error(`Failed to delete user: ${error.message}`),
  });

  const handleDeleteRow = useCallback((ids) => deleteUser(ids), [deleteUser]);
  const handleEditRow = useCallback((id) => {
    // Implement edit functionality here
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'User', href: paths.dashboard.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New User
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <UserTableToolbar filters={table.filters} onFilters={table.setFilters} />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataInPage.map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow([row.id])}
                      onEditRow={() => handleEditRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure you want to delete <strong>{table.selected.length}</strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow(table.selected);
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters = {} }) {
  const { name, email } = filters;

  if (!Array.isArray(inputData)) {
    console.error('Expected inputData to be an array but received:', inputData);
    return [];
  }

  let filteredData = [...inputData];
  filteredData = filteredData.sort((a, b) => comparator(a, b));

  if (name) {
    filteredData = filteredData.filter((user) =>
      user?.name?.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (email) {
    filteredData = filteredData.filter((user) =>
      user?.email?.toLowerCase().includes(email.toLowerCase())
    );
  }

  return filteredData;
}
