'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/api';
import TeamForm from '../components/TeamForm';

type Team = {
    id: number;
    name: string;
    description: string;
    city: string;
    uniform_color: string;
    participant_count: number;
};

export default function Page() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTeams = async () => {
        try {
            const res = await fetch(getApiUrl('/api/teams'));
            const data: Team[] = await res.json();
            setTeams(data);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка при загрузке команд:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleTeamAdded = () => {
        // Обновляем список команд после добавления новой
        fetchTeams();
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <div className="page-title">
                <div className="container d-lg-flex justify-content-between align-items-center">
                    <h1 className="mb-2 mb-lg-0">Список спортивных команд</h1>
                    <nav className="breadcrumbs">
                        <ol>
                            <li><Link href="/">Главная</Link></li>
                            <li className="current">Список спортивных команд</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <TeamForm onTeamAdded={handleTeamAdded} />
                </div>
            </section>

            <section id="services" className="services section light-background">
                <div className="container">
                    <div className="row gy-4">
                        {teams.map((item) => (
                            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100" key={item.id}>
                                <div className="service-item position-relative">
                                    <div className="icon">
                                        <i className="bi bi-activity"></i>
                                    </div>
                                    <a href="service-details.html" className="stretched-link">
                                        <h3>{item.name}</h3>
                                    </a>
                                    <p>{item.description}</p>
                                    <p><strong>Город:</strong> {item.city}</p>
                                    <p><strong>Цвет формы:</strong> {item.uniform_color}</p>
                                    <p><strong>Участников:</strong> {item.participant_count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
