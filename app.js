const usuarios = 'https://randomuser.me/api/?results=15&nat=br';
const publi = 'https://jsonplaceholder.typicode.com/posts';
const comentario = 'https://jsonplaceholder.typicode.com/comments';

let dadosDashboard = {
    usuarios: [],
    publi: [],
    comentario: [],
    graficoInteracoes: {},
    segmentos: {}
}

//Recebe os dados da API
async function fetchDados() {
    try {
        const [usuariosResponse, publiResponse, comentarioResponse] = await Promise.all([
            fetch(usuarios),
            fetch(publi),
            fetch(comentario)
        ]);

        const dadosUsuario = await usuariosResponse.json();
        dadosDashboard.usuarios = dadosUsuario.results;

        dadosDashboard.publi = await publiResponse.json();
        dadosDashboard.comentario = await comentarioResponse.json()

        attDashboard();
        criaGrafico();

    } catch (error) {
        console.error('Erro ao enviar os dados', error);
    }
}

//Atualiza os dados do dashboard
function attDashboard() {

    //Atualiza as estatísticas 
    document.getElementById('totalUsuarios').textContent = dadosDashboard.usuarios.length;
    document.getElementById('totalPublicacoes').textContent = dadosDashboard.publi.length;
    document.getElementById('totalComentario').textContent = dadosDashboard.comentario.length;
    document.getElementById('usuariosAtivos').textContent = Math.floor(dadosDashboard.usuarios.length * 0.5);

    //Atualiza a tabela dos usuários recentes
    const tableBody = document.getElementById("usuariosRecentes");
    tableBody.innerHTML = dadosDashboard.usuarios.map(usuarios => `
        <tr>
            <td><img src="${usuarios.picture.thumbnail}" alt="${usuarios.name.first}"></td>
            <td>${usuarios.name.first} ${usuarios.name.last}</td>
            <td>${usuarios.email}</td>
            <td>${usuarios.location.city}, ${usuarios.location.country}</td>
        </tr>
    `).join('');

}

function criaGrafico() {

    //Gráfico de interações mensais (Linha)
    const interacoesGC = document.getElementById("graficoInteracoes").getContext('2d');
    new Chart(interacoesGC, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Usuários Ativos',
                data: [65, 72, 86, 81, 90, 95],
                borderColor: '#4c6ef5',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    //Gráficos de segmentos (Pizza)
    const segmentosGC = document.getElementById('segmentos').getContext('2d');
    new Chart(segmentosGC, {
        type: 'doughnut',
        data: {
            labels: ['Tecnologia', 'Esportes', 'Jogos', 'Saúde', 'Outros'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    '#4c6ef5',
                    '#37b24d',
                    '#f59f00',
                    '#f03e3e',
                    '#868e96'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

fetchDados();


