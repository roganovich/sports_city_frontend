'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/api';
import TeamForm from '../../components/TeamForm';

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
        return (<div className="container">Загрузка...</div>);
    }

    return (
        <div>
            <div className="page-title">
                <div className="container d-lg-flex justify-content-between align-items-center">
                    <h1 className="mb-2 mb-lg-0">Список спортивных команд</h1>
                    <nav className="breadcrumbs">
                        <ol>
                            <li><Link href="/">Главная</Link></li>
                            <li><Link href="/teams">Список спортивных команд</Link></li>
                            <li className="current">Создать свою команду</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <TeamForm onTeamAdded={handleTeamAdded} />
                </div>
            </section>
        </div>
    );
}
