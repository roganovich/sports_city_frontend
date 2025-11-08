'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/api';
import Link from 'next/link';

type UserRole = {
  id: number;
  name: string;
};

type UserData = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  city: string | null;
  logo: string | null;
  media: any[];
  status: number;
  created_at: string;
};

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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
          const data: UserData = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user info');
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
    return <div className="container mt-5"><div>Загрузка...</div></div>;
  }

  if (!userData) {
    return <div className="container mt-5"><div>Ошибка загрузки данных пользователя</div></div>;
  }

  return (
    <div className="container mt-5">
      <div className="page-title">
        <div className="container d-lg-flex justify-content-between align-items-center">
          <h1 className="mb-2 mb-lg-0">Профиль пользователя</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link href="/">Главная</Link></li>
              <li className="current">Профиль пользователя</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body text-center">
                  {userData.logo ? (
                    <img 
                      src={userData.logo} 
                      alt="Аватар" 
                      className="img-fluid rounded-circle mb-3" 
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="bg-secondary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                         style={{ width: '150px', height: '150px' }}>
                      <span className="text-white" style={{ fontSize: '4rem' }}>
                        {userData.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <h4>{userData.name}</h4>
                  <p className="text-muted">{userData.role.name}</p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Информация о пользователе</h5>
                  
                  <div className="row">
                    <div className="col-sm-3">
                      <strong>Имя:</strong>
                    </div>
                    <div className="col-sm-9">
                      {userData.name}
                    </div>
                  </div>
                  
                  <hr />
                  
                  <div className="row">
                    <div className="col-sm-3">
                      <strong>Email:</strong>
                    </div>
                    <div className="col-sm-9">
                      {userData.email}
                    </div>
                  </div>
                  
                  <hr />
                  
                  <div className="row">
                    <div className="col-sm-3">
                      <strong>Роль:</strong>
                    </div>
                    <div className="col-sm-9">
                      {userData.role.name}
                    </div>
                  </div>
                  
                  <hr />
                  
                  <div className="row">
                    <div className="col-sm-3">
                      <strong>Телефон:</strong>
                    </div>
                    <div className="col-sm-9">
                      {userData.phone || 'Не указан'}
                    </div>
                  </div>
                  
                  <hr />
                  
                  <div className="row">
                    <div className="col-sm-3">
                      <strong>Город:</strong>
                    </div>
                    <div className="col-sm-9">
                      {userData.city || 'Не указан'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}