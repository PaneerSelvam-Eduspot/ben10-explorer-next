'use client';
import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface Alien {
  _id: string;
  id: number;
  name: string;
  species: string;
  planet: string;
  abilities: string[] | string;
  image: string;
  transform: string;
  series: string;
  firstAppearance: string;
  description: string;
}

// Now served internally by app/api/aliens/[series]/route.ts, backed by Postgres.
// No external ben10-api / Mongo dependency at runtime anymore.
const API_BASE_URL = `/api/aliens`;
const SERIES_SLUGS = ['classic', 'alien-force', 'ultimate-alien'];

const fetchAllSeriesData = async (): Promise<Alien[]> => {
  const fetchPromises = SERIES_SLUGS.map((slug) =>
    fetch(`${API_BASE_URL}/${slug}`).then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch ${slug}`);
      return res.json();
    })
  );

  const results: Alien[][] = await Promise.all(fetchPromises);
  const combinedAliens = results.flat();

  const uniqueAliensMap = new Map<string, Alien>();

  combinedAliens.forEach((alien) => {
    const rawSeries = alien.series as unknown;
    const normalizedSeries =
      typeof rawSeries === 'string'
        ? rawSeries
        : Array.isArray(rawSeries)
        ? rawSeries.join(', ')
        : 'Unknown';

    uniqueAliensMap.set(alien.name, { ...alien, series: normalizedSeries });
  });

  return Array.from(uniqueAliensMap.values());
};

type AlienState = {
  search: string;
  selectedAlienName: string | null;
  series: string;
  showFavorites: boolean;
};

type AlienAction =
  | { type: 'setSearch'; payload: string }
  | { type: 'selectAlien'; payload: string }
  | { type: 'navigateToList' }
  | { type: 'setSeries'; payload: string }
  | { type: 'setShowFavorites'; payload: boolean };

function useAlienSource() {
  const { data: allAliens = [], isLoading, error } = useQuery<Alien[], Error>({
    queryKey: ['allAliens'],
    queryFn: fetchAllSeriesData,
  });

  const [{ search, selectedAlienName, series, showFavorites }, dispatch] = useReducer(
    (state: AlienState, action: AlienAction): AlienState => {
      switch (action.type) {
        case 'setSearch':
          return { ...state, search: action.payload, selectedAlienName: null };
        case 'selectAlien':
          return { ...state, selectedAlienName: action.payload };
        case 'navigateToList':
          return { ...state, selectedAlienName: null };
        case 'setSeries':
          return { ...state, series: action.payload };
        case 'setShowFavorites':
          return { ...state, showFavorites: action.payload };
        default:
          return state;
      }
    },
    {
      search: '',
      selectedAlienName: null,
      series: '',
      showFavorites: false,
    }
  );

  const setSearch = useCallback((search: string) => {
    dispatch({ type: 'setSearch', payload: search });
  }, []);

  const setSeries = useCallback((series: string) => {
    dispatch({ type: 'setSeries', payload: series });
  }, []);

  const setShowFavorites = useCallback((show: boolean) => {
    dispatch({ type: 'setShowFavorites', payload: show });
  }, []);

  const selectAlien = useCallback((name: string) => {
    dispatch({ type: 'selectAlien', payload: name });
  }, []);

  const navigateToList = useCallback(() => {
    dispatch({ type: 'navigateToList' });
  }, []);

  const filteredAliens = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allAliens.filter((alien) => {
      const nameMatch = (alien.name || '').toString().toLowerCase().includes(q) || q === '';
      const speciesMatch = (alien.species || '').toString().toLowerCase().includes(q) || q === '';
      const seriesMatch = !series || String(alien.series).toLowerCase().includes(series.toLowerCase());
      return (nameMatch || speciesMatch) && seriesMatch;
    });
  }, [allAliens, search, series]);

  return {
    aliens: filteredAliens,
    search,
    setSearch,
    series,
    setSeries,
    showFavorites,
    setShowFavorites,
    isLoading,
    error,
    selectedAlienName,
    selectAlien,
    navigateToList,
    allAliens,
  };
}

const AlienContext = createContext<ReturnType<typeof useAlienSource> | null>(null);

export function useAliens() {
  const context = useContext(AlienContext);
  if (context === null) throw new Error('useAliens must be used within an AlienProvider');
  return context;
}

export const AlienProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useAlienSource();
  return <AlienContext.Provider value={value}>{children}</AlienContext.Provider>;
};
