class CircuitosQuemados extends Phaser.Scene {
    constructor() {
        super({ key: "CircuitosQuemados" });
        this.stars = [];
        this.nebulae = [];
        this.particles = [];
        this.ceremonyStarted = false;
        this.currentMedalIndex = 0;
        this.crewMembers = [];
        this.medals = [];
        this.lightBeams = [];
        this.meritTexts = [
            "🏅 Medalla al Valor Supremo\nPor proteger el núcleo intergaláctico contra fuerzas ancestrales",
            "⚡ Medalla a la Precisión Técnica\nPor calibrar sistemas críticos bajo presión extrema", 
            "🧠 Medalla al Ingenio Estratégico\nPor vencer la IA ancestral con táctica superior",
            "🌌 Medalla a la Exploración Cósmica\nPor descubrir los secretos del multiverso infinito"
        ];
        this.medalNames = [
            "🏅 MEDALLA AL VALOR SUPREMO",
            "⚡ MEDALLA A LA PRECISIÓN TÉCNICA", 
            "🧠 MEDALLA AL INGENIO ESTRATÉGICO",
            "🌌 MEDALLA A LA EXPLORACIÓN CÓSMICA"
        ];
        this.crewNames = ["Comandante Nova", "Ingeniera Zara", "Piloto Orion", "Científica Luna"];
    }

    preload() {
        // Cargar música de fondo
        this.load.audio("backgroundMusic", "assets/scenaPrincipal/musica.mp3");
    }

    create() {
        // Versión ultra-ligera para móviles
        if (this.sys.game.device.os.desktop) {
            // Versión completa para escritorio
            this.createEnhancedBackground();
            this.createEnhancedTitle();
            this.createEnhancedDialog();
            this.setupAmbientMusic();
        } else {
            // Versión ultra-ligera para móviles
            this.createMobileBackground();
            this.createSimpleTitle();
            this.createSimpleDialog();
            this.setupAmbientMusic();
        }
    }

    setupAmbientMusic() {
        if (this.sound.get('backgroundMusic')) {
            const music = this.sound.get('backgroundMusic');
            if (!music.isPlaying) {
                music.play({ loop: true, volume: 0.3 });
            }
        }
    }

    createMobileBackground() {
        // Fondo simple para móviles
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000022)
            .setOrigin(0, 0);
        
