const gameData = {
    animais: {
        easy: [
            { word: "GATO", hints: ["Faz miau", "Gosta de peixe", "Animal doméstico"] },
            { word: "CÃO", hints: ["Melhor amigo", "Late", "Gosta de osso"] },
            { word: "LEÃO", hints: ["Rei da selva", "Tem juba", "Vive na África"] },
            { word: "PATO", hints: ["Diz quá-quá", "Tem bico chato", "Gosta de água"] }
        ],
        medium: [
            { word: "CAVALO", hints: ["Usado para cavalgar", "Relincha", "Tem ferraduras"] },
            { word: "GIRAFA", hints: ["Tem pescoço longo", "Amarela com manchas", "Come folhas"] },
            { word: "TARTARUGA", hints: ["É muito lenta", "Tem casco", "Pode viver no mar"] },
            { word: "TUBARÃO", hints: ["Predador do mar", "Tem dentes afiados", "Filme Jaws"] }
        ],
        hard: [
            { word: "ORNITORRINCO", hints: ["Põe ovos", "Mora na Austrália", "Bico de pato"] },
            { word: "CAMALEÃO", hints: ["Muda de cor", "Língua comprida", "Olhos independentes"] },
            { word: "ESCARAVELHO", hints: ["Um tipo de besouro", "Antigo Egito", "Rola bolas de esterco"] },
            { word: "HIPOPÓTAMO", hints: ["Muito pesado", "Vive na água e terra", "Boca enorme"] }
        ]
    },
    alimentos: {
        easy: [
            { word: "UVA", hints: ["Fruta pequena", "Dá em cachos", "Faz vinho"] },
            { word: "PÃO", hints: ["Comemos no café", "Vem da padaria", "Feito de farinha"] },
            { word: "OVO", hints: ["A galinha põe", "É branco ou marrom", "Tem gema"] },
            { word: "MAÇÃ", hints: ["Fruta da Branca de Neve", "Pode ser vermelha ou verde", "Newton e a gravidade"] }
        ],
        medium: [
            { word: "BANANA", hints: ["Macaco adora", "É amarela", "Rica em potássio"] },
            { word: "PIZZA", hints: ["Comida italiana", "Redonda", "Tem queijo"] },
            { word: "LASANHA", hints: ["Muitas camadas", "Massa e molho", "Comida de domingo"] },
            { word: "AÇÚCAR", hints: ["Adoça o café", "Vem da cana", "Branco ou mascavo"] }
        ],
        hard: [
            { word: "ESPAGUETE", hints: ["Macarrão comprido", "Comer com garfo", "Dama e o Vagabundo"] },
            { word: "STROGONOFE", hints: ["Carne com creme", "Tem batata palha", "Prato famoso no Brasil"] },
            { word: "BERINJELA", hints: ["Legume roxo", "Pode fazer antepasto", "Textura macia"] },
            { word: "GUACAMOLE", hints: ["Prato mexicano", "Feito de abacate", "Comido com nachos"] }
        ]
    },
    tecnologia: {
        easy: [
            { word: "SITE", hints: ["Endereço na web", "WWW", "Página online"] },
            { word: "CHAT", hints: ["Conversa online", "Mensagens instantâneas", "Bate-papo"] },
            { word: "MOUSE", hints: ["Usa no PC", "Tem botão", "Não é o rato"] }
        ],
        medium: [
            { word: "CELULAR", hints: ["No seu bolso", "Tem apps", "Faz ligação"] },
            { word: "INTERNET", hints: ["Rede mundial", "Wi-fi", "Navegação"] },
            { word: "NOTEBOOK", hints: ["PC portátil", "Tem bateria", "Fecha como livro"] }
        ],
        hard: [
            { word: "ALGORITMO", hints: ["Passo a passo", "Lógica de PC", "Receita de código"] },
            { word: "CRIPTOGRAFIA", hints: ["Código secreto", "Segurança", "Dados embaralhados"] },
            { word: "METAVERSO", hints: ["Mundo virtual", "Realidade aumentada", "Futuro da web"] }
        ]
    },
    paises: {
        easy: [
            { word: "BRASIL", hints: ["Onde moramos", "Tem Carnaval", "Ordem e Progresso"] },
            { word: "JAPÃO", hints: ["Terra do sol nascente", "Tem sushi", "Ásia"] },
            { word: "ITÁLIA", hints: ["Formato de bota", "Tem massa", "Europa"] }
        ],
        medium: [
            { word: "CANADÁ", hints: ["Folha de ácer", "Frio e neve", "América do Norte"] },
            { word: "FRANÇA", hints: ["Torre Eiffel", "Tem baguete", "Paris"] },
            { word: "MÉXICO", hints: ["Tem taco e nachos", "Sombreiro", "América Latina"] }
        ],
        hard: [
            { word: "AUSTRÁLIA", hints: ["Tem cangurus", "Sydney", "Ilha-continente"] },
            { word: "EGITO", hints: ["Tem pirâmides", "Rio Nilo", "Faraós"] },
            { word: "TAILÂNDIA", hints: ["Sudeste asiático", "Templos lindos", "Comida apimentada"] }
        ]
    }
};

