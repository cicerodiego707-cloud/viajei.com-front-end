const API_URL = 'http://localhost:3000/api';

// ============================================================================
// 1. INTEGRAÇÃO DA TELA DE LOGIN (index.html)
// ============================================================================
const loginForm = document.getElementById('login-form'); // Ajuste o ID se necessário

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('usuario_viajei', JSON.stringify(data.usuario));
                window.location.href = 'dashboard.html';
            } else {
                alert(data.error || 'Erro ao realizar login.');
            }
        } catch (err) {
            alert('Erro de conexão com o servidor da API.');
        }
    });
}

// ============================================================================
// 2. INTEGRAÇÃO DO DASHBOARD DE DESTINOS DO PIAUÍ (dashboard.html)
// ============================================================================
const destinosContainer = document.getElementById('destinos-container'); // Container dos cards

async function carregarDestinos(categoria = '') {
    if (!destinosContainer) return;

    try {
        const url = categoria ? `${API_URL}/destinos?categoria=${categoria}` : `${API_URL}/destinos`;
        const response = await fetch(url);
        const data = await response.json();

        destinosContainer.innerHTML = '';

        data.destinos.forEach(destino => {
            const card = document.createElement('div');
            card.className = 'destino-card';
            card.innerHTML = `
                <h3>${destino.nome}</h3>
                <p><strong>Cidade:</strong> ${destino.cidade} (${destino.categoria})</p>
                <p><strong>Valor:</strong> R$ ${destino.preco.toFixed(2)}</p>
                <p>⭐ Avaliação: ${destino.avaliacao}</p>
                <button onclick="avaliarDestino(${destino.id})">Avaliar Pacote</button>
            `;
            destinosContainer.appendChild(card);
        });
    } catch (err) {
        destinosContainer.innerHTML = '<p>Erro ao carregar destinos turísticos.</p>';
    }
}

// 3. ENVIAR AVALIAÇÃO DO DESTINO PARA A API
async function avaliarDestino(id) {
    const nota = prompt('Dê uma nota de 1 a 5 para este destino no Piauí:');
    const comentario = prompt('Deixe um breve comentário:');
    if (!nota) return;

    try {
        const response = await fetch(`${API_URL}/destinos/${id}/avaliacoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nota: parseInt(nota), comentario })
        });
        const data = await response.json();
        alert(data.message || data.error);
    } catch (err) {
        alert('Falha ao enviar avaliação.');
    }
}

// Carrega os pacotes automaticamente ao abrir o dashboard
document.addEventListener('DOMContentLoaded', () => carregarDestinos());
