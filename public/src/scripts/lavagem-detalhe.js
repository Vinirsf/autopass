import { supabase } from './supabase.js';

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const nomeEl = document.getElementById('nome');
const enderecoEl = document.getElementById('endereco');
const notaEl = document.getElementById('nota');
const distanciaEl = document.getElementById('distancia');
const listaServicos = document.getElementById('lista-servicos');
const btnAgendar = document.getElementById('btn-agendar');

async function carregarEstabelecimento() {
    const { data, error } = await supabase
        .from('lavagens')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        alert('Estabelecimento não encontrado.');
        return;
    }

    nomeEl.textContent = data.nome;
    enderecoEl.textContent = `📍 ${data.endereco}`;
    notaEl.textContent = `Avaliação: ${data.nota ?? 'N/D'}`;
    distanciaEl.style.display = 'none'; // Distância pode ser adicionada futuramente

    if (data.servicos && data.servicos.length > 0) {
        data.servicos.forEach(servico => {
            const li = document.createElement('li');
            li.textContent = `✔ ${servico.nome} - R$ ${servico.preco}`;
            listaServicos.appendChild(li);
        });
    } else {
        listaServicos.innerHTML = '<li>Este local ainda não cadastrou serviços.</li>';
    }

    btnAgendar.onclick = () => {
        alert('Função de agendamento em breve!');
    };
}

carregarEstabelecimento();
