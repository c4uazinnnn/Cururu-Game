class Fase02 extends Phaser.Scene {
    constructor() {
        super({ key: 'Fase02' }); // Define a chave da cena como 'Fase02'
        this.pulos = 0; // Controla a quantidade de pulos do personagem
        this.pulando = false; // Indica se o personagem está pulando
    }

    preload() {
        // Carrega as spritesheets do personagem e dos elementos do jogo
        this.load.spritesheet('player', 'img/Ninja Frog/Idle.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('jump', 'img/Ninja Frog/Jump.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('doubleJump', 'img/Ninja Frog/DoubleJump.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('plataforma', 'img/plat/plataforma.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('chao', 'img/plat/chao.png'); // Imagem do chão
        this.load.spritesheet('abacaxi', 'img/Item/Pineapple.png', { frameWidth: 32, frameHeight: 32 }); // Fruta coletável
    }

    create() {
        let larguraJogo = this.sys.game.config.width; // Largura do jogo
        let alturaJogo = this.sys.game.config.height; // Altura do jogo

        // Adiciona o personagem ao jogo
        this.sapo = this.physics.add.sprite(100, alturaJogo - 150, 'player');
        this.sapo.setCollideWorldBounds(true); // Impede que o personagem saia dos limites da tela
        this.sapo.setDragX(600); // Define o atrito no eixo X
        this.sapo.setMaxVelocity(200, 400); // Velocidade máxima

        // Animações do personagem
        this.anims.create({
            key: 'andar',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'pulo',
            frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 1 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'double_jump',
            frames: this.anims.generateFrameNumbers('doubleJump', { start: 0, end: 6 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'abacaxi',
            frames: this.anims.generateFrameNumbers('abacaxi', { start: 0, end: 17 }),
            frameRate: 11,
            repeat: -1
        });

        // Criação do chão
        this.chao = this.physics.add.staticGroup();
        const posicoesChao = [45, 130, 220, 310, 400, 490, 580, 670, 760, 850, 940, 1030, 1120, 1200];
        posicoesChao.forEach(x => {
            this.chao.create(x, alturaJogo - 10, 'chao').setScale(2, 1).refreshBody();
        });

        // Criação das plataformas
        this.plataformas = this.physics.add.staticGroup();
        const plataformasData = [
            { x: 100, y: 450 },
            { x: 300, y: 370 },
            { x: 700, y: 340 },
            { x: 90, y: 270 },
            { x: 950, y: 270 },
            { x: 1150, y: 350 },
            { x: 850, y: 270 },
            { x: 510, y: 450 }
        ];
        plataformasData.forEach(pos => {
            let plat = this.plataformas.create(pos.x, pos.y, 'plataforma');
            plat.setFrame(0);
        });

        // Criação dos abacaxis (itens coletáveis)
        this.abacaxis = this.physics.add.group();
        const posicoesAbacaxi = [500, 600, 700, 400, 100, 300, 200, 800, 900, 1100];
        posicoesAbacaxi.forEach(x => {
            let abacaxi = this.abacaxis.create(x, 0, 'abacaxi');
            abacaxi.anims.play('abacaxi', true);
        });

        // Adiciona colisão entre os elementos do jogo
        this.physics.add.collider(this.abacaxis, this.chao);
        this.physics.add.collider(this.abacaxis, this.plataformas);

        // Reseta os pulos quando o personagem toca nas plataformas
        this.physics.add.collider(this.sapo, this.plataformas, () => {
            if (this.sapo.body.touching.down) {
                this.pulos = 0;
                this.pulando = false;
            }
        });

        // Reseta os pulos quando o personagem toca no chão
        this.physics.add.collider(this.sapo, this.chao, () => {
            this.pulos = 0;
            this.pulando = false;
        });

        // Inicializa o placar
        this.pontos = 0;
        this.placar = this.add.text(20, 20, 'Pontos: 0', {
            fontSize: '20px',
            fill: '#fff'
        });

        // Evento de coleta dos abacaxis
        this.physics.add.overlap(this.sapo, this.abacaxis, (sapo, abacaxi) => {
            abacaxi.disableBody(true, true); // Remove o abacaxi da tela
            this.pontos += 10; // Adiciona pontos
            this.placar.setText('Pontos: ' + this.pontos);
        });

        // Configurações do teclado
        this.teclado = this.input.keyboard.createCursorKeys();

        // Configuração da animação de pulo duplo
        this.sapo.on('animationcomplete', (anim) => {
            if (anim.key === 'double_jump') {
                this.sapo.anims.play('pulo', true);
                this.pulando = false;
            }
        });
    }

    update() {
        let noAr = !this.sapo.body.blocked.down; // Verifica se o personagem está no ar

        // Movimento para a esquerda
        if (this.teclado.left.isDown) {
            this.sapo.setVelocityX(-180);
            if (!noAr) this.sapo.anims.play('andar', true);
            this.sapo.flipX = true;
        }
        // Movimento para a direita
        else if (this.teclado.right.isDown) {
            this.sapo.setVelocityX(180);
            if (!noAr) this.sapo.anims.play('andar', true);
            this.sapo.flipX = false;
        }
        // Se não estiver pressionando nenhuma tecla de movimento
        else {
            this.sapo.setVelocityX(0);
            if (!noAr) this.sapo.setFrame(0);
        }

        // Lógica de pulo e pulo duplo
        if (Phaser.Input.Keyboard.JustDown(this.teclado.up)) {
            if (this.pulos === 0 || (this.pulos === 1 && noAr)) {
                this.sapo.setVelocityY(-250);
                this.sapo.anims.play(this.pulos === 0 ? 'pulo' : 'double_jump', true);
                this.pulos++;
            }
        }

        // Se o jogador atingir 100 pontos, muda para a cena 'Final'
        if (this.pontos == 100) {
            this.scene.start('Final');
        }
    }
}

// Configuração do jogo
var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 570,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false // Desativa a depuração
        }
    },
    scene: [Fase02] // Define a cena inicial
};
