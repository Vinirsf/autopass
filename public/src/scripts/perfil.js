import { supabase } from './supabase.js';

let originalData = {};

async function carregarPerfil() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return window.location.href = '/login.html';

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        alert('Erro ao carregar dados do perfil.');
        return;
    }

    originalData = data;

    document.getElementById('nome').value = data.full_name || '';
    document.getElementById('email').value = user.email;
    document.getElementById('senha').value = '••••••••';
    document.getElementById('endereco').value = data.endereco || '';
    document.getElementById('telefone').value = data.telefone || '';
    document.getElementById('codigo').value = data.codigo || '';

    if (data.avatar_url) {
        document.getElementById('avatar-preview').src = data.avatar_url;
    }

    document.getElementById('localizacao').checked = data.permitir_localizacao ?? true;
}

function ativarCampo(id) {
    const campo = document.getElementById(id);
    campo.disabled = false;
    campo.focus();
}

document.querySelectorAll('.editar').forEach(btn => {
    btn.addEventListener('click', () => {
        ativarCampo(btn.dataset.campo);
    });
});

document.getElementById('sair-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
});

document.getElementById('excluir-conta').addEventListener('click', async () => {
    const confirmar = confirm('Tem certeza que deseja excluir sua conta?');
    if (!confirmar) return;

    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('users').delete().eq('id', user.id);
    await supabase.auth.signOut();
    alert('Conta excluída.');
    window.location.href = '/';
});

document.getElementById('localizacao').addEventListener('change', async (e) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
        .from('users')
        .update({ permitir_localizacao: e.target.checked })
        .eq('id', user.id);
});

// Upload da foto de perfil
document.getElementById('input-foto').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop();
    const filePath = `avatars/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from('usuarios')
        .upload(filePath, file);

    if (uploadError) {
        alert('Erro ao enviar imagem');
        return;
    }

    const { data } = supabase.storage.from('usuarios').getPublicUrl(filePath);

    const { data: session } = await supabase.auth.getSession();
    await supabase
        .from('users')
        .update({ avatar_url: data.publicUrl })
        .eq('id', session.session.user.id);

    document.getElementById('avatar-preview').src = data.publicUrl;
});

// Salvar alterações (ativa botão se algo for modificado)
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        document.getElementById('salvar-dados')?.removeAttribute('disabled');
    });
});

document.body.insertAdjacentHTML('beforeend', `
  <div style="text-align: center; margin-top: 1rem;">
    <button id="salvar-dados" disabled style="padding: 0.8rem 2rem; border-radius: 20px; border: none; background: var(--yellow); font-size: 1rem;">Salvar Alterações</button>
  </div>
`);

document.getElementById('salvar-dados').addEventListener('click', async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const atualizados = {
        full_name: document.getElementById('nome').value,
        endereco: document.getElementById('endereco').value,
        telefone: document.getElementById('telefone').value,
    };

    const { error } = await supabase.from('users')
        .update(atualizados)
        .eq('id', user.id);

    if (error) {
        alert('Erro ao salvar alterações.');
    } else {
        alert('Informações salvas com sucesso!');
        document.getElementById('salvar-dados').disabled = true;
    }
});

carregarPerfil();