let currentSelectedTheme = null;
let currentSelectedDifficulty = 'easy';
let playerName = "";
const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
const themeMap = { animais: '🐾 ANIMAIS', alimentos: '🍎 ALIMENTOS', tecnologia: '💻 TECNOLOGIA', paises: '🌎 PAÍSES' };

class HangmanGameV5 {
    constructor() {
        this.ctx = document.getElementById('hangmanCanvas').getContext('2d');
        this.wordDisplay = document.getElementById('word-display');
        this.messageDisplay = document.getElementById('message');
        this.scoreDisplay = document.getElementById('score');
        this.keyboardContainer = document.getElementById('keyboard');
        this.hintArea = document.getElementById('hint-area');
        this.hintText = document.getElementById('hint-text');
        this.hintBtn = document.getElementById('hint-btn');
        this.restartBtn = document.getElementById('restart-btn');

        this.currentWordObj = null;
        this.currentWord = "";
        this.normalizedWord = "";
        this.guessedLetters = new Set();
        this.wrongGuesses = 0;
        this.maxWrongGuesses = 6;
        this.score = 0;
        this.gameActive = false;
        this.hintsUsed = 0;

        this.initEventListeners();
        this.initLoginLogic();
    }

    initEventListeners() {
        this.hintBtn.addEventListener('click', () => this.useHint());
        this.restartBtn.addEventListener('click', () => {
            document.getElementById('selection-overlay').classList.remove('hidden');
            this.backToThemes();
        });

        document.addEventListener('keydown', (e) => {
            if (!this.gameActive) return;
            const letter = e.key.toUpperCase();
            if (/^[A-Z]$/.test(letter)) this.handleGuess(letter);
        });
    }

