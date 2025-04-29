import { supabase } from './supabase.js';

// Exibe o nome do usuário logado
async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const { data, error } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', user.id)
            .single();

        if (data && data.full_name) {
            document.getElementById('user-name').textContent = data.full_name;
        } else {
            // Se não tiver registro, mostra nome do Auth
            document.getElementById('user-name').textContent = user.email.split('@')[0];
        }
    }
}

// Logout
const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
});

loadUser();
