const dias = document.querySelectorAll('.dia');
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

// horários simulados
const horariosDisponiveis = ["10:00", "11:00", "13:00"];

dias.forEach((botaoDia) => {
    botaoDia.addEventListener('click', () => {
        const dataSelecionada = botaoDia.dataset.dia;
        selecionado.data = dataSelecionada;
        selecionado.horario = null;

        horariosContainer.innerHTML = `
      <h4>Horários disponíveis:</h4>
      <div class="horarios-lista">
        ${horariosDisponiveis.map(hora => `<button class="hora-btn" data-hora="${hora}">${hora}</button>`).join("")}
      </div>
    `;

        document.querySelectorAll('.hora-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selecionado.horario = btn.dataset.hora;
                atualizarResumo();
            });
        });

        atualizarResumo();
    });
});

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
