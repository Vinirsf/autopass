import { supabase } from './supabase.js';

const diasContainer = document.getElementById('dias-do-mes');
const mesAtualTitulo = document.getElementById('mes-atual');
const horariosContainer = document.getElementById('horarios-disponiveis');
const resumoEl = document.getElementById('resumo');
const btnConfirmar = document.getElementById('btn-confirmar');

const estabelecimentoId = new URLSearchParams(window.location.search).get('id');

let selecionado = {
    data: null,
    horario: null,
    preco: 30.0,
    modelo: "Sedan",
    servico: "Lavagem"
};

function formatarData(iso) {
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}`;
}

function atualizarResumo() {
    if (selecionado.data && selecionado.horario) {
        resumoEl.innerHTML = `
      <strong>Resumo:</strong><br/>
      ${selecionado.servico} - ${formatarData(selecionado.data)} - ${selecionado.horario}<br/>
      Modelo: ${selecionado.modelo}<br/>
      Valor: <span class="preco">R$${selecionado.preco.toFixed(2)}</span>
    `;
        btnConfirmar.disabled = false;
    } else {
        resumoEl.textContent = "Selecione uma data e horário.";
        btnConfirmar.disabled = true;
    }
}

async function buscarHorariosDisponiveis(dataSelecionada) {
    const { data, error } = await supabase
        .from('disponibilidade')
        .select('horario')
        .eq('data', dataSelecionada)
        .eq('disponivel', true)
        .eq('estabelecimento_id', estabelecimentoId);

    if (error) {
        console.warn("Erro ao buscar horários:", error.message);
        return gerarHorariosPadrao();
    }

    return (data?.length > 0)
        ? data.map(h => h.horario)
        : gerarHorariosPadrao(); // fallback
}

function gerarHorariosPadrao() {
    return [
        "08:00", "09:00", "10:00", "11:00",
        "13:00", "14:00", "15:00", "16:00", "17:00"
    ];
}


function renderHorarios(horarios) {
    if (horarios.length === 0) {
        horariosContainer.innerHTML = `<p>Sem horários disponíveis para esta data.</p>`;
        return;
    }

    horariosContainer.innerHTML = `
    <h4>Horários disponíveis:</h4>
    <div class="horarios-lista">
      ${horarios.map(h => `<button class="hora-btn" data-hora="${h}">${h}</button>`).join('')}
    </div>
  `;

    document.querySelectorAll('.hora-btn').forEach(btn => {
        btn.onclick = () => {
            selecionado.horario = btn.dataset.hora;
            atualizarResumo();
        };
    });
}

function gerarCalendario() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();

    const nomesMes = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    mesAtualTitulo.textContent = `${nomesMes[mes]} ${ano}`;

    diasContainer.innerHTML = '';
    const offset = primeiroDia === 0 ? 6 : primeiroDia - 1;

    for (let i = 0; i < offset; i++) {
        diasContainer.innerHTML += `<div class="dia vazio"></div>`;
    }

    for (let d = 1; d <= diasNoMes; d++) {
        const data = new Date(ano, mes, d);
        const dataISO = data.toISOString().split('T')[0];
        const diaBtn = document.createElement('button');
        diaBtn.className = 'dia';
        diaBtn.textContent = d;
        diaBtn.dataset.dia = dataISO;

        diaBtn.onclick = async () => {
            selecionado.data = dataISO;
            selecionado.horario = null;
            const horarios = await buscarHorariosDisponiveis(dataISO);
            renderHorarios(horarios);
            atualizarResumo();
        };

        diasContainer.appendChild(diaBtn);
    }
}

btnConfirmar.addEventListener('click', async () => {
    const url = `/pagamento.html?servico=${selecionado.servico}&data=${selecionado.data}&hora=${selecionado.horario}&preco=${selecionado.preco}`;
    window.location.href = url;

    if (!user) {
        alert('Você precisa estar logado.');
        return;
    }

    const { error } = await supabase.from('agendamentos').insert([{
        usuario_id: user.id,
        estabelecimento_id: estabelecimentoId,
        data: selecionado.data,
        hora: selecionado.horario,
        servico: selecionado.servico,
        preco: selecionado.preco
    }]);

    if (!error) {
        await supabase
            .from('disponibilidade')
            .update({ disponivel: false })
            .eq('data', selecionado.data)
            .eq('horario', selecionado.horario)
            .eq('estabelecimento_id', estabelecimentoId);

        alert('Agendamento confirmado!');
        window.location.href = `/pagamento.html?servico=${selecionado.servico}&data=${selecionado.data}&hora=${selecionado.horario}&preco=${selecionado.preco}`;
    } else {
        alert('Erro ao agendar: ' + error.message);
    }
});

gerarCalendario();

