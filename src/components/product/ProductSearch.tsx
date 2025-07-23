'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Product } from '@/types/product';
import { BaseComponent } from '@/types/common';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface ProductSearchProps extends BaseComponent {
  onSearch: (query: string) => void;
  placeholder?: string;
  products?: Product[];
  showSuggestions?: boolean;
  maxSuggestions?: number;
  initialValue?: string;
  disabled?: boolean;
  loading?: boolean;
}

interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'tag';
  value: string;
  label: string;
  count?: number;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
  placeholder = 'Search products...',
  products = [],
  showSuggestions = true,
  maxSuggestions = 5,
  initialValue = '',
  disabled = false,
  loading = false,
  className
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const suggestions = React.useMemo((): SearchSuggestion[] => {
    if (!showSuggestions || !query.trim() || query.length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase();
    const allSuggestions: SearchSuggestion[] = [];

    const productSuggestions = products
      .filter(product => 
        product.name.toLowerCase().includes(searchTerm)
      )
      .slice(0, 3)
      .map(product => ({
        type: 'product' as const,
        value: product.name,
        label: product.name
      }));

    allSuggestions.push(...productSuggestions);

    const categories = [...new Set(products.map(p => p.category))];
    const categorySuggestions = categories
      .filter(category => 
        category.toLowerCase().includes(searchTerm)
      )
      .slice(0, 2)
      .map(category => ({
        type: 'category' as const,
        value: category,
        label: `Category: ${category}`,
        count: products.filter(p => p.category === category).length
      }));

    allSuggestions.push(...categorySuggestions);

    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    const brandSuggestions = brands
      .filter(brand => 
        brand && brand.toLowerCase().includes(searchTerm)
      )
      .slice(0, 2)
      .map(brand => ({
        type: 'brand' as const,
        value: brand!,
        label: `Brand: ${brand}`,
        count: products.filter(p => p.brand === brand).length
      }));

    allSuggestions.push(...brandSuggestions);

    const allTags = products.flatMap(p => p.tags);
    const uniqueTags = [...new Set(allTags)];
    const tagSuggestions = uniqueTags
      .filter(tag => 
        tag.toLowerCase().includes(searchTerm)
      )
      .slice(0, 2)
      .map(tag => ({
        type: 'tag' as const,
        value: tag,
        label: `Tag: ${tag}`,
        count: products.filter(p => p.tags.includes(tag)).length
      }));

    allSuggestions.push(...tagSuggestions);

    return allSuggestions.slice(0, maxSuggestions);
  }, [query, products, showSuggestions, maxSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.value);
    setIsFocused(false);
    setSelectedIndex(-1);
    onSearch(suggestion.value);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit();
        }
        break;

      case 'Escape':
        setIsFocused(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSubmit = () => {
    setIsFocused(false);
    setSelectedIndex(-1);
    onSearch(query);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedIndex(-1);
    onSearch('');
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
          </svg>
        );
      case 'category':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'brand':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case 'tag':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="animate-spin h-4 w-4 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          disabled={disabled || loading}
          className={cn(
            'block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md',
            'focus:ring-blue-500 focus:border-blue-500',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            'placeholder-gray-400'
          )}
          aria-label="Search products"
          aria-expanded={isFocused && suggestions.length > 0}
          aria-haspopup="listbox"
          role="combobox"
          aria-autocomplete="list"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showSuggestions && isFocused && suggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.type}-${suggestion.value}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                'px-3 py-2 cursor-pointer flex items-center space-x-2',
                'hover:bg-gray-50',
                selectedIndex === index && 'bg-blue-50 text-blue-900'
              )}
              role="option"
              aria-selected={selectedIndex === index}
            >
              <span className="text-gray-400">
                {getSuggestionIcon(suggestion.type)}
              </span>
              <span className="flex-1 text-sm">
                {suggestion.label}
              </span>
              {suggestion.count && (
                <span className="text-xs text-gray-500">
                  ({suggestion.count})
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};