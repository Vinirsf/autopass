import { supabase } from './supabase.js';

const container = document.getElementById('lista-mecanica');
const useLocationBtn = document.getElementById('use-location');
const manualInput = document.getElementById('manual-location');

useLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            // substituir com chamada para Supabase futuramente
            container.innerHTML = `<p>Localização: ${latitude}, ${longitude}</p>`;
        });
    } else {
        alert('Geolocalização não suportada.');
    }
});

manualInput.addEventListener('change', () => {
    const local = manualInput.value;
    alert(`Busca manual: ${local} (a ser implementado)`);
});
