"use client";

import Link from 'next/link';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/api';

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

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        // Функция для проверки аутентификации
        const checkAuthStatus = () => {
            // Проверяем наличие токена в localStorage
            const token = localStorage.getItem('jwtToken');
            setIsAuthenticated(!!token);
            
            // Если токен есть, получаем информацию о пользователе
            if (token) {
                fetchUserInfo(token);
            } else {
                // Если токена нет, очищаем данные пользователя
                setUserData(null);
            }
        };
        
        // Проверяем статус при монтировании компонента
        checkAuthStatus();
        
        // Добавляем слушатель события storage для отслеживания изменений в localStorage
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'jwtToken') {
                checkAuthStatus();
            }
        };
        
        // Добавляем слушатель custom события authChange
        const handleAuthChange = () => {
            checkAuthStatus();
        };
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authChange', handleAuthChange);
        
        // Очищаем слушатели при размонтировании компонента
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    const fetchUserInfo = async (token: string) => {
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
        }
    };

    const handleLogout = () => {
        // Удаляем токен из localStorage
        localStorage.removeItem('jwtToken');
        // Dispatch a custom event to notify other components of the auth change
        window.dispatchEvent(new CustomEvent('authChange'));
        // Обновляем состояние аутентификации
        setIsAuthenticated(false);
        setUserData(null);
        // Перенаправляем на главную страницу
        window.location.href = '/';
    };

    return (
        <header id="header" className="header d-flex align-items-center sticky-top">
            <div className="container-fluid container-xl position-relative d-flex align-items-center">
                <a href="/" className="logo d-flex align-items-center me-auto">
                    <Image
                        src="/baner-left_1_11zon.webp"
                        className="img-fluid"
                        alt=""
                        width={100}
                        height={300}
                    />
                </a>
                <nav id="navmenu" className="navmenu">
                    <ul>
                        <li><Link href="/">Главная</Link></li>
                        <li><Link href="/fields">Площадки</Link></li>
                        <li><Link href="/teams">Команды</Link></li>
                        <li><Link href="/informations">Информация</Link></li>
                        <li><Link href="/contacts">Контакты</Link></li>
                    
                        <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
                    
                        {isAuthenticated ? (
                            <>
                                {userData?.logo ? (
                                    <li>
                                        <Link href="/profile" className="d-flex align-items-center">
                                            <img
                                                src={userData.logo}
                                                alt="Аватар"
                                                className="rounded-circle me-2"
                                                style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                            />
                                            <span>{userData.name}</span>
                                        </Link>
                                    </li>
                                ) : (
                                    <li>
                                        <Link href="/profile">
                                            {userData?.name || 'Профиль'}
                                        </Link>
                                    </li>
                                )}
                                <li><Link href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Выйти</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link href="/login">Войти</Link></li>
                                <li><Link href="/registration">Регистрация</Link></li>
                            </>
                        )}
                    </ul>
                </nav>

            </div>
        </header>
    );
}
