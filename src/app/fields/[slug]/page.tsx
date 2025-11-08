import Link from 'next/link';
import { getApiUrl } from '../../utils/api';

// TypeScript type for the field DTO based on the backend structure
type Field = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  city: string;
  address: string;
  location: string | null;
  square: number | null;
  info: string | null;
  places: number;
  dressing: boolean;
  toilet: boolean;
  display: boolean;
  parking: boolean;
  for_disabled: boolean;
  logo: string | null;
  media: string | null;
  status: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

// This is a server component that fetches data at build time
export default async function FieldDetailPage({ params }: { params: { slug: string } }) {
  // Fetch the field data from the API
  const res = await fetch(getApiUrl(`/api/fields/${params.slug}`), {
    next: { revalidate: 60 } // Revalidate at most every 60 seconds
  });
  
  // Handle 404 case
  if (!res.ok) {
    if (res.status === 404) {
      return (
        <div className="container">
          <div className="page-title">
            <div className="container d-lg-flex justify-content-between align-items-center">
              <h1 className="mb-2 mb-lg-0">Площадка не найдена</h1>
              <nav className="breadcrumbs">
                <ol>
                  <li><Link href="/">Главная</Link></li>
                  <li><Link href="/fields">Список спортивных площадок</Link></li>
                  <li className="current">Площадка не найдена</li>
                </ol>
              </nav>
            </div>
          </div>
          
          <section className="section">
            <div className="container">
              <div className="alert alert-warning" role="alert">
                <h4 className="alert-heading">Площадка не найдена!</h4>
                <p>Запрашиваемая площадка не существует или была удалена.</p>
                <hr />
                <Link href="/fields" className="btn btn-primary">Вернуться к списку площадок</Link>
              </div>
            </div>
          </section>
        </div>
      );
    }
    
    // Handle other errors
    throw new Error(`Failed to fetch field: ${res.status} ${res.statusText}`);
  }
  
  const field: Field = await res.json();
  
  return (
    <div>
      <div className="page-title">
        <div className="container d-lg-flex justify-content-between align-items-center">
          <h1 className="mb-2 mb-lg-0">{field.name}</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link href="/">Главная</Link></li>
              <li><Link href="/fields">Список спортивных площадок</Link></li>
              <li className="current">{field.name}</li>
            </ol>
          </nav>
        </div>
      </div>
      
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title">{field.name}</h2>
                  
                  {field.logo && (
                    <div className="mb-4">
                      <img 
                        src={field.logo} 
                        alt={`Логотип ${field.name}`} 
                        className="img-fluid rounded" 
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  )}
                  
                  {field.description && (
                    <div className="mb-4">
                      <h5>Описание</h5>
                      <p>{field.description}</p>
                    </div>
                  )}
                  
                  <div className="row">
                    <div className="col-md-6">
                      <h5>Информация о площадке</h5>
                      <ul className="list-unstyled">
                        <li><strong>Город:</strong> {field.city}</li>
                        <li><strong>Адрес:</strong> {field.address}</li>
                        {field.square && <li><strong>Площадь:</strong> {field.square} кв. м.</li>}
                        <li><strong>Количество мест:</strong> {field.places}</li>
                      </ul>
                    </div>
                    
                    <div className="col-md-6">
                      <h5>Удобства</h5>
                      <ul className="list-unstyled">
                        <li>
                          <i className={`bi ${field.dressing ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`}></i>
                          Раздевалка
                        </li>
                        <li>
                          <i className={`bi ${field.toilet ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`}></i>
                          Туалет
                        </li>
                        <li>
                          <i className={`bi ${field.display ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`}></i>
                          Табло
                        </li>
                        <li>
                          <i className={`bi ${field.parking ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`}></i>
                          Парковка
                        </li>
                        <li>
                          <i className={`bi ${field.for_disabled ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`}></i>
                          Для инвалидов
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {field.info && (
                    <div className="mt-4">
                      <h5>Дополнительная информация</h5>
                      <p>{field.info}</p>
                    </div>
                  )}
                  
                  {field.location && (
                    <div className="mt-4">
                      <h5>Местоположение</h5>
                      <div>{field.location}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              {field.media && (
                <div className="card mt-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Медиа</h5>
                  </div>
                  <div className="card-body">
                    <div>Медиафайлы: {field.media}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <Link href="/fields" className="btn btn-secondary">
              <i className="bi bi-arrow-left"></i> Назад к списку
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}