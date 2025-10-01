class ScenaPregunta1 extends Phaser.Scene {
    constructor() {
        super({ key: 'ScenaPregunta1' });

        // Variables del nuevo sistema de estabilización orbital
        this.andromedaOrb = null;
        this.viaLacteaOrb = null;
        this.andromedaAngle = 0;
        this.viaLacteaAngle = Math.PI; // Empiezan en posiciones opuestas
        this.andromedaSpeed = 2; // Velocidad angular inicial
        this.viaLacteaSpeed = -1.5; // Velocidad angular inicial (opuesta)
        this.targetSpeed = 1; // Velocidad objetivo para estabilización
        this.orbitRadius = 120;

        // Núcleo central mejorado
        this.core = null;
        this.coreGlow = null;
        this.coreRings = [];
        this.energyWaves = [];
        this.coreParticles = [];

        // Botones de control
        this.redButton = null;
        this.violetButton = null;
        this.redButtonRipple = null;
        this.violetButtonRipple = null;

        // Sistema de tiempo
        this.gameTime = 25;
        this.timeText = null;
        this.gameStarted = false;
        this.gameEnded = false;
        
        // Variables para el temblor de pantalla
        this.screenShake = { x: 0, y: 0, intensity: 0, duration: 0 };
        this.shakeTimer = 0;

        // Control de estabilidad
        this.stabilityZone = 0.8; // Zona de velocidad estable (±0.8)
        this.isStable = false;
        this.explosionTriggered = false;

        // Efectos visuales
        this.stabilityIndicator = null;
        this.orbitTrails = [];
        this.redBarFlow = [];
        this.violetBarFlow = [];

        // Sistema de partículas avanzado
        this.particles = [];
        this.sparkles = [];
        this.energyTrails = [];

        // Animaciones
        this.pulsePhase = 0;
        this.wavePhase = 0;
        this.rotationPhase = 0;
        this.flowPhase = 0;

        // Efectos de transición
        this.transitionEffects = [];

        // Sistema de barras de energía (COMIENZAN FUERA DE ZONA ESTABLE)
        this.redBarValue = 25; // Valor inicial CRÍTICO (antes 50) - FUERZA PARTICIPACIÓN
        this.violetBarValue = 75; // Valor inicial CRÍTICO (antes 50) - FUERZA PARTICIPACIÓN
        this.redBarGraphics = null;
        this.violetBarGraphics = null;
        this.redBarBackground = null;
        this.violetBarBackground = null;
        this.redBarText = null;
        this.violetBarText = null;
        
        // Sistema de participación activa requerida
        this.playerActions = 0; // Contador de acciones del jugador
        this.requiredActions = 8; // Mínimo de acciones para ganar
        this.lastActionTime = 0; // Tiempo de la última acción
        
        // Zonas de estabilidad para las barras (MÁS RESTRICTIVAS)
        this.stableZoneMin = 45; // Zona verde mínima (antes 40) - MÁS PEQUEÑA
        this.stableZoneMax = 55; // Zona verde máxima (antes 60) - MÁS PEQUEÑA
        this.warningZoneMin = 25; // Zona amarilla mínima
        this.warningZoneMax = 75; // Zona amarilla máxima
        
        // Velocidad de variación de barras (MÁS AGRESIVA)
        this.baseVariationSpeed = 1.8; // Aumentado de 0.8 - MÁS CAOS
        this.currentVariationSpeed = this.baseVariationSpeed;
        this.chaosMultiplier = 1.5; // Aumentado de 1.0 - MÁS INESTABILIDAD
    }

    preload() {
        // No necesitamos precargar imágenes
    }

    create() {
        const { width, height } = this.cameras.main;

        // Fondo mejorado con gradiente
        this.createEnhancedBackground();

        // Título con animación de entrada
        this.createAnimatedTitle();

        // Núcleo central con animaciones realistas
        this.createRealisticCore();

        // Nuevo sistema de órbitas
        this.createOrbitalSystem();

        // Botones con animaciones
        this.createAnimatedButtons();

        // UI de tiempo mejorada
        this.createEnhancedTimeUI();

        // Crear barras de energía visuales
        this.createEnergyBars();

        // Sistema de partículas avanzado
        this.createAdvancedParticles();

        // Instrucciones con animación
        this.createAnimatedInstructions();

        // Efectos de entrada
        this.createEntryEffects();

        // Mostrar recuadro de instrucciones antes de comenzar
        this.showStartInstructions();
    }

    createEnhancedBackground() {
        const { width, height } = this.cameras.main;
        
        // Fondo del universo con gradiente espacial profundo MÁS OPACO
        const universeBackground = this.add.graphics();
        universeBackground.fillGradientStyle(0x000033, 0x000055, 0x220066, 0x330088);
        universeBackground.fillRect(0, 0, width, height);
        
        // Capa adicional de opacidad para mejorar visibilidad
        const opacityLayer = this.add.graphics();
        opacityLayer.fillStyle(0x000000, 0.4); // Capa negra semi-transparente
        opacityLayer.fillRect(0, 0, width, height);
        
        // Nebulosas coloridas MÁS TENUES
        const nebula1 = this.add.graphics();
        nebula1.fillStyle(0x4400aa, 0.15); // Reducido de 0.3 a 0.15
        nebula1.fillEllipse(width * 0.2, height * 0.3, 300, 200);
        nebula1.setBlendMode(Phaser.BlendModes.ADD);
        
        const nebula2 = this.add.graphics();
        nebula2.fillStyle(0x0066ff, 0.1); // Reducido de 0.2 a 0.1
        nebula2.fillEllipse(width * 0.8, height * 0.7, 250, 180);
        nebula2.setBlendMode(Phaser.BlendModes.ADD);
        
        const nebula3 = this.add.graphics();
        nebula3.fillStyle(0xff0066, 0.08); // Reducido de 0.15 a 0.08
        nebula3.fillEllipse(width * 0.6, height * 0.2, 200, 150);
        nebula3.setBlendMode(Phaser.BlendModes.ADD);
        
        // Galaxias distantes MÁS TENUES
        for (let i = 0; i < 8; i++) {
            const galaxy = this.add.graphics();
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 20 + Math.random() * 40;
            
            galaxy.fillStyle(0xffffff, 0.05 + Math.random() * 0.1); // Reducido significativamente
            galaxy.fillEllipse(x, y, size, size * 0.3);
            galaxy.setRotation(Math.random() * Math.PI * 2);
            galaxy.setBlendMode(Phaser.BlendModes.ADD);
        }
        
        // Estrellas brillantes con diferentes tamaños y colores MÁS TENUES
        for (let i = 0; i < 150; i++) {
            const star = this.add.graphics();
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 1 + Math.random() * 3;
            const colors = [0xffffff, 0xffffaa, 0xaaffff, 0xffaaff, 0xaaffaa];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            star.fillStyle(color, 0.3 + Math.random() * 0.2); // Reducido de 0.6-1.0 a 0.3-0.5
            star.fillCircle(x, y, size);
            
            // Animación de parpadeo para algunas estrellas
            if (Math.random() < 0.3) {
                this.tweens.add({
                    targets: star,
                    alpha: 0.2,
                    duration: 1000 + Math.random() * 2000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        }
        
        // Polvo cósmico animado
        for (let i = 0; i < 50; i++) {
            const dust = this.add.graphics();
            const x = Math.random() * width;
            const y = Math.random() * height;
            
            dust.fillStyle(0x6666aa, 0.1);
            dust.fillCircle(x, y, 1);
            
            // Movimiento lento del polvo cósmico
            this.tweens.add({
                targets: dust,
                x: x + (Math.random() - 0.5) * 100,
                y: y + (Math.random() - 0.5) * 100,
                duration: 10000 + Math.random() * 10000,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createAnimatedTitle() {
        const { width, height } = this.cameras.main;
        
        // Título principal más llamativo
        const mainTitle = this.add.text(width/2, 80, 'NEXUS GALACTICO', {
            fontSize: '48px',
            fill: '#00ffff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#0066aa',
            strokeThickness: 3
        }).setOrigin(0.5).setAlpha(0);

        // Subtítulo épico
        const subTitle = this.add.text(width/2, 130, 'ESTABILIZACION DEL NUCLEO UNIVERSAL', {
            fontSize: '20px',
            fill: '#88aaff',
            fontFamily: 'Arial',
            fontStyle: 'italic'
        }).setOrigin(0.5).setAlpha(0);

        // Efectos de resplandor en el título
        const titleGlow = this.add.graphics();
        titleGlow.fillStyle(0x00ffff, 0.2);
        titleGlow.fillEllipse(width/2, 80, 400, 60);
        titleGlow.setBlendMode(Phaser.BlendModes.ADD);
        titleGlow.setAlpha(0);

        // Animaciones de entrada épicas
        this.tweens.add({
            targets: [mainTitle, subTitle],
            alpha: 1,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 2000,
            ease: 'Back.easeOut',
            delay: 500
        });

        this.tweens.add({
            targets: titleGlow,
            alpha: 0.3,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Efecto de pulsación en el título principal
        this.tweens.add({
            targets: mainTitle,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createRealisticCore() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        // Anillos de energía externos
        for (let i = 0; i < 3; i++) {
            const ring = this.add.circle(centerX, centerY, 90 + i * 15, 0x000000, 0);
            ring.setStrokeStyle(2, 0x4488ff, 0.4 - i * 0.1);
            this.coreRings.push(ring);

            // Rotación de anillos
            this.tweens.add({
                targets: ring,
                rotation: Math.PI * 2,
                duration: 4000 + i * 1000,
                repeat: -1,
                ease: 'Linear'
            });
        }

        // Ondas de energía
        for (let i = 0; i < 4; i++) {
            const wave = this.add.circle(centerX, centerY, 60 + i * 20, 0x000000, 0);
            wave.setStrokeStyle(1, 0x00aaff, 0.3);
            this.energyWaves.push(wave);
        }

        // Núcleo principal con múltiples capas
        this.coreGlow = this.add.circle(centerX, centerY, 80, 0x4488ff, 0.2);
        this.core = this.add.circle(centerX, centerY, 50, 0x6699ff, 0.8);
        const coreInner = this.add.circle(centerX, centerY, 30, 0x88aaff, 0.9);
        const coreCenter = this.add.circle(centerX, centerY, 15, 0xaaccff, 1);

        // Partículas del núcleo
        for (let i = 0; i < 20; i++) {
            const particle = this.add.circle(centerX, centerY, 2, 0x00ffff, 0.8);
            this.coreParticles.push({
                sprite: particle,
                angle: (i / 20) * Math.PI * 2,
                distance: 60 + Math.random() * 20,
                speed: 0.02 + Math.random() * 0.01,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    createOrbitalSystem() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        // Crear órbita visual (círculo de referencia)
        const orbitCircle = this.add.circle(centerX, centerY, this.orbitRadius, 0x444444, 0);
        orbitCircle.setStrokeStyle(2, 0x666666, 0.3);

        // Zona de estabilidad visual (removida)
        const stabilityZoneRadius = this.orbitRadius * 0.15;
        // this.stabilityIndicator = this.add.circle(centerX, centerY, stabilityZoneRadius, 0x00ff00, 0.2);
        // this.stabilityIndicator.setStrokeStyle(3, 0x00ff00, 0.6);

        // Crear orbe de Andrómeda (rojo)
        this.andromedaOrb = this.add.circle(
            centerX + Math.cos(this.andromedaAngle) * this.orbitRadius,
            centerY + Math.sin(this.andromedaAngle) * this.orbitRadius,
            15, 0xff4444
        );
        this.andromedaOrb.setStrokeStyle(3, 0xff6666);

        // Crear orbe de Vía Láctea (violeta)
        this.viaLacteaOrb = this.add.circle(
            centerX + Math.cos(this.viaLacteaAngle) * this.orbitRadius,
            centerY + Math.sin(this.viaLacteaAngle) * this.orbitRadius,
            15, 0x8844ff
        );
        this.viaLacteaOrb.setStrokeStyle(3, 0xaa66ff);

        // Efectos de brillo
        this.andromedaOrb.setBlendMode(Phaser.BlendModes.ADD);
        this.viaLacteaOrb.setBlendMode(Phaser.BlendModes.ADD);

        // Etiquetas
        this.add.text(centerX - this.orbitRadius - 80, centerY, 'ANDROMEDA', {
            fontSize: '16px',
            fill: '#ff6666',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.add.text(centerX + this.orbitRadius + 80, centerY, 'VIA LACTEA', {
            fontSize: '16px',
            fill: '#aa66ff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Indicadores de velocidad
        this.andromedaSpeedText = this.add.text(centerX - this.orbitRadius - 80, centerY + 30, '', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.viaLacteaSpeedText = this.add.text(centerX + this.orbitRadius + 80, centerY + 30, '', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        console.log('Sistema orbital creado - Andrómeda:', this.andromedaSpeed, 'Vía Láctea:', this.viaLacteaSpeed);
    }

    createAnimatedButtons() {
        const { width, height } = this.cameras.main;

        // Posiciones más centradas
        const redButtonX = width * 0.3; // Más hacia el centro
        const redButtonY = height - 120;
        const violetButtonX = width * 0.7; // Más hacia el centro
        const violetButtonY = height - 120;

        // === BOTÓN ROJO MEJORADO ===
        // Marco hexagonal futurista
        const redFrame = this.add.graphics();
        redFrame.lineStyle(4, 0xff6666, 0.9);
        redFrame.fillStyle(0x220000, 0.8);
        this.drawHexagon(redFrame, redButtonX, redButtonY, 45);
        redFrame.fillPath();
        redFrame.strokePath();

        // Resplandor exterior
        const redGlow = this.add.graphics();
        redGlow.lineStyle(8, 0xff4444, 0.4);
        this.drawHexagon(redGlow, redButtonX, redButtonY, 50);
        redGlow.strokePath();
        redGlow.setBlendMode(Phaser.BlendModes.ADD);

        // Botón principal
        this.redButton = this.add.graphics();
        this.redButton.fillStyle(0xff4444, 0.9);
        this.drawHexagon(this.redButton, redButtonX, redButtonY, 35);
        this.redButton.fillPath();
        this.redButton.setInteractive(new Phaser.Geom.Circle(redButtonX, redButtonY, 40), Phaser.Geom.Circle.Contains);

        // Texto con efectos
        const redText = this.add.text(redButtonX, redButtonY, 'A', {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#ff0000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Etiqueta descriptiva
        this.add.text(redButtonX, redButtonY + 65, 'ANDROMEDA', {
            fontSize: '12px',
            fill: '#ff8888',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // === BOTÓN VIOLETA MEJORADO ===
        // Marco hexagonal futurista
        const violetFrame = this.add.graphics();
        violetFrame.lineStyle(4, 0xaa66ff, 0.9);
        violetFrame.fillStyle(0x220044, 0.8);
        this.drawHexagon(violetFrame, violetButtonX, violetButtonY, 45);
        violetFrame.fillPath();
        violetFrame.strokePath();

        // Resplandor exterior
        const violetGlow = this.add.graphics();
        violetGlow.lineStyle(8, 0x8844ff, 0.4);
        this.drawHexagon(violetGlow, violetButtonX, violetButtonY, 50);
        violetGlow.strokePath();
        violetGlow.setBlendMode(Phaser.BlendModes.ADD);

        // Botón principal
        this.violetButton = this.add.graphics();
        this.violetButton.fillStyle(0x8844ff, 0.9);
        this.drawHexagon(this.violetButton, violetButtonX, violetButtonY, 35);
        this.violetButton.fillPath();
        this.violetButton.setInteractive(new Phaser.Geom.Circle(violetButtonX, violetButtonY, 40), Phaser.Geom.Circle.Contains);

        // Texto con efectos
        const violetText = this.add.text(violetButtonX, violetButtonY, 'V', {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#8800ff',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Etiqueta descriptiva
        this.add.text(violetButtonX, violetButtonY + 65, 'VIA LACTEA', {
            fontSize: '12px',
            fill: '#bb88ff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // === EVENTOS INTERACTIVOS ===
        this.redButton.on('pointerdown', () => this.activateButton('red'));
        this.violetButton.on('pointerdown', () => this.activateButton('violet'));
    }

    // Método auxiliar para dibujar hexágonos
    drawHexagon(graphics, x, y, radius) {
        graphics.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);
            if (i === 0) {
                graphics.moveTo(px, py);
            } else {
                graphics.lineTo(px, py);
            }
        }
        graphics.closePath();
    }

    createEnhancedTimeUI() {
        const { width, height } = this.cameras.main;

        // Posición en la esquina superior derecha
        const timerX = width - 120;
        const timerY = 50;

        // Marco futurista para el timer
        const timerFrame = this.add.graphics();
        timerFrame.lineStyle(3, 0x00ffff, 0.8);
        timerFrame.fillStyle(0x001122, 0.7);
        timerFrame.fillRoundedRect(timerX - 70, timerY - 35, 140, 70, 10);
        timerFrame.strokeRoundedRect(timerX - 70, timerY - 35, 140, 70, 10);

        // Efectos de resplandor del marco (sin animación)
        const frameGlow = this.add.graphics();
        frameGlow.lineStyle(6, 0x00ffff, 0.3);
        frameGlow.strokeRoundedRect(timerX - 72, timerY - 37, 144, 74, 12);
        frameGlow.setBlendMode(Phaser.BlendModes.ADD);

        // Etiqueta "TIEMPO"
        this.add.text(timerX, timerY - 15, 'TIEMPO', {
            fontSize: '12px',
            fill: '#88ccff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Texto del tiempo principal (sin animación)
        this.timeText = this.add.text(timerX, timerY + 8, '25', {
            fontSize: '32px',
            fill: '#00ffff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#004466',
            strokeThickness: 2
        }).setOrigin(0.5);
    }

    createEnergyBars() {
        const { width, height } = this.cameras.main;
        
        // Posiciones de las barras
        const barWidth = 40;
        const barHeight = 300;
        const redBarX = 80;
        const violetBarX = width - 80;
        const barY = height / 2;
        
        // === BARRA ROJA (ANDRÓMEDA) ===
        
        // Fondo de la barra roja
        this.redBarBackground = this.add.graphics();
        this.redBarBackground.fillStyle(0x330000, 0.8);
        this.redBarBackground.fillRoundedRect(redBarX - barWidth/2, barY - barHeight/2, barWidth, barHeight, 8);
        this.redBarBackground.lineStyle(3, 0x666666, 0.8);
        this.redBarBackground.strokeRoundedRect(redBarX - barWidth/2, barY - barHeight/2, barWidth, barHeight, 8);
        
        // Zonas de color en el fondo
        // Zona roja (crítica) - arriba y abajo
        this.redBarBackground.fillStyle(0x660000, 0.6);
        this.redBarBackground.fillRoundedRect(redBarX - barWidth/2 + 2, barY - barHeight/2 + 2, barWidth - 4, (barHeight * 0.25) - 2, 6);
        this.redBarBackground.fillRoundedRect(redBarX - barWidth/2 + 2, barY + barHeight/2 - (barHeight * 0.25), barWidth - 4, (barHeight * 0.25) - 2, 6);
        
        // Zona amarilla (advertencia)
        this.redBarBackground.fillStyle(0x664400, 0.6);
        this.redBarBackground.fillRoundedRect(redBarX - barWidth/2 + 2, barY - barHeight/2 + (barHeight * 0.25), barWidth - 4, (barHeight * 0.25), 6);
        this.redBarBackground.fillRoundedRect(redBarX - barWidth/2 + 2, barY + barHeight/2 - (barHeight * 0.5), barWidth - 4, (barHeight * 0.25), 6);
        
        // Zona verde (estable) - centro
        this.redBarBackground.fillStyle(0x004400, 0.6);
        this.redBarBackground.fillRoundedRect(redBarX - barWidth/2 + 2, barY - (barHeight * 0.1), barWidth - 4, (barHeight * 0.2), 6);
        
        // Barra de energía roja (valor actual)
        this.redBarGraphics = this.add.graphics();
        
        // Etiquetas para la barra roja
        this.add.text(redBarX, barY - barHeight/2 - 30, 'ANDRÓMEDA', {
            fontSize: '16px',
            fill: '#ff6666',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.redBarText = this.add.text(redBarX, barY + barHeight/2 + 20, '50%', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // === BARRA VIOLETA (VÍA LÁCTEA) ===
        
        // Fondo de la barra violeta
        this.violetBarBackground = this.add.graphics();
        this.violetBarBackground.fillStyle(0x330033, 0.8);
        this.violetBarBackground.fillRoundedRect(violetBarX - barWidth/2, barY - barHeight/2, barWidth, barHeight, 8);
        this.violetBarBackground.lineStyle(3, 0x666666, 0.8);
        this.violetBarBackground.strokeRoundedRect(violetBarX - barWidth/2, barY - barHeight/2, barWidth, barHeight, 8);
        
        // Zonas de color en el fondo
        // Zona roja (crítica) - arriba y abajo
        this.violetBarBackground.fillStyle(0x660066, 0.6);
        this.violetBarBackground.fillRoundedRect(violetBarX - barWidth/2 + 2, barY - barHeight/2 + 2, barWidth - 4, (barHeight * 0.25) - 2, 6);
        this.violetBarBackground.fillRoundedRect(violetBarX - barWidth/2 + 2, barY + barHeight/2 - (barHeight * 0.25), barWidth - 4, (barHeight * 0.25) - 2, 6);
        
        // Zona amarilla (advertencia)
        this.violetBarBackground.fillStyle(0x664466, 0.6);
        this.violetBarBackground.fillRoundedRect(violetBarX - barWidth/2 + 2, barY - barHeight/2 + (barHeight * 0.25), barWidth - 4, (barHeight * 0.25), 6);
        this.violetBarBackground.fillRoundedRect(violetBarX - barWidth/2 + 2, barY + barHeight/2 - (barHeight * 0.5), barWidth - 4, (barHeight * 0.25), 6);
        
        // Zona verde (estable) - centro
        this.violetBarBackground.fillStyle(0x004400, 0.6);
        this.violetBarBackground.fillRoundedRect(violetBarX - barWidth/2 + 2, barY - (barHeight * 0.1), barWidth - 4, (barHeight * 0.2), 6);
        
        // Barra de energía violeta (valor actual)
        this.violetBarGraphics = this.add.graphics();
        
        // Etiquetas para la barra violeta
        this.add.text(violetBarX, barY - barHeight/2 - 30, 'VÍA LÁCTEA', {
            fontSize: '16px',
            fill: '#aa66ff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.violetBarText = this.add.text(violetBarX, barY + barHeight/2 + 20, '50%', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Actualizar las barras inicialmente
        this.updateEnergyBarsDisplay();
    }

    createAdvancedParticles() {
        // Partículas principales
        this.particles = [];
        for (let i = 0; i < 30; i++) {
            const particle = this.add.circle(0, 0, 1 + Math.random() * 2, 0x00ffff, 0);
            this.particles.push({
                sprite: particle,
                vx: 0,
                vy: 0,
                life: 0,
                maxLife: 60 + Math.random() * 40,
                type: Math.random() > 0.5 ? 'energy' : 'spark'
            });
        }

        // Chispas decorativas
        this.sparkles = [];
        for (let i = 0; i < 15; i++) {
            const sparkle = this.add.circle(0, 0, 1, 0xffffff, 0);
            this.sparkles.push({
                sprite: sparkle,
                life: 0,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    createAnimatedInstructions() {
        // Método eliminado - sin instrucciones de texto
    }

    createEntryEffects() {
        const { width, height } = this.cameras.main;

        // Ondas de entrada
        for (let i = 0; i < 3; i++) {
            const wave = this.add.circle(width/2, height/2, 50, 0x00ffff, 0.3);

            this.tweens.add({
                targets: wave,
                scaleX: 8,
                scaleY: 8,
                alpha: 0,
                duration: 2000,
                delay: i * 300,
                ease: 'Power2.easeOut',
                onComplete: () => wave.destroy()
            });
        }
    }

    showStartInstructions() {
        const { width, height } = this.cameras.main;
        
        // Overlay semi-transparente
        const instructionOverlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.8);
        instructionOverlay.setInteractive();
        
        // Marco del recuadro de instrucciones
        const instructionFrame = this.add.graphics();
        instructionFrame.lineStyle(4, 0x00ffff, 1);
        instructionFrame.strokeRoundedRect(width/2 - 300, height/2 - 150, 600, 300, 15);
        instructionFrame.lineStyle(2, 0x0088ff, 0.8);
        instructionFrame.strokeRoundedRect(width/2 - 290, height/2 - 140, 580, 280, 10);
        
        // Fondo del recuadro
        const instructionBg = this.add.graphics();
        instructionBg.fillStyle(0x001122, 0.9);
        instructionBg.fillRoundedRect(width/2 - 290, height/2 - 140, 580, 280, 10);
        
        // Título de las instrucciones
        const instructionTitle = this.add.text(width/2, height/2 - 80, 'MISIÓN: EQUILIBRIO GALÁCTICO', {
            fontSize: '28px',
            fill: '#00ffff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#0088ff',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Texto de instrucciones detalladas
        const instructionText1 = this.add.text(width/2, height/2 - 40, 'OBJETIVO: Estabiliza las órbitas de las galaxias', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const instructionText2 = this.add.text(width/2, height/2 - 10, '• Usa los botones A (ANDRÓMEDA) y V (VÍA LÁCTEA)', {
            fontSize: '16px',
            fill: '#aaffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        const instructionText3 = this.add.text(width/2, height/2 + 15, '• Mantén ambas barras en la ZONA VERDE (45-55%)', {
            fontSize: '16px',
            fill: '#aaffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        const instructionText4 = this.add.text(width/2, height/2 + 40, '• ¡DEBES presionar botones para ganar!', {
            fontSize: '16px',
            fill: '#ffaaaa',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Botón para comenzar - AGRANDADO por solicitud del usuario
        const startButton = this.add.graphics();
        startButton.fillStyle(0x0066cc, 0.9);
        startButton.fillRoundedRect(width/2 - 140, height/2 + 80, 280, 70, 15);
        startButton.lineStyle(3, 0x00ffff, 1);
        startButton.strokeRoundedRect(width/2 - 140, height/2 + 80, 280, 70, 15);
        startButton.setInteractive(new Phaser.Geom.Rectangle(width/2 - 140, height/2 + 80, 280, 70), Phaser.Geom.Rectangle.Contains);
        
        // Texto del botón - AGRANDADO
        const startButtonText = this.add.text(width/2, height/2 + 115, 'DA CLICK PARA COMENZAR', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        
        // Acción del botón - comenzar el juego
        startButton.on('pointerdown', () => {
            // Efecto de desvanecimiento
            this.tweens.add({
                targets: [instructionOverlay, instructionFrame, instructionBg, instructionTitle, instructionText1, instructionText2, instructionText3, instructionText4, startButton, startButtonText],
                alpha: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    // Destruir elementos de instrucciones
                    instructionOverlay.destroy();
                    instructionFrame.destroy();
                    instructionBg.destroy();
                    instructionTitle.destroy();
                    instructionText1.destroy();
                    instructionText2.destroy();
                    instructionText3.destroy();
                    instructionText4.destroy();
                    startButton.destroy();
                    startButtonText.destroy();
                    
                    // Iniciar el juego
                    this.startGame();
                }
            });
        });
    }

    startGame() {
        this.gameStarted = true;
        this.gameEnded = false;
        this.criticalValueTime = 0; // Inicializar contador de valores críticos
        this.stableTime = 0; // Inicializar contador de tiempo estable

        // Timer del juego con dificultad aumentada
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateGameTime,
            callbackScope: this,
            loop: true
        });

        // Variación de barras OPTIMIZADA para reducir lag
        this.barTimer = this.time.addEvent({
            delay: 150, // Reducido de 100 a 150ms para mejor rendimiento
            callback: this.updateEnergyLevels,
            callbackScope: this,
            loop: true
        });

        // Efectos visuales OPTIMIZADOS para reducir lag
        this.effectsTimer = this.time.addEvent({
            delay: 100, // Reducido de 50 a 100ms para mejor rendimiento
            callback: this.updateAdvancedVisualEffects,
            callbackScope: this,
            loop: true
        });
    }

    updateEnergyLevels() {
        if (!this.gameStarted || this.gameEnded) return;

        // Variación caótica de las barras de energía
        const redVariation = (Math.random() - 0.5) * this.currentVariationSpeed * this.chaosMultiplier;
        const violetVariation = (Math.random() - 0.5) * this.currentVariationSpeed * this.chaosMultiplier;

        // Aplicar variaciones
        this.redBarValue += redVariation;
        this.violetBarValue += violetVariation;

        // Mantener valores en rango 0-100
        this.redBarValue = Math.max(0, Math.min(100, this.redBarValue));
        this.violetBarValue = Math.max(0, Math.min(100, this.violetBarValue));

        // Actualizar la visualización de las barras
        this.updateEnergyBarsDisplay();

        // Verificar condiciones críticas
        if (this.redBarValue <= 5 || this.redBarValue >= 95 || 
            this.violetBarValue <= 5 || this.violetBarValue >= 95) {
            this.createCriticalWarning();
        }
    }

    updateEnergyBarsDisplay() {
        const { width, height } = this.cameras.main;
        const barWidth = 40;
        const barHeight = 300;
        const redBarX = 80;
        const violetBarX = width - 80;
        const barY = height / 2;

        // === ACTUALIZAR BARRA ROJA ===
        this.redBarGraphics.clear();
        
        // Calcular altura de la barra basada en el valor
        const redFillHeight = (this.redBarValue / 100) * (barHeight - 4);
        const redFillY = barY + barHeight/2 - 2 - redFillHeight;
        
        // Determinar color basado en la zona
        let redColor = 0xff4444; // Rojo por defecto
        if (this.redBarValue >= this.stableZoneMin && this.redBarValue <= this.stableZoneMax) {
            redColor = 0x44ff44; // Verde estable
        } else if (this.redBarValue >= this.warningZoneMin && this.redBarValue <= this.warningZoneMax) {
            redColor = 0xffaa44; // Amarillo advertencia
        }
        
        // Dibujar la barra roja
        this.redBarGraphics.fillStyle(redColor, 0.8);
        this.redBarGraphics.fillRoundedRect(redBarX - barWidth/2 + 2, redFillY, barWidth - 4, redFillHeight, 6);
        
        // Efecto de brillo
        this.redBarGraphics.fillStyle(redColor, 0.4);
        this.redBarGraphics.fillRoundedRect(redBarX - barWidth/2 + 2, redFillY, (barWidth - 4) * 0.3, redFillHeight, 6);
        
        // Actualizar texto
        this.redBarText.setText(Math.round(this.redBarValue) + '%');
        this.redBarText.setFill(this.redBarValue >= this.stableZoneMin && this.redBarValue <= this.stableZoneMax ? '#44ff44' : 
                               this.redBarValue >= this.warningZoneMin && this.redBarValue <= this.warningZoneMax ? '#ffaa44' : '#ff4444');

        // === ACTUALIZAR BARRA VIOLETA ===
        this.violetBarGraphics.clear();
        
        // Calcular altura de la barra basada en el valor
        const violetFillHeight = (this.violetBarValue / 100) * (barHeight - 4);
        const violetFillY = barY + barHeight/2 - 2 - violetFillHeight;
        
        // Determinar color basado en la zona
        let violetColor = 0xaa44ff; // Violeta por defecto
        if (this.violetBarValue >= this.stableZoneMin && this.violetBarValue <= this.stableZoneMax) {
            violetColor = 0x44ff44; // Verde estable
        } else if (this.violetBarValue >= this.warningZoneMin && this.violetBarValue <= this.warningZoneMax) {
            violetColor = 0xffaa44; // Amarillo advertencia
        }
        
        // Dibujar la barra violeta
        this.violetBarGraphics.fillStyle(violetColor, 0.8);
        this.violetBarGraphics.fillRoundedRect(violetBarX - barWidth/2 + 2, violetFillY, barWidth - 4, violetFillHeight, 6);
        
        // Efecto de brillo
        this.violetBarGraphics.fillStyle(violetColor, 0.4);
        this.violetBarGraphics.fillRoundedRect(violetBarX - barWidth/2 + 2, violetFillY, (barWidth - 4) * 0.3, violetFillHeight, 6);
        
        // Actualizar texto
        this.violetBarText.setText(Math.round(this.violetBarValue) + '%');
        this.violetBarText.setFill(this.violetBarValue >= this.stableZoneMin && this.violetBarValue <= this.stableZoneMax ? '#44ff44' : 
                                  this.violetBarValue >= this.warningZoneMin && this.violetBarValue <= this.warningZoneMax ? '#ffaa44' : '#aa44ff');
    }

    updateGameTime() {
        if (!this.gameStarted || this.gameEnded) return;

        this.gameTime--;
        this.timeText.setText(this.gameTime.toString());

        // Cambios de color más dramáticos con dificultad aumentada
        if (this.gameTime <= 10) {
            this.timeText.setFill('#ff0000');
            this.currentVariationSpeed = this.baseVariationSpeed * 2.5; // Más agresivo

            // Efecto de parpadeo crítico
            this.tweens.add({
                targets: this.timeText,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 200,
                yoyo: true,
                ease: 'Power2.easeOut'
            });
        } else if (this.gameTime <= 20) {
            this.timeText.setFill('#ff8800');
            this.currentVariationSpeed = this.baseVariationSpeed * 2.0; // Más agresivo
        } else if (this.gameTime <= 30) {
            this.timeText.setFill('#ffaa00');
            this.currentVariationSpeed = this.baseVariationSpeed * 1.5; // Más agresivo
        }

        // LÓGICA CORREGIDA: Victoria/Derrota basada en estabilidad Y PARTICIPACIÓN ACTIVA
        if (this.gameTime <= 0) {
            // Verificar si las barras están en zona estable al final del tiempo
            const redStable = this.redBarValue >= this.stableZoneMin && this.redBarValue <= this.stableZoneMax;
            const violetStable = this.violetBarValue >= this.stableZoneMin && this.violetBarValue <= this.stableZoneMax;
            const finalStability = redStable && violetStable;
            
            // NUEVA CONDICIÓN: Verificar participación activa del jugador
            const hasActiveParticipation = this.playerActions >= this.requiredActions;
            
            // Victoria SOLO si hay estabilidad Y participación activa
            const victory = finalStability && hasActiveParticipation;
            
            // DEBUG: Mostrar valores para verificar
            console.log('=== FINAL DEL JUEGO ===');
            console.log('Barra Roja:', Math.round(this.redBarValue * 100) / 100, 'Estable:', redStable);
            console.log('Barra Violeta:', Math.round(this.violetBarValue * 100) / 100, 'Estable:', violetStable);
            console.log('Zona Verde: Min =', this.stableZoneMin, 'Max =', this.stableZoneMax);
            console.log('Acciones del jugador:', this.playerActions, 'de', this.requiredActions, 'requeridas');
            console.log('Estabilidad Final:', finalStability);
            console.log('Participación Activa:', hasActiveParticipation);
            console.log('Victoria Final:', victory);
            
            // Victoria SOLO si ambas condiciones se cumplen
            this.endGame(victory);
        }
    }

    updateOrbitalSpeeds() {
        if (!this.gameStarted || this.gameEnded) return;

        // Variación balanceada para velocidades orbitales
        const chaosAndromeda = (Math.random() - 0.5) * this.currentVariationSpeed * this.chaosMultiplier * 0.3; // Reducido para velocidades
        const chaosViaLactea = (Math.random() - 0.5) * this.currentVariationSpeed * this.chaosMultiplier * 0.3; // Reducido para velocidades

        // Aplicar variaciones moderadas
        this.andromedaSpeed += chaosAndromeda;
        this.viaLacteaSpeed += chaosViaLactea;

        // Mantener en rango con rebotes más suaves
        const maxSpeed = 5.0;
        const minSpeed = 0.5;
        
        if (this.andromedaSpeed > maxSpeed) {
            this.andromedaSpeed = maxSpeed;
            this.createOrbitalBurst('red');
        }
        if (this.andromedaSpeed < minSpeed) {
            this.andromedaSpeed = minSpeed;
            this.createOrbitalBurst('red');
        }

        if (this.viaLacteaSpeed > maxSpeed) {
            this.viaLacteaSpeed = maxSpeed;
            this.createOrbitalBurst('violet');
        }
        if (this.viaLacteaSpeed < minSpeed) {
            this.viaLacteaSpeed = minSpeed;
            this.createOrbitalBurst('violet');
        }

        this.updateOrbitalSystem();
        this.checkOrbitalStability();
    }

    updateOrbitalSystem() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        // DESHABILITADO: Aplicar caos orbital (cambios aleatorios en velocidad)
        // this.andromedaSpeed += (Math.random() - 0.5) * this.chaosForce;
        // this.viaLacteaSpeed += (Math.random() - 0.5) * this.chaosForce;

        // DESHABILITADO: Limitar velocidades
        // this.andromedaSpeed = Math.max(-5, Math.min(5, this.andromedaSpeed));
        // this.viaLacteaSpeed = Math.max(-5, Math.min(5, this.viaLacteaSpeed));

        // DESHABILITADO: Actualizar ángulos basados en velocidad
        // this.andromedaAngle += this.andromedaSpeed * 0.02;
        // this.viaLacteaAngle += this.viaLacteaSpeed * 0.02;

        // POSICIONES FIJAS: Los orbes permanecen estáticos
        if (this.andromedaOrb && this.andromedaOrb.active) {
            // Posición fija para Andrómeda (lado izquierdo)
            this.andromedaOrb.x = centerX - this.orbitRadius;
            this.andromedaOrb.y = centerY;
        }

        if (this.viaLacteaOrb && this.viaLacteaOrb.active) {
            // Posición fija para Vía Láctea (lado derecho)
            this.viaLacteaOrb.x = centerX + this.orbitRadius;
            this.viaLacteaOrb.y = centerY;
        }

        // Actualizar colores basados en estabilidad
        this.updateOrbColors();

        // DESHABILITADO: Actualizar indicadores de velocidad
        // if (this.andromedaSpeedText) {
        //     this.andromedaSpeedText.setText(`Velocidad: ${this.andromedaSpeed.toFixed(2)}`);
        // }
        // if (this.viaLacteaSpeedText) {
        //     this.viaLacteaSpeedText.setText(`Velocidad: ${this.viaLacteaSpeed.toFixed(2)}`);
        // }

        // console.log('Orbital Update - Andrómeda:', this.andromedaSpeed.toFixed(2), 'Vía Láctea:', this.viaLacteaSpeed.toFixed(2));
    }

    updateOrbColors() {
        // Determinar si las velocidades están en zona estable (cerca del objetivo)
        const andromedaStable = Math.abs(this.andromedaSpeed - this.targetSpeed) <= this.stabilityZone;
        const viaLacteaStable = Math.abs(this.viaLacteaSpeed - this.targetSpeed) <= this.stabilityZone;

        // Actualizar color de Andrómeda
        if (this.andromedaOrb && this.andromedaOrb.active) {
            if (andromedaStable) {
                this.andromedaOrb.fillColor = 0x44ff44; // Verde estable
                this.andromedaOrb.setStrokeStyle(3, 0x66ff66);
            } else if (Math.abs(this.andromedaSpeed) > 3) {
                this.andromedaOrb.fillColor = 0xff4444; // Rojo crítico
                this.andromedaOrb.setStrokeStyle(3, 0xff6666);
            } else {
                this.andromedaOrb.fillColor = 0xffaa44; // Naranja inestable
                this.andromedaOrb.setStrokeStyle(3, 0xffcc66);
            }
        }

        // Actualizar color de Vía Láctea
        if (this.viaLacteaOrb && this.viaLacteaOrb.active) {
            if (viaLacteaStable) {
                this.viaLacteaOrb.fillColor = 0x44ff44; // Verde estable
                this.viaLacteaOrb.setStrokeStyle(3, 0x66ff66);
            } else if (Math.abs(this.viaLacteaSpeed) > 3) {
                this.viaLacteaOrb.fillColor = 0x8844ff; // Violeta crítico
                this.viaLacteaOrb.setStrokeStyle(3, 0xaa66ff);
            } else {
                this.viaLacteaOrb.fillColor = 0xaa44ff; // Violeta inestable
                this.viaLacteaOrb.setStrokeStyle(3, 0xcc66ff);
            }
        }

        // Actualizar indicador de zona de estabilidad (removido)
        /*
        if (this.stabilityIndicator) {
            if (andromedaStable && viaLacteaStable) {
                this.stabilityIndicator.fillColor = 0x00ff00;
                this.stabilityIndicator.setStrokeStyle(3, 0x00ff00, 0.8);
            } else {
                this.stabilityIndicator.fillColor = 0xffaa00;
                this.stabilityIndicator.setStrokeStyle(3, 0xffaa00, 0.6);
            }
        }
        */
    }

    updateFlowEffects() {
        const { height } = this.cameras.main;
        const barY = height / 2;
        const barHeight = 300;

        // Efectos de flujo en barra roja
        this.redBarFlow.forEach((flow, index) => {
            flow.phase += 0.1;
            const flowY = flow.baseY - (this.redBarValue / 100) * barHeight + Math.sin(flow.phase) * 10;
            flow.sprite.setPosition(100 + Math.sin(flow.phase * 2) * 5, flowY);
            flow.sprite.setAlpha(0.4 + Math.sin(flow.phase) * 0.3);
        });

        // Efectos de flujo en barra violeta
        this.violetBarFlow.forEach((flow, index) => {
            flow.phase += 0.1;
            const flowY = flow.baseY - (this.violetBarValue / 100) * barHeight + Math.sin(flow.phase) * 10;
            const { width } = this.cameras.main;
            flow.sprite.setPosition(width - 100 + Math.sin(flow.phase * 2) * 5, flowY);
            flow.sprite.setAlpha(0.4 + Math.sin(flow.phase) * 0.3);
        });
    }

    checkOrbitalStability() {
        const stabilityZone = this.targetSpeed * this.stabilityZone;
        const andromedaStable = Math.abs(this.andromedaSpeed - this.targetSpeed) <= stabilityZone;
        const viaLacteaStable = Math.abs(this.viaLacteaSpeed - this.targetSpeed) <= stabilityZone;

        this.isStable = andromedaStable && viaLacteaStable;

        // Efectos visuales de estabilidad mejorados
        if (this.isStable) {
            this.core.setFillStyle(0x44ff44);
            this.coreGlow.setAlpha(0.4);
            this.createStabilityParticles();
            
            // Detener el temblor cuando está estable
            this.screenShake.intensity = 0;
            this.screenShake.duration = 0;
            
            // Resetear contador de valores críticos cuando está estable
            this.criticalValueTime = 0;
            
            // ELIMINADO: Victoria temprana por estabilidad - solo se gana/pierde cuando termine el tiempo
        } else {
            this.core.setFillStyle(0x6699ff);
            this.coreGlow.setAlpha(0.2);
            this.stableTime = 0; // Resetear tiempo estable
            
            // Activar temblor de pantalla SOLO cuando NO está estable (no en críticas)
            this.startScreenShake(2, 100); // Intensidad 2, duración 100ms
        }

        // ELIMINADO: Verificación de fallo por valores críticos - solo se pierde cuando termine el tiempo
        // El juego ahora solo termina cuando el tiempo se agota
    }

    updateAdvancedVisualEffects() {
        this.pulsePhase += 0.05;
        this.wavePhase += 0.03;
        this.rotationPhase += 0.02;
        this.flowPhase += 0.08;

        // Actualizar resplandor del núcleo
        const glowIntensity = 0.2 + Math.sin(this.pulsePhase) * 0.1;
        this.coreGlow.setAlpha(glowIntensity);

        // Actualizar ondas de energía
        this.energyWaves.forEach((wave, index) => {
            const waveAlpha = 0.3 + Math.sin(this.wavePhase + index * 0.5) * 0.2;
            wave.setAlpha(waveAlpha);

            const waveScale = 1 + Math.sin(this.wavePhase + index * 0.3) * 0.1;
            wave.setScale(waveScale);
        });

        // Actualizar partículas del núcleo
        this.updateQuantumParticles();

        // Actualizar sistema de partículas avanzado
        this.updateAdvancedParticles();
    }

    updateQuantumParticles() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        this.coreParticles.forEach(particle => {
            particle.angle += particle.speed;
            particle.phase += 0.1;

            const distance = particle.distance + Math.sin(particle.phase) * 10;
            const x = centerX + Math.cos(particle.angle) * distance;
            const y = centerY + Math.sin(particle.angle) * distance;

            particle.sprite.setPosition(x, y);
            particle.sprite.setAlpha(0.6 + Math.sin(particle.phase) * 0.4);
        });
    }

    updateAdvancedParticles() {
        // Actualizar partículas principales
        this.particles.forEach(particle => {
            if (particle.life > 0) {
                particle.sprite.x += particle.vx;
                particle.sprite.y += particle.vy;
                particle.life--;

                const alpha = particle.life / particle.maxLife;
                particle.sprite.setAlpha(alpha);

                if (particle.life <= 0) {
                    particle.sprite.setAlpha(0);
                }
            }
        });

        // Actualizar chispas decorativas
        this.sparkles.forEach(sparkle => {
            sparkle.phase += 0.2;
            const alpha = 0.3 + Math.sin(sparkle.phase) * 0.3;
            sparkle.sprite.setAlpha(alpha);
        });
    }

    activateButton(color) {
        // Solo permitir activación si el juego ha comenzado
        if (!this.gameStarted) return;
        
        console.log('Botón activado:', color); // Debug
        this.stabilizeOrbitalSpeed(color);
        this.createButtonRipple(color);
        this.createActivationWave(color);
    }

    stabilizeOrbitalSpeed(color) {
        const stabilizationForce = 0.5 + Math.random() * 0.3; // Fuerza de estabilización orbital

        // CONTAR ACCIÓN DEL JUGADOR - REQUERIDO PARA GANAR
        this.playerActions++;
        this.lastActionTime = this.gameTime;
        console.log('Acción del jugador #' + this.playerActions + ' de ' + this.requiredActions + ' requeridas');

        if (color === 'red') {
            // Mover hacia la velocidad objetivo
            if (this.andromedaSpeed > this.targetSpeed) {
                this.andromedaSpeed = Math.max(this.targetSpeed, this.andromedaSpeed - stabilizationForce);
            } else {
                this.andromedaSpeed = Math.min(this.targetSpeed, this.andromedaSpeed + stabilizationForce);
            }
            
            // Actualizar barra de energía roja hacia zona estable
            const stabilizationAmount = 8 + Math.random() * 7; // 8-15 puntos
            if (this.redBarValue > this.stableZoneMax) {
                this.redBarValue = Math.max(this.stableZoneMax, this.redBarValue - stabilizationAmount);
            } else if (this.redBarValue < this.stableZoneMin) {
                this.redBarValue = Math.min(this.stableZoneMin, this.redBarValue + stabilizationAmount);
            } else {
                // Ya está en zona estable, pequeño ajuste hacia el centro
                const center = (this.stableZoneMin + this.stableZoneMax) / 2;
                if (this.redBarValue > center) {
                    this.redBarValue = Math.max(center, this.redBarValue - stabilizationAmount * 0.3);
                } else {
                    this.redBarValue = Math.min(center, this.redBarValue + stabilizationAmount * 0.3);
                }
            }
            
            this.createOrbitalBurst('red');
            this.createStabilizationEffect('red');
        } else if (color === 'violet') {
            // Mover hacia la velocidad objetivo
            if (this.viaLacteaSpeed > this.targetSpeed) {
                this.viaLacteaSpeed = Math.max(this.targetSpeed, this.viaLacteaSpeed - stabilizationForce);
            } else {
                this.viaLacteaSpeed = Math.min(this.targetSpeed, this.viaLacteaSpeed + stabilizationForce);
            }
            
            // Actualizar barra de energía violeta hacia zona estable
            const stabilizationAmount = 8 + Math.random() * 7; // 8-15 puntos
            if (this.violetBarValue > this.stableZoneMax) {
                this.violetBarValue = Math.max(this.stableZoneMax, this.violetBarValue - stabilizationAmount);
            } else if (this.violetBarValue < this.stableZoneMin) {
                this.violetBarValue = Math.min(this.stableZoneMin, this.violetBarValue + stabilizationAmount);
            } else {
                // Ya está en zona estable, pequeño ajuste hacia el centro
                const center = (this.stableZoneMin + this.stableZoneMax) / 2;
                if (this.violetBarValue > center) {
                    this.violetBarValue = Math.max(center, this.violetBarValue - stabilizationAmount * 0.3);
                } else {
                    this.violetBarValue = Math.min(center, this.violetBarValue + stabilizationAmount * 0.3);
                }
            }
            
            this.createOrbitalBurst('violet');
            this.createStabilizationEffect('violet');
        }

        this.updateOrbitalSystem();
        
        // Resetear contadores críticos cuando el jugador actúa
        this.criticalValueTime = 0;
    }

    createButtonRipple(color) {
        const { width, height } = this.cameras.main;
        const buttonX = color === 'red' ? width * 0.3 : width * 0.7;
        const buttonY = height - 120;

        const ripple = this.add.circle(buttonX, buttonY, 30, color === 'red' ? 0xff4444 : 0x8844ff, 0.6);

        this.tweens.add({
            targets: ripple,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 500,
            ease: 'Power2.easeOut',
            onComplete: () => ripple.destroy()
        });
    }

    createActivationWave(color) {
        const { width, height } = this.cameras.main;
        const buttonX = color === 'red' ? width * 0.3 : width * 0.7;
        const buttonY = height - 120;

        for (let i = 0; i < 5; i++) {
            const wave = this.add.circle(buttonX, buttonY, 10, color === 'red' ? 0xff6666 : 0xaa66ff, 0.4);

            this.tweens.add({
                targets: wave,
                scaleX: 2 + i * 0.5,
                scaleY: 2 + i * 0.5,
                alpha: 0,
                duration: 800 + i * 100,
                delay: i * 50,
                ease: 'Power2.easeOut',
                onComplete: () => wave.destroy()
            });
        }
    }

    createOrbitalBurst(color) {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Obtener posición del orbe correspondiente
        const orbX = color === 'red' ? 
            centerX + Math.cos(this.andromedaAngle) * this.orbitRadius :
            centerX + Math.cos(this.viaLacteaAngle) * this.orbitRadius;
        const orbY = color === 'red' ? 
            centerY + Math.sin(this.andromedaAngle) * this.orbitRadius :
            centerY + Math.sin(this.viaLacteaAngle) * this.orbitRadius;

        // Crear ráfaga de partículas orbitales
        for (let i = 0; i < 8; i++) {
            const particle = this.add.circle(orbX, orbY, 3, color === 'red' ? 0xff6666 : 0xaa66ff, 0.8);

            const angle = (i / 8) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;

            this.tweens.add({
                targets: particle,
                x: orbX + Math.cos(angle) * 50,
                y: orbY + Math.sin(angle) * 50,
                alpha: 0,
                duration: 600,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    createStabilizationEffect(color) {
        // Efecto visual en la barra de energía correspondiente
        const barX = color === 'red' ? 50 : this.cameras.main.width - 150;
        const barY = 150;

        // Crear partículas de estabilización
        for (let i = 0; i < 6; i++) {
            const particle = this.add.circle(
                barX + Math.random() * 100, 
                barY + Math.random() * 200, 
                2, 
                0x44ff44, 
                0.8
            );

            this.tweens.add({
                targets: particle,
                y: barY + 100,
                alpha: 0,
                duration: 800 + Math.random() * 400,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }

        // Efecto de brillo en la barra
        const glowEffect = this.add.rectangle(barX + 50, barY + 100, 100, 200, 0x44ff44, 0.3);
        
        this.tweens.add({
            targets: glowEffect,
            alpha: 0,
            duration: 600,
            ease: 'Power2.easeOut',
            onComplete: () => glowEffect.destroy()
        });
    }

    createStabilityParticles() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        // Crear partículas de estabilidad
        for (let i = 0; i < 3; i++) {
            const particle = this.add.circle(centerX, centerY, 2, 0x44ff44, 0.8);

            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 40;

            this.tweens.add({
                targets: particle,
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                alpha: 0,
                duration: 1000,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    createCriticalWarning() {
        // Efecto de advertencia crítica
        this.cameras.main.shake(100, 0.01);

        // Flash rojo
        const flash = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            0xff0000,
            0.2
        );

        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 200,
            onComplete: () => flash.destroy()
        });
    }

    triggerExplosion() {
        if (this.explosionTriggered) return;
        this.explosionTriggered = true;

        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        // === EFECTOS DE DISTORSIÓN DE PANTALLA ===
        
        // Efecto de glitch en toda la pantalla
        const glitchOverlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0);
        
        // Crear líneas de interferencia
        const interferenceLines = [];
        for (let i = 0; i < 20; i++) {
            const line = this.add.rectangle(
                Math.random() * width, 
                Math.random() * height, 
                width, 
                2 + Math.random() * 4, 
                0xffffff, 
                0.8
            );
            interferenceLines.push(line);
        }

        // Animación de glitch con parpadeo
        this.tweens.add({
            targets: glitchOverlay,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 15,
            ease: 'Power2.easeInOut',
            onComplete: () => glitchOverlay.destroy()
        });

        // Animación de líneas de interferencia
        interferenceLines.forEach((line, index) => {
            this.tweens.add({
                targets: line,
                x: Math.random() * width,
                alpha: 0,
                duration: 200 + Math.random() * 300,
                delay: index * 50,
                ease: 'Power2.easeOut',
                onComplete: () => line.destroy()
            });
        });

        // Efecto de distorsión cromática
        const chromaticShift = this.add.graphics();
        chromaticShift.fillStyle(0xff0000, 0.1);
        chromaticShift.fillRect(0, 0, width, height);
        chromaticShift.setBlendMode(Phaser.BlendModes.MULTIPLY);

        this.tweens.add({
            targets: chromaticShift,
            x: 5,
            alpha: 0,
            duration: 500,
            ease: 'Power2.easeOut',
            onComplete: () => chromaticShift.destroy()
        });

        // Explosión mejorada con múltiples ondas
        for (let wave = 0; wave < 5; wave++) {
            const explosion = this.add.circle(centerX, centerY, 50, 0xff4444, 0.8 - wave * 0.15);

            this.tweens.add({
                targets: explosion,
                scaleX: 15 + wave * 2,
                scaleY: 15 + wave * 2,
                alpha: 0,
                duration: 1500 + wave * 200,
                delay: wave * 100,
                ease: 'Power2.easeOut',
                onComplete: () => explosion.destroy()
            });
        }

        // Partículas de explosión mejoradas
        for (let i = 0; i < 40; i++) {
            const particle = this.add.circle(centerX, centerY, 3 + Math.random() * 4, 0xff6644, 1);

            const angle = (i / 40) * Math.PI * 2;
            const speed = 5 + Math.random() * 10;
            const distance = 100 + Math.random() * 250;

            this.tweens.add({
                targets: particle,
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                alpha: 0,
                scaleX: 0.1,
                scaleY: 0.1,
                duration: 2000 + Math.random() * 500,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }

        // Fragmentos de "circuitos" que se desintegran
        for (let i = 0; i < 15; i++) {
            const fragment = this.add.rectangle(
                centerX + (Math.random() - 0.5) * 200,
                centerY + (Math.random() - 0.5) * 200,
                10 + Math.random() * 20,
                2,
                0x00ffff,
                0.8
            );

            this.tweens.add({
                targets: fragment,
                x: fragment.x + (Math.random() - 0.5) * 300,
                y: fragment.y + (Math.random() - 0.5) * 300,
                rotation: Math.random() * Math.PI * 2,
                alpha: 0,
                duration: 1500 + Math.random() * 1000,
                ease: 'Power2.easeOut',
                onComplete: () => fragment.destroy()
            });
        }

        // Shake de cámara intenso con múltiples fases
        this.cameras.main.shake(500, 0.03);
        this.time.delayedCall(600, () => {
            this.cameras.main.shake(800, 0.02);
        });
        this.time.delayedCall(1500, () => {
            this.cameras.main.shake(1000, 0.01);
        });

        this.endGame(false);
    }

    endGame(victory) {
        this.gameEnded = true;
        this.gameStarted = false;

        if (this.gameTimer) this.gameTimer.remove();
        if (this.barTimer) this.barTimer.remove();
        if (this.effectsTimer) this.effectsTimer.remove();

        const { width, height } = this.cameras.main;

        if (victory) {
            // Overlay de victoria con efectos espectaculares
            const victoryOverlay = this.add.rectangle(width/2, height/2, width, height, 0x000033, 0.85);
            victoryOverlay.setAlpha(0);
            
            // Marco de victoria con efectos dorados
            const victoryFrame = this.add.graphics();
            victoryFrame.lineStyle(4, 0xffd700, 1);
            victoryFrame.strokeRoundedRect(width/2 - 350, height/2 - 200, 700, 400, 20);
            victoryFrame.lineStyle(2, 0xffff00, 0.8);
            victoryFrame.strokeRoundedRect(width/2 - 340, height/2 - 190, 680, 380, 15);
            victoryFrame.setAlpha(0);
            
            // Líneas decorativas de victoria
            const victoryLines = this.add.graphics();
            victoryLines.lineStyle(3, 0x00ffff, 0.7);
            for (let i = 0; i < 8; i++) {
                const angle = (i * 45) * Math.PI / 180;
                const startX = width/2 + Math.cos(angle) * 120;
                const startY = height/2 + Math.sin(angle) * 120;
                const endX = width/2 + Math.cos(angle) * 180;
                const endY = height/2 + Math.sin(angle) * 180;
                victoryLines.moveTo(startX, startY);
                victoryLines.lineTo(endX, endY);
            }
            victoryLines.setAlpha(0);

            // Mensaje principal de felicitaciones con efectos dramáticos
            const victoryText = this.add.text(width/2, height/2 - 120, '¡FELICITACIONES!', {
                fontSize: '56px',
                fill: '#ffd700',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                stroke: '#ffff00',
                strokeThickness: 3,
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#ffd700',
                    blur: 15,
                    stroke: true,
                    fill: true
                }
            }).setOrigin(0.5).setAlpha(0);

            // Código de éxito galáctico
            const successCode = this.add.text(width/2, height/2 - 80, 'CÓDIGO: SINCRONIZACIÓN-UNIVERSAL-EXITOSA', {
                fontSize: '18px',
                fill: '#00ffff',
                fontFamily: 'Courier New',
                fontStyle: 'bold',
                stroke: '#0088ff',
                strokeThickness: 1
            }).setOrigin(0.5).setAlpha(0);

            // Subtítulo mejorado
            const subText = this.add.text(width/2, height/2 - 40, '¡EQUILIBRIO CÓSMICO RESTAURADO!', {
                fontSize: '28px',
                fill: '#88ff88',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                stroke: '#44ff44',
                strokeThickness: 2,
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#88ff88',
                    blur: 10,
                    stroke: true,
                    fill: true
                }
            }).setOrigin(0.5).setAlpha(0);

            // Feedback detallado y mejorado
            const feedbackText = this.add.text(width/2, height/2 + 20, 'Has logrado estabilizar con éxito las galaxias Andrómeda y Vía Láctea.\nLas fuerzas gravitacionales están en perfecta armonía.\nEl multiverso está a salvo de la fragmentación cuántica.', {
                fontSize: '18px',
                fill: '#aaffaa',
                fontFamily: 'Arial',
                align: 'center',
                lineSpacing: 8,
                stroke: '#66cc66',
                strokeThickness: 1
            }).setOrigin(0.5).setAlpha(0);

            // Estadísticas de logro
            const achievementText = this.add.text(width/2, height/2 + 90, '★ LOGRO DESBLOQUEADO: MAESTRO DEL EQUILIBRIO GALÁCTICO ★\nPrecisión: 100% | Tiempo de Respuesta: Óptimo | Estado: HÉROE CÓSMICO', {
                fontSize: '16px',
                fill: '#ffaa00',
                fontFamily: 'Arial',
                align: 'center',
                lineSpacing: 6,
                fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0);

            // Animaciones secuenciales de victoria
            this.tweens.add({
                targets: victoryOverlay,
                alpha: 1,
                duration: 800,
                ease: 'Power2'
            });

            this.time.delayedCall(300, () => {
                this.tweens.add({
                    targets: [victoryFrame, victoryLines],
                    alpha: 1,
                    duration: 1000,
                    ease: 'Back.easeOut'
                });
            });

            this.time.delayedCall(600, () => {
                this.tweens.add({
                    targets: victoryText,
                    alpha: 1,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 1200,
                    ease: 'Elastic.easeOut'
                });
            });

            this.time.delayedCall(900, () => {
                this.tweens.add({
                    targets: [successCode, subText],
                    alpha: 1,
                    y: '-=10',
                    duration: 1000,
                    ease: 'Back.easeOut'
                });
            });

            this.time.delayedCall(1200, () => {
                this.tweens.add({
                    targets: [feedbackText, achievementText],
                    alpha: 1,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 1000,
                    ease: 'Back.easeOut'
                });
            });

            // Efectos de celebración mejorados
            this.createCelebrationEffects();

            // Botón continuar futurista después de mostrar todos los efectos
            this.time.delayedCall(2500, () => {
                // Marco hexagonal del botón
                const buttonFrame = this.add.graphics();
                buttonFrame.lineStyle(3, 0x00ffff, 1);
                this.drawHexagon(buttonFrame, width/2, height/2 + 160, 80);
                buttonFrame.lineStyle(2, 0x0088ff, 0.8);
                this.drawHexagon(buttonFrame, width/2, height/2 + 160, 70);
                buttonFrame.setAlpha(0);

                // Resplandor del botón
                const buttonGlow = this.add.graphics();
                buttonGlow.fillStyle(0x00ffff, 0.2);
                this.drawHexagon(buttonGlow, width/2, height/2 + 160, 85);
                buttonGlow.setAlpha(0);

                // Botón principal
                const continueButton = this.add.graphics();
                continueButton.fillStyle(0x0066cc, 0.9);
                this.drawHexagon(continueButton, width/2, height/2 + 160, 65);
                continueButton.setInteractive(new Phaser.Geom.Circle(width/2, height/2 + 160, 65), Phaser.Geom.Circle.Contains);
                continueButton.setAlpha(0);

                // Texto del botón
                const continueText = this.add.text(width/2, height/2 + 160, 'CONTINUAR', {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    fontStyle: 'bold',
                    stroke: '#00ffff',
                    strokeThickness: 2,
                    shadow: {
                        offsetX: 0,
                        offsetY: 0,
                        color: '#00ffff',
                        blur: 8,
                        stroke: true,
                        fill: true
                    }
                }).setOrigin(0.5).setAlpha(0);

                // Etiqueta descriptiva del botón
                const buttonLabel = this.add.text(width/2, height/2 + 200, '', {
                    fontSize: '14px',
                    fill: '#88ccff',
                    fontFamily: 'Arial',
                    fontStyle: 'bold'
                }).setOrigin(0.5).setAlpha(0);

                // Animación de aparición del botón
                this.tweens.add({
                    targets: [buttonFrame, buttonGlow, continueButton, continueText, buttonLabel],
                    alpha: 1,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 800,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        this.tweens.add({
                            targets: [buttonFrame, buttonGlow, continueButton, continueText, buttonLabel],
                            scaleX: 1,
                            scaleY: 1,
                            duration: 300,
                            ease: 'Back.easeOut'
                        });
                    }
                });

                // Efectos hover del botón
                continueButton.on('pointerover', () => {
                    this.tweens.add({
                        targets: [continueButton, continueText],
                        scaleX: 1.15,
                        scaleY: 1.15,
                        duration: 200,
                        ease: 'Back.easeOut'
                    });
                    
                    this.tweens.add({
                        targets: buttonGlow,
                        alpha: 0.4,
                        scaleX: 1.2,
                        scaleY: 1.2,
                        duration: 200,
                        ease: 'Power2'
                    });
                });

                continueButton.on('pointerout', () => {
                    this.tweens.add({
                        targets: [continueButton, continueText],
                        scaleX: 1,
                        scaleY: 1,
                        duration: 200,
                        ease: 'Back.easeOut'
                    });
                    
                    this.tweens.add({
                        targets: buttonGlow,
                        alpha: 0.2,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 200,
                        ease: 'Power2'
                    });
                });

                // Acción del botón
                continueButton.on('pointerdown', () => {
                    // Efecto de activación
                    this.tweens.add({
                        targets: [continueButton, continueText],
                        scaleX: 0.95,
                        scaleY: 0.95,
                        duration: 100,
                        ease: 'Power2',
                        yoyo: true,
                        onComplete: () => {
                            // Transición a la siguiente escena
                            this.scene.start('scenaVideo4');
                        }
                    });
                    
                    // Onda de activación
                    const activationWave = this.add.graphics();
                    activationWave.lineStyle(4, 0x00ffff, 1);
                    this.drawHexagon(activationWave, width/2, height/2 + 160, 65);
                    
                    this.tweens.add({
                        targets: activationWave,
                        scaleX: 2,
                        scaleY: 2,
                        alpha: 0,
                        duration: 600,
                        ease: 'Power2',
                        onComplete: () => {
                            activationWave.destroy();
                        }
                    });
                });
            });

        } else {
            this.triggerExplosion();

            this.time.delayedCall(2000, () => {
                // === MENSAJE DE FALLO CRÍTICO MEJORADO ===
                
                // Fondo de emergencia con efecto de alarma
                const emergencyOverlay = this.add.rectangle(width/2, height/2, width, height, 0x330000, 0.8);
                emergencyOverlay.setAlpha(0);
                
                // Marco de alerta crítica
                const alertFrame = this.add.graphics();
                alertFrame.lineStyle(8, 0xff0000, 1);
                alertFrame.strokeRect(50, height/2 - 120, width - 100, 240);
                alertFrame.setAlpha(0);
                
                // Líneas de advertencia en las esquinas
                const warningLines = this.add.graphics();
                warningLines.lineStyle(4, 0xffff00, 1);
                // Esquina superior izquierda
                warningLines.moveTo(60, height/2 - 110);
                warningLines.lineTo(120, height/2 - 110);
                warningLines.moveTo(60, height/2 - 110);
                warningLines.lineTo(60, height/2 - 50);
                // Esquina superior derecha
                warningLines.moveTo(width - 60, height/2 - 110);
                warningLines.lineTo(width - 120, height/2 - 110);
                warningLines.moveTo(width - 60, height/2 - 110);
                warningLines.lineTo(width - 60, height/2 - 50);
                // Esquina inferior izquierda
                warningLines.moveTo(60, height/2 + 110);
                warningLines.lineTo(120, height/2 + 110);
                warningLines.moveTo(60, height/2 + 110);
                warningLines.lineTo(60, height/2 + 50);
                // Esquina inferior derecha
                warningLines.moveTo(width - 60, height/2 + 110);
                warningLines.lineTo(width - 120, height/2 + 110);
                warningLines.moveTo(width - 60, height/2 + 110);
                warningLines.lineTo(width - 60, height/2 + 50);
                warningLines.strokePath();
                warningLines.setAlpha(0);

                // Texto principal con efectos dramáticos
                const defeatText = this.add.text(width/2, height/2 - 60, '⚠ FALLO CRÍTICO ⚠', {
                    fontSize: '48px',
                    fill: '#ff0000',
                    fontFamily: 'Arial',
                    fontStyle: 'bold',
                    stroke: '#ffffff',
                    strokeThickness: 3,
                    shadow: {
                        offsetX: 0,
                        offsetY: 0,
                        color: '#ff0000',
                        blur: 10,
                        stroke: true,
                        fill: true
                    }
                }).setOrigin(0.5).setAlpha(0);

                // Código de error futurista
                const errorCode = this.add.text(width/2, height/2 - 20, 'ERROR CODE: NX-7734', {
                    fontSize: '16px',
                    fill: '#ffaa00',
                    fontFamily: 'Courier New',
                    fontStyle: 'bold'
                }).setOrigin(0.5).setAlpha(0);

                // Mensaje descriptivo mejorado
                const subText = this.add.text(width/2, height/2 + 10, 'COLAPSO TOTAL DEL NÚCLEO UNIVERSAL', {
                    fontSize: '20px',
                    fill: '#ff6666',
                    fontFamily: 'Arial',
                    fontStyle: 'bold'
                }).setOrigin(0.5).setAlpha(0);

                const consequenceText = this.add.text(width/2, height/2 + 35, 'Las galaxias se desintegran en el vacío cósmico', {
                    fontSize: '14px',
                    fill: '#ff9999',
                    fontFamily: 'Arial',
                    fontStyle: 'italic'
                }).setOrigin(0.5).setAlpha(0);

                // Animación de entrada dramática
                this.tweens.add({
                    targets: emergencyOverlay,
                    alpha: 0.8,
                    duration: 500,
                    ease: 'Power2.easeOut'
                });

                this.tweens.add({
                    targets: [alertFrame, warningLines],
                    alpha: 1,
                    duration: 800,
                    delay: 200,
                    ease: 'Power2.easeOut'
                });

                this.tweens.add({
                    targets: defeatText,
                    alpha: 1,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 1000,
                    delay: 500,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        // Efecto de parpadeo del texto principal
                        this.tweens.add({
                            targets: defeatText,
                            alpha: 0.3,
                            duration: 300,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Power2.easeInOut'
                        });
                    }
                });

                this.tweens.add({
                    targets: [errorCode, subText, consequenceText],
                    alpha: 1,
                    duration: 1000,
                    delay: 800,
                    ease: 'Power2.easeOut'
                });

                // Efecto de parpadeo en las líneas de advertencia
                this.tweens.add({
                    targets: warningLines,
                    alpha: 0.3,
                    duration: 500,
                    delay: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Power2.easeInOut'
                });

                // Botón de reinicio mejorado con estilo futurista
                this.time.delayedCall(1500, () => {
                    // Marco hexagonal para el botón - posición más baja
                    const buttonFrame = this.add.graphics();
                    buttonFrame.lineStyle(3, 0x00aaff, 1);
                    buttonFrame.fillStyle(0x001133, 0.9);
                    this.drawHexagon(buttonFrame, width/2, height/2 + 120, 60);
                    buttonFrame.fillPath();
                    buttonFrame.strokePath();

                    // Resplandor del botón
                    const buttonGlow = this.add.graphics();
                    buttonGlow.lineStyle(6, 0x0088ff, 0.5);
                    this.drawHexagon(buttonGlow, width/2, height/2 + 120, 65);
                    buttonGlow.strokePath();
                    buttonGlow.setBlendMode(Phaser.BlendModes.ADD);

                    // Botón principal - centrado dentro del hexágono
                    const restartButton = this.add.circle(width/2, height/2 + 120, 30, 0x0066cc, 0.9);
                    restartButton.setInteractive();

                    const restartText = this.add.text(width/2, height/2 + 120, 'REINTENTAR', {
                        fontSize: '14px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        fontStyle: 'bold',
                        stroke: '#003366',
                        strokeThickness: 1
                    }).setOrigin(0.5);

                    // Etiqueta del botón - debajo del hexágono
                    const buttonLabel = this.add.text(width/2, height/2 + 155, '', {
                        fontSize: '10px',
                        fill: '#66aaff',
                        fontFamily: 'Arial',
                        alpha: 0.8
                    }).setOrigin(0.5);

                    // Sin efectos hover - botón estático
                    restartButton.on('pointerdown', () => {
                        this.scene.restart();
                    });
                });
            });
        }
    }

    createCelebrationEffects() {
        const { width, height } = this.cameras.main;

        // Fuegos artificiales de celebración
        for (let i = 0; i < 20; i++) {
            const firework = this.add.circle(
                width/2 + (Math.random() - 0.5) * 400,
                height/2 + (Math.random() - 0.5) * 300,
                5,
                Phaser.Display.Color.HSVToRGB(Math.random(), 1, 1).color,
                0.8
            );

            this.tweens.add({
                targets: firework,
                scaleX: 3,
                scaleY: 3,
                alpha: 0,
                duration: 1500,
                delay: Math.random() * 1000,
                ease: 'Power2.easeOut',
                onComplete: () => firework.destroy()
            });
        }
    }

    // Método para iniciar el temblor de pantalla
    startScreenShake(intensity, duration) {
        this.screenShake.intensity = intensity;
        this.screenShake.duration = duration;
        this.shakeTimer = 0;
    }

    // Método para actualizar el temblor de pantalla
    updateScreenShake(delta) {
        if (this.screenShake.duration > 0) {
            this.shakeTimer += delta;
            
            if (this.shakeTimer < this.screenShake.duration) {
                // Calcular desplazamiento aleatorio
                const progress = this.shakeTimer / this.screenShake.duration;
                const currentIntensity = this.screenShake.intensity * (1 - progress);
                
                this.screenShake.x = (Math.random() - 0.5) * currentIntensity * 2;
                this.screenShake.y = (Math.random() - 0.5) * currentIntensity * 2;
                
                // Aplicar el temblor a la cámara
                this.cameras.main.setScroll(this.screenShake.x, this.screenShake.y);
            } else {
                // Terminar el temblor
                this.screenShake.intensity = 0;
                this.screenShake.duration = 0;
                this.screenShake.x = 0;
                this.screenShake.y = 0;
                this.cameras.main.setScroll(0, 0);
            }
        }
    }

    update(time, delta) {
        if (!this.gameStarted || this.gameEnded) return;

        // Actualizar el temblor de pantalla
        this.updateScreenShake(delta);

        // CRÍTICO: Actualizar el sistema orbital
        this.updateOrbitalSpeeds();
        this.updateOrbitalSystem();
        this.updateFlowEffects();
        this.updateAdvancedVisualEffects();
        this.updateQuantumParticles();
        this.updateAdvancedParticles();
        
        // Verificar estabilidad del sistema
        this.checkOrbitalStability();
    }
}

window.ScenaPregunta1 = ScenaPregunta1;