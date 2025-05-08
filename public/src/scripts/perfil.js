import { supabase } from './supabase.js';

let userId = null;

// Carrega dados do usuário e preenche os campos
async function carregarPerfil() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        alert("Você precisa estar logado.");
        window.location.href = '/login.html';
        return;
    }

    userId = user.id;

    const { data: profile, error: perfilErro } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (perfilErro) {
        console.error('Erro ao buscar perfil:', perfilErro.message);
        return;
    }

    document.getElementById('nome').value = profile.full_name || '';
    document.getElementById('email').value = user.email;
    document.getElementById('telefone').value = profile.telefone || '';
    document.getElementById('endereco').value = profile.endereco || '';
    document.getElementById('codigo').value = profile.codigo || '0000';
    document.getElementById('localizacao').checked = profile.localizacao ?? true;
    document.getElementById('senha').value = profile.senha ? profile.senha : '********';

    const avatarUrl = profile.avatar_url || '/src/assets/images/user-default.png';
    document.getElementById('avatar-preview').src = avatarUrl;
}

// Alternar visibilidade da senha
document.getElementById('ver-senha').addEventListener('change', (e) => {
    const senhaInput = document.getElementById('senha');
    senhaInput.type = e.target.checked ? 'text' : 'password';
});

// Ativa edição de campos com botão ✏
document.querySelectorAll('.editar').forEach(btn => {
    btn.addEventListener('click', () => {
        const campo = document.getElementById(btn.dataset.campo);
        campo.disabled = false;
        campo.focus();

        campo.addEventListener('blur', async () => {
            const novoValor = campo.value;
            const campoSupabase = btn.dataset.campo === 'nome' ? 'full_name' : btn.dataset.campo;

            const { error } = await supabase
                .from('users')
                .update({ [campoSupabase]: novoValor })
                .eq('id', userId);

            if (error) {
                alert(`Erro ao salvar ${campoSupabase}`);
            }

            campo.disabled = true;
        }, { once: true });
    });
});

// Upload de imagem de perfil
document.getElementById('input-foto').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = `${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase
        .storage
        .from('usuarios')
        .upload(`avatars/${fileName}`, file, { upsert: true });

    if (uploadError) {
        alert("Erro ao enviar imagem.");
        return;
    }

    const { data } = supabase.storage.from('usuarios').getPublicUrl(`avatars/${fileName}`);
    const avatarUrl = data.publicUrl;

    const { error } = await supabase
        .from('users')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId);

    if (!error) {
        document.getElementById('avatar-preview').src = avatarUrl;
    }
});

// Atualizar permissão de localização
document.getElementById('localizacao').addEventListener('change', async (e) => {
    await supabase
        .from('users')
        .update({ localizacao: e.target.checked })
        .eq('id', userId);
});

// Sair da conta
document.getElementById('sair-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
});

document.getElementById('priv').addEventListener('click', async () => {
    window.location.href = '/priv.html';
});

// Excluir conta
document.getElementById('excluir-conta').addEventListener('click', async () => {
    const confirmar = confirm("Deseja mesmo excluir sua conta?");
    if (!confirmar) return;

    await supabase.from('users').delete().eq('id', userId);
    await supabase.auth.signOut();
    alert("Conta excluída.");
    window.location.href = '/';
});

carregarPerfil();

