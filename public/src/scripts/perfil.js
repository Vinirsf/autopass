import { supabase } from './supabase.js';

let userId = null;

async function carregarPerfil() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        window.location.href = '/login.html';
        return;
    }

    userId = user.id;

    const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (profileError) {
        console.error('Erro ao carregar perfil:', profileError);
        return;
    }

    document.getElementById('nome').value = profile.full_name || '';
    document.getElementById('email').value = user.email;
    document.getElementById('endereco').value = profile.endereco || '';
    document.getElementById('telefone').value = profile.telefone || '';
    document.getElementById('codigo').value = profile.codigo || '0000';
    document.getElementById('localizacao').checked = profile.localizacao ?? true;

    const avatar = profile.avatar_url || '/src/assets/images/user-default.png';
    document.getElementById('avatar-preview').src = avatar;
}

// Habilita e salva edição dos campos
document.querySelectorAll('.editar').forEach(button => {
    button.addEventListener('click', () => {
        const campoId = button.dataset.campo;
        const campo = document.getElementById(campoId);
        campo.disabled = false;
        campo.focus();

        campo.addEventListener('blur', async () => {
            const valor = campo.value;
            const coluna = campoId === 'nome' ? 'full_name' : campoId;

            const { error } = await supabase
                .from('users')
                .update({ [coluna]: valor })
                .eq('id', userId);

            if (error) {
                alert('Erro ao salvar campo: ' + coluna);
            }

            campo.disabled = true;
        }, { once: true });
    });
});

// Permissão de localização
document.getElementById('localizacao').addEventListener('change', async (e) => {
    await supabase
        .from('users')
        .update({ localizacao: e.target.checked })
        .eq('id', userId);
});

// Upload de imagem
document.getElementById('input-foto').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('usuarios')
        .upload(filePath, file);

    if (uploadError) {
        alert('Erro ao enviar imagem.');
        return;
    }

    const { data } = supabase.storage.from('usuarios').getPublicUrl(filePath);

    const { error } = await supabase
        .from('users')
        .update({ avatar_url: data.publicUrl })
        .eq('id', userId);

    if (!error) {
        document.getElementById('avatar-preview').src = data.publicUrl;
    }
});

// Botão sair
document.getElementById('sair-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
});

// Botão excluir conta
document.getElementById('excluir-conta').addEventListener('click', async () => {
    const confirmar = confirm('Tem certeza que deseja excluir sua conta?');

    if (!confirmar) return;

    await supabase.from('users').delete().eq('id', userId);
    await supabase.auth.signOut();

    alert('Conta excluída com sucesso.');
    window.location.href = '/';
});

carregarPerfil();