    initLoginLogic() {
        const nickInput = document.getElementById('initial-nickname');
        const passInput = document.getElementById('initial-password');
        const btn = document.getElementById('login-btn');

        const validate = () => {
            const isNickValid = nickInput.value.trim().length >= 2;
            const isPassValid = passInput.value.trim().length >= 4;
            btn.disabled = !(isNickValid && isPassValid);
        };

        nickInput.addEventListener('input', validate);
        passInput.addEventListener('input', validate);

        nickInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') passInput.focus();
        });

        passInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !btn.disabled) confirmNickname();
        });
    }

    backToThemes() {
        document.getElementById('theme-selection').classList.remove('hidden');
        document.getElementById('difficulty-selection').classList.add('hidden');
        document.getElementById('modal-title').textContent = "ESCOLHA O TEMA";
    }

    setTheme(theme) {
        currentSelectedTheme = theme;
        document.getElementById('theme-selection').classList.add('hidden');
        document.getElementById('difficulty-selection').classList.remove('hidden');
        document.getElementById('modal-title').textContent = "ESCOLHA A DIFICULDADE";
    }

    setDifficulty(diff) {
        currentSelectedDifficulty = diff;
        document.getElementById('selection-overlay').classList.add('hidden');

        document.getElementById('current-theme').textContent = themeMap[currentSelectedTheme];
        const diffLabel = document.getElementById('current-difficulty');
        diffLabel.textContent = diff.toUpperCase();
        diffLabel.className = `badge diff-badge ${diff}`;

        this.startGame();
    }

    startGame() {
        this.gameActive = true;
        this.wrongGuesses = 0;
        this.hintsUsed = 0;
        this.guessedLetters.clear();

        const possibleWords = gameData[currentSelectedTheme][currentSelectedDifficulty];
        this.currentWordObj = possibleWords[Math.floor(Math.random() * possibleWords.length)];
        this.currentWord = this.currentWordObj.word.toUpperCase();
        this.normalizedWord = normalize(this.currentWord);

        this.messageDisplay.textContent = "";
        this.hintArea.classList.add('hidden');
        this.hintBtn.disabled = false;
        this.hintBtn.textContent = "PEDIR DICA (-10pts)";

        this.createKeyboard();
        this.clearCanvas();
        this.drawGallows();
        this.updateDisplay();
    }

    createKeyboard() {
        this.keyboardContainer.innerHTML = '';
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').forEach(letter => {
            const btn = document.createElement('button');
            btn.textContent = letter;
            btn.classList.add('key-btn');
            btn.dataset.letter = letter;
            btn.addEventListener('click', () => this.handleGuess(letter));
            this.keyboardContainer.appendChild(btn);
        });
    }

    handleGuess(guess) {
        if (!this.gameActive || this.guessedLetters.has(guess)) return;

        this.guessedLetters.add(guess);
        const btn = document.querySelector(`.key-btn[data-letter="${guess}"]`);

        if (this.normalizedWord.includes(guess)) {
            if (btn) { btn.classList.add('correct'); btn.disabled = true; }
            this.updateDisplay();
            this.checkWin();
        } else {
            if (btn) { btn.classList.add('wrong'); btn.disabled = true; }
            this.wrongGuesses++;
            this.drawThemedCharacter(this.wrongGuesses);
            this.checkLoss();
        }
    }

    updateDisplay() {
        this.wordDisplay.innerHTML = this.currentWord.split('').map((letter, index) => {
            const isRevealed = this.guessedLetters.has(this.normalizedWord[index]);
            return `
                <div class="letter-slot ${isRevealed ? 'revealed' : ''}">
                    ${isRevealed ? letter : ''}
                </div>
            `;
        }).join('');
    }

    useHint() {
        if (!this.gameActive || this.hintsUsed >= 3) return;
        const hints = this.currentWordObj.hints;
        if (hints && hints[this.hintsUsed]) {
            this.hintText.textContent = hints[this.hintsUsed];
            this.hintArea.classList.remove('hidden');
            this.hintsUsed++;
            this.score = Math.max(0, this.score - 10);
            this.scoreDisplay.textContent = this.score;
            if (this.hintsUsed >= hints.length) {
                this.hintBtn.disabled = true;
                this.hintBtn.textContent = "SEM DICAS";
            }
        }
    }

    checkWin() {
        if (this.normalizedWord.split('').every(l => this.guessedLetters.has(l))) {
            const bonus = { easy: 20, medium: 50, hard: 100 }[currentSelectedDifficulty];
            this.score += bonus;
            this.scoreDisplay.textContent = this.score;
            this.gameActive = false;
            showSaveModal("🎉 VOCÊ SALVOU O BONECO! 🎉", `Sua pontuação final foi: ${this.score}`);
        }
    }

    checkLoss() {
        if (this.wrongGuesses >= this.maxWrongGuesses) {
            this.gameActive = false;
            this.normalizedWord.split('').forEach(l => this.guessedLetters.add(l));
            this.updateDisplay();
            showSaveModal("💀 O BONECO FOI PEGO!", `A palavra era: ${this.currentWord}. <br> Pontuação: ${this.score}`);
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, 350, 350);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = '#2d3436';
        this.ctx.lineCap = 'round';
    }

    drawGallows() {
        this.ctx.beginPath(); this.ctx.lineWidth = 5; this.ctx.strokeStyle = "#8e44ad";
        this.ctx.moveTo(50, 300); this.ctx.lineTo(250, 300);
        this.ctx.moveTo(100, 300); this.ctx.lineTo(100, 50);
        this.ctx.lineTo(250, 50); this.ctx.lineTo(250, 80);
        this.ctx.stroke();
    }

    drawThemedCharacter(stage) {
        if (currentSelectedTheme === 'animais') this.drawGatinho(stage);
        else if (currentSelectedTheme === 'alimentos') this.drawBiscoito(stage);
        else if (currentSelectedTheme === 'tecnologia') this.drawRobo(stage);
        else if (currentSelectedTheme === 'paises') this.drawTurista(stage);
        else this.drawFunnyHangman(stage); // Fallback
    }

    // --- PERSONAGENS TEMÁTICOS ---

    drawGatinho(stage) {
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "#2d3436";
        switch (stage) {
            case 1: // Cabeça + Orelhas
                this.ctx.beginPath(); this.ctx.arc(250, 110, 25, 0, Math.PI * 2); this.ctx.fillStyle = "#dfe6e9"; this.ctx.fill(); this.ctx.stroke();
                // Orelhas
                this.ctx.beginPath(); this.ctx.moveTo(230, 95); this.ctx.lineTo(225, 75); this.ctx.lineTo(245, 90); this.ctx.fill(); this.ctx.stroke();
                this.ctx.beginPath(); this.ctx.moveTo(270, 95); this.ctx.lineTo(275, 75); this.ctx.lineTo(255, 90); this.ctx.fill(); this.ctx.stroke();
                break;
            case 2: // Rosto (Olhos e Bigodes)
                this.ctx.fillStyle = "black";
                this.ctx.beginPath(); this.ctx.arc(240, 105, 3, 0, Math.PI * 2); this.ctx.fill();
                this.ctx.beginPath(); this.ctx.arc(260, 105, 3, 0, Math.PI * 2); this.ctx.fill();
                // Bigodes
                this.ctx.beginPath(); this.ctx.moveTo(230, 115); this.ctx.lineTo(210, 110); this.ctx.stroke();
                this.ctx.beginPath(); this.ctx.moveTo(230, 120); this.ctx.lineTo(210, 125); this.ctx.stroke();
                this.ctx.beginPath(); this.ctx.moveTo(270, 115); this.ctx.lineTo(290, 110); this.ctx.stroke();
                this.ctx.beginPath(); this.ctx.moveTo(270, 120); this.ctx.lineTo(290, 125); this.ctx.stroke();
                break;
            case 3: // Corpo
                this.ctx.beginPath(); this.ctx.ellipse(250, 170, 30, 40, 0, 0, Math.PI * 2); this.ctx.fillStyle = "#dfe6e9"; this.ctx.fill(); this.ctx.stroke();
                break;
            case 4: // Patas Frontais
                this.ctx.beginPath(); this.ctx.moveTo(230, 180); this.ctx.lineTo(220, 210); this.ctx.stroke();
                this.ctx.beginPath(); this.ctx.moveTo(270, 180); this.ctx.lineTo(280, 210); this.ctx.stroke();
                break;
            case 5: // Patas Traseiras
                this.ctx.beginPath(); this.ctx.moveTo(235, 205); this.ctx.lineTo(225, 240); this.ctx.stroke();
                this.ctx.beginPath(); this.ctx.moveTo(265, 205); this.ctx.lineTo(275, 240); this.ctx.stroke();
                break;
            case 6: // Cauda
                this.ctx.beginPath(); this.ctx.moveTo(275, 185); this.ctx.quadraticCurveTo(310, 185, 310, 150); this.ctx.stroke();
                break;
        }
    }

    drawBiscoito(stage) {
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = "#e67e22"; // Marrom biscoito
        this.ctx.fillStyle = "#d35400";
        switch (stage) {
            case 1: // Cabeça
                this.ctx.beginPath(); this.ctx.arc(250, 110, 25, 0, Math.PI * 2); this.ctx.fill(); this.ctx.stroke();
                // Olhos de glacê
                this.ctx.fillStyle = "white";
                this.ctx.beginPath(); this.ctx.arc(242, 105, 3, 0, Math.PI * 2); this.ctx.fill();
                this.ctx.beginPath(); this.ctx.arc(258, 105, 3, 0, Math.PI * 2); this.ctx.fill();
                break;
            case 2: // Tronco
                this.ctx.fillStyle = "#d35400";
                this.ctx.beginPath(); this.ctx.roundRect(230, 135, 40, 60, 10); this.ctx.fill(); this.ctx.stroke();
                break;
            case 3: // Braço Esquerdo
                this.ctx.beginPath(); this.ctx.moveTo(230, 150); this.ctx.lineTo(200, 170); this.ctx.stroke();
                break;
            case 4: // Braço Direito
                this.ctx.beginPath(); this.ctx.moveTo(270, 150); this.ctx.lineTo(300, 170); this.ctx.stroke();
                break;
            case 5: // Perna Esquerda
                this.ctx.beginPath(); this.ctx.moveTo(240, 195); this.ctx.lineTo(230, 240); this.ctx.stroke();
                break;
            case 6: // Perna Direita + Botões de Cereja
                this.ctx.beginPath(); this.ctx.moveTo(260, 195); this.ctx.lineTo(270, 240); this.ctx.stroke();
                // Botões
                this.ctx.fillStyle = "#e74c3c";
                this.ctx.beginPath(); this.ctx.arc(250, 155, 4, 0, Math.PI * 2); this.ctx.fill();
                this.ctx.beginPath(); this.ctx.arc(250, 175, 4, 0, Math.PI * 2); this.ctx.fill();
                break;
        }
    }

    drawRobo(stage) {
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "#34495e";
        this.ctx.fillStyle = "#95a5a6";
        switch (stage) {
            case 1: // Cabeça Quadrada + Antena
                this.ctx.beginPath(); this.ctx.roundRect(230, 85, 40, 40, 5); this.ctx.fill(); this.ctx.stroke();
                // Antena
                this.ctx.beginPath(); this.ctx.moveTo(250, 85); this.ctx.lineTo(250, 70); this.ctx.stroke();
                this.ctx.beginPath(); this.ctx.arc(250, 65, 4, 0, Math.PI * 2); this.ctx.fillStyle = "#e74c3c"; this.ctx.fill(); this.ctx.stroke();
                break;
            case 2: // Corpo com Tela
                this.ctx.fillStyle = "#95a5a6";
                this.ctx.beginPath(); this.ctx.roundRect(220, 130, 60, 70, 5); this.ctx.fill(); this.ctx.stroke();
                // Tela
                this.ctx.fillStyle = "#2ecc71";
                this.ctx.beginPath(); this.ctx.roundRect(230, 140, 40, 30, 2); this.ctx.fill();
                break;
            case 3: // Braço Mecânico 1
                this.ctx.beginPath(); this.ctx.moveTo(220, 150); this.ctx.lineTo(190, 150); this.ctx.lineTo(190, 180); this.ctx.stroke();
                break;
            case 4: // Braço Mecânico 2
                this.ctx.beginPath(); this.ctx.moveTo(280, 150); this.ctx.lineTo(310, 150); this.ctx.lineTo(310, 180); this.ctx.stroke();
                break;
            case 5: // Esteira Esquerda
                this.ctx.fillStyle = "#2c3e50";
                this.ctx.beginPath(); this.ctx.ellipse(230, 210, 15, 8, 0, 0, Math.PI * 2); this.ctx.fill(); this.ctx.stroke();
                break;
            case 6: // Esteira Direita
                this.ctx.fillStyle = "#2c3e50";
                this.ctx.beginPath(); this.ctx.ellipse(270, 210, 15, 8, 0, 0, Math.PI * 2); this.ctx.fill(); this.ctx.stroke();
                break;
        }
    }

    drawTurista(stage) {
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "#2d3436";
        switch (stage) {
            case 1: // Cabeça + Chapéu de Sol
                this.ctx.beginPath(); this.ctx.arc(250, 110, 20, 0, Math.PI * 2); this.ctx.fillStyle = "#ffeaa7"; this.ctx.fill(); this.ctx.stroke();
                // Chapéu
                this.ctx.fillStyle = "#f1c40f";
                this.ctx.beginPath(); this.ctx.ellipse(250, 95, 30, 10, 0, 0, Math.PI * 2); this.ctx.fill(); this.ctx.stroke();
                break;
            case 2: // Camisa Florida
                this.ctx.fillStyle = "#00cec9";
                this.ctx.beginPath(); this.ctx.roundRect(230, 130, 40, 60, 5); this.ctx.fill(); this.ctx.stroke();
                // Flores na camisa
                this.ctx.fillStyle = "white";
                this.ctx.beginPath(); this.ctx.arc(240, 150, 3, 0, Math.PI * 2); this.ctx.fill();
                this.ctx.beginPath(); this.ctx.arc(260, 170, 3, 0, Math.PI * 2); this.ctx.fill();
                break;
            case 3: // Braço com Câmera
                this.ctx.beginPath(); this.ctx.moveTo(230, 150); this.ctx.lineTo(200, 160); this.ctx.stroke();
                // Câmera
                this.ctx.fillStyle = "#2d3436";
                this.ctx.beginPath(); this.ctx.rect(190, 155, 15, 10); this.ctx.fill();
                break;
            case 4: // Braço com Mapa
                this.ctx.beginPath(); this.ctx.moveTo(270, 150); this.ctx.lineTo(300, 160); this.ctx.stroke();
                // Mapa
                this.ctx.fillStyle = "white";
                this.ctx.beginPath(); this.ctx.rect(300, 150, 20, 25); this.ctx.fill(); this.ctx.stroke();
                break;
            case 5: // Pernas com Shorts
                this.ctx.fillStyle = "#e17055";
                this.ctx.beginPath(); this.ctx.rect(230, 190, 15, 30); this.ctx.fill(); this.ctx.stroke();
                this.ctx.beginPath(); this.ctx.rect(255, 190, 15, 30); this.ctx.fill(); this.ctx.stroke();
                break;
            case 6: // Chinelos + Bandeira
                this.ctx.fillStyle = "#fab1a0";
                this.ctx.beginPath(); this.ctx.rect(225, 220, 25, 5); this.ctx.fill();
                this.ctx.beginPath(); this.ctx.rect(250, 220, 25, 5); this.ctx.fill();
                // Bandeira no chão
                this.ctx.beginPath(); this.ctx.moveTo(210, 300); this.ctx.lineTo(210, 250); this.ctx.stroke();
                this.ctx.fillStyle = "#e74c3c";
                this.ctx.beginPath(); this.ctx.rect(210, 250, 20, 15); this.ctx.fill(); this.ctx.stroke();
                break;
        }
    }

    drawFunnyHangman(stage) {
        // Fallback for character of V3 (slightly simplified for reuse)
        this.ctx.strokeStyle = "#2d3436"; this.ctx.lineWidth = 3;
        switch (stage) {
            case 1: this.ctx.beginPath(); this.ctx.arc(250, 110, 30, 0, Math.PI * 2); this.ctx.fillStyle = "#ffccaa"; this.ctx.fill(); this.ctx.stroke(); break;
            case 2: this.ctx.fillStyle = "#ff7675"; this.ctx.beginPath(); this.ctx.moveTo(250, 140); this.ctx.lineTo(220, 200); this.ctx.lineTo(280, 200); this.ctx.closePath(); this.ctx.fill(); this.ctx.stroke(); break;
            case 3: this.ctx.beginPath(); this.ctx.moveTo(235, 150); this.ctx.lineTo(200, 120); this.ctx.stroke(); break;
            case 4: this.ctx.beginPath(); this.ctx.moveTo(265, 150); this.ctx.lineTo(300, 120); this.ctx.stroke(); break;
            case 5: this.ctx.fillStyle = "#74b9ff"; this.ctx.beginPath(); this.ctx.rect(220, 200, 25, 60); this.ctx.fill(); this.ctx.stroke(); break;
            case 6: this.ctx.fillStyle = "#74b9ff"; this.ctx.beginPath(); this.ctx.rect(255, 200, 25, 60); this.ctx.fill(); this.ctx.stroke(); break;
        }
    }
}

