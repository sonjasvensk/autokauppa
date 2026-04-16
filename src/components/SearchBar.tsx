import { TextField, Button, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface SearchBarProps {
  onSearchChange: (searchTerm: string) => void;
  onAddClick: () => void;
  searchValue?: string;
  loading?: boolean;
}

export function SearchBar({ onSearchChange, onAddClick, searchValue = '', loading = false }: SearchBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        marginBottom: 1,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <TextField
        label="Search (brand, model, color)"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        disabled={loading}
        placeholder="Type to filter..."
        sx={{ flex: '1 1 320px', minWidth: { xs: '100%', sm: 320 } }}
      />
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddClick}
        disabled={loading}
        sx={{ height: 56, whiteSpace: 'nowrap', flexShrink: 0 }}
      >
        Add Car
      </Button>
    </Box>
  );
}
