import { supabase } from './supabase.js';

const form = document.getElementById('register-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Primeiro faz o signup
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
        // Agora insere o perfil só se o signup funcionou
        const { error: insertError } = await supabase
            .from('users')
            .insert([
                { id: user.id, full_name: fullName }
            ]);

        if (insertError) {
            console.error('Erro ao salvar perfil:', insertError);
            // 🔥 Correção: apenas logar o erro, não dar alert, pois o cadastro funcionou
        }
    }

    alert('Conta criada com sucesso!');
    window.location.href = '/login.html';
});
