import { supabase } from './supabase.js';

async function carregarAgendamentos() {
    const container = document.getElementById('lista-agendamentos');
    const { data: session } = await supabase.auth.getSession();
    const user = session?.session?.user;

    if (!user) {
        container.innerHTML = '<p>Você precisa estar logado.</p>';
        return;
    }

    const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('usuario_id', user.id)
        .order('data', { ascending: false });

    if (error) {
        container.innerHTML = '<p>Erro ao carregar agendamentos.</p>';
        return;
    }

    if (data.length === 0) {
        container.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
        return;
    }

    container.innerHTML = data.map(item => `
    <div class="agendamento">
      <strong>${item.servico}</strong> - ${item.data} às ${item.hora}<br/>
      Valor: R$${item.preco.toFixed(2)}<br/>
      Pagamento: ${item.pagamento?.metodo?.toUpperCase() || 'N/A'} (${item.pagamento?.status || 'pendente'})
    </div>
  `).join('');
}

carregarAgendamentos();

const { data, error } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('usuario_id', user.id)
    .order('data', { ascending: false });

console.log("Dados carregados:", data);
