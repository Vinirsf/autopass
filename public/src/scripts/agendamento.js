import { supabase } from './supabase.js';

const urlParams = new URLSearchParams(window.location.search);
const estabelecimentoId = urlParams.get('id');

const nomeEl = document.getElementById('estabelecimento-nome');
const servicoSelect = document.getElementById('servico');
const form = document.getElementById('form-agendamento');

async function carregarEstabelecimento() {
    const { data, error } = await supabase
        .from('lavagens')
        .select('*')
        .eq('id', estabelecimentoId)
        .single();

    if (error || !data) {
        nomeEl.textContent = 'Estabelecimento não encontrado.';
        return;
    }

    nomeEl.textContent = data.nome;

    if (data.servicos && data.servicos.length > 0) {
        data.servicos.forEach((s) => {
            const opt = document.createElement('option');
            opt.value = JSON.stringify(s); // envia o objeto como string
            opt.textContent = `${s.nome} - R$ ${s.preco}`;
            servicoSelect.appendChild(opt);
        });
    } else {
        servicoSelect.innerHTML = '<option>Sem serviços disponíveis</option>';
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { data: session } = await supabase.auth.getSession();
    const user = session?.session?.user;

    if (!user) {
        alert('Você precisa estar logado para agendar.');
        return;
    }

    const servicoSelecionado = JSON.parse(servicoSelect.value);
    const dataSelecionada = document.getElementById('data').value;
    const horaSelecionada = document.getElementById('hora').value;

    const { error } = await supabase.from('agendamentos').insert([
        {
            usuario_id: user.id,
            estabelecimento_id: estabelecimentoId,
            servico: servicoSelecionado.nome,
            preco: servicoSelecionado.preco,
            data: dataSelecionada,
            hora: horaSelecionada,
        },
    ]);

    if (error) {
        alert('Erro ao agendar: ' + error.message);
        return;
    }

    alert('Agendamento confirmado!');
    window.location.href = '/inicio.html';
});

carregarEstabelecimento();
