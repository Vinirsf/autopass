import { supabase } from './supabase.js';

const listContainer = document.getElementById('lista-estetica');
const useLocationBtn = document.getElementById('use-location');
const manualInput = document.getElementById('manual-location');

useLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            fetchEstabelecimentos(latitude, longitude, 'estetica');
        });
    } else {
        alert('Geolocalização não suportada neste navegador.');
    }
});

manualInput.addEventListener('change', async () => {
    alert(`Busca por localização manual ainda será implementada.`);
});

async function fetchEstabelecimentos(lat, lng, tipo) {
    const { data, error } = await supabase.rpc('lavagens_proximas', {
        user_lat: lat,
        user_lng: lng,
        servico_tipo: tipo
    });

    if (error) {
        console.error('Erro ao buscar estabelecimentos:', error);
        listContainer.innerHTML = `<p>Erro ao carregar estabelecimentos.</p>`;
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
      <a href="/estetica-detalhe.html?id=${estabelecimento.id}">Ver detalhes</a>
    `;
        listContainer.appendChild(div);
    });
}
