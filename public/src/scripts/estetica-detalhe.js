import { supabase } from './supabase.js';

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const nomeEl = document.getElementById('nome');
const enderecoEl = document.getElementById('endereco');
const notaEl = document.getElementById('nota');
const listaServicos = document.getElementById('lista-servicos');
const btnAgendar = document.getElementById('btn-agendar');

async function carregarEstabelecimento() {
    const { data, error } = await supabase
        .from('lavagens')
        .select('*')
        .eq('id', id)
        .eq('tipo', 'estetica') // <- Filtra só os de estética
        .single();

    if (error || !data) {
        nomeEl.textContent = 'Estabelecimento não encontrado.';
        return;
    }

    nomeEl.textContent = data.nome;
    enderecoEl.textContent = `📍 ${data.endereco}`;
    notaEl.textContent = `Avaliação: ${data.nota ?? 'N/D'}`;

    if (data.servicos && data.servicos.length > 0) {
        data.servicos.forEach(servico => {
            const li = document.createElement('li');
            li.textContent = `✔ ${servico.nome} - R$ ${servico.preco}`;
            listaServicos.appendChild(li);
        });
    } else {
        listaServicos.innerHTML = '<li>Nenhum serviço cadastrado.</li>';
    }

    btnAgendar.onclick = () => {
        window.location.href = `/agendar-estetica.html?id=${data.id}`;
    };
}

carregarEstabelecimento();
