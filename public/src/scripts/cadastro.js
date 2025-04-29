import { supabase } from './supabase.js';

const form = document.getElementById('register-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        alert('Erro ao criar conta: ' + error.message);
        return;
    }

    const userId = data?.user?.id;

    if (userId) {
        const { error: insertError } = await supabase
            .from('users')
            .insert([{ id: userId, full_name: fullName }]);

        if (insertError) {
            alert('Erro ao salvar perfil: ' + insertError.message);
        } else {
            alert('Conta criada com sucesso!');
            window.location.href = '/login.html';
        }
    } else {
        alert('Erro: usuário não criado corretamente.');
    }
});
