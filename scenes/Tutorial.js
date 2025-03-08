// Defina suas cenas aqui
class Tutorial extends Phaser.Scene {
    constructor() {
        super({key: 'Tutorial'}); // Define a chave da cena como 'Tutorial'
    }

    preload() {
        // Carrega as imagens utilizadas na cena
        this.load.image('startButton1', 'img/Play01.png'); // Botão para iniciar o jogo
        this.load.image('chao', 'img/plat/chao.png'); // Imagem do chão (não utilizada nesta cena)
        this.load.image('Tutorial', 'img/telas/Tutorial.png'); // Tela com as instruções do jogo
    }

    create() {
        let alturaJogo = this.sys.game.config.height; // Obtém a altura do jogo 

        // Adiciona a imagem do tutorial ao fundo
        this.add.image(600, 300, 'Tutorial').setScale(0.5);

        // Adiciona o botão para iniciar a fase
        let button = this.add.image(900, 470, 'startButton1').setInteractive().setScale(2);

        // Configura o evento de clique no botão para iniciar a primeira fase
        button.on('pointerdown', () => {
            this.scene.start('Fase01'); // Muda para a cena 'Fase01'
        });
    }
}
