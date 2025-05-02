import { supabase } from './supabase.js';

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const nomeEl = document.getElementById('nome');
const enderecoEl = document.getElementById('endereco');
const notaEl = document.getElementById('nota');
const distanciaEl = document.getElementById('distancia');
const listaServicos = document.getElementById('lista-servicos');
const btnAgendar = document.getElementById('btn-agendar');

let servicoSelecionado = null;

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
    distanciaEl.style.display = 'none';

    if (data.servicos?.length) {
        data.servicos.forEach((servico, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${servico.nome}</strong> - R$ ${servico.preco}`;
            li.style.cursor = 'pointer';
            li.onclick = () => {
                servicoSelecionado = servico;
                btnAgendar.disabled = false;
                btnAgendar.textContent = `Agendar ${servico.nome}`;
            };
            listaServicos.appendChild(li);
        });
    } else {
        listaServicos.innerHTML = '<li>Este local ainda não cadastrou serviços.</li>';
    }

    btnAgendar.onclick = () => {
        if (!servicoSelecionado) return;
        const params = new URLSearchParams({
            id,
            servico: servicoSelecionado.nome,
            preco: servicoSelecionado.preco
        }).toString();
        window.location.href = `/agendar-lavage.html?${params}`;
    };
}

carregarEstabelecimento();
