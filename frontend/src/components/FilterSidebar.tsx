import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FilterState } from '@/types/housePlan';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
}

export function FilterSidebar({ onFilterChange, onClearAll }: FilterSidebarProps) {
  const [selectedBedrooms, setSelectedBedrooms] = useState<number[]>([]);
  const [selectedBathrooms, setSelectedBathrooms] = useState<number[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<number[]>([]);
  const [selectedGarages, setSelectedGarages] = useState<number[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [floorAreaMin, setFloorAreaMin] = useState<string>('');
  const [floorAreaMax, setFloorAreaMax] = useState<string>('');

  const bedrooms = [1, 2, 3, 4, 5];
  const bathrooms = [1, 2, 3, 4];
  const levels = [1, 2, 3];
  const garages = [1, 2, 3];
  const styles = ['Modern', 'Contemporary', 'Farmhouse', 'Tuscan'];

  const toggleFilter = (
    value: number | string,
    selected: any[],
    setter: (val: any[]) => void
  ) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setter(newSelected);
    
    // Notify parent of filter change - use the appropriate new selected array
    let updatedBedrooms = selectedBedrooms;
    let updatedBathrooms = selectedBathrooms;
    let updatedLevels = selectedLevels;
    let updatedGarages = selectedGarages;
    let updatedStyles = selectedStyles;

    // Update the correct array based on which filter is being toggled
    if (selected === selectedBedrooms) updatedBedrooms = newSelected;
    if (selected === selectedBathrooms) updatedBathrooms = newSelected;
    if (selected === selectedLevels) updatedLevels = newSelected;
    if (selected === selectedGarages) updatedGarages = newSelected;
    if (selected === selectedStyles) updatedStyles = newSelected;

    const updatedFilters: FilterState = {
      bedrooms: updatedBedrooms,
      bathrooms: updatedBathrooms,
      levels: updatedLevels,
      garage: updatedGarages,
      styles: updatedStyles,
      priceMin: priceMin ? parseInt(priceMin) : undefined,
      priceMax: priceMax ? parseInt(priceMax) : undefined,
      floorAreaMin: floorAreaMin ? parseInt(floorAreaMin) : undefined,
      floorAreaMax: floorAreaMax ? parseInt(floorAreaMax) : undefined,
    };
    onFilterChange(updatedFilters);
  };

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    if (field === 'min') setPriceMin(value);
    if (field === 'max') setPriceMax(value);
    
    const updatedFilters: FilterState = {
      bedrooms: selectedBedrooms,
      bathrooms: selectedBathrooms,
      levels: selectedLevels,
      garage: selectedGarages,
      styles: selectedStyles,
      priceMin: field === 'min' ? (value ? parseInt(value) : undefined) : (priceMin ? parseInt(priceMin) : undefined),
      priceMax: field === 'max' ? (value ? parseInt(value) : undefined) : (priceMax ? parseInt(priceMax) : undefined),
      floorAreaMin: floorAreaMin ? parseInt(floorAreaMin) : undefined,
      floorAreaMax: floorAreaMax ? parseInt(floorAreaMax) : undefined,
    };
    onFilterChange(updatedFilters);
  };

  const handleFloorAreaChange = (field: 'min' | 'max', value: string) => {
    if (field === 'min') setFloorAreaMin(value);
    if (field === 'max') setFloorAreaMax(value);
    
    const updatedFilters: FilterState = {
      bedrooms: selectedBedrooms,
      bathrooms: selectedBathrooms,
      levels: selectedLevels,
      garage: selectedGarages,
      styles: selectedStyles,
      priceMin: priceMin ? parseInt(priceMin) : undefined,
      priceMax: priceMax ? parseInt(priceMax) : undefined,
      floorAreaMin: field === 'min' ? (value ? parseInt(value) : undefined) : (floorAreaMin ? parseInt(floorAreaMin) : undefined),
      floorAreaMax: field === 'max' ? (value ? parseInt(value) : undefined) : (floorAreaMax ? parseInt(floorAreaMax) : undefined),
    };
    onFilterChange(updatedFilters);
  };

  return (
    <div className="w-full lg:w-64 bg-background border-r p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="link"
          onClick={() => {
            onClearAll();
            setSelectedBedrooms([]);
            setSelectedBathrooms([]);
            setSelectedLevels([]);
            setSelectedGarages([]);
            setSelectedStyles([]);
          }}
          className="text-primary p-0 h-auto"
        >
          Clear All
        </Button>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Price Range</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Min"
            type="number"
            value={priceMin}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Max"
            type="number"
            value={priceMax}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Bedrooms</Label>
        <div className="flex flex-wrap gap-2">
          {bedrooms.map((num) => (
            <Button
              key={num}
              type="button"
              variant={selectedBedrooms.includes(num) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleFilter(num, selectedBedrooms, setSelectedBedrooms)}
              className="w-12"
            >
              {num}+
            </Button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Bathrooms</Label>
        <div className="flex flex-wrap gap-2">
          {bathrooms.map((num) => (
            <Button
              key={num}
              type="button"
              variant={selectedBathrooms.includes(num) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleFilter(num, selectedBathrooms, setSelectedBathrooms)}
              className="w-12"
            >
              {num}+
            </Button>
          ))}
        </div>
      </div>

      {/* Levels */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Levels</Label>
        <div className="flex flex-wrap gap-2">
          {levels.map((num) => (
            <Button
              key={num}
              type="button"
              variant={selectedLevels.includes(num) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleFilter(num, selectedLevels, setSelectedLevels)}
              className="w-12"
            >
              {num}
            </Button>
          ))}
          <Button
            type="button"
            variant={selectedLevels.includes(4) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleFilter(4, selectedLevels, setSelectedLevels)}
            className="w-12"
          >
            3+
          </Button>
        </div>
      </div>

      {/* Floor Area */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Floor Area (m²)</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Min m²"
            type="number"
            value={floorAreaMin}
            onChange={(e) => handleFloorAreaChange('min', e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Max m²"
            type="number"
            value={floorAreaMax}
            onChange={(e) => handleFloorAreaChange('max', e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Style */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Style</Label>
        <div className="space-y-2">
          {styles.map((style) => (
            <div key={style} className="flex items-center space-x-2">
              <Checkbox
                id={style}
                checked={selectedStyles.includes(style)}
                onCheckedChange={() =>
                  toggleFilter(style, selectedStyles, setSelectedStyles)
                }
              />
              <label
                htmlFor={style}
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {style}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Garage */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Garage</Label>
        <div className="flex flex-wrap gap-2">
          {garages.map((num) => (
            <Button
              key={num}
              type="button"
              variant={selectedGarages.includes(num) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleFilter(num, selectedGarages, setSelectedGarages)}
              className="w-12"
            >
              {num}
            </Button>
          ))}
          <Button
            type="button"
            variant={selectedGarages.includes(4) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleFilter(4, selectedGarages, setSelectedGarages)}
            className="w-12"
          >
            3+
          </Button>
        </div>
      </div>
    </div>
  );
}
