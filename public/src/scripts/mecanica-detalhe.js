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
        .from('lavagens') // usando a mesma tabela, com tipo 'mecanica'
        .select('*')
        .eq('id', id)
        .eq('tipo', 'mecanica')
        .single();

    if (error || !data) {
        nomeEl.textContent = 'Oficina não encontrada.';
        return;
    }

    nomeEl.textContent = data.nome;
    enderecoEl.textContent = `📍 ${data.endereco}`;
    notaEl.textContent = `Avaliação: ${data.nota ?? 'N/D'}`;

    if (data.servicos && data.servicos.length > 0) {
        data.servicos.forEach(servico => {
            const li = document.createElement('li');
            li.textContent = `🔧 ${servico.nome} - R$ ${servico.preco}`;
            listaServicos.appendChild(li);
        });
    } else {
        listaServicos.innerHTML = '<li>Esta oficina ainda não cadastrou serviços.</li>';
    }

    btnAgendar.onclick = () => {
        window.location.href = `/agendar-servico.html?id=${data.id}`;
    };
}

carregarEstabelecimento();
