import Link from 'next/link';
import { getApiUrl } from '../utils/api';
import Image from "next/image";

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
    slug: string;
    logo: MediaFile | null; // логотип теперь объект или null
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
                <div className="d-flex mb-4">
                    <Link href="/fields/create" className="btn-getstarted">
                    Добавить новую площадку
                    </Link>
                </div>
                  <div className="row gy-4">
                      {data.map((item) => (
                          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100"  key={item.id}>
                              <div className="service-item position-relative">
                                    <div className="col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-out" data-aos-delay="100">
                                        <Image
                                            src={typeof item.logo?.name === 'string' ? getApiUrl(`/api/media/${item.logo.name}`) : '/file.svg'}
                                            className="img-fluid"
                                            alt=""
                                            width={400}
                                            height={400}
                                        />
                                    </div>
                                  <Link href={`/fields/${item.slug}`} className="stretched-link">
                                      <h3>{item.name}</h3>
                                  </Link>
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