let game;
window.onload = () => { game = new HangmanGameV5(); };

// Bridge functions
function confirmNickname() {
    const nickInput = document.getElementById('initial-nickname');
    const passInput = document.getElementById('initial-password');

    playerName = nickInput.value.trim();
    const playerPassword = passInput.value.trim();

    if (playerName.length < 2 || playerPassword.length < 4) {
        alert("Por favor, preencha o usuário (mín. 2 letras) e senha (mín. 4 caracteres).");
        return;
    }

    document.getElementById('login-overlay').classList.add('hidden');
    document.getElementById('selection-overlay').classList.remove('hidden');
    document.getElementById('player-tag').textContent = `👤 ${playerName.toUpperCase()}`;
    document.getElementById('display-player-name').textContent = playerName;
}

function selectTheme(theme) { game.setTheme(theme); }
function selectDifficulty(diff) { game.setDifficulty(diff); }
function backToThemes() { game.backToThemes(); }

function showSaveModal(title, msg) {
    document.getElementById('end-title').textContent = title;
    document.getElementById('end-message').innerHTML = msg;
    document.getElementById('save-score-overlay').classList.remove('hidden');
}

function closeSaveModal() {
    document.getElementById('save-score-overlay').classList.add('hidden');
}

// Local Storage Keys
const STORAGE_KEY = 'hangman_rankings';

