import { useState, useRef, useEffect } from 'react';
import { getApiUrl } from '../utils/api';

// Yandex Maps API type declarations
declare global {
  interface Window {
    ymaps: any;
  }
}

interface MediaFile {
  id: number;
  name: string;
  path: string;
  ext: string;
  size: number;
  created_at: string;
}

type Field = {
  id: number;
  name: string;
  description: string;
  city: string;
  address: string;
  location: string | null;
  square: number | null;
  info: string | null;
  places: number | null;
  dressing: boolean;
  toilet: boolean;
  display: boolean;
  parking: boolean;
  for_disabled: boolean;
  logo: MediaFile | null;
  media: MediaFile[] | null;
  slug: string;
};

type FieldEditFormProps = {
  field: Field;
  onFieldUpdated: (updatedField: Field) => void;
  onCancel: () => void;
};

export default function FieldEditForm({ field, onFieldUpdated, onCancel }: FieldEditFormProps) {
  // Function to fetch address suggestions
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 4) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsAddressLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(getApiUrl(`/api/address/suggests?query=${encodeURIComponent(query)}`));
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsAddressLoading(false);
    }
  };

  // Debounced address input handler
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value;
      setAddress(value);

      // Clear previous timeout
      if (addressTimeoutRef.current) {
        clearTimeout(addressTimeoutRef.current);
      }

      // Set new timeout
      addressTimeoutRef.current = setTimeout(() => {
        fetchAddressSuggestions(value);
      }, 300);
    } catch (error) {
      console.error('Error in handleAddressChange:', error);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: { value: string, geo: { lat: string, lon: string } }) => {
    setAddress(suggestion.value);
    setShowSuggestions(false);

    // Convert string coordinates to numbers
    const lat = parseFloat(suggestion.geo.lat);
    const lon = parseFloat(suggestion.geo.lon);

    // Update map
    if (mapInstance && placemark) {
      // Set new coordinates
      placemark.geometry.setCoordinates([lat, lon]);
      mapInstance.setCenter([lat, lon], 15);
      setLatitude(lat);
      setLongitude(lon);
    }
  };

  // Initialize form state with field data
  const [name, setName] = useState(field.name);
  const [description, setDescription] = useState(field.description || '');
  const [city, setCity] = useState(field.city || '');
  const [address, setAddress] = useState(field.address || '');
  const [suggestions, setSuggestions] = useState<{ value: string, geo: { lat: string, lon: string } }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(field.location ? parseFloat(field.location.split(',')[0]) : null);
  const [longitude, setLongitude] = useState<number | null>(field.location ? parseFloat(field.location.split(',')[1]) : null);
  const [square, setSquare] = useState(field.square?.toString() || '');
  const [info, setInfo] = useState(field.info || '');
  const [places, setPlaces] = useState(field.places?.toString() || '');
  const [dressing, setDressing] = useState(field.dressing || false);
  const [toilet, setToilet] = useState(field.toilet || false);
  const [display, setDisplay] = useState(field.display || false);
  const [parking, setParking] = useState(field.parking || false);
  const [forDisabled, setForDisabled] = useState(field.for_disabled || false);
  const [logo, setLogo] = useState<MediaFile | null>(field.logo);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [media, setMedia] = useState<MediaFile[]>(field.media || []);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const addressInputRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [placemark, setPlacemark] = useState<any>(null);
  const addressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize map with field location
  useEffect(() => {
    let isInitialized = false;
    let handleLoad: (() => void) | null = null;

    // Check if map is already loaded and initialized
    if (typeof window !== 'undefined' && window.ymaps && mapRef.current && !mapInstance) {
      window.ymaps.ready(() => {
        if (!mapInstance && !isInitialized) {
          isInitialized = true;
          initializeMap();
        }
      });
    } else if (typeof window !== 'undefined' && mapRef.current && !mapInstance) {
      // Check if script is already loaded
      const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]') as HTMLScriptElement | null;
      if (existingScript) {
        // Script already exists, wait for it to load
        handleLoad = () => {
          if (window.ymaps && !mapInstance && !isInitialized) {
            window.ymaps.ready(() => {
              if (!mapInstance && !isInitialized) {
                isInitialized = true;
                initializeMap();
              }
            });
          }
        };

        if (existingScript.getAttribute('data-loaded')) {
          handleLoad();
        } else {
          existingScript.addEventListener('load', handleLoad);
        }
      } else {
        // Load Yandex Maps API
        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${process.env.YANDEX_MAPS_API_KEY}&lang=ru_RU`;
        script.onload = () => {
          script.setAttribute('data-loaded', 'true');
          if (window.ymaps && !mapInstance && !isInitialized) {
            window.ymaps.ready(() => {
              if (!mapInstance && !isInitialized) {
                isInitialized = true;
                initializeMap();
              }
            });
          }
        };
        document.head.appendChild(script);
      }
    }

    // Cleanup function
    return () => {
      isInitialized = true;
      // Clean up event listener
      const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]') as HTMLScriptElement | null;
      if (existingScript && handleLoad) {
        existingScript.removeEventListener('load', handleLoad);
      }
    };
  }, [mapInstance]);

  // Handle clicks outside the address input to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const initializeMap = () => {
    if (mapRef.current && window.ymaps && !mapInstance) {
      // Check if a map is already initialized for this container
      if (mapRef.current.children.length > 0) {
        // A map is already initialized, don't create a new one
        return;
      }

      // Use field location or default to Moscow
      const centerLat = latitude || 55.7558;
      const centerLon = longitude || 37.6173;

      const map = new window.ymaps.Map(mapRef.current, {
        center: [centerLat, centerLon],
        zoom: 15
      });

      // Create a placemark at the field location
      const newPlacemark = new window.ymaps.Placemark(
        [centerLat, centerLon],
        {
          hintContent: 'Местоположение площадки'
        },
        {
          draggable: true
        }
      );

      // Add event listener to placemark
      newPlacemark.events.add('dragend', (e: any) => {
        const coords = e.get('target').geometry.getCoordinates();
        setLatitude(coords[0]);
        setLongitude(coords[1]);
      });

      // Add event listener to map
      map.events.add('click', (e: any) => {
        const coords = e.get('coords');
        newPlacemark.geometry.setCoordinates(coords);
        setLatitude(coords[0]);
        setLongitude(coords[1]);
      });

      map.geoObjects.add(newPlacemark);
      setMapInstance(map);
      setPlacemark(newPlacemark);
    }
  };

  // Upload file function
  const uploadFile = async (file: File): Promise<MediaFile> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('jwtToken');

    try {
      const fetchPromise = fetch(getApiUrl('/api/media/preloader'), {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
        body: formData,
      });

      const response = await fetchPromise;

      if (!response.ok) {
        throw new Error('Ошибка загрузки файла');
      }

      const result: MediaFile = await response.json();
      return result;
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      throw error;
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Пожалуйста, выберите изображение в формате JPG, PNG, GIF или WEBP');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Размер файла не должен превышать 5 МБ');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      try {
        const result = await uploadFile(file);
        console.log('Файл загружен:', result);
        setLogo(result);
        setLogoPreview(URL.createObjectURL(file));
        setError(null);
      } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        setError('Не удалось загрузить файл');
      }

    } else {
      setLogo(null);
      setLogoPreview(null);
    }
  };

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      // Validate types
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const invalidFiles = files.filter(file => !validTypes.includes(file.type));

      if (invalidFiles.length > 0) {
        setError('Пожалуйста, выберите изображения в формате JPG, PNG, GIF или WEBP');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file sizes
      const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setError('Размер каждого файла не должен превышать 5 МБ');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setError(null);

      try {
        // Upload all files in parallel
        const uploadPromises = files.map(file => uploadFile(file));
        const results = await Promise.all(uploadPromises);

        console.log('Все файлы загружены:', results);

        // Update state - save MediaFile objects
        setMedia(prevMedia => [...prevMedia, ...results]);

        // Create previews
        const previews = files.map(file => URL.createObjectURL(file));
        setMediaPreviews(prevPreviews => [...prevPreviews, ...previews]);

      } catch (error) {
        console.error('Ошибка загрузки файлов:', error);
        setError('Не удалось загрузить один или несколько файлов');
      } finally {
      }

    } else {
      setMedia([]);
      setMediaPreviews([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Create JSON data
    const jsonData = {
      name,
      description: description || null,
      city,
      address,
      location: (latitude !== null && longitude !== null) ? `${latitude},${longitude}` : null,
      square: square ? parseFloat(square) : null,
      info: info || null,
      places: places ? parseInt(places) : null,
      dressing,
      toilet,
      display,
      parking,
      for_disabled: forDisabled,
      logo: logo ? logo.name : null,
      media: media.map(mediaItem => mediaItem.name)
    };

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Требуется авторизация');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(getApiUrl(`/api/fields/${field.slug}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        const updatedField = await response.json();
        onFieldUpdated(updatedField);
        setSuccess('Площадка успешно обновлена!');
      } else {
        // Handle non-200 status codes
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Ошибка: ${response.status} ${response.statusText}`;
        setError(errorMessage);
      }
    } catch (error: unknown) {
      console.error('Ошибка:', error);
      if (error instanceof TypeError) {
        setError('Ошибка сети. Проверьте подключение к серверу.');
      } else {
        setError('Произошла ошибка при обновлении площадки: ' + (error as Error).message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="field-edit-form-container">
      <style jsx>{`
        .hover-bg-light:hover {
          background-color: #f8f9fa;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
      <h2>Редактировать площадку</h2>
      <form onSubmit={handleSubmit} className="field-form">
        <div className="form-group">
          <label htmlFor="name">Название площадки:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">Город:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Адрес:</label>
          <div ref={addressInputRef} className="position-relative">
            <input
              type="text"
              id="address"
              value={address}
              onChange={handleAddressChange}
              required
              className="form-control"
              autoComplete="off"
            />
            {showSuggestions && (
              <div className="position-absolute w-100 mt-1" style={{
                zIndex: 1000,
                maxHeight: '200px',
                overflowY: 'auto',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-2 border-bottom cursor-pointer hover-bg-light"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    style={{ cursor: 'pointer' }}
                  >
                    {suggestion.value}
                  </div>
                ))}
              </div>
            )}
            {isAddressLoading && (
              <div className="position-absolute w-100 mt-1 p-2" style={{
                zIndex: 1000,
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                Загрузка...
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="square">Площадь (кв. м.):</label>
            <input
              type="number"
              id="square"
              value={square}
              onChange={(e) => setSquare(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="places">Количество мест:</label>
            <input
              type="number"
              id="places"
              value={places}
              onChange={(e) => setPlaces(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="info">Дополнительная информация:</label>
          <textarea
            id="info"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className="form-control"
            rows={3}
          />
        </div>

        <div className="form-check mb-2">
          <input
            type="checkbox"
            id="dressing"
            checked={dressing}
            onChange={(e) => setDressing(e.target.checked)}
            className="form-check-input"
          />
          <label htmlFor="dressing" className="form-check-label">Раздевалка</label>
        </div>

        <div className="form-check mb-2">
          <input
            type="checkbox"
            id="toilet"
            checked={toilet}
            onChange={(e) => setToilet(e.target.checked)}
            className="form-check-input"
          />
          <label htmlFor="toilet" className="form-check-label">Туалет</label>
        </div>

        <div className="form-check mb-2">
          <input
            type="checkbox"
            id="display"
            checked={display}
            onChange={(e) => setDisplay(e.target.checked)}
            className="form-check-input"
          />
          <label htmlFor="display" className="form-check-label">Табло</label>
        </div>

        <div className="form-check mb-2">
          <input
            type="checkbox"
            id="parking"
            checked={parking}
            onChange={(e) => setParking(e.target.checked)}
            className="form-check-input"
          />
          <label htmlFor="parking" className="form-check-label">Парковка</label>
        </div>

        <div className="form-check mb-2">
          <input
            type="checkbox"
            id="forDisabled"
            checked={forDisabled}
            onChange={(e) => setForDisabled(e.target.checked)}
            className="form-check-input"
          />
          <label htmlFor="forDisabled" className="form-check-label">Для инвалидов</label>
        </div>

        <div className="form-group">
          <label htmlFor="logo">Логотип:</label>
          <input
            type="file"
            id="logo"
            ref={fileInputRef}
            onChange={handleLogoChange}
            className="form-control"
            accept="image/jpeg,image/png,image/gif,image/webp"
          />
          {(logoPreview || field.logo) && (
            <div className="mt-2">
              <img
                src={logoPreview || (field.logo ? getApiUrl(`/api/media/${field.logo.name}`) : '/file.svg')}
                alt="Предпросмотр логотипа"
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="media">Медиа:</label>
          <input
            type="file"
            id="media"
            ref={mediaInputRef}
            onChange={handleMediaChange}
            className="form-control"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
          />
          <div className="mt-2 d-flex flex-wrap gap-2">
            {/* Existing media */}
            {field.media && field.media.map((mediaItem, index) => (
              <div key={`existing-${index}`} className="position-relative">
                <img
                  src={getApiUrl(`/api/media/${mediaItem.name}`)}
                  alt={`Media ${index + 1}`}
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                />
              </div>
            ))}
            {/* New media previews */}
            {mediaPreviews.map((preview, index) => (
              <div key={`new-${index}`} className="position-relative">
                <img
                  src={preview}
                  alt={`New media preview ${index + 1}`}
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Yandex Map */}
        <div className="form-group mt-4">
          <label>Выберите местоположение площадки на карте:</label>
          <div
            ref={mapRef}
            style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}
          />
          {(latitude !== null && longitude !== null) && (
            <div className="mt-2">
              <p>Выбранные координаты: Широта {latitude.toFixed(6)}, Долгота {longitude.toFixed(6)}</p>
            </div>
          )}
        </div>

        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}