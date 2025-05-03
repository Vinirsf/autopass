import { supabase } from './supabase.js';

const cpfInput = document.getElementById('cpf');
const botoesPagamento = document.querySelectorAll('.btn-pagamento');
const btnCancelar = document.getElementById('cancelar');

// Função auxiliar para validar CPF/CNPJ
function validarDocumento(doc) {
    return /^\d{11,14}$/.test(doc);
}

botoesPagamento.forEach(btn => {
    btn.addEventListener('click', async () => {
        const metodo = btn.dataset.metodo;
        const cpf = cpfInput.value.trim();

        if (!validarDocumento(cpf)) {
            alert("Digite um CPF ou CNPJ válido (somente números).");
            return;
        }

        // Pega os dados da URL
        const urlParams = new URLSearchParams(window.location.search);
        const servico = urlParams.get('servico');
        const data = urlParams.get('data');
        const hora = urlParams.get('hora');
        const preco = parseFloat(urlParams.get('preco'));

        const { data: session } = await supabase.auth.getSession();
        const user = session?.session?.user;

        if (!user) {
            alert("Você precisa estar logado.");
            return;
        }

        // Salva o agendamento com status de pagamento
        const { error } = await supabase.from('agendamentos').insert([{
            usuario_id: user.id,
            servico,
            data,
            hora,
            preco,
            pagamento: {
                metodo,
                status: "confirmado",
                cpf
            }
        }]);

        if (error) {
            alert("Erro ao salvar agendamento: " + error.message);
        } else {
            alert(`Pagamento via ${metodo.toUpperCase()} confirmado!`);
            window.location.href = '/meus-agendamentos.html';
        }
    });
});

// Cancelar pagamento
btnCancelar.addEventListener('click', () => {
    if (confirm("Deseja cancelar o pagamento e voltar?")) {
        window.location.href = '/inicio.html';
    }
});
