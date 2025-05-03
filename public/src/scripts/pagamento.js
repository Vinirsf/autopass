import { supabase } from './supabase.js';

const cpfInput = document.getElementById('cpf');
const botoesPagamento = document.querySelectorAll('.btn-pagamento');
const btnCancelar = document.getElementById('cancelar');

// Função para validar CPF/CNPJ
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

        // Salva agendamento com método de pagamento
        const { error } = await supabase.from('agendamentos').insert([{
            usuario_id: user.id,
            servico,
            data,
            hora,
            preco,
            pagamento: {
                metodo,
                status: metodo === "local" ? "pendente" : "confirmado",
                cpf
            }
        }]);

        if (error) {
            alert("Erro ao salvar agendamento: " + error.message);
        } else {
            const msg = metodo === "local"
                ? "Agendamento salvo. Pagamento será feito no local."
                : `Pagamento via ${metodo.toUpperCase()} confirmado!`;

            alert(msg);
            window.location.href = '/meus-agendamentos.html';
        }
    });
});

btnCancelar.addEventListener('click', () => {
    if (confirm("Deseja cancelar o pagamento?")) {
        window.location.href = '/inicio.html';
    }
});
