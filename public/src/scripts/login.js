import { supabase } from './supabase.js';

const form = document.getElementById('login-form');
const showPassword = document.getElementById('show-password');
const passwordField = document.getElementById('password');

// Mostrar/ocultar senha
showPassword.addEventListener('change', () => {
    passwordField.type = showPassword.checked ? 'text' : 'password';
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert('Erro ao entrar: ' + error.message);
        return;
    }

    alert('Login realizado com sucesso!');
    window.location.href = '/inicio.html'; // Página após login (a criar ainda)
});

import { supabase } from './supabase.js';

const googleBtn = document.getElementById('google-login');

googleBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });

    if (error) {
        console.error('Erro ao fazer login com Google:', error.message);
        alert('Erro ao fazer login com Google.');
    }
});

