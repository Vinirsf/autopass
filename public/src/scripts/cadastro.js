import { supabase } from './supabase.js';

const form = document.getElementById('register-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        alert('Erro ao cadastrar: ' + error.message);
        return;
    }

    const user = data.user;

    // Inserir no banco o nome completo
    await supabase
        .from('users')
        .insert([
            { id: user.id, full_name: fullName }
        ]);

    alert('Conta criada com sucesso!');
    window.location.href = '/login.html'; // Redireciona para o login
});
