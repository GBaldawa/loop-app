import React, { useState } from 'react';

// Smart Item Autocomplete Component
const ItemAutocomplete = ({ value, onChange, placeholder, getItemSuggestions }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    
    if (inputValue.length >= 2) {
      // Get suggestions from the item database
      const newSuggestions = getItemSuggestions(inputValue);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          onChange(suggestions[selectedIndex].name);
          setShowSuggestions(false);
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onFocus={() => {
          if (value.length >= 2) {
            const newSuggestions = getItemSuggestions(value);
            setSuggestions(newSuggestions);
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          outline: 'none',
          backgroundColor: 'white',
          transition: 'all 0.2s',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#9333ea';
          e.target.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.1)';
          if (value.length >= 2) {
            const newSuggestions = getItemSuggestions(value);
            setSuggestions(newSuggestions);
            setShowSuggestions(true);
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#d1d5db';
          e.target.style.boxShadow = 'none';
          setTimeout(() => setShowSuggestions(false), 200);
        }}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderTop: 'none',
          borderRadius: '0 0 0.5rem 0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          zIndex: 50,
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '0.75rem',
                cursor: 'pointer',
                backgroundColor: index === selectedIndex ? '#f3f4f6' : 'transparent',
                borderBottom: index < suggestions.length - 1 ? '1px solid #e5e7eb' : 'none',
                fontSize: '0.875rem',
                color: '#374151',
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                {suggestion.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {suggestion.category}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemAutocomplete;
