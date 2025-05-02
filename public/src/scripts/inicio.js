import { supabase } from './supabase.js';

async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const { data, error } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', user.id)
            .single();

        document.getElementById('user-name').textContent = data?.full_name || user.email.split('@')[0];
    }
}

document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
});

loadUser();

import { supabase } from './supabase.js';

async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();
    const avatar = document.getElementById('user-avatar');

    if (user) {
        const { data, error } = await supabase
            .from('users')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .single();

        const name = data?.full_name || user.email.split('@')[0];
        document.getElementById('user-name').textContent = name;

        if (data?.avatar_url) {
            avatar.src = data.avatar_url;
        }
    }
}

document.getElementById('user-button').addEventListener('click', () => {
    window.location.href = '/perfil.html'; // ou outra ação
});

loadUser();
