import { supabase } from './supabase.js';

const listaEl = document.getElementById('agendamentos-list');

async function carregarAgendamentos() {
    const { data: session } = await supabase.auth.getSession();
    const user = session?.session?.user;

    if (!user) {
        listaEl.innerHTML = `<p>Você precisa estar logado.</p>`;
        return;
    }

    const { data, error } = await supabase
        .from('agendamentos')
        .select('*, lavagens(nome)')
        .eq('usuario_id', user.id)
        .order('data', { ascending: true });

    if (error) {
        listaEl.innerHTML = `<p>Erro ao carregar agendamentos.</p>`;
        return;
    }

    if (data.length === 0) {
        listaEl.innerHTML = `<p>Você ainda não tem agendamentos.</p>`;
        return;
    }

    listaEl.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'agendamento-card';

        const nomeEstabelecimento = item.lavagens?.nome || 'Estabelecimento';

        card.innerHTML = `
    <h3>${item.servico}</h3>
    <p><span>Local:</span> ${nomeEstabelecimento}</p>
    <p><span>Data:</span> ${formatarData(item.data)}</p>
    <p><span>Hora:</span> ${item.hora}</p>
    <p><span>Valor:</span> R$${item.preco?.toFixed(2)}</p>
    `;

        listaEl.appendChild(card);
    });
}

function formatarData(iso) {
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}`;
}

carregarAgendamentos();
