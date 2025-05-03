import { supabase } from './supabase.js';

let userId = null;

// Carrega dados do usuário
async function carregarPerfil() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    userId = user.id;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (data) {
        document.getElementById('nome').value = data.full_name || '';
        document.getElementById('email').value = user.email;
        document.getElementById('endereco').value = data.endereco || '';
        document.getElementById('telefone').value = data.telefone || '';
        document.getElementById('codigo').value = data.codigo || '0000';
        document.getElementById('localizacao').checked = data.localizacao ?? true;

        if (data.avatar_url) {
            document.getElementById('avatar-preview').src = data.avatar_url;
        }
    }
}

// Ativa edição do campo
document.querySelectorAll('.editar').forEach(btn => {
    btn.addEventListener('click', () => {
        const campo = document.getElementById(btn.dataset.campo);
        campo.disabled = !campo.disabled;

        if (!campo.disabled) {
            campo.focus();

            campo.addEventListener('blur', async () => {
                const value = campo.value;

                const updates = {};
                updates[btn.dataset.campo === 'nome' ? 'full_name' : btn.dataset.campo] = value;

                const { error } = await supabase
                    .from('users')
                    .update(updates)
                    .eq('id', userId);

                if (error) {
                    alert('Erro ao salvar alteração.');
                }
                campo.disabled = true;
            }, { once: true });
        }
    });
});

// Atualiza permissão de localização
document.getElementById('localizacao').addEventListener('change', async (e) => {
    await supabase
        .from('users')
        .update({ localizacao: e.target.checked })
        .eq('id', userId);
});

// Upload de imagem de perfil
document.getElementById('input-foto').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop();
    const filePath = `avatars/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase
        .storage
        .from('usuarios')
        .upload(filePath, file, { upsert: true });

    if (uploadError) {
        alert('Erro ao enviar imagem.');
        return;
    }

    const { data } = supabase.storage.from('usuarios').getPublicUrl(filePath);

    await supabase
        .from('users')
        .update({ avatar_url: data.publicUrl })
        .eq('id', userId);

    document.getElementById('avatar-preview').src = data.publicUrl;
});

// Logout
document.getElementById('sair-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
});

// Exclusão de conta
document.getElementById('excluir-conta').addEventListener('click', async () => {
    if (!confirm('Tem certeza que deseja excluir sua conta?')) return;

    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('users').delete().eq('id', user.id);
    alert('Conta excluída.');
    window.location.href = '/';
});

carregarPerfil();
