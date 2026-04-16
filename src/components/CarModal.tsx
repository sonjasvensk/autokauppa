import { Modal, Paper } from '@mui/material';
import type { Car } from '../types/car';
import { CarForm } from './CarForm';

interface CarModalProps {
  open: boolean;
  car?: Car;
  onClose: () => void;
  onSubmit: (car: Omit<Car, 'id'>) => Promise<void>;
  loading?: boolean;
}

export function CarModal({ open, car, onClose, onSubmit, loading = false }: CarModalProps) {
  const handleSubmit = async (formData: Omit<Car, 'id'>) => {
    await onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        sx={{
          width: 'min(92vw, 620px)',
          maxWidth: 620,
          padding: { xs: 2, sm: 3 },
          borderRadius: 3,
          boxShadow: 6,
        }}
      >
        <CarForm car={car} onSubmit={handleSubmit} onCancel={onClose} loading={loading} />
      </Paper>
    </Modal>
  );
}
