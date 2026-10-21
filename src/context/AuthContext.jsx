import { createContext, useEffect, useState } from 'react';
import api from '../api/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        async function checkAuth() {
            const token = localStorage.getItem('token');

            if (!token) {
                setUser(null);
                return;
            }

            try {
                const response = await api.get('/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        }

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}