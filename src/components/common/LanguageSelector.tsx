import React from 'react';
import { 
  FormControl, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  InputLabel,
  Box,
  IconButton,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLanguage, LanguageOption } from '../../context/LanguageContext';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, isRTL } = useLanguage();
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent) => {
    changeLanguage(event.target.value as LanguageOption);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />
      <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel id="language-select-label">{t('settings.language')}</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={currentLanguage}
          label={t('settings.language')}
          onChange={handleChange}
          sx={{
            '& .MuiSelect-select': {
              paddingRight: isRTL ? 32 : 'auto',
              paddingLeft: isRTL ? 'auto' : 32,
              textAlign: isRTL ? 'right' : 'left',
            }
          }}
        >
          <MenuItem value="en">{t('settings.english')}</MenuItem>
          <MenuItem value="he">{t('settings.hebrew')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

// Small version just with icon buttons
export const CompactLanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'he' : 'en';
    changeLanguage(newLanguage);
  };

  return (
    <IconButton 
      color="inherit" 
      onClick={toggleLanguage}
      aria-label="Toggle language"
    >
      <LanguageIcon />
    </IconButton>
  );
};

export default LanguageSelector;
