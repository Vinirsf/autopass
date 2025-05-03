import { supabase } from './supabase.js';

async function carregarAgendamentos() {
    const container = document.getElementById('lista-agendamentos');

    if (!container) {
        console.error('Elemento #lista-agendamentos não encontrado.');
        return;
    }

    // Obter sessão e usuário autenticado
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    const user = session?.session?.user;

    if (sessionError || !user) {
        container.innerHTML = '<p>Você precisa estar logado.</p>';
        return;
    }

    console.log("🟡 Usuário logado:", user.id);

    // Buscar agendamentos do usuário
    const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('usuario_id', user.id)
        .order('data', { ascending: false });

    console.log("📦 Agendamentos recebidos:", data);
    if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        container.innerHTML = '<p>Erro ao carregar agendamentos.</p>';
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
        return;
    }

    // Renderizar lista
    container.innerHTML = data.map(item => `
    <div class="agendamento">
      <strong>${item.servico}</strong><br/>
      Data: ${item.data} às ${item.hora}<br/>
      Valor: R$${item.preco?.toFixed(2) || '0,00'}<br/>
      Pagamento: ${item.pagamento?.metodo?.toUpperCase() || 'N/A'} (${item.pagamento?.status || 'pendente'})
    </div>
  `).join('');
}

carregarAgendamentos();
