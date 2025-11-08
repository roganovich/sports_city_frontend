'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/api';
import FieldForm from '../../components/FieldForm';

type Field = {
    id: number;
    name: string;
    description: string;
};

export default function Page() {
    const [fields, setFields] = useState<Field[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFields = async () => {
        try {
            const res = await fetch(getApiUrl('/api/fields'));
            
            if (!res.ok) {
                // Handle non-200 status codes
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.message);
                setLoading(false);
                return;
            }
            
            const data: Field[] = await res.json();
            setFields(data);
            setError(null);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка при загрузке площадок:', error);
            setError('Произошла ошибка при загрузке данных');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFields();
    }, []);

    const handleFieldAdded = () => {
        // Обновляем список площадок после добавления новой
        fetchFields();
    };

    if (loading) {
        return (<div className="container">Загрузка...</div>);
    }

    if (error) {
        return (
            <div className="container">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-title">
                <div className="container d-lg-flex justify-content-between align-items-center">
                    <h1 className="mb-2 mb-lg-0">Список спортивных площадок</h1>
                    <nav className="breadcrumbs">
                        <ol>
                            <li><Link href="/">Главная</Link></li>
                            <li><Link href="/fields">Список спортивных площадок</Link></li>
                            <li className="current">Добавить новую площадку</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <FieldForm onFieldAdded={handleFieldAdded} />
                </div>
            </section>
        </div>
    );
}