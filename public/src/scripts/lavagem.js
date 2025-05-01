import { supabase } from './supabase.js';

const listContainer = document.getElementById('lavagens-list');
const useLocationBtn = document.getElementById('use-location');
const manualInput = document.getElementById('manual-location');

useLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            fetchLavagensProximas(latitude, longitude);
        });
    } else {
        alert('Geolocalização não suportada neste navegador.');
    }
});

manualInput.addEventListener('change', async () => {
    // Aqui futuramente poderemos usar uma API de geocoding (ex: Google Maps ou Mapbox)
    const cidade = manualInput.value;
    alert(`Busca por localização manual ainda será implementada. Você digitou: ${cidade}`);
});

async function fetchLavagensProximas(lat, lng) {
    const { data, error } = await supabase
        .rpc('lavagens_proximas', { user_lat: lat, user_lng: lng });

    if (error) {
        console.error('Erro ao buscar lavagens:', error);
        listContainer.innerHTML = `<p>Erro ao carregar lavagens.</p>`;
        return;
    }

    listContainer.innerHTML = '';
    data.forEach(estabelecimento => {
        const div = document.createElement('div');
        div.className = 'estabelecimento-card';
        div.innerHTML = `
    <h3>${estabelecimento.nome}</h3>
    <p>${estabelecimento.endereco}</p>
    <p>Distância: ${(estabelecimento.distancia / 1000).toFixed(1)} km</p>
    <a href="/lavagem-detalhe.html?id=${estabelecimento.id}">Ver detalhes</a>
    `;
        listContainer.appendChild(div);
    });
}
