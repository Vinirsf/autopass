import { supabase } from './supabase.js';

const cpfInput = document.getElementById('cpf');
const botoesPagamento = document.querySelectorAll('.btn-pagamento');
const btnCancelar = document.getElementById('cancelar');

// Valida CPF/CNPJ (somente números, entre 11 e 14 dígitos)
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

        const { data: session } = await supabase.auth.getSession();
        const user = session?.session?.user;
        if (!user) {
            alert("Você precisa estar logado.");
            return;
        }

        // Obtem dados da URL
        const params = new URLSearchParams(window.location.search);
        const dataSelecionada = params.get('data');
        const horaSelecionada = params.get('hora');

        // Atualiza agendamento existente
        const { error } = await supabase
            .from('agendamentos')
            .update({
                pagamento: {
                    metodo,
                    status: "confirmado",
                    cpf
                }
            })
            .eq('usuario_id', user.id)
            .eq('data', dataSelecionada)
            .eq('hora', horaSelecionada);

        if (error) {
            alert("Erro ao registrar pagamento: " + error.message);
        } else {
            alert(`Pagamento via ${metodo.toUpperCase()} confirmado!`);
            window.location.href = '/meus-agendamentos.html';
        }
    });
});

btnCancelar.addEventListener('click', () => {
    if (confirm("Deseja cancelar o pagamento?")) {
        window.location.href = '/inicio.html';
    }
});
