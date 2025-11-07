import { useState } from 'react';
import { getApiUrl } from '../utils/api';

type TeamFormProps = {
  onTeamAdded?: () => void;
};

export default function TeamForm({ onTeamAdded }: TeamFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [uniformColor, setUniformColor] = useState('');
  const [participantCount, setParticipantCount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const teamData = {
      name,
      description,
      city,
      uniform_color: uniformColor,
      participant_count: parseInt(participantCount) || 0
    };

    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

      const response = await fetch(getApiUrl('/api/teams'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(teamData),
      });

      if (response.ok) {
        // Сброс формы после успешной отправки
        setName('');
        setDescription('');
        setCity('');
        setUniformColor('');
        setParticipantCount('');
        
        // Вызов callback функции, если она передана
        if (onTeamAdded) {
          onTeamAdded();
        }
        
        alert('Команда успешно добавлена!');
      } else {
        alert('Ошибка при добавлении команды');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при добавлении команды');
    }
  };

  return (
    <div className="team-form-container">
      <h2>Добавить новую команду</h2>
      <form onSubmit={handleSubmit} className="team-form">
        <div className="form-group">
          <label htmlFor="name">Название команды:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-control"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">Город:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="uniformColor">Цвет формы:</label>
          <input
            type="text"
            id="uniformColor"
            value={uniformColor}
            onChange={(e) => setUniformColor(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="participantCount">Количество участников:</label>
          <input
            type="number"
            id="participantCount"
            value={participantCount}
            onChange={(e) => setParticipantCount(e.target.value)}
            required
            min="1"
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Добавить команду
        </button>
      </form>
    </div>
  );
}