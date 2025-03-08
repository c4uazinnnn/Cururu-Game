class Fase01 extends Phaser.Scene {
    constructor() {
        super({ key: 'Fase01' }); // Define a chave da cena como 'Fase01'
        this.pulos = 0; // Variável para controlar o número de pulos
        this.pulando = false; // Variável para verificar se o jogador está no ar
    }

    preload() {
        // Carrega as imagens e animações utilizadas na cena
        this.load.spritesheet('player', 'img/Ninja Frog/Idle.png', { frameWidth: 32, frameHeight: 32 }); // Spritesheet do jogador (sapo)
        this.load.spritesheet('jump', 'img/Ninja Frog/Jump.png', { frameWidth: 32, frameHeight: 32 }); // Spritesheet do pulo
        this.load.spritesheet('doubleJump', 'img/Ninja Frog/DoubleJump.png', { frameWidth: 32, frameHeight: 32 }); // Spritesheet do double jump
        this.load.spritesheet('plataforma', 'img/plat/plataforma.png', { frameWidth: 32, frameHeight: 32 }); // Spritesheet das plataformas
        this.load.image('chao', 'img/plat/chao.png'); // Imagem do chão
        this.load.spritesheet('abacaxi', 'img/item/Pineapple.png', { frameWidth: 32, frameHeight: 32 }); // Spritesheet do abacaxi (item)
    }

    create() {
        let larguraJogo = this.sys.game.config.width; // Obtém a largura do jogo
        let alturaJogo = this.sys.game.config.height; // Obtém a altura do jogo

        // Cria o jogador (sapo) e define propriedades físicas (colisão e movimentação)
        this.sapo = this.physics.add.sprite(100, alturaJogo - 150, 'player');
        this.sapo.setCollideWorldBounds(true); // O sapo não pode sair da tela
        this.sapo.setDragX(600); // Resistencia ao movimento no eixo X
        this.sapo.setMaxVelocity(200, 400); // Define a velocidade máxima do sapo

        // Criação das animações para o sapo (andar, pulo, double jump)
        this.anims.create({
            key: 'andar',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 11 }),
            frameRate: 10,
            repeat: -1 // Repete indefinidamente
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

        // Criação do chão e das plataformas
        this.chao = this.physics.add.staticGroup();
        const posicoesChao = [45, 130, 220, 310, 400, 490, 580, 670, 760, 850, 940, 1030, 1120, 1200];
        posicoesChao.forEach(x => {
            this.chao.create(x, alturaJogo - 10, 'chao').setScale(2, 1).refreshBody();
        });

        // Criação das plataformas
        this.plataformas = this.physics.add.staticGroup();
        const plataformasData = [
            { x: 500, y: 450 },
            { x: 300, y: 370 },
            { x: 700, y: 340 },
            { x: 160, y: 270 },
            { x: 900, y: 270 },
            { x: 1100, y: 350 },
            { x: 900, y: 270 },
            { x: 500, y: 220 }
        ];
        plataformasData.forEach(pos => {
            let plat = this.plataformas.create(pos.x, pos.y, 'plataforma');
            plat.setFrame(0);
        });

        // Criação dos abacaxis (itens que o jogador pode coletar)
        this.abacaxis = this.physics.add.group();
        const posicoesAbacaxi = [500, 600, 700, 400, 100, 300, 200, 800, 900, 1100];
        posicoesAbacaxi.forEach(x => {
            let abacaxi = this.abacaxis.create(x, 0, 'abacaxi');
            abacaxi.anims.play('abacaxi', true); // Anima o abacaxi
        });

        // Definindo colisões entre os abacaxis e o chão/plataformas
        this.physics.add.collider(this.abacaxis, this.chao);
        this.physics.add.collider(this.abacaxis, this.plataformas);

        // Colisão do sapo com as plataformas
        this.physics.add.collider(this.sapo, this.plataformas, () => {
            if (this.sapo.body.touching.down) {
                this.pulos = 0; // Reinicia o número de pulos ao tocar no chão
                this.pulando = false;
            }
        });

        // Colisão do sapo com o chão
        this.physics.add.collider(this.sapo, this.chao, () => {
            this.pulos = 0; // Reinicia o número de pulos ao tocar no chão
            this.pulando = false;
        });

        // Inicialização do placar
        this.pontos = 0;
        this.placar = this.add.text(20, 20, 'Pontos: 0', {
            fontSize: '20px',
            fill: '#fff'
        });

        // Detecção de sobreposição do sapo com os abacaxis para coleta
        this.physics.add.overlap(this.sapo, this.abacaxis, (sapo, abacaxi) => {
            abacaxi.disableBody(true, true); // Desativa o abacaxi após ser coletado
            this.pontos += 10; // Adiciona pontos ao placar
            this.placar.setText('Pontos: ' + this.pontos); // Atualiza o placar
        });

        // Controle de movimento do jogador
        this.teclado = this.input.keyboard.createCursorKeys();

        // Event listener para animação de double jump (quando termina, troca para animação de pulo)
        this.sapo.on('animationcomplete', (anim) => {
            if (anim.key === 'double_jump') {
                this.sapo.anims.play('pulo', true);
                this.pulando = false;
            }
        });
    }

    update() {
        let noAr = !this.sapo.body.blocked.down; // Verifica se o sapo está no ar

        // Movimentação do jogador (esquerda e direita)
        if (this.teclado.left.isDown) {
            this.sapo.setVelocityX(-180);
            if (!noAr) this.sapo.anims.play('andar', true); // Reproduz animação de andar se não estiver no ar
            this.sapo.flipX = true; // Inverte a direção do jogador
        } else if (this.teclado.right.isDown) {
            this.sapo.setVelocityX(180);
            if (!noAr) this.sapo.anims.play('andar', true);
            this.sapo.flipX = false;
        } else {
            this.sapo.setVelocityX(0);
            if (!noAr) this.sapo.setFrame(0); // Define o quadro de animação para parado
        }

        // Controle de pulo
        if (Phaser.Input.Keyboard.JustDown(this.teclado.up)) {
            if (this.pulos === 0 || (this.pulos === 1 && noAr)) {
                this.sapo.setVelocityY(-250); // Impulso para o pulo
                this.sapo.anims.play(this.pulos === 0 ? 'pulo' : 'double_jump', true); // Determina qual animação de pulo usar
                this.pulos++; // Incrementa o contador de pulos
            }
        }

        // Transição para a próxima fase quando atingir 100 pontos
        if (this.pontos == 100) {
            this.scene.start('Fase02'); // Inicia a próxima fase
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
            gravity: { y: 500 }, // Gravidade aplicada ao jogo
            debug: false
        }
    },
    scene: [Fase01] // Define que a cena inicial é 'Fase01'
};
