import { useState } from 'react';
import { DataGrid, type GridColDef, GridActionsCell, GridActionsCellItem } from '@mui/x-data-grid';
import type { Car } from '../types/car';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

interface CarTableProps {
  cars: Car[];
  onEdit: (car: Car) => void;
  onDelete: (id: number) => Promise<void>;
  loading?: boolean;
}

export function CarTable({ cars, onEdit, onDelete, loading = false }: CarTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCarId, setDeleteCarId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (id: number) => {
    setDeleteCarId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteCarId === null) return;
    setDeleting(true);
    try {
      await onDelete(deleteCarId);
      setDeleteDialogOpen(false);
      setDeleteCarId(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'brand', headerName: 'Brand', flex: 1, minWidth: 130 },
    { field: 'model', headerName: 'Model', flex: 1, minWidth: 130 },
    { field: 'color', headerName: 'Color', width: 100 },
    { field: 'fuel', headerName: 'Fuel', width: 100 },
    {
      field: 'modelYear',
      headerName: 'Year',
      width: 80,
      type: 'number',
      valueFormatter: (value) => String(value ?? ''),
    },
    {
      field: 'price',
      headerName: 'Price (€)',
      width: 120,
      renderCell: (params) => params.value?.toLocaleString('fi-FI') || '',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <GridActionsCell {...params}>
          <GridActionsCellItem
            icon={<EditIcon />}
            onClick={() => onEdit(params.row as Car)}
            label="Edit"
            disabled={loading || deleting}
          />
          <GridActionsCellItem
            icon={<DeleteIcon />}
            onClick={() => handleDeleteClick(params.id as number)}
            label="Delete"
            disabled={loading || deleting}
          />
        </GridActionsCell>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ flex: 1, width: '100%', overflow: 'hidden' }}>
        <DataGrid
          rows={cars}
          columns={columns}
          getRowId={(row) => row.id!}
          disableColumnMenu
          pageSizeOptions={[5, 10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Car</DialogTitle>
        <DialogContent>Are you sure you want to delete this car?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
