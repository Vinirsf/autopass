import { supabase } from './supabase.js';

async function carregarPerfil() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const enderecoInput = document.getElementById('endereco');
    const telefoneInput = document.getElementById('telefone');
    const codigoInput = document.getElementById('codigo');
    const avatarImg = document.getElementById('avatar-preview');

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (data) {
        nomeInput.value = data.full_name || '';
        emailInput.value = user.email;
        senhaInput.value = '••••••••';
        enderecoInput.value = data.endereco || '';
        telefoneInput.value = data.telefone || '';
        codigoInput.value = data.codigo || '0000';
        if (data.avatar_url) avatarImg.src = data.avatar_url;
    }
}

// ativar edição ao clicar no botão ✏️
document.querySelectorAll('.editar').forEach(btn => {
    btn.addEventListener('click', () => {
        const campo = document.getElementById(btn.dataset.campo);
        campo.disabled = !campo.disabled;
        if (!campo.disabled) campo.focus();
    });
});

// upload de imagem
document.getElementById('input-foto').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('usuarios')
        .upload(filePath, file);

    if (uploadError) {
        alert('Erro ao enviar imagem.');
        return;
    }

    const { data } = supabase.storage.from('usuarios').getPublicUrl(filePath);

    await supabase
        .from('users')
        .update({ avatar_url: data.publicUrl })
        .eq('id', (await supabase.auth.getUser()).data.user.id);

    document.getElementById('avatar-preview').src = data.publicUrl;
});

document.getElementById('sair-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
});

document.getElementById('excluir-conta').addEventListener('click', async () => {
    const confirmacao = confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.');
    if (!confirmacao) return;

    const { user } = (await supabase.auth.getUser()).data;

    await supabase.from('users').delete().eq('id', user.id);
    await supabase.auth.admin.deleteUser(user.id); // se autorizado
    alert('Conta excluída.');
    window.location.href = '/';
});

carregarPerfil();
