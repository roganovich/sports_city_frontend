"use client";

export default function AuthInfo() {
        const token = localStorage.getItem('jwtToken');
        const response = fetch('http://localhost:8000/api/auth/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        });

        if (response.ok) {
            console.log(response.data);
        } else {
        }

    return null;
};