import { supabase } from './supabase.js';

async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();

    const nameEl = document.getElementById('user-name');
    const avatarEl = document.getElementById('user-avatar');

    if (!user) return;

    const { data, error } = await supabase
        .from('users')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

    const fullName = data?.full_name || user.email.split('@')[0];
    nameEl.textContent = fullName;

    if (data?.avatar_url) {
        avatarEl.src = data.avatar_url;
    }
}

function setupActions() {
    const perfilBtn = document.getElementById('user-button');
    const logoutBtn = document.getElementById('logoutBtn');

    if (perfilBtn) {
        perfilBtn.addEventListener('click', () => {
            window.location.href = '/perfil.html';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.location.href = '/login.html';
        });
    }
}

// Aguarde o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    setupActions();
});
 
