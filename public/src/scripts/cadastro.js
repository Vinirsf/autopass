import { supabase } from './supabase.js';

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

    const user = data?.user;

    if (user) {
        // Atualiza o nome completo na tabela 'users' (assumindo que a trigger já inseriu o usuário)
        const { error: updateError } = await supabase
            .from('users')
            .update({ full_name: fullName })
            .eq('id', user.id);

        if (updateError) {
            console.error('Erro ao atualizar perfil:', updateError);
            alert('Usuário criado, mas houve um problema ao salvar o nome.');
            return;
        }
    }

    alert('Conta criada com sucesso! Verifique seu e-mail para ativar a conta.');
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
