import { useState, useEffect } from 'react'; // Import useEffect
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            // В этом варианте токен в ответе на запрос
            const token = await response.json();
            // Сохраняем токен в localStorage
            localStorage.setItem('jwtToken', token);
            console.log('Авторизация успешна. Получили токен:', token);
            router.push('/'); // Redirect to the home page after successful authentication
        } else {
            console.error('Ошибка авторизации');
        }
    };

    return (
        <form  onSubmit={handleSubmit} className="php-email-form" data-aos="fade-up"
               data-aos-delay="200">
            <div className="row gy-4">

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
                    <div className="error-message">Возникла ошибка при авторизации</div>
                    <div className="sent-message">Вы успешно прошли авторизацию!</div>
                    <button type="submit">Войти</button>
                </div>
            </div>
        </form>
    );
}