async function saveScore() {
    if (!playerName) return alert("Erro: Nickname não encontrado!");

    const newScore = {
        name: playerName,
        score: game.score,
        theme: themeMap[currentSelectedTheme],
        difficulty: currentSelectedDifficulty,
        date: new Date().toISOString()
    };

    try {
        // 1. Get existing rankings
        const existingData = localStorage.getItem(STORAGE_KEY);
        let rankings = existingData ? JSON.parse(existingData) : [];

        // 2. Add new score
        rankings.push(newScore);

        // 3. Sort by score (descending)
        rankings.sort((a, b) => b.score - a.score);

        // 4. Keep only top 10
        rankings = rankings.slice(0, 10);

        // 5. Save back to Local Storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rankings));

        alert("Pontuação salva com sucesso (Local)!");
        closeSaveModal();
        toggleRanking(true);

    } catch (err) {
        console.error("Erro ao salvar localmente:", err);
        alert("Erro ao salvar pontuação.");
    }
}

async function toggleRanking(show) {
    const overlay = document.getElementById('ranking-overlay');
    if (show) {
        overlay.classList.remove('hidden');
        const list = document.getElementById('ranking-list');
        list.innerHTML = "Carregando...";

        try {
            // Read from Local Storage
            const existingData = localStorage.getItem(STORAGE_KEY);
            const data = existingData ? JSON.parse(existingData) : [];

            list.innerHTML = data.map((item, i) => `
                <div class="ranking-item">
                    <span>${i + 1}. ${item.name}</span>
                    <span>${item.score} pts (Nível: ${item.difficulty})</span>
                </div>
            `).join('') || "Nenhuma pontuação registrada ainda.";
        } catch (err) {
            console.error(err);
            list.innerHTML = "Erro ao carregar ranking.";
        }
    } else {
        overlay.classList.add('hidden');
    }
}
