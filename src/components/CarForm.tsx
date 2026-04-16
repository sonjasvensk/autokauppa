import { useState } from 'react';
import type { Car } from '../types/car';
import {
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';

interface CarFormProps {
  car?: Car;
  onSubmit: (car: Omit<Car, 'id'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function CarForm({ car, onSubmit, onCancel, loading = false }: CarFormProps) {
  const [formData, setFormData] = useState<Omit<Car, 'id'>>({
    brand: car?.brand || '',
    model: car?.model || '',
    color: car?.color || '',
    fuel: car?.fuel || '',
    modelYear: car?.modelYear || new Date().getFullYear(),
    price: car?.price || 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.color.trim()) newErrors.color = 'Color is required';
    if (!formData.fuel.trim()) newErrors.fuel = 'Fuel type is required';
    if (formData.modelYear < 1900 || formData.modelYear > new Date().getFullYear() + 1) {
      newErrors.modelYear = 'Invalid model year';
    }
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'modelYear' || name === 'price' ? (value ? Number(value) : 0) : value,
    });
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">{car?.id ? 'Edit Car' : 'Add New Car'}</Typography>

      <TextField
        label="Brand"
        name="brand"
        value={formData.brand}
        onChange={handleChange}
        error={!!errors.brand}
        helperText={errors.brand}
        disabled={loading}
        fullWidth
      />

      <TextField
        label="Model"
        name="model"
        value={formData.model}
        onChange={handleChange}
        error={!!errors.model}
        helperText={errors.model}
        disabled={loading}
        fullWidth
      />

      <TextField
        label="Color"
        name="color"
        value={formData.color}
        onChange={handleChange}
        error={!!errors.color}
        helperText={errors.color}
        disabled={loading}
        fullWidth
      />

      <TextField
        label="Fuel Type"
        name="fuel"
        value={formData.fuel}
        onChange={handleChange}
        error={!!errors.fuel}
        helperText={errors.fuel}
        disabled={loading}
        fullWidth
      />

      <TextField
        label="Model Year"
        name="modelYear"
        type="number"
        value={formData.modelYear}
        onChange={handleChange}
        error={!!errors.modelYear}
        helperText={errors.modelYear}
        disabled={loading}
        fullWidth
      />

      <TextField
        label="Price (€)"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        error={!!errors.price}
        helperText={errors.price}
        disabled={loading}
        fullWidth
      />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
}
