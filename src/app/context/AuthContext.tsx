import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Тип для пользователя
type User = {
    id: string;
    name: string;
    email: string;
} | null;

// Тип для контекста
type AuthContextType = {
    user: User;
    login: (userData: User) => void;
    logout: () => void;
};

// Создаем контекст с начальным значением `null`
const AuthContext = createContext<AuthContextType | null>(null);

// Пропсы для AuthProvider
type AuthProviderProps = {
    children: ReactNode;
};

// Провайдер для контекста
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User>(null);

    // Функция для входа
    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Сохраняем в localStorage
    };

    // Функция для выхода
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Удаляем из localStorage
    };

    // При монтировании компонента проверяем localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для использования контекста
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};