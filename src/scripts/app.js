if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration.scope);
            })
            .catch(error => {
                console.log('Falha ao registrar o Service Worker:', error);
            });
    });
}

// Lógica do app irá aqui
document.getElementById('app').innerHTML = `<h1 style="color: var(--primary-color)">Bem-vindo ao AutoPass!</h1>`;