        // Añadir algunas estrellas estáticas
        for (let i = 0; i < 20; i++) {
            this.add.circle(
                Phaser.Math.Between(0, this.cameras.main.width),
                Phaser.Math.Between(0, this.cameras.main.height),
                Phaser.Math.FloatBetween(0.5, 1.5),
                0xFFFFFF,
                Phaser.Math.FloatBetween(0.5, 1)
            );
        }
    }
    
    createSimpleTitle() {
        this.add.text(this.cameras.main.centerX, 50, '🏆 MEDALLAS 🏆', {
            fontSize: '24px',
            fill: '#FFD700',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
    }
    
    createSimpleDialog() {
        // Fondo del diálogo simple
        const dialog = this.add.graphics();
        dialog.fillStyle(0x000033, 0.9);
        dialog.lineStyle(2, 0xFFD700, 1);
        dialog.fillRoundedRect(20, 100, this.cameras.main.width - 40, 200, 10);
        dialog.strokeRoundedRect(20, 100, this.cameras.main.width - 40, 200, 10);
        
        // Texto simple
        this.add.text(this.cameras.main.centerX, 150, '¡Bienvenido a la ceremonia de premiación!', {
            fontSize: '16px',
            fill: '#FFFFFF',
            align: 'center',
            wordWrap: { width: this.cameras.main.width - 80 }
        }).setOrigin(0.5);
        
        // Botón de continuar
        const button = this.add.rectangle(this.cameras.main.centerX, 250, 200, 40, 0x4CAF50)
            .setInteractive();
            
        this.add.text(this.cameras.main.centerX, 250, 'Comenzar', {
            fontSize: '18px',
            fill: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);
        
        button.on('pointerdown', () => {
            this.scene.start('MenuPrincipal'); // Ajusta esto según tu juego
        });
    }
    
    createEnhancedBackground() {
        // Versión original solo para escritorio
        if (!this.sys.game.device.os.desktop) return;
        
        // Gradiente de fondo espacial ultra realista con múltiples capas
        const gradient = this.add.graphics();
        
        // Capa base del espacio profundo
        gradient.fillGradientStyle(0x000008, 0x000015, 0x001133, 0x000822, 1);
        gradient.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        
        // Capa de atmósfera galáctica
        const atmosphere = this.add.graphics();
        atmosphere.fillGradientStyle(0x220044, 0x110022, 0x001144, 0x002211, 0.3);
        atmosphere.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        atmosphere.setBlendMode(Phaser.BlendModes.ADD);
        
        // Efecto de vórtice galáctico sutil
        const vortex = this.add.graphics();
        vortex.fillGradientStyle(0x4400AA, 0x2200FF, 0x0044AA, 0x001166, 0.15);
        vortex.fillEllipse(this.cameras.main.centerX, this.cameras.main.centerY, 
                          this.cameras.main.width * 1.5, this.cameras.main.height * 0.8);
        vortex.setBlendMode(Phaser.BlendModes.SCREEN);
        
        // Animación del vórtice
        this.tweens.add({
            targets: vortex,
            rotation: Math.PI * 2,
            duration: 60000,
            repeat: -1,
            ease: 'Linear'
        });

        // Crear nebulosas mejoradas
        this.createNebulae();
        
        // Crear estrellas mejoradas con diferentes capas
        this.createEnhancedStars();
        
        // Crear partículas flotantes
        this.createFloatingParticles();
        
        // Añadir rayos de luz cósmicos
        this.createCosmicRays();
    }

    createCosmicRays() {
        // Solo crear rayos cósmicos en escritorio
        if (!this.sys.game.device.os.desktop) return;
        
        for (let i = 0; i < 3; i++) { // Menos rayos
            const ray = this.add.graphics();
            ray.lineStyle(1, 0x88AAFF, 0.3);
            
            const startX = Phaser.Math.Between(0, this.cameras.main.width);
            const startY = Phaser.Math.Between(0, this.cameras.main.height);
            const endX = startX + Phaser.Math.Between(-200, 200);
            const endY = startY + Phaser.Math.Between(-200, 200);
            
            ray.lineBetween(startX, startY, endX, endY);
            ray.setAlpha(0);
            
            // Animación de aparición y desaparición
            this.tweens.add({
                targets: ray,
                alpha: { from: 0, to: 0.6 },
                duration: 2000,
                delay: i * 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createNebulae() {
        // Solo crear nebulosas en escritorio
        if (!this.sys.game.device.os.desktop) return;
        
        const nebulaCount = 2; // Muy pocas nebulosas
        for (let i = 0; i < nebulaCount; i++) {
            const nebulaContainer = this.add.container();
            
            // Colores más realistas y variados para nebulosas
            const colorSets = [
                [0x6a0dad, 0x4b0082, 0x8a2be2], // Púrpura
                [0x00ced1, 0x20b2aa, 0x48d1cc], // Turquesa
                [0xff6347, 0xff4500, 0xffa500], // Naranja-rojo
                [0x32cd32, 0x00ff7f, 0x98fb98], // Verde
                [0x1e90ff, 0x4169e1, 0x87ceeb]  // Azul
            ];
            
            const colors = colorSets[i];
            const x = Phaser.Math.Between(100, this.cameras.main.width - 100);
            const y = Phaser.Math.Between(100, this.cameras.main.height - 100);
            
            // Capa base de la nebulosa
            const nebulaBase = this.add.graphics();
            nebulaBase.fillStyle(colors[0], 0.15);
            nebulaBase.fillCircle(0, 0, Phaser.Math.Between(120, 180));
            nebulaBase.setBlendMode(Phaser.BlendModes.ADD);
            
            // Capa media con gradiente
            const nebulaMid = this.add.graphics();
            nebulaMid.fillGradientStyle(colors[1], colors[0], colors[2], colors[1], 0.12);
            nebulaMid.fillCircle(0, 0, Phaser.Math.Between(80, 140));
            nebulaMid.setBlendMode(Phaser.BlendModes.SCREEN);
            
            // Núcleo brillante
            const nebulaCore = this.add.graphics();
            nebulaCore.fillStyle(colors[2], 0.25);
            nebulaCore.fillCircle(0, 0, Phaser.Math.Between(40, 80));
            nebulaCore.setBlendMode(Phaser.BlendModes.ADD);
            
            // Reducir partículas de polvo estelar
            const dustParticles = this.sys.game.device.os.desktop ? 4 : 2;
            for (let j = 0; j < dustParticles; j++) {
                const dust = this.add.graphics();
                dust.fillStyle(0xffffff, 0.1);
                const dustX = Phaser.Math.Between(-60, 60);
                const dustY = Phaser.Math.Between(-60, 60);
                dust.fillCircle(dustX, dustY, Phaser.Math.Between(2, 6));
                dust.setBlendMode(Phaser.BlendModes.ADD);
                nebulaContainer.add(dust);
                
                // Animación del polvo
                this.tweens.add({
                    targets: dust,
                    alpha: { from: 0.05, to: 0.2 },
                    scaleX: { from: 0.5, to: 1.5 },
                    scaleY: { from: 0.5, to: 1.5 },
                    duration: Phaser.Math.Between(6000, 10000),
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
            
            nebulaContainer.add([nebulaBase, nebulaMid, nebulaCore]);
            nebulaContainer.setPosition(x, y);
            
            // Animación compleja de la nebulosa
            this.tweens.add({
                targets: nebulaContainer,
                alpha: { from: 0.8, to: 1.2 },
                scaleX: { from: 0.9, to: 1.1 },
                scaleY: { from: 0.9, to: 1.1 },
                rotation: { from: 0, to: Math.PI / 4 },
                duration: Phaser.Math.Between(15000, 25000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            this.nebulae.push(nebulaContainer);
        }
    }

    createReducedStars() {
        // Versión optimizada de estrellas para móvil
        const starCount = 30; // Muy pocas estrellas para móvil
        
        for (let i = 0; i < starCount; i++) {
            const starContainer = this.add.container();
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            
            // Núcleo de la estrella
            const starCore = this.add.circle(0, 0, 
                Phaser.Math.FloatBetween(0.3, 1.2), 
                0xffffff, 
                Phaser.Math.FloatBetween(0.6, 1)
            );
            
            // Halo de luz alrededor de la estrella
            const starHalo = this.add.circle(0, 0, 
                Phaser.Math.FloatBetween(1.5, 3), 
                0xffffff, 
                Phaser.Math.FloatBetween(0.1, 0.3)
            );
            starHalo.setBlendMode(Phaser.BlendModes.ADD);
            
            starContainer.add([starHalo, starCore]);
            starContainer.setPosition(x, y);
            
            // Animación de parpadeo realista
            this.tweens.add({
                targets: starContainer,
                alpha: { from: 0.4, to: 1 },
                scaleX: { from: 0.8, to: 1.2 },
                scaleY: { from: 0.8, to: 1.2 },
                duration: Phaser.Math.Between(3000, 6000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 3000),
                ease: 'Sine.easeInOut'
            });
            
            this.stars.push(starContainer);
        }
        
        // Reducir estrellas medianas
        const mediumStars = this.sys.game.device.os.desktop ? 15 : 8;
        for (let i = 0; i < mediumStars; i++) {
            const starContainer = this.add.container();
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            
            // Colores variados para estrellas
            const colors = [0xffffff, 0xfff8dc, 0xffd700, 0x87ceeb, 0xffa07a];
            const color = colors[Phaser.Math.Between(0, colors.length - 1)];
            
            // Núcleo brillante
            const starCore = this.add.circle(0, 0, 
                Phaser.Math.FloatBetween(1.5, 2.5), 
                color, 1
            );
            
            // Múltiples halos para efecto de brillo
            const halo1 = this.add.circle(0, 0, 4, color, 0.3);
            const halo2 = this.add.circle(0, 0, 6, color, 0.15);
            const halo3 = this.add.circle(0, 0, 8, 0xffffff, 0.08);
            
            halo1.setBlendMode(Phaser.BlendModes.ADD);
            halo2.setBlendMode(Phaser.BlendModes.ADD);
            halo3.setBlendMode(Phaser.BlendModes.ADD);
            
            starContainer.add([halo3, halo2, halo1, starCore]);
            starContainer.setPosition(x, y);
            
            // Animación más compleja
            this.tweens.add({
                targets: starContainer,
                alpha: { from: 0.7, to: 1 },
                scaleX: { from: 0.9, to: 1.3 },
                scaleY: { from: 0.9, to: 1.3 },
                rotation: { from: 0, to: Math.PI * 2 },
                duration: Phaser.Math.Between(4000, 8000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000),
                ease: 'Sine.easeInOut'
            });
            
            this.stars.push(starContainer);
        }
        
        // Reducir estrellas gigantes
        const bigStars = this.sys.game.device.os.desktop ? 4 : 2;
        for (let i = 0; i < bigStars; i++) {
            const starContainer = this.add.container();
            const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
            const y = Phaser.Math.Between(50, this.cameras.main.height - 50);
            
            const colors = [0xffd700, 0xff6347, 0x87ceeb, 0xffffff, 0xffa500];
            const color = colors[Phaser.Math.Between(0, colors.length - 1)];
            
            // Núcleo súper brillante
            const starCore = this.add.circle(0, 0, 3, color, 1);
            
            // Sistema de halos múltiples
            const halos = [];
            for (let j = 1; j <= 5; j++) {
                const halo = this.add.circle(0, 0, 
                    4 + (j * 3), 
                    color, 
                    0.4 - (j * 0.06)
                );
                halo.setBlendMode(Phaser.BlendModes.ADD);
                halos.push(halo);
            }
            
            // Rayos de luz (cruz)
            const rayH = this.add.rectangle(0, 0, 40, 1, color, 0.6);
            const rayV = this.add.rectangle(0, 0, 1, 40, color, 0.6);
            rayH.setBlendMode(Phaser.BlendModes.ADD);
            rayV.setBlendMode(Phaser.BlendModes.ADD);
            
            starContainer.add([...halos, rayH, rayV, starCore]);
            starContainer.setPosition(x, y);
            
            // Animación espectacular
            this.tweens.add({
                targets: starContainer,
                alpha: { from: 0.8, to: 1 },
                scaleX: { from: 0.7, to: 1.4 },
                scaleY: { from: 0.7, to: 1.4 },
                rotation: { from: 0, to: Math.PI * 4 },
                duration: Phaser.Math.Between(6000, 12000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            this.stars.push(starContainer);
        }
    }

    createFloatingParticles() {
        // Solo crear partículas en escritorio
        if (!this.sys.game.device.os.desktop) return;
        
        const particleCount = 5; // Muy pocas partículas
        for (let i = 0; i < particleCount; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, this.cameras.main.width),
                Phaser.Math.Between(0, this.cameras.main.height),
                Phaser.Math.FloatBetween(1, 2),
                0x00ffff,
                Phaser.Math.FloatBetween(0.2, 0.6)
            );
            
            // Movimiento flotante
            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-50, 50),
                y: particle.y + Phaser.Math.Between(-30, 30),
                duration: Phaser.Math.Between(5000, 8000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            this.particles.push(particle);
        }
    }

    createEnhancedTitle() {
        if (!this.sys.game.device.os.desktop) return;
        
        this.titleText = this.add.text(this.cameras.main.centerX, 80, 
            '🏆 MEDALLAS DE HONOR 🏆', {
            fontSize: '32px',
            fill: '#FFD700',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 5,
                fill: true
            }
        }).setOrigin(0.5);

        // Efecto de brillo sutil
        this.tweens.add({
            targets: this.titleText,
            alpha: { from: 0.9, to: 1 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createEnhancedDialog() {
        if (!this.sys.game.device.os.desktop) return;
        
        // Fondo del diálogo con efectos mejorados
        this.dialogBox = this.add.graphics();
        this.dialogBox.fillStyle(0x000033, 0.9);
        this.dialogBox.lineStyle(3, 0xffd700, 1);
        
        // Crear bordes con esquinas redondeadas y efectos
        const dialogWidth = this.cameras.main.width - 150;
        const dialogHeight = 250;
        const dialogX = 75;
        const dialogY = 180;
        
        this.dialogBox.fillRoundedRect(dialogX, dialogY, dialogWidth, dialogHeight, 15);
        this.dialogBox.strokeRoundedRect(dialogX, dialogY, dialogWidth, dialogHeight, 15);
        
        // Efectos de esquinas brillantes
        for (let i = 0; i < 4; i++) {
            const corner = this.add.circle(0, 0, 3, 0xffd700);
            const positions = [
                { x: dialogX + 15, y: dialogY + 15 },
                { x: dialogX + dialogWidth - 15, y: dialogY + 15 },
                { x: dialogX + 15, y: dialogY + dialogHeight - 15 },
                { x: dialogX + dialogWidth - 15, y: dialogY + dialogHeight - 15 }
            ];
            corner.setPosition(positions[i].x, positions[i].y);
            
            this.tweens.add({
                targets: corner,
                scaleX: { from: 1, to: 1.5 },
                scaleY: { from: 1, to: 1.5 },
                alpha: { from: 0.7, to: 1 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                delay: i * 250
            });
        }

        // Mensaje principal mejorado
        this.dialogText = this.add.text(this.cameras.main.centerX, 280, 
            '🌌 TRANSMISIÓN OFICIAL DEL COMANDO GALÁCTICO 🌌\n\n' +
            'Las cuatro medallas más prestigiosas del multiverso\n' +
            'serán presentadas en honor a la misión épica.\n\n' +
            'Cada medalla representa un logro extraordinario\n' +
            'que salvó TechnoGalaxia de la extinción total.', {
            fontSize: '16px',
            fill: '#ffffff',
            align: 'center',
            lineSpacing: 5,
            wordWrap: { width: dialogWidth - 40 }
        }).setOrigin(0.5);

        // Texto de instrucción mejorado
        this.clickText = this.add.text(this.cameras.main.centerX, 380, 
            '✨ TOCA LA PANTALLA PARA INICIAR LA CEREMONIA OFICIAL ✨', {
            fontSize: '18px',
            fill: '#ffff00',
            align: 'center',
            fontStyle: 'bold',
            stroke: '#ff6600',
            strokeThickness: 1
        }).setOrigin(0.5);

        // Efecto pulsante mejorado
        this.tweens.add({
            targets: this.clickText,
            scaleX: { from: 0.9, to: 1.1 },
            scaleY: { from: 0.9, to: 1.1 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Evento de clic
        this.input.once('pointerdown', () => {
            this.startEnhancedCeremony();
        });
    }

    startEnhancedCeremony() {
        this.ceremonyStarted = true;
        
        // Transición suave para ocultar diálogo
        this.tweens.add({
            targets: [this.dialogBox, this.dialogText, this.clickText],
            alpha: 0,
            duration: 1000,
            ease: 'Power2.easeOut',
            onComplete: () => {
                this.dialogBox.destroy();
                this.dialogText.destroy();
                this.clickText.destroy();
            }
        });

        // Crear efectos de luz ceremonial
        this.createCeremonialLights();
        
        // Iniciar presentación de medallas directamente (sin podio)
        this.time.delayedCall(1500, () => {
            this.presentNextUltraRealisticMedal();
        });
    }

    createCeremonialLights() {
        // Sistema de iluminación ultra realista y cinematográfico
        
        // Luz principal central con efectos volumétricos avanzados
        const mainLightContainer = this.add.container();
        
        // Múltiples capas de luz para efecto volumétrico
        for (let layer = 0; layer < 5; layer++) {
            const lightLayer = this.add.graphics();
            const intensity = 0.8 - (layer * 0.15);
            const width = 120 + (layer * 40);
            
            lightLayer.fillGradientStyle(
                0xFFFFFF, 0xFFFFFF, 0xFFD700, 0xFFD700, 
                intensity, intensity, intensity * 0.3, intensity * 0.3
            );
            
            const lightPoints = [
                this.cameras.main.centerX - width, 0,
                this.cameras.main.centerX + width, 0,
                this.cameras.main.centerX + (width * 0.4), 450,
                this.cameras.main.centerX - (width * 0.4), 450
            ];
            lightLayer.fillPoints(lightPoints, true);
            lightLayer.setBlendMode(Phaser.BlendModes.ADD);
            lightLayer.setAlpha(intensity);
            
            mainLightContainer.add(lightLayer);
        }
        
        this.lightBeams.push(mainLightContainer);

        // Rayos laterales con efectos de dispersión atmosférica
        for (let i = 0; i < 8; i++) {
            const rayContainer = this.add.container();
            const angle = (i / 8) * Math.PI * 2;
            const distance = 350;
            const startX = this.cameras.main.centerX + Math.cos(angle) * distance;
            const startY = Math.max(0, this.cameras.main.centerY + Math.sin(angle) * distance);
            
            // Múltiples rayos por cada dirección para efecto realista
            for (let j = 0; j < 3; j++) {
                const ray = this.add.graphics();
                const offset = (j - 1) * 15;
                const intensity = 0.4 - (j * 0.1);
                
                ray.fillGradientStyle(
                    0xFFD700, 0xFFD700, 0xFFFFFF, 0xFFFFFF, 
                    intensity, intensity, 0.05, 0.05
                );
                
                const rayPoints = [
                    startX - 20 + offset, startY,
                    startX + 20 + offset, startY,
                    this.cameras.main.centerX + 15 + offset, this.cameras.main.centerY,
                    this.cameras.main.centerX - 15 + offset, this.cameras.main.centerY
                ];
                ray.fillPoints(rayPoints, true);
                ray.setBlendMode(Phaser.BlendModes.ADD);
                ray.setAlpha(intensity);
                
                rayContainer.add(ray);
            }
            
            // Animación de intensidad variable
            this.tweens.add({
                targets: rayContainer,
                alpha: { from: 0.6, to: 1 },
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                delay: i * 200,
                ease: 'Sine.easeInOut'
            });
            
            this.lightBeams.push(rayContainer);
        }

        // Luz ambiental con gradiente radial realista
        const ambientLightContainer = this.add.container();
        
        // Múltiples capas de luz ambiental
        for (let i = 0; i < 4; i++) {
            const ambientLayer = this.add.graphics();
            const radius = 200 + (i * 100);
            const intensity = 0.15 - (i * 0.03);
            
            ambientLayer.fillGradientStyle(
                0xFFD700, 0xFFD700, 0xFFA500, 0xFF8C00,
                intensity, intensity, intensity * 0.3, intensity * 0.1
            );
            ambientLayer.fillCircle(this.cameras.main.centerX, this.cameras.main.centerY, radius);
            ambientLayer.setBlendMode(Phaser.BlendModes.ADD);
            
            ambientLightContainer.add(ambientLayer);
        }
        
        this.lightBeams.push(ambientLightContainer);

        // Partículas de luz flotantes ultra realistas
        for (let i = 0; i < 35; i++) {
            const particleContainer = this.add.container();
            
            // Núcleo de la partícula
            const core = this.add.circle(0, 0, Phaser.Math.Between(1, 3), 0xFFFFFF, 1);
            
            // Halo de la partícula
            const halo = this.add.circle(0, 0, Phaser.Math.Between(4, 8), 0xFFD700, 0.3);
            halo.setBlendMode(Phaser.BlendModes.ADD);
            
            // Brillo exterior
            const glow = this.add.circle(0, 0, Phaser.Math.Between(8, 15), 0xFFFFFF, 0.1);
            glow.setBlendMode(Phaser.BlendModes.ADD);
            
            particleContainer.add([glow, halo, core]);
            
            const x = this.cameras.main.centerX + Phaser.Math.Between(-300, 300);
            const y = Phaser.Math.Between(50, 400);
            particleContainer.setPosition(x, y);
            
            // Animación compleja de flotación
            this.tweens.add({
                targets: particleContainer,
                y: y - Phaser.Math.Between(80, 200),
                x: x + Phaser.Math.Between(-50, 50),
                alpha: { from: 1, to: 0.2 },
                scaleX: { from: 1, to: 0.4 },
                scaleY: { from: 1, to: 0.4 },
                rotation: { from: 0, to: Math.PI * 2 },
                duration: Phaser.Math.Between(4000, 8000),
                repeat: -1,
                yoyo: true,
                delay: Phaser.Math.Between(0, 2000),
                ease: 'Sine.easeInOut'
            });
            
            this.lightBeams.push(particleContainer);
        }

        // Rayos de luz direccionales desde las esquinas
        const corners = [
            { x: 0, y: 0 },
            { x: this.cameras.main.width, y: 0 },
            { x: 0, y: this.cameras.main.height },
            { x: this.cameras.main.width, y: this.cameras.main.height }
        ];
        
        corners.forEach((corner, index) => {
            const cornerLight = this.add.graphics();
            cornerLight.fillGradientStyle(
                0xFFFFFF, 0xFFD700, 0xFFA500, 0xFF8C00,
                0.3, 0.2, 0.1, 0.05
            );
            
            const lightPoints = [
                corner.x, corner.y,
                corner.x + (index < 2 ? 150 : -150), corner.y + (index % 2 === 0 ? 150 : -150),
                this.cameras.main.centerX, this.cameras.main.centerY
            ];
            cornerLight.fillPoints(lightPoints, true);
            cornerLight.setBlendMode(Phaser.BlendModes.ADD);
            
            // Animación de pulsación
            this.tweens.add({
                targets: cornerLight,
                alpha: { from: 0.3, to: 0.6 },
                duration: 3000 + (index * 500),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            this.lightBeams.push(cornerLight);
        });

        // Luz central concentrada en el podio con múltiples capas
        const podiumLightContainer = this.add.container();
        
        for (let i = 0; i < 3; i++) {
            const podiumLight = this.add.graphics();
            const radius = 80 + (i * 30);
            const intensity = 0.8 - (i * 0.2);
            
            podiumLight.fillGradientStyle(
                0xFFFFFF, 0xFFD700, 0xFFD700, 0xFFA500, 
                intensity, intensity * 0.8, intensity * 0.5, intensity * 0.2
            );
            podiumLight.fillCircle(this.cameras.main.centerX, 280, radius);
            podiumLight.setBlendMode(Phaser.BlendModes.ADD);
            
            podiumLightContainer.add(podiumLight);
        }
        
        // Animación de respiración de la luz del podio
        this.tweens.add({
            targets: podiumLightContainer,
            alpha: { from: 0.7, to: 1 },
            scaleX: { from: 0.9, to: 1.1 },
            scaleY: { from: 0.9, to: 1.1 },
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        this.lightBeams.push(podiumLightContainer);
    }

    repositionExistingMedals() {
        // Calcular posiciones para las medallas existentes
        const totalMedals = this.medals.length;
        if (totalMedals === 0) return;

        // Definir posiciones laterales para las medallas existentes
        const positions = [
            { x: this.cameras.main.centerX - 200, y: 280 }, // Izquierda
            { x: this.cameras.main.centerX - 400, y: 280 }, // Más a la izquierda
            { x: this.cameras.main.centerX + 200, y: 280 }, // Derecha
        ];

        // Mover cada medalla existente a su nueva posición
        this.medals.forEach((medal, index) => {
            if (index < positions.length) {
                // Animar el movimiento suave hacia la nueva posición
                this.tweens.add({
                    targets: medal,
                    x: positions[index].x,
                    y: positions[index].y,
                    duration: 1500,
                    ease: 'Power2.easeInOut'
                });
            }
        });
    }

    createEnhancedPodium() {
        // Base del podio con efecto 3D mejorado
        const podiumBase = this.add.graphics();
        
        // Crear efecto 3D con múltiples capas
        const centerX = this.cameras.main.centerX;
        const baseY = 420;
        
        // Sombra profunda
        podiumBase.fillStyle(0x000000, 0.6);
        podiumBase.fillRoundedRect(centerX - 210, baseY + 8, 420, 90, 10);
        
        // Base principal con gradiente
        podiumBase.fillGradientStyle(0x333333, 0x333333, 0x555555, 0x555555, 1);
        podiumBase.fillRoundedRect(centerX - 200, baseY, 400, 80, 8);
        
        // Borde brillante principal
        podiumBase.lineStyle(4, 0x00ccff, 1);
        podiumBase.strokeRoundedRect(centerX - 200, baseY, 400, 80, 8);
        
        // Superficie superior brillante con gradiente
        podiumBase.fillGradientStyle(0x666666, 0x666666, 0x888888, 0x888888, 1);
        podiumBase.fillRoundedRect(centerX - 190, baseY + 5, 380, 20, 5);
        
        // Líneas de detalle tecnológico mejoradas
        podiumBase.lineStyle(2, 0x00ffff, 0.8);
        for (let i = 0; i < 10; i++) {
            const lineX = centerX - 180 + (i * 36);
            podiumBase.lineBetween(lineX, baseY + 30, lineX, baseY + 70);
        }
        
        // Líneas horizontales de detalle
        podiumBase.lineStyle(1, 0x00ffff, 0.6);
        podiumBase.lineBetween(centerX - 180, baseY + 40, centerX + 180, baseY + 40);
        podiumBase.lineBetween(centerX - 180, baseY + 60, centerX + 180, baseY + 60);
        
        // Efectos de energía en el podio
        this.tweens.add({
            targets: podiumBase,
            alpha: { from: 0.9, to: 1 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // Holograma central mejorado
        const hologram = this.add.text(centerX, baseY + 40, '⚡ PODIO DE HONOR GALÁCTICO ⚡', {
            fontSize: '16px',
            fill: '#00ffff',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#ffffff',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hologram,
            alpha: { from: 0.6, to: 1 },
            scaleY: { from: 0.9, to: 1.1 },
            duration: 1200,
            yoyo: true,
            repeat: -1
        });

        this.podium = podiumBase;
    }

    presentNextUltraRealisticMedal() {
        if (this.currentMedalIndex >= 4) {
            this.showEnhancedFinalMessage();
            return;
        }

        // Reposicionar medallas existentes antes de crear la nueva
        this.repositionExistingMedals();

        // Crear medalla realista con diseño único para cada una
        const medalContainer = this.add.container(this.cameras.main.centerX, 200);

        // Definir colores y diseños únicos para cada medalla - Medallas ultra realistas
        const medalDesigns = [
            { // Medalla de Oro Clásico - Primera medalla
                outerColor: 0xFFD700,
                middleColor: 0xFFA500,
                innerColor: 0xFFE55C,
                ribbonColor: 0xFF0000,
                symbol: 'star',
                name: 'VALOR'
            },
            { // Medalla de Oro Brillante - Segunda medalla
                outerColor: 0xFFF700,
                middleColor: 0xFFD700,
                innerColor: 0xFFFACD,
                ribbonColor: 0x0000FF,
                symbol: 'diamond',
                name: 'HONOR'
            },
            { // Medalla de Oro Antiguo - Tercera medalla
                outerColor: 0xDAA520,
                middleColor: 0xB8860B,
                innerColor: 0xF0E68C,
                ribbonColor: 0x008000,
                symbol: 'circle',
                name: 'MÉRITO'
            },
            { // Medalla de Oro Rosa - Cuarta medalla
                outerColor: 0xFFB347,
                middleColor: 0xFF8C00,
                innerColor: 0xFFE4B5,
                ribbonColor: 0xFF1493,
                symbol: 'crown',
                name: 'GLORIA'
            }
        ];

        const design = medalDesigns[this.currentMedalIndex];
        
        // Sombra realista múltiple para profundidad
        const shadowLarge = this.add.graphics();
        shadowLarge.fillStyle(0x000000, 0.4);
        shadowLarge.fillCircle(4, 6, 65);
        shadowLarge.setBlendMode(Phaser.BlendModes.MULTIPLY);
        medalContainer.add(shadowLarge);
        
        const shadowMedium = this.add.graphics();
        shadowMedium.fillStyle(0x000000, 0.2);
        shadowMedium.fillCircle(2, 3, 62);
        shadowMedium.setBlendMode(Phaser.BlendModes.MULTIPLY);
        medalContainer.add(shadowMedium);

        // Base de la medalla con múltiples capas para realismo 3D
        const medalBase = this.add.graphics();
        
        // Anillo exterior con bisel
        medalBase.fillStyle(design.outerColor, 1.0);
        medalBase.fillCircle(0, 0, 65);
        
        // Bisel exterior
        medalBase.fillStyle(0xFFFFFF, 0.3);
        medalBase.fillCircle(-2, -2, 63);
        
        // Anillo medio con gradiente
        medalBase.fillStyle(design.middleColor, 1.0);
        medalBase.fillCircle(0, 0, 55);
        
        // Bisel interior
        medalBase.fillStyle(0x000000, 0.1);
        medalBase.fillCircle(1, 1, 52);
        
        // Centro con brillo metálico
        medalBase.fillStyle(design.innerColor, 1.0);
        medalBase.fillCircle(0, 0, 45);
        
        // Reflejo metálico superior
        medalBase.fillStyle(0xFFFFFF, 0.4);
        medalBase.fillEllipse(-8, -15, 25, 15);
        
        // Borde decorativo con grabado
        medalBase.lineStyle(3, design.outerColor, 0.9);
        medalBase.strokeCircle(0, 0, 42);
        medalBase.lineStyle(1, 0x000000, 0.3);
        medalBase.strokeCircle(0, 0, 39);
        
        medalContainer.add(medalBase);

        // Símbolo central único para cada medalla con efectos 3D
        const symbol = this.add.graphics();
        symbol.fillStyle(design.outerColor, 1.0);
        symbol.lineStyle(2, 0x000000, 0.6);
        
        switch(design.symbol) {
            case 'star':
                // Estrella de 5 puntas con relieve
                const starPoints = [];
                for (let i = 0; i < 10; i++) {
                    const angle = (i * Math.PI) / 5 - Math.PI / 2;
                    const radius = i % 2 === 0 ? 22 : 12;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    starPoints.push(x, y);
                }
                symbol.fillPoints(starPoints, true);
                symbol.strokePoints(starPoints, true);
                // Sombra interna de la estrella
                symbol.fillStyle(0x000000, 0.2);
                const starShadowPoints = [];
                for (let i = 0; i < 10; i++) {
                    const angle = (i * Math.PI) / 5 - Math.PI / 2;
                    const radius = i % 2 === 0 ? 20 : 10;
                    const x = Math.cos(angle) * radius + 1;
                    const y = Math.sin(angle) * radius + 1;
                    starShadowPoints.push(x, y);
                }
                symbol.fillPoints(starShadowPoints, true);
                break;
                
            case 'diamond':
                // Diamante con facetas
                const diamondPoints = [0, -20, 14, 0, 0, 20, -14, 0];
                symbol.fillPoints(diamondPoints, true);
                symbol.strokePoints(diamondPoints, true);
                // Facetas del diamante
                symbol.lineStyle(1, 0xFFFFFF, 0.6);
                symbol.lineBetween(0, -20, 0, 20);
                symbol.lineBetween(-14, 0, 14, 0);
                symbol.lineBetween(-7, -10, 7, 10);
                symbol.lineBetween(7, -10, -7, 10);
                break;
                
            case 'circle':
                // Círculo con cruz ornamental
                symbol.fillCircle(0, 0, 18);
                symbol.strokeCircle(0, 0, 18);
                // Cruz ornamental
                symbol.lineStyle(4, 0x000000, 0.8);
                symbol.lineBetween(-12, 0, 12, 0);
                symbol.lineBetween(0, -12, 0, 12);
                // Decoración en los extremos
                symbol.fillStyle(design.outerColor, 1.0);
                symbol.fillCircle(-12, 0, 3);
                symbol.fillCircle(12, 0, 3);
                symbol.fillCircle(0, -12, 3);
                symbol.fillCircle(0, 12, 3);
                break;
                
            case 'crown':
                // Corona real con joyas
                const crownPoints = [
                    -18, 12, -12, -8, -6, 8, 0, -12, 6, 8, 12, -8, 18, 12,
                    15, 18, -15, 18
                ];
                symbol.fillPoints(crownPoints, true);
                symbol.strokePoints(crownPoints, true);
                // Joyas en la corona
                symbol.fillStyle(0xFF0000, 0.8);
                symbol.fillCircle(-9, 2, 2);
                symbol.fillCircle(0, -2, 3);
                symbol.fillCircle(9, 2, 2);
                // Base de la corona
                symbol.fillStyle(design.outerColor, 1.0);
                symbol.fillRect(-18, 12, 36, 6);
                symbol.strokeRect(-18, 12, 36, 6);
                break;
        }
        
        medalContainer.add(symbol);

        // Texto del tipo de medalla - Ultra mejorado para máxima visibilidad
        const medalText = this.add.text(0, 32, design.name, {
            fontSize: '14px',
            fill: '#FFFFFF',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 3,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000000',
                blur: 2,
                fill: true
            }
        }).setOrigin(0.5);
        medalContainer.add(medalText);

        // Cinta ultra realista con efectos 3D
        const ribbon = this.add.graphics();
        
        // Sombra múltiple de la cinta para profundidad
        ribbon.fillStyle(0x000000, 0.4);
        ribbon.fillRect(-7, 64, 14, 38);
        ribbon.fillStyle(0x000000, 0.2);
        ribbon.fillRect(-6, 62, 12, 36);
        
        // Cinta principal con gradiente
        ribbon.fillGradientStyle(design.ribbonColor, design.ribbonColor, 
                               Phaser.Display.Color.GetColor32(
                                   Phaser.Display.Color.IntegerToRGB(design.ribbonColor).r * 0.7,
                                   Phaser.Display.Color.IntegerToRGB(design.ribbonColor).g * 0.7,
                                   Phaser.Display.Color.IntegerToRGB(design.ribbonColor).b * 0.7
                               ), design.ribbonColor);
        ribbon.fillRect(-5, 60, 10, 32);
        
        // Pliegues y sombras internas de la cinta
        ribbon.fillStyle(0x000000, 0.15);
        ribbon.fillRect(-1, 60, 2, 32);
        ribbon.fillRect(-5, 60, 1, 32);
        ribbon.fillRect(4, 60, 1, 32);
        
        // Rayas decorativas con brillo
        ribbon.fillStyle(0xFFFFFF, 0.5);
        ribbon.fillRect(-4, 66, 8, 1);
        ribbon.fillRect(-4, 72, 8, 1);
        ribbon.fillRect(-4, 78, 8, 1);
        ribbon.fillRect(-4, 84, 8, 1);
        
        // Brillo metálico en las rayas
        ribbon.fillStyle(0xFFD700, 0.3);
        ribbon.fillRect(-3, 66, 6, 0.5);
        ribbon.fillRect(-3, 72, 6, 0.5);
        ribbon.fillRect(-3, 78, 6, 0.5);
        ribbon.fillRect(-3, 84, 6, 0.5);
        
        // Extremo de la cinta con corte en V realista
        ribbon.fillGradientStyle(design.ribbonColor, 
                               Phaser.Display.Color.GetColor32(
                                   Phaser.Display.Color.IntegerToRGB(design.ribbonColor).r * 0.8,
                                   Phaser.Display.Color.IntegerToRGB(design.ribbonColor).g * 0.8,
                                   Phaser.Display.Color.IntegerToRGB(design.ribbonColor).b * 0.8
                               ), design.ribbonColor, design.ribbonColor);
        const ribbonEnd = new Phaser.Geom.Polygon([
            -5, 92,
            5, 92,
            3, 98,
            0, 102,
            -3, 98
        ]);
        ribbon.fillPoints(ribbonEnd.points, true);
        
        // Sombra del extremo
        ribbon.fillStyle(0x000000, 0.3);
        const ribbonShadowEnd = new Phaser.Geom.Polygon([
            -4, 93,
            4, 93,
            2, 99,
            0, 103,
            -2, 99
        ]);
        ribbon.fillPoints(ribbonShadowEnd.points, true);
        
        medalContainer.add(ribbon);

        // Múltiples brillos metálicos para ultra realismo
        const shine1 = this.add.graphics();
        shine1.fillStyle(0xFFFFFF, 0.6);
        shine1.fillEllipse(-18, -18, 15, 8);
        shine1.setBlendMode(Phaser.BlendModes.ADD);
        medalContainer.add(shine1);
        
        const shine2 = this.add.graphics();
        shine2.fillStyle(0xFFD700, 0.4);
        shine2.fillEllipse(12, 15, 8, 4);
        shine2.setBlendMode(Phaser.BlendModes.ADD);
        medalContainer.add(shine2);
        
        const shine3 = this.add.graphics();
        shine3.fillStyle(0xFFFFFF, 0.3);
        shine3.fillEllipse(-5, -25, 20, 6);
        shine3.setBlendMode(Phaser.BlendModes.ADD);
        medalContainer.add(shine3);
        
        // Animación de aparición
        medalContainer.setAlpha(0);
        medalContainer.setScale(0.3);
        medalContainer.setY(150);
        
        this.tweens.add({
            targets: medalContainer,
            y: 280,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 2000,
            ease: 'Back.easeOut',
            onComplete: () => {
                // CORREGIDO: Mostrar el texto ANTES de incrementar el índice
                this.showEnhancedMeritText(this.currentMedalIndex);
                
                // Animación sutil de balanceo en lugar de rotación completa
                this.tweens.add({
                    targets: medalContainer,
                    rotation: { from: -0.1, to: 0.1 },
                    duration: 3000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });

                // Efecto de flotación vertical muy sutil
                this.tweens.add({
                    targets: medalContainer,
                    y: { from: 280, to: 275 },
                    duration: 2500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                
                // CORREGIDO: Incrementar el índice DESPUÉS de mostrar el texto
                this.currentMedalIndex++;
            }
        });

        this.medals.push(medalContainer);
    }

    createEnhancedGoldenParticles(x, y) {
        // Sistema de partículas doradas ultra realistas
        const particleCount = 35;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.add.graphics();
            
            // Tipos de partículas con diferentes materiales
            const particleTypes = [
                { color: 0xFFD700, alpha: 0.9, size: [3, 7] },    // Oro brillante
                { color: 0xFFA500, alpha: 0.8, size: [2, 5] },    // Oro naranja
                { color: 0xFFFFFF, alpha: 0.7, size: [1, 4] },    // Destellos blancos
                { color: 0xB8860B, alpha: 0.6, size: [2, 6] }     // Oro oscuro
            ];
            
            const type = particleTypes[i % 4];
            const size = Phaser.Math.Between(type.size[0], type.size[1]);
            
            // Crear partícula con efecto metálico
            particle.fillStyle(type.color, type.alpha);
            particle.fillCircle(0, 0, size);
            
            // Agregar brillo interno
            particle.fillStyle(0xFFFFFF, 0.4);
            particle.fillCircle(-size/3, -size/3, size/3);
            
            // Posición inicial aleatoria alrededor de la medalla
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = Phaser.Math.Between(80, 150);
            const startX = x + Math.cos(angle) * distance;
            const startY = y + Math.sin(angle) * distance;
            particle.setPosition(startX, startY);
            
            // Efectos de blend para realismo
            particle.setBlendMode(Phaser.BlendModes.ADD);
            
            // Animación compleja de partículas
            this.tweens.add({
                targets: particle,
                y: startY - Phaser.Math.Between(150, 300),
                x: startX + Phaser.Math.Between(-80, 80),
                alpha: 0,
                scaleX: { from: 1, to: 0.1 },
                scaleY: { from: 1, to: 0.1 },
                rotation: Math.PI * 4,
                duration: Phaser.Math.Between(3000, 6000),
                ease: 'Power2.easeOut',
                onComplete: () => {
                    particle.destroy();
                }
            });
            
            // Animación de pulsación durante el vuelo
            this.tweens.add({
                targets: particle,
                scaleX: { from: 1, to: 1.5 },
                scaleY: { from: 1, to: 1.5 },
                duration: 800,
                yoyo: true,
                repeat: 3,
                ease: 'Sine.easeInOut'
            });
        }
        
        // Partículas de chispas adicionales
        for (let i = 0; i < 15; i++) {
            const spark = this.add.graphics();
            spark.fillStyle(0xFFFFFF, 0.9);
            
            // Crear forma de chispa (línea pequeña)
            spark.fillRect(-1, -3, 2, 6);
            
            const sparkX = x + Phaser.Math.Between(-100, 100);
            const sparkY = y + Phaser.Math.Between(-50, 50);
            spark.setPosition(sparkX, sparkY);
            spark.setBlendMode(Phaser.BlendModes.ADD);
            
            // Animación de chispa
            this.tweens.add({
                targets: spark,
                y: sparkY - Phaser.Math.Between(50, 120),
                x: sparkX + Phaser.Math.Between(-30, 30),
                alpha: 0,
                rotation: Math.PI * 2,
                duration: Phaser.Math.Between(1500, 3000),
                ease: 'Power1.easeOut',
                onComplete: () => {
                    spark.destroy();
                }
            });
        }
        
        // Efecto de ondas de energía dorada
        for (let i = 0; i < 3; i++) {
            const wave = this.add.graphics();
            wave.lineStyle(3, 0xFFD700, 0.6);
            wave.strokeCircle(0, 0, 50);
            wave.setPosition(x, y);
            wave.setBlendMode(Phaser.BlendModes.ADD);
            
            this.tweens.add({
                targets: wave,
                scaleX: 3,
                scaleY: 3,
                alpha: 0,
                duration: 2000,
                delay: i * 500,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    wave.destroy();
                }
            });
        }
    }

    showEnhancedMeritText(index) {
        const meritContainer = this.add.container(this.cameras.main.centerX, 120);
        
        // Fondo del texto de mérito con efectos mejorados
        const textBg = this.add.graphics();
        textBg.fillGradientStyle(0x000066, 0x000044, 0x000088, 0x000066, 0.95);
        textBg.lineStyle(3, 0xffd700, 1);
        textBg.fillRoundedRect(-250, -60, 500, 120, 15);
        textBg.strokeRoundedRect(-250, -60, 500, 120, 15);
        
        // Efectos de esquinas brillantes
        for (let i = 0; i < 4; i++) {
            const corner = this.add.graphics();
            corner.fillStyle(0xffd700);
            
            // Crear estrella para esquinas usando polígono
            const cornerStarPoints = [];
            const cornerOuterRadius = 6;
            const cornerInnerRadius = 3;
            const cornerSpikes = 4;
            
            for (let j = 0; j < cornerSpikes * 2; j++) {
                const radius = j % 2 === 0 ? cornerOuterRadius : cornerInnerRadius;
                const angle = (j / (cornerSpikes * 2)) * Math.PI * 2;
                cornerStarPoints.push(Math.cos(angle) * radius);
                cornerStarPoints.push(Math.sin(angle) * radius);
            }
            corner.fillPoints(cornerStarPoints, true);
            
            const positions = [
                { x: -235, y: -45 },
                { x: 235, y: -45 },
                { x: -235, y: 45 },
                { x: 235, y: 45 }
            ];
            corner.setPosition(positions[i].x, positions[i].y);
            
            this.tweens.add({
                targets: corner,
                rotation: Math.PI * 2,
                scaleX: { from: 0.8, to: 1.2 },
                scaleY: { from: 0.8, to: 1.2 },
                duration: 2000,
                repeat: -1,
                delay: i * 500
            });
            
            meritContainer.add(corner);
        }
        
        // Título de la medalla
        const medalTitle = this.add.text(0, -30, this.medalNames[index], {
            fontSize: '20px',
            fill: '#ffd700',
            align: 'center',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Texto de mérito mejorado
        const meritText = this.add.text(0, 15, this.meritTexts[index], {
            fontSize: '14px',
            fill: '#ffffff',
            align: 'center',
            lineSpacing: 6,
            wordWrap: { width: 450 }
        }).setOrigin(0.5);
        
        meritContainer.add([textBg, medalTitle, meritText]);
        
        // Animación de aparición espectacular
        meritContainer.setAlpha(0);
        meritContainer.setScale(0.3);
        
        this.tweens.add({
            targets: meritContainer,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 1200,
            ease: 'Back.easeOut'
        });

        // Efecto de brillo pulsante en el fondo
        this.tweens.add({
            targets: textBg,
            alpha: { from: 0.8, to: 1 },
            duration: 1000,
            yoyo: true,
            repeat: 3
        });

        // Ocultar después de mostrar
        this.time.delayedCall(4000, () => {
            this.tweens.add({
                targets: meritContainer,
                alpha: 0,
                scaleX: 0.3,
                scaleY: 0.3,
                duration: 1000,
                ease: 'Power2.easeIn',
                onComplete: () => {
                    meritContainer.destroy();
                    this.time.delayedCall(800, () => {
                        this.presentNextUltraRealisticMedal();
                    });
                }
            });
        });
    }

    showEnhancedFinalMessage() {
        // Crear explosión de fuegos artificiales mejorada
        this.createSpectacularFireworks();
        
        // Mensaje principal épico
        const finalContainer = this.add.container(this.cameras.main.centerX, 200);
        
        const completionBg = this.add.graphics();
        completionBg.fillGradientStyle(0x003300, 0x004400, 0x002200, 0x003300, 0.95);
        completionBg.lineStyle(4, 0x00ff00, 1);
        completionBg.fillRoundedRect(-350, -80, 700, 160, 20);
        completionBg.strokeRoundedRect(-350, -80, 700, 160, 20);
        
        const completionText = this.add.text(0, -30, 
            '🎉 ¡CEREMONIA COMPLETADA CON ÉXITO TOTAL! 🎉\n\nLas cuatro medallas más prestigiosas del multiverso\nhan sido otorgadas oficialmente', {
            fontSize: '20px',
            fill: '#00ff00',
            align: 'center',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2,
            lineSpacing: 8
        }).setOrigin(0.5);

        const secondaryText = this.add.text(0, 50, 
            '⭐ TechnoGalaxia está a salvo gracias a estos logros heroicos ⭐', {
            fontSize: '16px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        finalContainer.add([completionBg, completionText, secondaryText]);
        
        // Animación espectacular de aparición
        finalContainer.setAlpha(0);
        finalContainer.setScale(0.2);
        
        this.tweens.add({
            targets: finalContainer,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 2000,
            ease: 'Back.easeOut'
        });

        // Efecto parpadeante épico
        this.tweens.add({
            targets: completionText,
            scaleX: { from: 0.95, to: 1.05 },
            scaleY: { from: 0.95, to: 1.05 },
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Transición final
        this.time.delayedCall(6000, () => {
            this.showEnhancedFinalFade();
        });
    }

    createSpectacularFireworks() {
        for (let i = 0; i < 12; i++) {
            this.time.delayedCall(i * 250, () => {
                const x = Phaser.Math.Between(100, this.cameras.main.width - 100);
                const y = Phaser.Math.Between(100, 300);
                
                for (let j = 0; j < 16; j++) {
                    const spark = this.add.graphics();
                    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff];
                    const color = Phaser.Math.RND.pick(colors);
                    
                    if (j % 3 === 0) {
                        spark.fillStyle(color);
                        // Crear estrella para fuegos artificiales usando polígono
                        const fireworkStarPoints = [];
                        const fireworkOuterRadius = 6;
                        const fireworkInnerRadius = 3;
                        const fireworkSpikes = 5;
                        
                        for (let k = 0; k < fireworkSpikes * 2; k++) {
                            const radius = k % 2 === 0 ? fireworkOuterRadius : fireworkInnerRadius;
                            const angle = (k / (fireworkSpikes * 2)) * Math.PI * 2;
                            fireworkStarPoints.push(Math.cos(angle) * radius);
                            fireworkStarPoints.push(Math.sin(angle) * radius);
                        }
                        spark.fillPoints(fireworkStarPoints, true);
                    } else {
                        spark.fillStyle(color);
                        spark.fillCircle(0, 0, 4);
                    }
                    
                    spark.setPosition(x, y);
                    
                    const angle = (j / 16) * Math.PI * 2;
                    const distance = Phaser.Math.Between(40, 100);
                    
                    this.tweens.add({
                        targets: spark,
                        x: x + Math.cos(angle) * distance,
                        y: y + Math.sin(angle) * distance,
                        alpha: 0,
                        scaleX: { from: 1, to: 0 },
                        scaleY: { from: 1, to: 0 },
                        rotation: Math.PI * 2,
                        duration: 1500,
                        ease: 'Power2.easeOut',
                        onComplete: () => spark.destroy()
                    });
                }
            });
        }
    }

    showEnhancedFinalFade() {
        // Overlay de desvanecimiento mejorado
        const fadeOverlay = this.add.graphics();
        fadeOverlay.fillGradientStyle(0x000000, 0x000000, 0x001122, 0x001122, 0, 0, 1, 1);
        fadeOverlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        fadeOverlay.setAlpha(0);

        // Desvanecimiento gradual
        this.tweens.add({
            targets: fadeOverlay,
            alpha: 1,
            duration: 3500,
            ease: 'Power2.easeInOut',
            onComplete: () => {
                // Mensaje final simplificado
                const finalText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 
                    '🎉 CEREMONIA COMPLETADA CON ÉXITO 🎉', {
                    fontSize: '32px',
                    fill: '#ffd700',
                    align: 'center',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 3,
                    shadow: {
                        offsetX: 0,
                        offsetY: 0,
                        color: '#ffd700',
                        blur: 20,
                        fill: true
                    }
                }).setOrigin(0.5);

                finalText.setAlpha(0);
                this.tweens.add({
                    targets: finalText,
                    alpha: 1,
                    scaleX: { from: 0.7, to: 1 },
                    scaleY: { from: 0.7, to: 1 },
                    duration: 2500,
                    ease: 'Power2.easeOut'
                });

                // Efecto final de brillo
                this.tweens.add({
                    targets: finalText,
                    alpha: { from: 0.8, to: 1 },
                    duration: 1800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });
    }

    update() {
        // Actualización continua para efectos dinámicos
    }
}
