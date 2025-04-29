import { supabase } from './supabase.js';

// Cadastro por email e senha
const form = document.getElementById('register-form');
const googleBtn = document.getElementById('google-login');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Cria o usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        alert('Erro ao criar usuário: ' + error.message);
        return;
    }

    const user = data.user;

    if (user) {
        // Insere o nome completo na tabela users
        const { error: insertError } = await supabase
            .from('users')
            .insert([
                { id: user.id, full_name: fullName }
            ]);

        if (insertError) {
            console.error('Erro ao salvar perfil:', insertError);
        }
    }

    alert('Conta criada com sucesso!');
    window.location.href = '/login.html';
});

// Login com Google
googleBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });

    if (error) {
        console.error('Erro ao fazer login com Google:', error.message);
        alert('Erro ao fazer login com Google.');
    }
});
