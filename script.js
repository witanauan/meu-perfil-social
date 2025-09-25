// Configuração do Supabase
const SUPABASE_URL = 'https://joziquvyefffpixhjkso.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvemlxdXZ5ZWZmZnBpeGhqa3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjUwMzYsImV4cCI6MjA3NDQwMTAzNn0.cFQ4uNQF6b5W0qkuTM6TI5JiQvv4J0yH0MyRWORxMo4';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Like button functionality with Supabase
document.addEventListener('DOMContentLoaded', async function() {
    const likeButton = document.getElementById('likeButton');
    const likeCount = document.getElementById('likeCount');
    
    // Gera um ID único para o visitante
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
        visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitorId', visitorId);
    }

    // Função para buscar o total de curtidas
    async function fetchLikes() {
        try {
            const { data, error } = await supabase
                .from('likes')
                .select('count')
                .single();
                
            if (error) throw error;
            return data ? data.count : 0;
        } catch (error) {
            console.error('Erro ao buscar curtidas:', error);
            return 0;
        }
    }

    // Função para verificar se o usuário já curtiu
    async function checkUserLiked() {
        try {
            const { data, error } = await supabase
                .from('user_likes')
                .select('*')
                .eq('visitor_id', visitorId)
                .single();
                
            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
            return !!data;
        } catch (error) {
            console.error('Erro ao verificar like:', error);
            return false;
        }
    }

    // Atualiza a interface
    async function updateUI() {
        const [totalLikes, hasLiked] = await Promise.all([
            fetchLikes(),
            checkUserLiked()
        ]);

        likeCount.textContent = totalLikes;
        const heart = likeButton.querySelector('.heart');
        
        if (hasLiked) {
            heart.textContent = '❤️';
            likeButton.classList.add('liked');
        } else {
            heart.textContent = '🤍';
            likeButton.classList.remove('liked');
        }
    }

    // Toggle like on click
    likeButton.addEventListener('click', async function() {
        const heart = likeButton.querySelector('.heart');
        const hasLiked = likeButton.classList.contains('liked');
        
        try {
            if (hasLiked) {
                // Remove o like
                const { error } = await supabase
                    .from('likes')
                    .update({ count: await fetchLikes() - 1 })
                    .eq('id', 1);
                
                if (error) throw error;
                
                // Remove o registro do usuário
                const { error: deleteError } = await supabase
                    .from('user_likes')
                    .delete()
                    .eq('visitor_id', visitorId);
                    
                if (deleteError) throw deleteError;
                
                heart.textContent = '🤍';
                likeButton.classList.remove('liked');
            } else {
                // Adiciona o like
                const { error } = await supabase
                    .from('likes')
                    .upsert([{ id: 1, count: (await fetchLikes()) + 1 }], {
                        onConflict: 'id'
                    });
                
                if (error) throw error;
                
                // Registra o usuário que curtiu
                const { error: insertError } = await supabase
                    .from('user_likes')
                    .insert([{ 
                        visitor_id: visitorId,
                        created_at: new Date().toISOString() 
                    }]);
                    
                if (insertError) throw insertError;
                
                heart.textContent = '❤️';
                likeButton.classList.add('liked');
            }
            
            // Atualiza a interface
            await updateUI();
            
            // Adiciona animação
            likeButton.classList.add('animate-like');
            setTimeout(() => {
                likeButton.classList.remove('animate-like');
            }, 300);
            
        } catch (error) {
            console.error('Erro ao atualizar like:', error);
            alert('Ocorreu um erro ao processar sua curtida. Tente novamente.');
        }
    });
    
    // Carrega os dados iniciais
    updateUI();
});
