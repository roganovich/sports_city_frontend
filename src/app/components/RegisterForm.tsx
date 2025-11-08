import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '../utils/api';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch(getApiUrl('/api/auth/create'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, phone, password }),
        });

        if (response.ok) {
            // В этом варианте токен в ответе на запрос
            const token = await response.json();
            // Сохраняем токен в localStorage
            localStorage.setItem('jwtToken', token);
            // Dispatch a custom event to notify other components of the auth change
            window.dispatchEvent(new CustomEvent('authChange'));
            console.log('Регистрация успешна. Получили токен:', token);
            
            // Redirect to the home page after successful registration
            router.push('/');
        } else {
            console.error('Ошибка регистрации');
        }
    };

    return (
        <form  onSubmit={handleSubmit} className="php-email-form" data-aos="fade-up"
               data-aos-delay="200">
            <div className="row gy-4">

                <div className="col-md-12">
                    <label htmlFor="name-field" className="pb-2">Имя</label>
                    <input
                        className="form-control"
                        id="name-field"
                        type="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="col-md-12">
                    <label htmlFor="email-field" className="pb-2">Email</label>
                    <input
                        className="form-control"
                        id="email-field"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="col-md-12">
                    <label htmlFor="phone-field" className="pb-2">Телефон</label>
                    <input
                        className="form-control"
                        id="phone-field"
                        type="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div className="col-md-12">
                    <label htmlFor="password-field" className="pb-2">Пароль</label>
                    <input
                        className="form-control"
                        id="password-field"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="col-md-12 text-center">
                    <div className="loading">Загрузка</div>
                    <div className="error-message">Возникла ошибка при регистрации</div>
                    <div className="sent-message">Вы успешно прошли регистрацию!</div>
                    <button  type="submit">Отправить</button>
                </div>
            </div>
        </form>
    );
}