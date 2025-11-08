import { useState, useRef } from 'react';
import { getApiUrl } from '../utils/api';

type FieldFormProps = {
  onFieldAdded?: () => void;
};

export default function FieldForm({ onFieldAdded }: FieldFormProps) {
  // Function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [square, setSquare] = useState('');
  const [info, setInfo] = useState('');
  const [places, setPlaces] = useState('0');
  const [dressing, setDressing] = useState(false);
  const [toilet, setToilet] = useState(false);
  const [display, setDisplay] = useState(false);
  const [parking, setParking] = useState(false);
  const [forDisabled, setForDisabled] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [media, setMedia] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
      setError(null);
    } else {
      setLogo(null);
      setLogoPreview(null);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Validate file types
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/avi', 'video/mov'];
      const invalidFiles = files.filter(file => !validTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        setError('Пожалуйста, выберите файлы в формате JPG, PNG, GIF, WEBP, MP4, AVI или MOV');
        if (mediaInputRef.current) {
          mediaInputRef.current.value = '';
        }
        return;
      }
      
      // Validate file sizes (e.g., max 10MB each)
      const largeFiles = files.filter(file => file.size > 10 * 1024 * 1024);
      
      if (largeFiles.length > 0) {
        setError('Размер каждого файла не должен превышать 10 МБ');
        if (mediaInputRef.current) {
          mediaInputRef.current.value = '';
        }
        return;
      }
      
      setMedia(files);
      
      // Create previews for images
      const previews = files.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        return '';
      });
      setMediaPreviews(previews);
      setError(null);
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
    
    // Convert files to base64
    const logoBase64 = logo ? await fileToBase64(logo) : null;
    const mediaBase64 = await Promise.all(media.map(file => fileToBase64(file)));
    
    // Create JSON data
    const jsonData = {
      name,
      description: description || null,
      city,
      address,
      location: location || null,
      square: square ? parseFloat(square) : null,
      info: info || null,
      places: parseInt(places) || 0,
      dressing,
      toilet,
      display,
      parking,
      for_disabled: forDisabled,
      logo: logoBase64,
      media: mediaBase64
    };

    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('Требуется авторизация');
          setIsSubmitting(false);
          return;
        }

      console.log('Sending request to:', getApiUrl('/api/fields'));
      console.log('JSON data:', jsonData);
      
      // Create a timeout promise
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      // Create the fetch promise
      const fetchPromise = fetch(getApiUrl('/api/fields'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(jsonData),
      });
      
      // Race the fetch promise against the timeout
      const response = await Promise.race([fetchPromise, timeout]);

      if ((response as Response).ok) {
        // Сброс формы после успешной отправки
        setName('');
        setDescription('');
        setCity('');
        setAddress('');
        setLocation('');
        setSquare('');
        setInfo('');
        setPlaces('0');
        setDressing(false);
        setToilet(false);
        setDisplay(false);
        setParking(false);
        setForDisabled(false);
        setLogo(null);
        setLogoPreview(null);
        setMedia([]);
        setMediaPreviews([]);
        
        // Вызов callback функции, если она передана
        if (onFieldAdded) {
          onFieldAdded();
        }
        
        setSuccess('Площадка успешно добавлена!');
      } else {
        // Handle non-200 status codes
        const errorData = await (response as Response).json().catch(() => ({}));
        const errorMessage = errorData.message || `Ошибка: ${(response as Response).status} ${(response as Response).statusText}`;
        setError(errorMessage);
      }
    } catch (error: unknown) {
      console.error('Ошибка:', error);
      if (error instanceof TypeError) {
        console.error('Network error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        setError('Ошибка сети. Проверьте подключение к серверу. Это может быть проблема с CORS или недоступностью сервера.');
      } else if (error instanceof Error && error.message === 'Request timeout') {
        setError('Превышено время ожидания ответа от сервера.');
      } else {
        setError('Произошла ошибка при добавлении площадки: ' + (error as Error).message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="field-form-container">
      <h2>Добавить новую площадку</h2>
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
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Местоположение (JSON):</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="form-control"
          />
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
              min="0"
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
          {logoPreview && (
            <div className="mt-2">
              <img
                src={logoPreview}
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
            accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/avi,video/mov"
            multiple
          />
          {mediaPreviews.length > 0 && (
            <div className="mt-2 d-flex flex-wrap gap-2">
              {mediaPreviews.map((preview, index) => (
                preview ? (
                  <div key={index} className="position-relative">
                    <img
                      src={preview}
                      alt={`Media preview ${index + 1}`}
                      style={{ maxWidth: '100px', maxHeight: '100px' }}
                    />
                  </div>
                ) : (
                  <div key={index} className="position-relative">
                    <div className="bg-secondary d-flex align-items-center justify-content-center"
                         style={{ width: '100px', height: '100px' }}>
                      <span className="text-white">Видео</span>
                    </div>
                  </div>
                )
              ))}
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
        
        <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
          {isSubmitting ? 'Добавление...' : 'Добавить площадку'}
        </button>
      </form>
    </div>
  );
}