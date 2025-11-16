'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getApiUrl } from '../utils/api';
import FieldEditForm from './FieldEditForm';

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

interface User {
  id: number;
  name: string;
  email: string;
}

type FieldItemField = {
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

export default function FieldItem({ item }: { item: any }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [fieldData, setFieldData] = useState<any>(item);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(getApiUrl('/api/auth/info'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100" key={item.id}>
        <div className="service-item position-relative">
          <div className="col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-out" data-aos-delay="100">
            {/* Loading skeleton or placeholder */}
          </div>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
      </div>
    );
  }

  const handleFieldUpdated = (updatedField: any) => {
    setFieldData(updatedField);
    setShowEditForm(false);
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  if (showEditForm) {
    return (
      <div className="col-lg-12" data-aos="fade-up" data-aos-delay="100" key={fieldData.id}>
        <FieldEditForm
          field={fieldData as any}
          onFieldUpdated={handleFieldUpdated}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100" key={fieldData.id}>
      <div className="card" style={{ width: '18rem' }}>
        {fieldData.logo && (
          <div
            className="card-img-top"
            style={{
              width: '100%',
              height: '200px',
              backgroundImage: `url(${typeof fieldData.logo?.name === 'string' ? getApiUrl(`/api/media/${fieldData.logo.name}`) : '/file.svg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        )}
        <div className="card-body">
          <h5 className="card-title">{fieldData.name}</h5>
          <p className="card-text">{fieldData.description}</p>
          {user && fieldData.responsible && user.id === fieldData.responsible.id ? (
            <button
              className="btn btn-warning me-2"
              onClick={async () => {
                // Fetch full field data
                try {
                  const token = localStorage.getItem('jwtToken');
                  const response = await fetch(getApiUrl(`/api/fields/${fieldData.slug}`), {
                    headers: {
                      'Authorization': token ? `Bearer ${token}` : '',
                    },
                  });
                  
                  if (response.ok) {
                    const fullFieldData = await response.json();
                    setFieldData(fullFieldData);
                    setShowEditForm(true);
                  } else {
                    console.error('Failed to fetch full field data');
                  }
                } catch (error) {
                  console.error('Error fetching full field data:', error);
                }
              }}
            >
              Изменить
            </button>
          ) : null}
          <Link href={`/fields/${fieldData.slug}`} className="btn btn-secondary">
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}