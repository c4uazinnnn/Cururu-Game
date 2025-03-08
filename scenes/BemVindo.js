// Defina suas cenas aqui
class BemVindo extends Phaser.Scene {
    constructor() {
        super({key: 'BemVindo'});  // Define a chave da cena como 'BemVindo'
    }

    preload() {
        // Carrega as imagens utilizadas na cena
        this.load.image('startButton', 'img/play.png'); // Botão para iniciar o jogo
        this.load.image('chao', 'img/plat/chao.png'); // Imagem do chão (não utilizada nesta cena)
        this.load.image('Cururu', 'img/Cururu.png'); // Tela com as instruções do jogo
    }

    create() {
        let alturaJogo = this.sys.game.config.height; // Obtém a altura do jogo (usada para definir a posição do chão)

        // Cria o botão de início do jogo e torna ele interativo
        let button = this.add.image(600, 300, 'startButton').setInteractive().setScale(1); 
        button.on('pointerdown', () => {
            this.scene.start('Tutorial'); // Muda para a cena 'Tutorial' ao clicar no botão
        });

        // Cria a imagem de instruções (Cururu)
        this.Cururu = this.add.image(600, 250, 'Cururu').setScale(1.5); 
        
        // Cria o grupo estático para o chão
        this.chao = this.physics.add.staticGroup();

        // Define as posições do chão na tela
        const posicoesChao = [45, 130, 220, 310, 400, 490, 580, 670, 760, 850, 940, 1030, 1120, 1200];
        // Cria os objetos de chão nas posições definidas
        posicoesChao.forEach(x => {
            this.chao.create(x, alturaJogo - 10, 'chao').setScale(2, 1).refreshBody(); // Ajusta o tamanho do chão e atualiza o corpo físico
        });
    }
}
