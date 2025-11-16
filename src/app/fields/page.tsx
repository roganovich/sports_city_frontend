import Link from 'next/link';
import { getApiUrl } from '../utils/api';
import Image from "next/image";
import FieldItem from '../components/FieldItem';

interface MediaFile {
  id: number;
  name: string;
  path: string;
  ext: string;
  size: number;
  created_at: string;
}

interface Responsible {
  id: number;
  name: string;
  email: string;
}

type FieldPageField = {
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
    status: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    responsible: Responsible | null;
};

export default async function Page() {
    // Асинхронный запрос к API
    const res = await fetch(getApiUrl('/api/fields'));
    const data: FieldPageField[] = await res.json();

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
                    <Link href="/fields/create" className="btn btn-success">
                    Добавить новую площадку
                    </Link>
                </div>
                  <div className="row gy-4">
                      {data.map((item) => (
                          <FieldItem key={item.id} item={item} />
                      ))}
                  </div>
              </div>
          </section>
      </div>
  );
}
