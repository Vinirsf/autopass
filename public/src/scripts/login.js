import { supabase } from './supabase.js';

const form = document.getElementById('login-form');
const showPassword = document.getElementById('show-password');
const passwordField = document.getElementById('password');

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
    window.location.href = '/home.html'; // Você pode direcionar para o dashboard depois
});
