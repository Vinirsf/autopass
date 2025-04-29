import { supabase } from './supabase.js';

const form = document.getElementById('register-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // 1. Cria o usuário no Auth
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (signupError) {
        alert('Erro ao cadastrar: ' + signupError.message);
        return;
    }

    const user = signupData.user;

    if (user) {
        // 2. Insere o nome completo na tabela users
        const { error: insertError } = await supabase
            .from('users')
            .insert([
                { id: user.id, full_name: fullName }
            ]);

        if (insertError) {
            alert('Erro ao salvar perfil: ' + insertError.message);
        } else {
            alert('Conta criada com sucesso!');
            window.location.href = '/login.html';
        }
    }
});
