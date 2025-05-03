const cpfInput = document.getElementById('cpf');
const botoesPagamento = document.querySelectorAll('.btn-pagamento');
const btnCancelar = document.getElementById('cancelar');

botoesPagamento.forEach(btn => {
    btn.addEventListener('click', () => {
        const metodo = btn.dataset.metodo;
        const cpf = cpfInput.value.trim();

        if (!cpf.match(/^\d{11,14}$/)) {
            alert("Digite um CPF ou CNPJ válido (somente números).");
            return;
        }

        // Aqui você pode integrar com seu backend ou gateway de pagamento.
        alert(`Pagamento por ${metodo.toUpperCase()} processado com CPF/CNPJ: ${cpf}`);
        window.location.href = '/inicio.html';
    });
});

btnCancelar.addEventListener('click', () => {
    if (confirm("Deseja cancelar o pagamento?")) {
        window.location.href = '/inicio.html';
    }
});
