const diasContainer = document.getElementById('dias-do-mes');
const mesAtualTitulo = document.getElementById('mes-atual');
const horariosContainer = document.getElementById('horarios-disponiveis');
const resumoEl = document.getElementById('resumo');
const btnConfirmar = document.getElementById('btn-confirmar');

let selecionado = {
    data: null,
    horario: null,
    preco: 30.0,
    modelo: "Sedan",
    servico: "Lavagem"
};

const horariosDisponiveis = ["10:00", "11:00", "13:00"];

function gerarCalendario() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth(); // 0-11
    const primeiroDia = new Date(ano, mes, 1).getDay(); // 0-domingo
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();

    const nomesMes = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
        'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    mesAtualTitulo.textContent = `${nomesMes[mes]} ${ano}`;

    diasContainer.innerHTML = '';

    for (let i = 0; i < primeiroDia; i++) {
        diasContainer.innerHTML += `<div class="dia vazio"></div>`;
    }

    for (let d = 1; d <= diasNoMes; d++) {
        const data = new Date(ano, mes, d);
        const dataISO = data.toISOString().split('T')[0];
        const diaBtn = document.createElement('button');
        diaBtn.className = 'dia';
        diaBtn.textContent = d;
        diaBtn.dataset.dia = dataISO;

        diaBtn.onclick = () => {
            selecionado.data = dataISO;
            selecionado.horario = null;
            renderHorarios();
            atualizarResumo();
        };

        diasContainer.appendChild(diaBtn);
    }
}

function renderHorarios() {
    horariosContainer.innerHTML = `
    <h4>Horários disponíveis:</h4>
    <div class="horarios-lista">
      ${horariosDisponiveis.map(h => `<button class="hora-btn" data-hora="${h}">${h}</button>`).join('')}
    </div>
  `;

    document.querySelectorAll('.hora-btn').forEach(btn => {
        btn.onclick = () => {
            selecionado.horario = btn.dataset.hora;
            atualizarResumo();
        };
    });
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

function formatarData(iso) {
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}`;
}

gerarCalendario();
