import Link from 'next/link';
import { getApiUrl } from '../utils/api';

type Field = {
    id: number;
    name: string;
    description: string;
};

export default async function Page() {
    // Асинхронный запрос к API
    const res = await fetch(getApiUrl('/api/fields'));
    const data: Field[] = await res.json();

  return (
      <div>
          <div className="page-title">
              <div className="container d-lg-flex justify-content-between align-items-center">
                  <h1 className="mb-2 mb-lg-0">Список спортивных площадок</h1>
                  <nav className="breadcrumbs">
                      <ol>
                          <li><Link href="/">Главная</Link></li>
                          <li className="current">Список спортивных площадок</li>
                      </ol>
                  </nav>
              </div>
          </div>

          <section id="services" className="services section light-background">
              <div className="container">
                  <div className="row gy-4">
                      {data.map((item) => (
                          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100"  key={item.id}>
                              <div className="service-item position-relative">
                                  <div className="icon">
                                      <i className="bi bi-activity"></i>
                                  </div>
                                  <a href="service-details.html" className="stretched-link">
                                      <h3>{item.name}</h3>
                                  </a>
                                  <p>{item.description}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      </div>
  );
}
