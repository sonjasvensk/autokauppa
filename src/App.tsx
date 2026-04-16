import { useState, useEffect } from 'react';
import type { Car } from './types/car';
import { CircularProgress, Snackbar, Alert, Box, Typography, Stack } from '@mui/material';
import './App.css';
import { getCars, addCar, updateCar, deleteCar } from './services/carService';
import { CarTable } from './components/CarTable';
import { SearchBar } from './components/SearchBar';
import { CarModal } from './components/CarModal';

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    filterCars();
  }, [cars, searchTerm]);

  const loadCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCars();
      setCars(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load cars';
      setError(errorMessage);
      console.error('Load cars error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCars = () => {
    const term = searchTerm.toLowerCase();
    const filtered = cars.filter(
      (car) =>
        car.brand.toLowerCase().includes(term) ||
        car.model.toLowerCase().includes(term) ||
        car.color.toLowerCase().includes(term) ||
        car.fuel.toLowerCase().includes(term)
    );
    setFilteredCars(filtered);
  };

  const handleAddCar = () => {
    setEditingCar(undefined);
    setModalOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCar(undefined);
  };

  const handleSubmitForm = async (carData: Omit<Car, 'id'>) => {
    setSubmitting(true);
    setError(null);
    try {
      if (editingCar?.id) {
        await updateCar(editingCar.id, carData);
      } else {
        await addCar(carData);
      }
      await loadCars();
      handleCloseModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      console.error('Submit form error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCar = async (id: number) => {
    setError(null);
    try {
      await deleteCar(id);
      await loadCars();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      console.error('Delete car error:', err);
    }
  };

  return (
    <Stack
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#f6f8fb',
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1440,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3, md: 4 },
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          flex: 1,
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography variant="h3" component="h1" sx={{ color: '#111827', fontWeight: 700 }}>
            Car Shop
          </Typography>
        </Box>

        {loading && !cars.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2 }}>
            <SearchBar
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              onAddClick={handleAddCar}
              loading={submitting}
            />

            <CarTable
              cars={filteredCars}
              onEdit={handleEditCar}
              onDelete={handleDeleteCar}
              loading={submitting}
            />
          </Box>
        )}

        <CarModal
          open={modalOpen}
          car={editingCar}
          onClose={handleCloseModal}
          onSubmit={handleSubmitForm}
          loading={submitting}
        />

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Stack>
  );
}

export default App;
