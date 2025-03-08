// Defina suas cenas aqui
class Final extends Phaser.Scene {
    constructor() {
        super({key: 'Final'}); // Define a chave da cena como 'Final'
    }

    preload() {
        // Carrega as imagens utilizadas na cena
        this.load.image('startButton1', 'img/Play01.png'); // Botão de reinício
        this.load.image('chao', 'img/plat/chao.png'); // Imagem do chão (não utilizada na cena)
        this.load.image('Fim', 'img/telas/Fim.png'); // Tela de fim de jogo
    }

    create() {
        let alturaJogo = this.sys.game.config.height; // Obtém a altura do jogo (não utilizada)

        // Adiciona a imagem da tela de fim ao fundo
        this.add.image(600, 300, 'Fim').setScale(0.5);

        // Adiciona o botão para voltar ao BemVindo
        let button = this.add.image(900, 470, 'startButton1').setInteractive().setScale(2);

        // Configura o evento de clique no botão para trocar para a cena BemVindo
        button.on('pointerdown', () => {
            this.scene.start('BemVindo'); // Muda para a cena inicial
        });
    }
}
