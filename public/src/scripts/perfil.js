import { supabase } from './supabase.js';

async function carregarPerfil() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    const nomeEl = document.getElementById('nome-usuario');
    const emailEl = document.getElementById('email-usuario');
    const fotoEl = document.getElementById('foto-usuario');

    emailEl.textContent = user.email;

    const { data, error } = await supabase
        .from('users')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

    if (data) {
        nomeEl.textContent = data.full_name || user.email.split('@')[0];
        if (data.avatar_url) {
            fotoEl.src = data.avatar_url;
        }
    }
}

document.getElementById('sair-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
});

carregarPerfil();
