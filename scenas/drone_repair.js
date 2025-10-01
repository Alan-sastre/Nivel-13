class DroneRepairScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DroneRepairScene' });
        this.viruses = [];
        this.firewalls = [];
        this.placedFirewalls = 0;
        this.maxFirewalls = 4; // Restaurado de 3 a 4
        this.virusesDestroyed = 0;
        this.virusesReachedCore = 0;
        this.totalViruses = 24; // Cambiado de 35 a 24
        this.virusSpawnCount = 0;
        this.virusSpeed = 1.0;
        this.coreHealth = 100;
        this.maxCoreHealth = 100;
        this.gameEnded = false;
        this.gamePaused = false; // Inicializar en false

        // Puntos estratégicos para colocar firewalls - restaurado a 4 puntos
        this.strategicPoints = [
            { x: 200, y: 150 },
            { x: 400, y: 300 },
            { x: 550, y: 150 },
            { x: 700, y: 280 }  // Cuarto punto restaurado
        ];

        // Camino que siguen los virus (más complejo)
        this.path = [
            { x: 50, y: 250 },
            { x: 150, y: 200 },
            { x: 250, y: 300 },
            { x: 350, y: 150 },
            { x: 450, y: 350 },
            { x: 550, y: 200 },
            { x: 650, y: 300 },
            { x: 750, y: 150 },
            { x: 850, y: 250 },
            { x: 900, y: 250 }
        ];
    }

    preload() {
        // No necesitamos precargar imágenes, crearemos el fondo con gráficos
    }

    create() {
        // Crear fondo con gráficos
        this.createBackground();

        // Dibujar el camino del laberinto
        this.drawPath();

        // Dibujar puntos estratégicos
        this.drawStrategicPoints();

        // Núcleo central - mejorado visualmente
        this.core = this.add.circle(900, 250, 30, 0x00ff00);
        this.core.setStrokeStyle(4, 0x00ffff);

        // Efecto de pulsación del núcleo
        this.tweens.add({
            targets: this.core,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Título del núcleo debajo del núcleo - mejorado visualmente
        this.coreLabel = this.add.text(900, 290, 'NÚCLEO', {
            fontSize: '18px',
            fill: '#00ffff',
            fontFamily: 'Arial Black',
            stroke: '#000000',
            strokeThickness: 3,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5, 0.5);

        // Efecto de brillo pulsante para el texto del núcleo
        this.tweens.add({
            targets: this.coreLabel,
            alpha: 0.7,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Efecto de escala sutil para el texto del núcleo
        this.tweens.add({
            targets: this.coreLabel,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Power2'
        });

        // UI Elements
        this.createUI();

        // Configurar eventos
        this.setupEvents();

        // Iniciar spawn de virus
        this.startVirusSpawn();

        // Crear sonidos
        this.createSounds();

        // Crear recuadro de instrucciones
        this.createInstructionBox();
    }

    createBackground() {
        // Fondo base negro
        this.add.rectangle(500, 250, 1000, 500, 0x000000);

        // Crear grid dinámico con efectos de iluminación
        const graphics = this.add.graphics();

        // Grid principal
        graphics.lineStyle(1, 0x003366, 0.6);
        for (let x = 0; x <= 1000; x += 25) {
            graphics.lineBetween(x, 0, x, 500);
        }
        for (let y = 0; y <= 500; y += 25) {
            graphics.lineBetween(0, y, 1000, y);
        }

        // Grid secundario más sutil
        graphics.lineStyle(1, 0x001133, 0.3);
        for (let x = 12.5; x <= 1000; x += 25) {
            graphics.lineBetween(x, 0, x, 500);
        }
        for (let y = 12.5; y <= 500; y += 25) {
            graphics.lineBetween(0, y, 1000, y);
        }

        // Efectos de iluminación ambiental
        this.createAmbientLighting();

        // Partículas de fondo flotantes
        this.createBackgroundParticles();

        // Efectos de escaneo
        this.createScanLines();
    }

    createAmbientLighting() {
        // Luces pulsantes en las esquinas
        const lightPositions = [
            {x: 100, y: 100}, {x: 900, y: 100},
            {x: 100, y: 400}, {x: 900, y: 400}
        ];

        lightPositions.forEach((pos, index) => {
            const light = this.add.circle(pos.x, pos.y, 80, 0x0066cc, 0.1);

            this.tweens.add({
                targets: light,
                alpha: 0.2,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 3000 + (index * 500),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // Luz central más intensa
        const centralLight = this.add.circle(500, 250, 150, 0x0099ff, 0.05);
        this.tweens.add({
            targets: centralLight,
            alpha: 0.15,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createBackgroundParticles() {
        // Crear partículas flotantes de fondo
        this.backgroundParticles = [];
        for (let i = 0; i < 20; i++) {
            const particle = this.add.circle(
                Math.random() * 1000,
                Math.random() * 500,
                Math.random() * 2 + 0.5,
                0x0099ff,
                0.3
            );

            this.backgroundParticles.push(particle);

            // Movimiento flotante aleatorio
            this.tweens.add({
                targets: particle,
                x: Math.random() * 1000,
                y: Math.random() * 500,
                alpha: 0.1,
                duration: 8000 + Math.random() * 4000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createScanLines() {
        // Líneas de escaneo horizontales
        for (let i = 0; i < 3; i++) {
            const scanLine = this.add.rectangle(
                -50,
                Math.random() * 500,
                100, 2,
                0x00ffff,
                0.6
            );

            this.tweens.add({
                targets: scanLine,
                x: 1050,
                duration: 4000 + Math.random() * 2000,
                delay: i * 1500,
                repeat: -1,
                ease: 'Linear'
            });
        }

        // Líneas de escaneo verticales
        for (let i = 0; i < 2; i++) {
            const scanLine = this.add.rectangle(
                Math.random() * 1000,
                -25,
                2, 50,
                0x00ffff,
                0.4
            );

            this.tweens.add({
                targets: scanLine,
                y: 525,
                duration: 3000 + Math.random() * 1000,
                delay: i * 2000,
                repeat: -1,
                ease: 'Linear'
            });
        }
    }

    drawPath() {
        // Crear contenedor para todos los efectos del camino
        this.pathContainer = this.add.container(0, 0);

        // 1. Camino base con gradiente
        this.drawBasePathWithGradient();

        // 2. Efectos de circuitos digitales
        this.drawDigitalCircuits();

        // 3. Partículas de datos fluyendo
        this.createDataFlowParticles();

        // 4. Efectos de pulso energético
        // this.createEnergyPulses(); // Eliminado - círculos verdes que recorren el sistema

        // 5. Nodos de conexión en los puntos del camino
        this.drawConnectionNodes();

        // 6. Efectos ambientales del camino
        this.createPathAmbientEffects();
    }

    drawBasePathWithGradient() {
        const graphics = this.add.graphics();

        // Camino principal con múltiples capas
        for (let layer = 0; layer < 3; layer++) {
            const width = 16 - layer * 4;
            const alpha = 0.8 - layer * 0.2;
            let color;

            switch(layer) {
                case 0: color = 0x001122; break; // Azul oscuro exterior
                case 1: color = 0x003366; break; // Azul medio
                case 2: color = 0x0066cc; break; // Azul brillante interior
            }

            graphics.lineStyle(width, color, alpha);

            for (let i = 0; i < this.path.length - 1; i++) {
                graphics.lineBetween(
                    this.path[i].x, this.path[i].y,
                    this.path[i + 1].x, this.path[i + 1].y
                );
            }
        }

        // Línea central brillante con efecto de flujo
        graphics.lineStyle(2, 0x00ffff, 1);
        for (let i = 0; i < this.path.length - 1; i++) {
            graphics.lineBetween(
                this.path[i].x, this.path[i].y,
                this.path[i + 1].x, this.path[i + 1].y
            );
        }

        this.pathContainer.add(graphics);
    }

    drawDigitalCircuits() {
        const circuitGraphics = this.add.graphics();

        // Circuitos paralelos con patrones hexagonales
        for (let side = 0; side < 2; side++) {
            const offset = side === 0 ? -8 : 8;

            circuitGraphics.lineStyle(2, 0x0088ff, 0.6);

            for (let i = 0; i < this.path.length - 1; i++) {
                const startX = this.path[i].x;
                const startY = this.path[i].y + offset;
                const endX = this.path[i + 1].x;
                const endY = this.path[i + 1].y + offset;

                // Línea principal del circuito
                circuitGraphics.lineBetween(startX, startY, endX, endY);

                // Conectores hexagonales cada cierta distancia
                const distance = Phaser.Math.Distance.Between(startX, startY, endX, endY);
                const segments = Math.floor(distance / 30);

                for (let j = 1; j < segments; j++) {
                    const t = j / segments;
                    const hexX = startX + (endX - startX) * t;
                    const hexY = startY + (endY - startY) * t;

                    // Dibujar hexágono pequeño
                    this.drawHexagon(circuitGraphics, hexX, hexY, 3, 0x00aaff, 0.8);
                }
            }
        }

        // Conectores transversales
        circuitGraphics.lineStyle(1, 0x0066aa, 0.4);
        for (let i = 0; i < this.path.length; i++) {
            circuitGraphics.lineBetween(
                this.path[i].x, this.path[i].y - 8,
                this.path[i].x, this.path[i].y + 8
            );
        }

        this.pathContainer.add(circuitGraphics);
    }

    drawHexagon(graphics, x, y, radius, color, alpha) {
        graphics.fillStyle(color, alpha);
        graphics.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const hexX = x + Math.cos(angle) * radius;
            const hexY = y + Math.sin(angle) * radius;
            if (i === 0) {
                graphics.moveTo(hexX, hexY);
            } else {
                graphics.lineTo(hexX, hexY);
            }
        }
        graphics.closePath();
        graphics.fillPath();
    }

    createDataFlowParticles() {
        // Crear partículas que fluyen por el camino
        this.dataParticles = [];

        for (let i = 0; i < 15; i++) {
            const particle = this.add.circle(
                this.path[0].x,
                this.path[0].y,
                2,
                0x00ffff,
                0.8
            );

            particle.pathProgress = Math.random();
            particle.speed = 0.005 + Math.random() * 0.01;
            particle.glowIntensity = Math.random();

            this.dataParticles.push(particle);
            this.pathContainer.add(particle);
        }

        // Animar las partículas
        this.time.addEvent({
            delay: 50,
            callback: this.updateDataParticles,
            callbackScope: this,
            loop: true
        });
    }

    updateDataParticles() {
        if (!this.dataParticles) return;

        this.dataParticles.forEach(particle => {
            particle.pathProgress += particle.speed;

            if (particle.pathProgress >= 1) {
                particle.pathProgress = 0;
            }

            // Calcular posición en el camino
            const segmentIndex = Math.floor(particle.pathProgress * (this.path.length - 1));
            const segmentProgress = (particle.pathProgress * (this.path.length - 1)) - segmentIndex;

            if (segmentIndex < this.path.length - 1) {
                const startPoint = this.path[segmentIndex];
                const endPoint = this.path[segmentIndex + 1];

                particle.x = startPoint.x + (endPoint.x - startPoint.x) * segmentProgress;
                particle.y = startPoint.y + (endPoint.y - startPoint.y) * segmentProgress;
            }

            // Efecto de brillo pulsante
            particle.glowIntensity += 0.1;
            const alpha = 0.5 + Math.sin(particle.glowIntensity) * 0.3;
            particle.setAlpha(alpha);
        });
    }

    createEnergyPulses() {
        // Crear pulsos de energía que recorren el camino
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                const pulse = this.add.circle(this.path[0].x, this.path[0].y, 8, 0x00ff88, 0.6);
                pulse.setStrokeStyle(2, 0x00ffff, 0.8);

                // Animar el pulso a lo largo del camino
                let currentSegment = 0;

                const movePulse = () => {
                    if (currentSegment >= this.path.length - 1) {
                        pulse.destroy();
                        return;
                    }

                    this.tweens.add({
                        targets: pulse,
                        x: this.path[currentSegment + 1].x,
                        y: this.path[currentSegment + 1].y,
                        duration: 300,
                        ease: 'Power2',
                        onComplete: () => {
                            currentSegment++;
                            movePulse();
                        }
                    });
                };

                movePulse();

                // Efecto de escala pulsante
                this.tweens.add({
                    targets: pulse,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    duration: 500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });

            },
            loop: true
        });
    }

    drawConnectionNodes() {
        // Nodos de conexión en cada punto del camino
        this.path.forEach((point, index) => {
            // Nodo principal
            const node = this.add.circle(point.x, point.y, 6, 0x003366, 0.8);
            node.setStrokeStyle(2, 0x0099ff, 1);

            // Anillo exterior animado
            const ring = this.add.circle(point.x, point.y, 10, 0x000000, 0);
            ring.setStrokeStyle(1, 0x00ffff, 0.6);

            // Animación del anillo
            this.tweens.add({
                targets: ring,
                scaleX: 2,
                scaleY: 2,
                alpha: 0,
                duration: 2000,
                delay: index * 200,
                repeat: -1,
                ease: 'Power2'
            });

            // Efectos de partículas en los nodos
            if (index % 2 === 0) {
                for (let i = 0; i < 4; i++) {
                    const sparkle = this.add.circle(
                        point.x + (Math.random() - 0.5) * 20,
                        point.y + (Math.random() - 0.5) * 20,
                        1,
                        0x00ffff,
                        0.8
                    );

                    this.tweens.add({
                        targets: sparkle,
                        x: point.x + (Math.random() - 0.5) * 40,
                        y: point.y + (Math.random() - 0.5) * 40,
                        alpha: 0,
                        duration: 1000 + Math.random() * 1000,
                        delay: Math.random() * 2000,
                        repeat: -1,
                        ease: 'Power2'
                    });
                }
            }

            this.pathContainer.add(node);
            this.pathContainer.add(ring);
        });
    }

    createPathAmbientEffects() {
        // Efectos ambientales a lo largo del camino
        for (let i = 0; i < this.path.length - 1; i++) {
            const startPoint = this.path[i];
            const endPoint = this.path[i + 1];

            // Crear efectos de interferencia digital
            const midX = (startPoint.x + endPoint.x) / 2;
            const midY = (startPoint.y + endPoint.y) / 2;

            // Líneas de interferencia
            for (let j = 0; j < 3; j++) {
                const interference = this.add.rectangle(
                    midX + (Math.random() - 0.5) * 60,
                    midY + (Math.random() - 0.5) * 60,
                    1,
                    Math.random() * 10 + 5,
                    0x0088ff,
                    0.3
                );

                this.tweens.add({
                    targets: interference,
                    alpha: 0.8,
                    duration: 200 + Math.random() * 300,
                    yoyo: true,
                    repeat: -1,
                    delay: Math.random() * 1000
                });

                this.pathContainer.add(interference);
            }
        }

        // Efecto de escaneo que recorre todo el camino
        // this.createPathScanEffect(); // Eliminado - línea verde que recorre el sistema
    }

    createPathScanEffect() {
        const scanLine = this.add.rectangle(this.path[0].x, this.path[0].y, 3, 20, 0x00ff00, 0.8);
        scanLine.angle = 45;

        let currentSegment = 0;

        const moveScan = () => {
            if (currentSegment >= this.path.length - 1) {
                currentSegment = 0;
            }

            this.tweens.add({
                targets: scanLine,
                x: this.path[currentSegment + 1].x,
                y: this.path[currentSegment + 1].y,
                duration: 800,
                ease: 'Linear',
                onComplete: () => {
                    currentSegment++;
                    moveScan();
                }
            });
        };

        moveScan();

        // Efecto de rotación del escáner
        this.tweens.add({
            targets: scanLine,
            angle: 405,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });

        this.pathContainer.add(scanLine);
    }

    drawStrategicPoints() {
        this.strategicPoints.forEach((point, index) => {
            const circle = this.add.circle(point.x, point.y, 18, 0x444444, 0.6);
            circle.setStrokeStyle(3, 0x00ffff);
            circle.setInteractive();
            circle.pointIndex = index;

            circle.on('pointerdown', () => {
                this.placeFirewall(point, index);
            });

            // Efecto hover
            circle.on('pointerover', () => {
                if (!point.occupied && this.canPlaceFirewall()) {
                    circle.setFillStyle(0x0066cc, 0.8);
                    circle.setScale(1.1);
                }
            });

            circle.on('pointerout', () => {
                if (!point.occupied) {
                    circle.setFillStyle(0x444444, 0.6);
                    circle.setScale(1.0);
                }
            });
        });
    }

    createUI() {
        // Título del juego - centrado en la parte superior
        this.add.text(400, 15, 'DEFENSA DEL NÚCLEO DIGITAL', {
            fontSize: '22px',
            fill: '#00ffff',
            fontFamily: 'Arial Black',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Crear la barra de vida del núcleo
        this.createCoreLifeBar();

        // Panel de información principal - esquina superior izquierda
        const mainPanelX = 20;
        const mainPanelY = 60;

        // Contador de firewalls
        this.firewallCountText = this.add.text(mainPanelX, mainPanelY, 'FIREWALLS: 0/4', {
            fontSize: '16px',
            fill: '#00ff00',
            fontFamily: 'Arial Black',
            stroke: '#000000',
            strokeThickness: 2
        });

        // Contador de virus
        this.virusCountText = this.add.text(mainPanelX, mainPanelY + 25, 'VIRUS: 0/24', {
            fontSize: '16px',
            fill: '#ff0000',
            fontFamily: 'Arial Black',
            stroke: '#000000',
            strokeThickness: 2
        });

        // Velocidad
        this.speedText = this.add.text(mainPanelX, mainPanelY + 50, 'VELOCIDAD: x1.0', {
            fontSize: '16px',
            fill: '#ffff00',
            fontFamily: 'Arial Black',
            stroke: '#000000',
            strokeThickness: 2
        });



        // Estadísticas del juego - parte inferior
        this.eliminatedText = this.add.text(20, 570, 'Eliminados: 0', {
            fontSize: '14px',
            fill: '#00ff00',
            fontFamily: 'Arial Black',
            stroke: '#000000',
            strokeThickness: 2
        });

        this.reachedText = this.add.text(200, 570, 'Núcleo alcanzado: 0', {
            fontSize: '14px',
            fill: '#ff6600',
            fontFamily: 'Arial Black',
            stroke: '#000000',
            strokeThickness: 2
        });
    }

    createCoreLifeBar() {
        // Fondo de la barra de vida - reposicionado para no traspasar
        this.coreHealthBarBg = this.add.rectangle(620, 55, 180, 18, 0x333333);
        this.coreHealthBarBg.setStrokeStyle(2, 0x0099ff);

        // Barra de vida principal
        this.coreHealthBar = this.add.rectangle(620, 55, 176, 14, 0xff0000);

        // Texto de vida - mejorado visualmente
        this.coreLifeLabel = this.add.text(420, 47, 'NÚCLEO:', {
            fontSize: '18px',
            fill: '#00ffff',
            fontFamily: 'Arial Black',
            stroke: '#000000',
            strokeThickness: 3,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000000',
                blur: 3,
                stroke: true,
                fill: true
            }
        });

        // Efecto de brillo pulsante para el texto de la barra de vida
        this.tweens.add({
            targets: this.coreLifeLabel,
            alpha: 0.8,
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.coreHealthText = this.add.text(720, 55, '100/100', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Arial Black',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);

        // Efecto de brillo en la barra
        this.coreLifeGlow = this.add.rectangle(620, 55, 180, 18, 0xff0000, 0.3);
        this.tweens.add({
            targets: this.coreLifeGlow,
            alpha: 0.1,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    setupEvents() {
        // Configurar eventos adicionales si es necesario
    }

    startVirusSpawn() {
        this.virusSpawnTimer = this.time.addEvent({
            delay: 1200, // Más rápido: cada 1.2 segundos
            callback: this.spawnVirus,
            callbackScope: this,
            repeat: this.totalViruses - 1
        });
    }

    spawnVirus() {
        // No generar virus si el juego está pausado o terminado
        if (this.gameEnded || this.gamePaused) return;

        // Determinar tipo de virus basado en el número spawneado
        let virusType = 'normal';
        if (this.virusSpawnCount > 15 && this.virusSpawnCount % 4 === 0) {
            virusType = 'fast'; // Virus rápido cada 4 después del 15
        } else if (this.virusSpawnCount > 25 && this.virusSpawnCount % 6 === 0) {
            virusType = 'armored'; // Virus blindado cada 6 después del 25
        }

        const virus = new Virus(this, this.path, virusType, this.virusSpeed);
        this.viruses.push(virus);
        this.virusSpawnCount++;

        // Aumentar velocidad gradualmente
        if (this.virusSpawnCount % 8 === 0) {
            this.virusSpeed += 0.15;
        }

        this.updateUI();
        this.playSound('virusSpawn');
    }

    placeFirewall(point, index) {
        if (!this.canPlaceFirewall() || point.occupied) {
            return;
        }

        if (this.placedFirewalls < this.maxFirewalls) {
            const firewall = new Firewall(this, point.x, point.y);
            this.firewalls.push(firewall);

            point.occupied = true;
            this.placedFirewalls++;

            // Actualizar visual del punto
            const circle = this.children.list.find(child =>
                child.x === point.x && child.y === point.y && child.type === 'Arc'
            );
            if (circle) {
                circle.setFillStyle(0x0099ff, 0.9);
                circle.setScale(1.0);
            }

            this.updateUI();
            this.playSound('firewallPlace');
            this.createElectricEffect(point.x, point.y);
        }
    }

    canPlaceFirewall() {
        return this.placedFirewalls < this.maxFirewalls &&
               !this.gameEnded;
    }

    update() {
        // Si el juego está pausado, no actualizar nada
        if (this.gamePaused || this.gameEnded) return;

        // Actualizar virus
        this.viruses.forEach((virus, index) => {
            virus.update();

            if (virus.reachedEnd) {
                this.virusReachedCore();
                this.viruses.splice(index, 1);
                virus.destroy();
            }
        });

        // Actualizar firewalls
        this.firewalls.forEach(firewall => {
            firewall.update(this.viruses);
        });

        // Verificar condiciones de victoria/derrota
        this.checkGameEnd();
    }

    virusReachedCore() {
        this.virusesReachedCore++;
        this.coreHealth -= 25; // Aumentado de 5 a 25 para que 4 virus destruyan el núcleo (100/25 = 4)
        if (this.coreHealth < 0) this.coreHealth = 0;

        this.updateUI();
        this.playSound('coreDamage');
        this.createCoreHitEffect();
    }

    virusDestroyed() {
        this.virusesDestroyed++;
        this.updateUI();
        this.playSound('virusDestroy');
    }

    checkGameEnd() {
        const totalProcessed = this.virusesDestroyed + this.virusesReachedCore;

        if (totalProcessed >= this.totalViruses) {
            const successRate = (this.virusesDestroyed / this.totalViruses) * 100;

            if (successRate >= 70) {
                this.gameWon();
            } else {
                this.gameLost();
            }
        } else if (this.coreHealth <= 0) {
            this.gameLost();
        }
    }

    gameWon() {
        this.gameEnded = true;
        this.showEndMessage('¡VICTORIA!', 'Has protegido la ROBO-EXPLORER de las Sombras del Multiverso', 0x00ff00);
    }

    gameLost() {
        this.gameEnded = true;

        // Eliminar todos los virus de la pantalla
        this.viruses.forEach(virus => {
            virus.destroy();
        });
        this.viruses = [];

        this.showEndMessage('¡DERROTA!', 'El sistema colapsó, la brecha digital sigue abierta', 0xff0000);
    }

    showEndMessage(title, message, color) {
        const overlay = this.add.rectangle(500, 250, 1000, 500, 0x000000, 0.8);

        // Título mejorado con efectos visuales
        const titleText = this.add.text(500, 180, title, {
            fontSize: '48px',
            fill: Phaser.Display.Color.IntegerToColor(color).rgba,
            fontFamily: 'Arial Black',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Animación de pulsación para el título
        this.tweens.add({
            targets: titleText,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Mensaje mejorado
        const messageText = this.add.text(500, 250, message, {
            fontSize: '22px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 700 },
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);

        if (title === '¡VICTORIA!') {
            // Solo mostrar botón SIGUIENTE para victoria
            const nextButton = this.add.text(500, 350, 'SIGUIENTE', {
                fontSize: '28px',
                fill: '#00ff00',
                fontFamily: 'Arial Black',
                backgroundColor: '#004400',
                padding: { x: 30, y: 15 }
            }).setOrigin(0.5);

            // Efecto de brillo para el botón
            nextButton.setStroke('#00ff00', 2);

            // Animación de brillo
            this.tweens.add({
                targets: nextButton,
                alpha: 0.7,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            nextButton.setInteractive();
            nextButton.on('pointerover', () => {
                nextButton.setScale(1.1);
                nextButton.setFill('#ffffff');
            });
            nextButton.on('pointerout', () => {
                nextButton.setScale(1);
                nextButton.setFill('#00ff00');
            });
            nextButton.on('pointerdown', () => {
                this.scene.start('ScenaPregunta1');
            });
        } else {
            // Para derrota, mostrar botón de reiniciar
            const restartButton = this.add.text(500, 350, 'REINICIAR', {
                fontSize: '22px',
                fill: '#00ffff',
                fontFamily: 'Arial',
                backgroundColor: '#333333',
                padding: { x: 25, y: 12 }
            }).setOrigin(0.5);

            restartButton.setInteractive();
            restartButton.on('pointerdown', () => {
                this.scene.restart();
            });
        }
    }

    updateUI() {
        // Actualizar barra de vida del núcleo
        const healthPercent = this.coreHealth / this.maxCoreHealth;
        this.coreHealthBar.scaleX = healthPercent;
        this.coreHealthText.setText(`${this.coreHealth}/${this.maxCoreHealth}`);

        // Cambiar color según el nivel de vida
        if (healthPercent > 0.6) {
            this.coreHealthBar.setFillStyle(0x00ff00);
            this.coreLifeGlow.setFillStyle(0x00ff00);
        } else if (healthPercent > 0.3) {
            this.coreHealthBar.setFillStyle(0xffff00);
            this.coreLifeGlow.setFillStyle(0xffff00);
        } else {
            this.coreHealthBar.setFillStyle(0xff0000);
            this.coreLifeGlow.setFillStyle(0xff0000);
        }

        // Actualizar contadores
        this.firewallCountText.setText(`FIREWALLS: ${this.placedFirewalls}/${this.maxFirewalls}`);
        this.virusCountText.setText(`VIRUS: ${this.virusSpawnCount}/${this.totalViruses}`);
        this.speedText.setText(`VELOCIDAD: x${this.virusSpeed.toFixed(1)}`);
        this.eliminatedText.setText(`Eliminados: ${this.virusesDestroyed}`);
        this.reachedText.setText(`Núcleo alcanzado: ${this.virusesReachedCore}`);
    }

    createElectricEffect(x, y) {
        // Crear efecto de electricidad con partículas
        for (let i = 0; i < 12; i++) {
            const particle = this.add.circle(
                x + Phaser.Math.Between(-25, 25),
                y + Phaser.Math.Between(-25, 25),
                Phaser.Math.Between(2, 4),
                0x00ffff
            );

            this.tweens.add({
                targets: particle,
                alpha: 0,
                scale: 0,
                duration: 400,
                delay: i * 30,
                onComplete: () => particle.destroy()
            });
        }

        // Líneas de electricidad
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x00ffff, 0.8);
        for (let i = 0; i < 6; i++) {
            const startX = x + Phaser.Math.Between(-20, 20);
            const startY = y + Phaser.Math.Between(-20, 20);
            const endX = x + Phaser.Math.Between(-30, 30);
            const endY = y + Phaser.Math.Between(-30, 30);
            graphics.lineBetween(startX, startY, endX, endY);
        }

        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 300,
            onComplete: () => graphics.destroy()
        });
    }

    createCoreHitEffect() {
        this.tweens.add({
            targets: this.core,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });

        // Cambiar el tinte del núcleo usando el método correcto para círculos
        this.core.fillColor = 0xff0000;
        this.time.delayedCall(400, () => {
            this.core.fillColor = 0x00ff00;
        });

        // Ondas de choque
        for (let i = 0; i < 3; i++) {
            const shockwave = this.add.circle(900, 200, 25, 0xff0000, 0);
            shockwave.setStrokeStyle(3, 0xff0000);

            this.tweens.add({
                targets: shockwave,
                scaleX: 3,
                scaleY: 3,
                alpha: 0,
                duration: 600,
                delay: i * 100,
                onComplete: () => shockwave.destroy()
            });
        }
    }

    createSounds() {
        // Simulación de sonidos usando Web Audio API
        this.sounds = {
            firewallPlace: () => this.playTone(440, 0.15, 'square'),
            virusDestroy: () => this.playTone(880, 0.2, 'sawtooth'),
            coreDamage: () => this.playTone(220, 0.4, 'triangle'),
            virusSpawn: () => this.playTone(330, 0.1, 'sine')
        };
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    playTone(frequency, duration, type = 'sine') {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    createInstructionBox() {
        // Pausar el juego completamente
        this.gamePaused = true;
        this.physics.pause();

        // Pausar el timer de spawn de virus si existe
        if (this.virusSpawnTimer) {
            this.virusSpawnTimer.paused = true;
        }

        // Crear fondo semi-transparente para el recuadro
        this.instructionBox = this.add.rectangle(500, 250, 700, 400, 0x000000, 0.9);
        this.instructionBox.setStrokeStyle(3, 0x00ffff);

        // Efecto de brillo en el borde
        const glowBox = this.add.rectangle(500, 250, 710, 410, 0x00ffff, 0);
        glowBox.setStrokeStyle(6, 0x00ffff, 0.3);

        // Título del juego
        this.instructionTitle = this.add.text(500, 120, 'ROBO-EXPLORER', {
            fontSize: '28px',
            fill: '#00ffff',
            fontFamily: 'Arial Black',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Subtítulo
        this.instructionSubtitle = this.add.text(500, 155, 'Reparación de Drones - Instrucciones', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Instrucciones del juego
        const instructions = [
            '• Coloca FIREWALLS haciendo click en los puntos estratégicos',
            '• Los firewalls disparan automáticamente a los virus',
            '• Protege el NÚCLEO central del sistema',
            '• Gana dinero eliminando virus para comprar más firewalls'
        ];

        const instructionTexts = [];
        let yPos = 190;
        instructions.forEach(instruction => {
            const textElement = this.add.text(200, yPos, instruction, {
                fontSize: '20px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                wordWrap: { width: 600 }
            });
            instructionTexts.push(textElement);
            yPos += 20;
        });

        // Texto de instrucción principal
        this.instructionText = this.add.text(500, 360, 'Haz click en la pantalla para continuar', {
            fontSize: '18px',
            fill: '#ffff00',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);

        // Animación de parpadeo para el texto de instrucción
        this.tweens.add({
            targets: this.instructionText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Animación de pulsación para el título
        this.tweens.add({
            targets: this.instructionTitle,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Agrupar elementos del recuadro
        this.instructionElements = [
            this.instructionBox,
            glowBox,
            this.instructionTitle,
            this.instructionSubtitle,
            this.instructionText,
            ...instructionTexts  // Agregar todos los textos de instrucciones
        ];

        // Configurar evento de click para ocultar el recuadro
        this.input.on('pointerdown', this.hideInstructionBox, this);
    }

    hideInstructionBox() {
        // Reanudar el juego completamente
        this.gamePaused = false;
        this.physics.resume();

        // Reanudar el timer de spawn de virus si existe
        if (this.virusSpawnTimer) {
            this.virusSpawnTimer.paused = false;
        }

        // Ocultar y destruir todos los elementos del recuadro
        if (this.instructionElements) {
            this.instructionElements.forEach(element => {
                if (element) {
                    element.setVisible(false);
                    element.destroy(); // Destruir completamente el elemento
                }
            });
            this.instructionElements = null; // Limpiar la referencia
        }

        // Remover el evento de click
        this.input.off('pointerdown', this.hideInstructionBox, this);
    }
}

class Virus {
    constructor(scene, path, type = 'normal', baseSpeed = 1.0) {
        this.scene = scene;
        this.path = path;
        this.type = type;
        this.pathIndex = 0;
        this.reachedEnd = false;

        // Configurar propiedades según el tipo
        switch(type) {
            case 'fast':
                this.speed = 60 * baseSpeed * 1.8; // 80% más rápido
                this.health = 1;
                this.color = 0xff3300; // Rojo-naranja intenso
                this.glowColor = 0xff6600;
                this.size = 9;
                this.trailColor = 0xff4400;
                this.coreColor = 0xffff00; // Núcleo amarillo brillante
                break;
            case 'armored':
                this.speed = 60 * baseSpeed * 0.7; // 30% más lento
                this.health = 3; // Requiere 3 disparos
                this.color = 0x6600cc; // Púrpura más intenso
                this.glowColor = 0x8833ff;
                this.size = 14;
                this.trailColor = 0x7700dd;
                this.coreColor = 0xcc00ff; // Núcleo magenta
                break;
            default: // normal
                this.speed = 60 * baseSpeed;
                this.health = 1;
                this.color = 0xcc0000; // Rojo más intenso
                this.glowColor = 0xff3333;
                this.size = 11;
                this.trailColor = 0xdd0000;
                this.coreColor = 0xff6666; // Núcleo rojo claro
        }

        this.maxHealth = this.health;

        // Crear sprite del virus con diseño más complejo y detallado
        this.createVirusBody();

        // Partículas de rastro
        this.trailParticles = [];
        this.lastTrailTime = 0;

        // Barra de vida mejorada (solo para virus blindados)
        if (type === 'armored') {
            this.createHealthBar();
        }

        // Efectos ambientales
        this.createAmbientEffects();
    }

    createVirusBody() {
        const x = this.path[0].x;
        const y = this.path[0].y;

        // Crear virus informáticos auténticos según el tipo
        if (this.type === 'fast') {
            // WORM - Gusano informático con segmentos conectados
            const container = this.scene.add.container(x, y);

            // Cabeza del gusano - núcleo principal
            const head = this.scene.add.circle(0, 0, this.size * 0.6, 0x00ff41, 0.9);
            head.setStrokeStyle(2, 0x00ff00, 1);
            container.add(head);

            // Ojo digital central
            const digitalEye = this.scene.add.circle(0, 0, this.size * 0.3, 0x000000, 1);
            container.add(digitalEye);

            // Pupila con código binario
            const pupil = this.scene.add.text(0, 0, '01', {
                fontSize: '12px',
                fill: '#00ff00',
                fontFamily: 'Courier New',
                fontWeight: 'bold'
            });
            pupil.setOrigin(0.5);
            container.add(pupil);

            // Segmentos del cuerpo del gusano
            for (let i = 1; i <= 4; i++) {
                const segment = this.scene.add.circle(-i * 8, 0, this.size * (0.5 - i * 0.05), 0x00aa33, 0.8);
                segment.setStrokeStyle(1, 0x00ff00, 0.8);
                container.add(segment);

                // Código binario en cada segmento
                const segmentCode = this.scene.add.text(-i * 8, 0, Math.random() > 0.5 ? '1' : '0', {
                    fontSize: '8px',
                    fill: '#00ff00',
                    fontFamily: 'Courier New'
                });
                segmentCode.setOrigin(0.5);
                container.add(segmentCode);

                // Animación de propagación
                this.scene.tweens.add({
                    targets: segment,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    alpha: 0.6,
                    duration: 300 + i * 100,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }

            // Antenas de red para propagación
            for (let i = 0; i < 3; i++) {
                const angle = -Math.PI/3 + (i * Math.PI/3);
                const antenna = this.scene.add.line(0, 0, 0, 0,
                    Math.cos(angle) * this.size * 0.8,
                    Math.sin(angle) * this.size * 0.8, 0x00ff00, 0.8);
                antenna.setLineWidth(2);
                container.add(antenna);

                // Señal de red en las antenas
                const signal = this.scene.add.circle(
                    Math.cos(angle) * this.size * 0.8,
                    Math.sin(angle) * this.size * 0.8,
                    3, 0x00ff00, 0.9
                );
                container.add(signal);

                // Pulso de transmisión
                this.scene.tweens.add({
                    targets: signal,
                    scaleX: 2,
                    scaleY: 2,
                    alpha: 0,
                    duration: 800 + i * 200,
                    repeat: -1,
                    ease: 'Power2'
                });
            }

            // Efecto de replicación
            const replicationAura = this.scene.add.circle(0, 0, this.size * 1.5, 0x00ff00, 0);
            replicationAura.setStrokeStyle(1, 0x00ff00, 0.4);
            container.add(replicationAura);

            this.scene.tweens.add({
                targets: replicationAura,
                scaleX: 2.5,
                scaleY: 2.5,
                alpha: 0,
                duration: 1500,
                repeat: -1,
                ease: 'Power2'
            });

            this.sprite = container;

        } else if (this.type === 'armored') {
            // ROOTKIT - Virus sigiloso con camuflaje del sistema
            const container = this.scene.add.container(x, y);

            // Cuerpo principal - forma de archivo del sistema
            const systemFile = this.scene.add.rectangle(0, 0, this.size * 1.4, this.size * 1.1, 0x333333, 0.9);
            systemFile.setStrokeStyle(2, 0x666666, 1);
            container.add(systemFile);

            // Icono de archivo del sistema falso
            const fileIcon = this.scene.add.rectangle(0, -this.size * 0.2, this.size * 0.6, this.size * 0.4, 0x555555, 1);
            container.add(fileIcon);

            // Texto de archivo del sistema
            const systemText = this.scene.add.text(0, 0, 'system32.dll', {
                fontSize: '6px',
                fill: '#cccccc',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            });
            systemText.setOrigin(0.5);
            container.add(systemText);

            // Máscara de camuflaje que se desvanece
            const camouflage = this.scene.add.rectangle(0, 0, this.size * 1.4, this.size * 1.1, 0x888888, 0.7);
            container.add(camouflage);

            // Animación de camuflaje intermitente
            this.scene.tweens.add({
                targets: camouflage,
                alpha: 0.2,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Código malicioso oculto que aparece ocasionalmente
            const hiddenCode = this.scene.add.text(0, this.size * 0.3, 'exec(payload)', {
                fontSize: '5px',
                fill: '#ff0000',
                fontFamily: 'Courier New'
            });
            hiddenCode.setOrigin(0.5);
            hiddenCode.setAlpha(0);
            container.add(hiddenCode);

            // Revelación ocasional del código malicioso
            this.scene.tweens.add({
                targets: hiddenCode,
                alpha: 0.8,
                duration: 200,
                delay: 2000,
                yoyo: true,
                repeat: -1,
                repeatDelay: 3000,
                ease: 'Power2'
            });

            // Procesos falsos del sistema
            for (let i = 0; i < 4; i++) {
                const fakeProcess = this.scene.add.rectangle(
                    -this.size * 0.5 + i * (this.size * 0.3),
                    -this.size * 0.6,
                    this.size * 0.2,
                    3,
                    0x00aa00,
                    0.6
                );
                container.add(fakeProcess);

                // Simulación de actividad del sistema
                this.scene.tweens.add({
                    targets: fakeProcess,
                    alpha: 0.2,
                    width: this.size * 0.1,
                    duration: 500 + i * 150,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Linear'
                });
            }

            // Escudo de protección del rootkit
            const protection = this.scene.add.circle(0, 0, this.size * 1.3, 0x444444, 0);
            protection.setStrokeStyle(2, 0x666666, 0.5);
            container.add(protection);

            this.scene.tweens.add({
                targets: protection,
                scaleX: 1.5,
                scaleY: 1.5,
                alpha: 0,
                duration: 2000,
                repeat: -1,
                ease: 'Power2'
            });

            this.sprite = container;

        } else {
            // TROJAN - Caballo de Troya con apariencia engañosa
            const container = this.scene.add.container(x, y);

            // Cuerpo principal - apariencia de aplicación legítima
            const appBody = this.scene.add.rectangle(0, 0, this.size * 1.3, this.size * 1.2, 0x4169e1, 0.9);
            appBody.setStrokeStyle(2, 0x1e90ff, 1);
            container.add(appBody);

            // Icono de aplicación falsa
            const fakeIcon = this.scene.add.circle(0, -this.size * 0.2, this.size * 0.3, 0x87ceeb, 1);
            container.add(fakeIcon);

            // Símbolo de "seguridad" falso
            const fakeSecurity = this.scene.add.text(0, -this.size * 0.2, '🛡', {
                fontSize: '12px'
            });
            fakeSecurity.setOrigin(0.5);
            container.add(fakeSecurity);

            // Nombre de aplicación engañosa
            const appName = this.scene.add.text(0, 0, 'SecurityApp', {
                fontSize: '6px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            });
            appName.setOrigin(0.5);
            container.add(appName);

            // Payload malicioso oculto
            const payload = this.scene.add.rectangle(0, this.size * 0.4, this.size * 1.1, this.size * 0.3, 0x8b0000, 0.8);
            payload.setStrokeStyle(1, 0xff0000, 0.9);
            container.add(payload);

            // Código malicioso en el payload
            const maliciousCode = this.scene.add.text(0, this.size * 0.4, 'backdoor.exe', {
                fontSize: '5px',
                fill: '#ff4444',
                fontFamily: 'Courier New'
            });
            maliciousCode.setOrigin(0.5);
            container.add(maliciousCode);

            // Animación de revelación del payload
            this.scene.tweens.add({
                targets: [payload, maliciousCode],
                alpha: 0.3,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Conexiones de red sospechosas
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                const connection = this.scene.add.line(0, 0, 0, 0,
                    Math.cos(angle) * this.size * 0.9,
                    Math.sin(angle) * this.size * 0.9, 0xff4444, 0.6);
                connection.setLineWidth(1);
                container.add(connection);

                // Datos siendo transmitidos
                const dataPacket = this.scene.add.circle(
                    Math.cos(angle) * this.size * 0.9,
                    Math.sin(angle) * this.size * 0.9,
                    2, 0xff0000, 0.8
                );
                container.add(dataPacket);

                // Animación de transmisión de datos
                this.scene.tweens.add({
                    targets: dataPacket,
                    x: 0,
                    y: 0,
                    alpha: 0,
                    duration: 1000 + i * 200,
                    repeat: -1,
                    ease: 'Power2'
                });
            }

            // Aura de engaño
            const deceptionAura = this.scene.add.circle(0, 0, this.size * 1.6, 0x4169e1, 0);
            deceptionAura.setStrokeStyle(1, 0x1e90ff, 0.3);
            container.add(deceptionAura);

            this.scene.tweens.add({
                targets: deceptionAura,
                scaleX: 2.2,
                scaleY: 2.2,
                alpha: 0,
                duration: 1800,
                repeat: -1,
                ease: 'Power2'
            });

            this.sprite = container;
        }

        // Configurar propiedades comunes del sprite
        this.sprite.setDepth(10);
        this.sprite.setData('virus', this);
    }

    createDigitalCore() {
        const x = this.path[0].x;
        const y = this.path[0].y;

        // Crear núcleo digital según el tipo de virus
        if (this.type === 'fast') {
            // Núcleo de procesamiento rápido
            this.core = this.scene.add.rectangle(x, y, this.size * 0.4, this.size * 0.4, this.coreColor, 1);
            this.core.setStrokeStyle(1, 0xffffff, 1);

            // Texto del núcleo
            this.coreText = this.scene.add.text(x, y, 'CPU', {
                fontSize: '8px',
                fill: '#000000',
                fontFamily: 'Courier New'
            });
            this.coreText.setOrigin(0.5);

        } else if (this.type === 'armored') {
            // Núcleo blindado
            this.core = this.scene.add.rectangle(x, y, this.size * 0.5, this.size * 0.5, this.coreColor, 1);
            this.core.setStrokeStyle(2, 0xffffff, 1);

            // Gráficos de chip
            const chipGraphics = this.scene.add.graphics();
            chipGraphics.x = x;
            chipGraphics.y = y;
            chipGraphics.lineStyle(1, 0x000000, 0.8);

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    chipGraphics.strokeRect(-8 + i * 4, -8 + j * 4, 3, 3);
                }
            }
            this.coreGraphics = chipGraphics;

        } else {
            // Núcleo de malware
            this.core = this.scene.add.circle(x, y, this.size * 0.3, this.coreColor, 1);
            this.core.setStrokeStyle(1, 0xffffff, 0.8);

            // Símbolo de advertencia
            this.coreText = this.scene.add.text(x, y, '⚠', {
                fontSize: '12px',
                fill: '#ff0000'
            });
            this.coreText.setOrigin(0.5);
        }

        // Núcleo interno común
        this.innerCore = this.scene.add.circle(x, y, this.size * 0.15, 0x00ff00, 1.0);

        // Anillos de transmisión de datos
        this.energyRings = [];
        const ringCount = this.type === 'armored' ? 2 : 3;

        for (let i = 0; i < ringCount; i++) {
            const ringGraphics = this.scene.add.graphics();
            ringGraphics.x = x;
            ringGraphics.y = y;

            const ringRadius = this.size + (i * 10);
            const ringAlpha = 0.6 - (i * 0.15);

            if (this.type === 'fast') {
                // Anillos de datos rectangulares
                ringGraphics.lineStyle(2 - i * 0.3, this.glowColor, ringAlpha);
                ringGraphics.strokeRect(-ringRadius, -ringRadius * 0.6, ringRadius * 2, ringRadius * 1.2);

                // Puntos de datos
                for (let j = 0; j < 8; j++) {
                    const angle = (j / 8) * Math.PI * 2;
                    const dotX = Math.cos(angle) * ringRadius;
                    const dotY = Math.sin(angle) * ringRadius * 0.6;
                    ringGraphics.fillStyle(this.glowColor, ringAlpha);
                    ringGraphics.fillCircle(dotX, dotY, 1);
                }

            } else if (this.type === 'armored') {
                // Anillos hexagonales de seguridad
                ringGraphics.lineStyle(2 - i * 0.3, this.glowColor, ringAlpha);
                const sides = 6;
                const angleStep = (Math.PI * 2) / sides;
                ringGraphics.beginPath();
                for (let j = 0; j <= sides; j++) {
                    const angle = j * angleStep;
                    const ringX = Math.cos(angle) * ringRadius;
                    const ringY = Math.sin(angle) * ringRadius;
                    if (j === 0) {
                        ringGraphics.moveTo(ringX, ringY);
                    } else {
                        ringGraphics.lineTo(ringX, ringY);
                    }
                }
                ringGraphics.strokePath();

            } else {
                // Anillos de propagación de malware
                ringGraphics.lineStyle(2 - i * 0.3, this.glowColor, ringAlpha);
                ringGraphics.strokeCircle(0, 0, ringRadius);

                // Puntos de infección
                for (let j = 0; j < 6; j++) {
                    const angle = (j / 6) * Math.PI * 2;
                    const dotX = Math.cos(angle) * ringRadius;
                    const dotY = Math.sin(angle) * ringRadius;
                    ringGraphics.fillStyle(0xff0000, ringAlpha);
                    ringGraphics.fillRect(dotX - 1, dotY - 1, 2, 2);
                }
            }

            this.energyRings.push(ringGraphics);

            // Animación de transmisión de datos
            if (this.type === 'fast') {
                this.scene.tweens.add({
                    targets: ringGraphics,
                    rotation: Math.PI * 2,
                    duration: 600 - i * 100,
                    repeat: -1,
                    ease: 'Linear'
                });
            } else if (this.type === 'armored') {
                this.scene.tweens.add({
                    targets: ringGraphics,
                    rotation: Math.PI * 2,
                    duration: 1800 + i * 200,
                    repeat: -1,
                    ease: 'Linear'
                });
            } else {
                this.scene.tweens.add({
                    targets: ringGraphics,
                    rotation: Math.PI * 2 * (i % 2 === 0 ? 1 : -1),
                    duration: 1000 + Math.random() * 400,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        }

        // Efectos digitales avanzados y glitch
        this.createDigitalEffects(x, y);

        // Efectos de pulsación digital
        if (this.type === 'fast') {
            // Pulsación rápida de procesamiento
            this.scene.tweens.add({
                targets: [this.core, this.innerCore],
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 200,
                yoyo: true,
                repeat: -1,
                ease: 'Power2.easeInOut'
            });

            // Parpadeo del texto
            if (this.coreText) {
                this.scene.tweens.add({
                    targets: this.coreText,
                    alpha: 0.3,
                    duration: 150,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Linear'
                });
            }

            // Efecto de glitch para Worm
            this.createGlitchEffect();

        } else if (this.type === 'armored') {
            // Pulsación de sistema de seguridad
            this.scene.tweens.add({
                targets: [this.core, this.innerCore],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 600,
                yoyo: true,
                repeat: -1,
                ease: 'Power2'
            });

            // Efecto de escaneo para Rootkit
            this.createScanEffect();

        } else {
            // Pulsación errática de malware
            this.scene.tweens.add({
                targets: [this.core, this.innerCore],
                scaleX: 1.3,
                scaleY: 1.3,
                alpha: 0.7,
                duration: 400 + Math.random() * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Bounce.easeInOut'
            });

            // Efecto de corrupción para Trojan
            this.createCorruptionEffect();

            // Parpadeo del símbolo de peligro
            if (this.coreText) {
                this.scene.tweens.add({
                    targets: this.coreText,
                    alpha: 0.2,
                    duration: 300,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Linear'
                });
            }
        }
    }

    createAmbientEffects() {
        // Efectos digitales ambientales específicos por tipo
        this.ambientParticles = [];
        this.digitalEffects = [];

        if (this.type === 'fast') {
            // Efectos de transmisión de datos para virus rápido
            for (let i = 0; i < 8; i++) {
                const dataPacket = this.scene.add.rectangle(
                    this.sprite.x + (Math.random() - 0.5) * this.size * 2,
                    this.sprite.y + (Math.random() - 0.5) * this.size * 2,
                    2,
                    1,
                    this.glowColor,
                    0.7
                );

                this.digitalEffects.push(dataPacket);

                // Animación de flujo de datos
                this.scene.tweens.add({
                    targets: dataPacket,
                    x: dataPacket.x + (Math.random() - 0.5) * 50,
                    y: dataPacket.y + (Math.random() - 0.5) * 50,
                    alpha: 0,
                    duration: 1000 + Math.random() * 500,
                    repeat: -1,
                    yoyo: true,
                    ease: 'Linear'
                });
            }

            // Efecto de glitch en el código binario
            this.glitchTimer = this.scene.time.addEvent({
                delay: 200 + Math.random() * 300,
                callback: () => {
                    if (this.sprite && this.sprite.list && this.sprite.list.length > 1) {
                        const binaryText = this.sprite.list[1]; // El texto binario
                        if (binaryText && binaryText.setText) {
                            const glitchCode = Math.random() > 0.5 ?
                                '11111111\n00000000\nERROR404' :
                                '10110101\n01011010\n11010110';
                            binaryText.setText(glitchCode);

                            // Restaurar después de un momento
                            this.scene.time.delayedCall(100, () => {
                                if (binaryText && binaryText.setText) {
                                    binaryText.setText('10110101\n01011010\n11010110');
                                }
                            });
                        }
                    }
                },
                loop: true
            });

        } else if (this.type === 'armored') {
            // Efectos de sistema de seguridad para virus blindado
            for (let i = 0; i < 6; i++) {
                const securityNode = this.scene.add.circle(
                    this.sprite.x + (Math.random() - 0.5) * this.size * 1.5,
                    this.sprite.y + (Math.random() - 0.5) * this.size * 1.5,
                    1,
                    0x00ff00,
                    0.8
                );

                this.digitalEffects.push(securityNode);

                // Parpadeo de nodos de seguridad
                this.scene.tweens.add({
                    targets: securityNode,
                    alpha: 0.2,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    duration: 800 + Math.random() * 400,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }

            // Efecto de corrupción del sistema de seguridad
            this.corruptionTimer = this.scene.time.addEvent({
                delay: 1000 + Math.random() * 1000,
                callback: () => {
                    if (this.sprite && this.sprite.list && this.sprite.list.length > 2) {
                        const securityText = this.sprite.list[2]; // El texto de seguridad
                        if (securityText && securityText.setText) {
                            const corruptedText = Math.random() > 0.5 ? 'BREACH!' : 'HACK_IN';
                            securityText.setText(corruptedText);
                            securityText.setTint(0xff0000);

                            // Restaurar después de un momento
                            this.scene.time.delayedCall(300, () => {
                                if (securityText && securityText.setText) {
                                    securityText.setText('SEC_ERR');
                                    securityText.clearTint();
                                }
                            });
                        }
                    }
                },
                loop: true
            });

        } else {
            // Efectos de malware para virus normal
            for (let i = 0; i < 10; i++) {
                const corruptPixel = this.scene.add.rectangle(
                    this.sprite.x + (Math.random() - 0.5) * this.size * 2,
                    this.sprite.y + (Math.random() - 0.5) * this.size * 2,
                    1,
                    1,
                    Math.random() > 0.5 ? 0xff0000 : 0x00ff00,
                    0.6
                );

                this.digitalEffects.push(corruptPixel);

                // Animación de píxeles corruptos
                this.scene.tweens.add({
                    targets: corruptPixel,
                    x: corruptPixel.x + (Math.random() - 0.5) * 20,
                    y: corruptPixel.y + (Math.random() - 0.5) * 20,
                    alpha: 0,
                    duration: 500 + Math.random() * 500,
                    repeat: -1,
                    yoyo: true,
                    ease: 'Power2'
                });
            }

            // Efecto de corrupción del código malicioso
            this.malwareTimer = this.scene.time.addEvent({
                delay: 300 + Math.random() * 400,
                callback: () => {
                    if (this.sprite && this.sprite.list && this.sprite.list.length > 1) {
                        const malwareText = this.sprite.list[1]; // El texto de malware
                        if (malwareText && malwareText.setText) {
                            const corruptedCode = Math.random() > 0.5 ?
                                '<virus>\ninfect.exe\n</virus>' :
                                '<trojan>\nsteal.dll\n</trojan>';
                            malwareText.setText(corruptedCode);
                            malwareText.setTint(0xff0000);

                            // Restaurar después de un momento
                            this.scene.time.delayedCall(200, () => {
                                if (malwareText && malwareText.setText) {
                                    malwareText.setText('<script>\nmalware.exe\n</script>');
                                    malwareText.clearTint();
                                }
                            });
                        }
                    }
                },
                loop: true
            });
        }

        // Efecto de interferencia digital general
        this.interferenceTimer = this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                if (Math.random() < 0.1) { // 10% de probabilidad
                    // Crear línea de interferencia
                    const interference = this.scene.add.rectangle(
                        this.sprite.x + (Math.random() - 0.5) * this.size * 3,
                        this.sprite.y + (Math.random() - 0.5) * this.size * 3,
                        Math.random() * 10 + 5,
                        1,
                        0xffffff,
                        0.8
                    );

                    // Desaparecer rápidamente
                    this.scene.tweens.add({
                        targets: interference,
                        alpha: 0,
                        duration: 50,
                        onComplete: () => interference.destroy()
                    });
                }
            },
            loop: true
        });

        // Partículas ambientales básicas
        const particleCount = this.type === 'armored' ? 4 : 2;

        for (let i = 0; i < particleCount; i++) {
            const particle = this.scene.add.circle(
                this.sprite.x,
                this.sprite.y,
                1 + Math.random(),
                this.glowColor,
                0.6
            );

            this.ambientParticles.push({
                sprite: particle,
                angle: (i / particleCount) * Math.PI * 2,
                distance: this.size + 8 + Math.random() * 5,
                speed: 0.02 + Math.random() * 0.01
            });
        }
    }

    // Método para crear efectos digitales avanzados
    createDigitalEffects(x, y) {
        this.digitalEffects = [];

        if (this.type === 'fast') {
            // Efectos de transmisión de datos para Worm
            for (let i = 0; i < 8; i++) {
                const dataPacket = this.scene.add.rectangle(
                    x + (Math.random() - 0.5) * this.size * 2,
                    y + (Math.random() - 0.5) * this.size * 2,
                    2,
                    1,
                    0x00ffff,
                    0.7
                );

                this.digitalEffects.push(dataPacket);

                // Animación de paquetes de datos
                this.scene.tweens.add({
                    targets: dataPacket,
                    x: dataPacket.x + (Math.random() - 0.5) * 50,
                    y: dataPacket.y + (Math.random() - 0.5) * 50,
                    alpha: 0,
                    duration: 1000 + Math.random() * 500,
                    repeat: -1,
                    yoyo: true,
                    ease: 'Linear'
                });
            }

        } else if (this.type === 'armored') {
            // Efectos de sistema de seguridad para Rootkit
            for (let i = 0; i < 6; i++) {
                const securityNode = this.scene.add.circle(
                    x + (Math.random() - 0.5) * this.size * 1.5,
                    y + (Math.random() - 0.5) * this.size * 1.5,
                    1,
                    0x00ff00,
                    0.8
                );

                this.digitalEffects.push(securityNode);

                // Parpadeo de nodos de seguridad
                this.scene.tweens.add({
                    targets: securityNode,
                    alpha: 0.2,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    duration: 800 + Math.random() * 400,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }

        } else {
            // Efectos de malware para Trojan
            for (let i = 0; i < 10; i++) {
                const corruptPixel = this.scene.add.rectangle(
                    x + (Math.random() - 0.5) * this.size * 2,
                    y + (Math.random() - 0.5) * this.size * 2,
                    1,
                    1,
                    Math.random() > 0.5 ? 0xff0000 : 0x00ff00,
                    0.6
                );

                this.digitalEffects.push(corruptPixel);

                // Animación de píxeles corruptos
                this.scene.tweens.add({
                    targets: corruptPixel,
                    x: corruptPixel.x + (Math.random() - 0.5) * 20,
                    y: corruptPixel.y + (Math.random() - 0.5) * 20,
                    alpha: 0,
                    duration: 500 + Math.random() * 500,
                    repeat: -1,
                    yoyo: true,
                    ease: 'Power2'
                });
            }
        }
    }

    // Efecto de glitch para Worm
    createGlitchEffect() {
        this.glitchTimer = this.scene.time.addEvent({
            delay: 200 + Math.random() * 300,
            callback: () => {
                if (this.sprite && this.sprite.list && this.sprite.list.length > 1) {
                    const binaryText = this.sprite.list[1]; // El texto binario
                    if (binaryText && binaryText.setText) {
                        const glitchCode = Math.random() > 0.5 ?
                            '11111111\n00000000\nERROR404' :
                            '10110101\n01011010\n11010110';
                        binaryText.setText(glitchCode);

                        // Restaurar después de un momento
                        this.scene.time.delayedCall(100, () => {
                            if (binaryText && binaryText.setText) {
                                binaryText.setText('10110101\n01011010\n11010110');
                            }
                        });
                    }
                }
            },
            loop: true
        });
    }

    // Efecto de escaneo para Rootkit
    createScanEffect() {
        this.corruptionTimer = this.scene.time.addEvent({
            delay: 1000 + Math.random() * 1000,
            callback: () => {
                if (this.sprite && this.sprite.list && this.sprite.list.length > 2) {
                    const securityText = this.sprite.list[2]; // El texto de seguridad
                    if (securityText && securityText.setText) {
                        const corruptedText = Math.random() > 0.5 ? 'BREACH!' : 'HACK_IN';
                        securityText.setText(corruptedText);
                        securityText.setTint(0xff0000);

                        // Restaurar después de un momento
                        this.scene.time.delayedCall(300, () => {
                            if (securityText && securityText.setText) {
                                securityText.setText('SEC_ERR');
                                securityText.clearTint();
                            }
                        });
                    }
                }
            },
            loop: true
        });
    }

    // Efecto de corrupción para Trojan
     createCorruptionEffect() {
         this.malwareTimer = this.scene.time.addEvent({
             delay: 300 + Math.random() * 400,
             callback: () => {
                 if (this.sprite && this.sprite.list && this.sprite.list.length > 1) {
                     const malwareText = this.sprite.list[1]; // El texto de malware
                     if (malwareText && malwareText.setText) {
                         const corruptedCode = Math.random() > 0.5 ?
                             '<virus>\ninfect.exe\n</virus>' :
                             '<trojan>\nsteal.dll\n</trojan>';
                         malwareText.setText(corruptedCode);
                         malwareText.setTint(0xff0000);

                         // Restaurar después de un momento
                         this.scene.time.delayedCall(200, () => {
                             if (malwareText && malwareText.setText) {
                                 malwareText.setText('<script>\nmalware.exe\n</script>');
                                 malwareText.clearTint();
                             }
                         });
                     }
                 }
             },
             loop: true
         });
     }

     // Método para crear efectos de corrupción de datos aleatorios
     createDataCorruptionEffect() {
         const corruptionTypes = ['binary', 'hex', 'error'];
         const type = corruptionTypes[Math.floor(Math.random() * corruptionTypes.length)];

         let corruptionText = '';
         let corruptionColor = 0xff0000;

         switch (type) {
             case 'binary':
                 corruptionText = Math.random() > 0.5 ? '1010ERROR' : '0101FAIL';
                 corruptionColor = 0x00ff00;
                 break;
             case 'hex':
                 corruptionText = '0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase();
                 corruptionColor = 0x00ffff;
                 break;
             case 'error':
                 const errors = ['404', 'NULL', 'SEGFAULT', 'OVERFLOW'];
                 corruptionText = errors[Math.floor(Math.random() * errors.length)];
                 corruptionColor = 0xff0000;
                 break;
         }

         const corruptionEffect = this.scene.add.text(
             this.sprite.x + (Math.random() - 0.5) * this.size * 3,
             this.sprite.y + (Math.random() - 0.5) * this.size * 3,
             corruptionText,
             {
                 fontSize: '8px',
                 fill: '#' + corruptionColor.toString(16).padStart(6, '0'),
                 fontFamily: 'monospace'
             }
         );
         corruptionEffect.setOrigin(0.5);
         corruptionEffect.setAlpha(0.8);

         // Animación de aparición y desaparición
         this.scene.tweens.add({
             targets: corruptionEffect,
             alpha: 0,
             y: corruptionEffect.y - 20,
             scaleX: 0.5,
             scaleY: 0.5,
             duration: 800 + Math.random() * 400,
             ease: 'Power2',
             onComplete: () => corruptionEffect.destroy()
         });
     }

     createHealthBar() {
        // Barra de vida para virus blindados
        const barWidth = this.size * 2;
        const barHeight = 3;
        const barY = this.sprite.y - this.size - 8;

        this.healthBarBg = this.scene.add.rectangle(this.sprite.x, barY, barWidth, barHeight, 0x333333, 0.8);
        this.healthBar = this.scene.add.rectangle(this.sprite.x, barY, barWidth, barHeight, 0x00ff00, 0.9);
    }

    createDestroyEffect() {
        // Efecto de explosión mejorado
        const explosionParticles = 8;
        for (let i = 0; i < explosionParticles; i++) {
            const angle = (i / explosionParticles) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const endX = this.sprite.x + Math.cos(angle) * distance;
            const endY = this.sprite.y + Math.sin(angle) * distance;

            const particle = this.scene.add.circle(
                this.sprite.x,
                this.sprite.y,
                3 + Math.random() * 3,
                this.color,
                0.8
            );

            this.scene.tweens.add({
                targets: particle,
                x: endX,
                y: endY,
                alpha: 0,
                scaleX: 0.2,
                scaleY: 0.2,
                duration: 400 + Math.random() * 200,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }

        // Onda expansiva
        const shockwave = this.scene.add.circle(this.sprite.x, this.sprite.y, 5, this.glowColor, 0);
        shockwave.setStrokeStyle(3, this.glowColor, 0.8);

        this.scene.tweens.add({
            targets: shockwave,
            scaleX: 4,
            scaleY: 4,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => shockwave.destroy()
        });
    }

    updateHealthBar() {
        if (this.healthBar && this.healthBarBg) {
            const healthPercent = this.health / this.maxHealth;
            this.healthBar.scaleX = healthPercent;

            // Cambiar color según la vida
            if (healthPercent > 0.6) {
                this.healthBar.setFillStyle(0x00ff00); // Verde
            } else if (healthPercent > 0.3) {
                this.healthBar.setFillStyle(0xffff00); // Amarillo
            } else {
                this.healthBar.setFillStyle(0xff0000); // Rojo
            }
        }
    }

    createTrailParticle() {
        const currentTime = this.scene.time.now;
        if (currentTime - this.lastTrailTime > 30) { // Crear partícula cada 30ms (más frecuente)
            // Crear múltiples partículas por frame para un trail más denso
            for (let i = 0; i < 2; i++) {
                const offsetX = (Math.random() - 0.5) * 6;
                const offsetY = (Math.random() - 0.5) * 6;

                const particle = this.scene.add.circle(
                    this.sprite.x + offsetX,
                    this.sprite.y + offsetY,
                    1.5 + Math.random() * 1.5,
                    this.trailColor,
                    0.7 + Math.random() * 0.3
                );

                // Añadir brillo a las partículas
                particle.setStrokeStyle(1, this.glowColor, 0.5);

                this.trailParticles.push(particle);

                // Animar partícula con movimiento más orgánico
                this.scene.tweens.add({
                    targets: particle,
                    alpha: 0,
                    scaleX: 0.1,
                    scaleY: 0.1,
                    x: particle.x + (Math.random() - 0.5) * 10,
                    y: particle.y + (Math.random() - 0.5) * 10,
                    duration: 600 + Math.random() * 400,
                    ease: 'Power2',
                    onComplete: () => {
                        particle.destroy();
                        const index = this.trailParticles.indexOf(particle);
                        if (index > -1) {
                            this.trailParticles.splice(index, 1);
                        }
                    }
                });
            }

            this.lastTrailTime = currentTime;
        }
    }

    update() {
        if (this.reachedEnd || this.health <= 0) return;

        const target = this.path[this.pathIndex + 1];
        if (!target) {
            this.reachedEnd = true;
            return;
        }

        const dx = target.x - this.sprite.x;
        const dy = target.y - this.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 8) {
            this.pathIndex++;
            if (this.pathIndex >= this.path.length - 1) {
                this.reachedEnd = true;
            }
        } else {
            const moveX = (dx / distance) * this.speed * (1/60);
            const moveY = (dy / distance) * this.speed * (1/60);

            this.sprite.x += moveX;
            this.sprite.y += moveY;

            // Actualizar posición de todos los elementos digitales
            if (this.core && !this.core.destroyed) {
                this.core.x = this.sprite.x;
                this.core.y = this.sprite.y;
            }

            if (this.innerCore && !this.innerCore.destroyed) {
                this.innerCore.x = this.sprite.x;
                this.innerCore.y = this.sprite.y;
            }

            // Actualizar texto del núcleo
            if (this.coreText && !this.coreText.destroyed) {
                this.coreText.x = this.sprite.x;
                this.coreText.y = this.sprite.y;
            }

            // Actualizar gráficos del chip
            if (this.coreGraphics && !this.coreGraphics.destroyed) {
                this.coreGraphics.x = this.sprite.x;
                this.coreGraphics.y = this.sprite.y;
            }

            if (this.energyRings) {
                this.energyRings.forEach(ring => {
                    if (ring && !ring.destroyed) {
                        ring.x = this.sprite.x;
                        ring.y = this.sprite.y;
                    }
                });
            }

            // Actualizar elementos específicos por tipo
            if (this.type === 'armored' && this.armorPlates) {
                this.armorPlates.forEach((plate, index) => {
                    if (plate && !plate.destroyed) {
                        const angle = (index / 6) * Math.PI * 2;
                        plate.x = this.sprite.x + Math.cos(angle) * (this.size * 0.8);
                        plate.y = this.sprite.y + Math.sin(angle) * (this.size * 0.8);
                    }
                });
            }

            if (this.type === 'normal' && this.organicSpikes) {
                this.organicSpikes.forEach((spike, index) => {
                    if (spike && !spike.destroyed) {
                        const angle = (index / 6) * Math.PI * 2 + Math.random() * 0.1;
                        spike.x = this.sprite.x + Math.cos(angle) * (this.size * 0.9);
                        spike.y = this.sprite.y + Math.sin(angle) * (this.size * 0.9);
                    }
                });
            }

            // Actualizar partículas ambientales
            if (this.ambientParticles) {
                this.ambientParticles.forEach(particle => {
                    if (particle && particle.sprite && !particle.sprite.destroyed) {
                        particle.angle += particle.speed;
                        particle.sprite.x = this.sprite.x + Math.cos(particle.angle) * particle.distance;
                        particle.sprite.y = this.sprite.y + Math.sin(particle.angle) * particle.distance;
                    }
                });
            }

            // Actualizar efectos digitales con animaciones de código binario
            if (this.digitalEffects) {
                this.digitalEffects.forEach((effect, index) => {
                    if (effect && !effect.destroyed) {
                        // Los efectos digitales se mueven con el virus
                        const offsetX = effect.x - this.sprite.x;
                        const offsetY = effect.y - this.sprite.y;
                        effect.x = this.sprite.x + offsetX;
                        effect.y = this.sprite.y + offsetY;

                        // Animaciones específicas por tipo de virus
                        if (this.type === 'fast') {
                            // Paquetes de datos que parpadean con código binario
                            if (Math.random() < 0.05) { // 5% de probabilidad por frame
                                // Los rectangles usan setFillStyle en lugar de setTint
                                const originalColor = effect.fillColor;
                                effect.setFillStyle(Math.random() > 0.5 ? 0x00ff00 : 0xff0000, effect.alpha);
                                this.scene.time.delayedCall(50, () => {
                                    if (effect && !effect.destroyed) {
                                        effect.setFillStyle(originalColor, effect.alpha);
                                    }
                                });
                            }
                        } else if (this.type === 'armored') {
                            // Nodos de seguridad que cambian de color al detectar amenazas
                            if (Math.random() < 0.03) { // 3% de probabilidad por frame
                                effect.setFillStyle(0xff0000, 0.8);
                                this.scene.time.delayedCall(200, () => {
                                    if (effect && !effect.destroyed) {
                                        effect.setFillStyle(0x00ff00, 0.8);
                                    }
                                });
                            }
                        } else {
                            // Píxeles corruptos que cambian aleatoriamente
                            if (Math.random() < 0.08) { // 8% de probabilidad por frame
                                const corruptColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
                                effect.setFillStyle(corruptColors[Math.floor(Math.random() * corruptColors.length)], 0.6);
                            }
                        }
                    }
                });
            }

            // Crear efectos de corrupción de datos aleatorios
            if (Math.random() < 0.02) { // 2% de probabilidad por frame
                this.createDataCorruptionEffect();
            }

            // Actualizar barra de vida si existe
            if (this.healthBar && this.healthBarBg) {
                const barY = this.sprite.y - this.size - 8;
                this.healthBar.x = this.sprite.x;
                this.healthBar.y = barY;
                this.healthBarBg.x = this.sprite.x;
                this.healthBarBg.y = barY;
            }

            // Crear partículas de rastro
            this.createTrailParticle();
        }
    }

    takeDamage() {
        this.health--;

        // Efecto visual de daño mejorado
        // Como el sprite es un Container, necesitamos aplicar efectos a sus elementos hijos
        if (this.sprite && this.sprite.active) {
            // Efecto de parpadeo en blanco para todo el container
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 0.3,
                duration: 100,
                yoyo: true,
                repeat: 2,
                ease: 'Power2'
            });

            // Efecto de tinte rojo en el núcleo
            if (this.core && this.core.setFillStyle) {
                const originalCoreColor = this.core.fillColor;
                this.core.setFillStyle(0xff0000);

                this.scene.time.delayedCall(150, () => {
                    if (this.core && this.core.active) {
                        this.core.setFillStyle(originalCoreColor || 0xffffff);
                    }
                });
            }
        }

        // Efecto de sacudida
        this.scene.tweens.add({
            targets: [this.sprite, this.core],
            x: this.sprite.x + 3,
            duration: 50,
            yoyo: true,
            repeat: 2,
            ease: 'Power2'
        });

        // Si es blindado, mostrar barra de vida
        if (this.type === 'armored') {
            this.updateHealthBar();
        }

        if (this.health <= 0) {
            this.createDestroyEffect();
            this.destroy();
            this.scene.virusDestroyed();
        }
    }

    destroy() {
        if (this.sprite) {
            // Efecto de explosión mejorado según el tipo
            const explosionColor = this.type === 'fast' ? 0xff6600 :
                                  (this.type === 'armored' ? 0x9900ff : 0xff0000);
            const explosionSize = this.type === 'armored' ? 25 : 20;

            // Crear múltiples partículas de explosión con efectos mejorados
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                const distance = 15 + Math.random() * 15;
                const particleX = this.sprite.x + Math.cos(angle) * distance;
                const particleY = this.sprite.y + Math.sin(angle) * distance;

                const particle = this.scene.add.circle(
                    this.sprite.x,
                    this.sprite.y,
                    Math.random() * 4 + 2,
                    explosionColor,
                    0.9
                );

                // Añadir brillo a las partículas de explosión
                particle.setStrokeStyle(1, this.glowColor, 0.7);

                this.scene.tweens.add({
                    targets: particle,
                    x: particleX,
                    y: particleY,
                    scaleX: 0.1,
                    scaleY: 0.1,
                    alpha: 0,
                    duration: 600 + Math.random() * 300,
                    ease: 'Power2',
                    onComplete: () => particle.destroy()
                });
            }

            // Crear partículas secundarias más pequeñas
            for (let i = 0; i < 8; i++) {
                const particle = this.scene.add.circle(
                    this.sprite.x + (Math.random() - 0.5) * 10,
                    this.sprite.y + (Math.random() - 0.5) * 10,
                    Math.random() * 2 + 1,
                    this.trailColor,
                    0.8
                );

                this.scene.tweens.add({
                    targets: particle,
                    scaleX: 0,
                    scaleY: 0,
                    alpha: 0,
                    x: particle.x + (Math.random() - 0.5) * 30,
                    y: particle.y + (Math.random() - 0.5) * 30,
                    duration: 800,
                    ease: 'Power2',
                    onComplete: () => particle.destroy()
                });
            }

            // Onda de choque mejorada con múltiples ondas
            for (let i = 0; i < 3; i++) {
                const delay = i * 100;
                this.scene.time.delayedCall(delay, () => {
                    const shockwave = this.scene.add.circle(this.sprite.x, this.sprite.y, 5, explosionColor, 0);
                    shockwave.setStrokeStyle(2 + i, explosionColor, 0.6 - i * 0.2);

                    this.scene.tweens.add({
                        targets: shockwave,
                        scaleX: 5 + i,
                        scaleY: 5 + i,
                        alpha: 0,
                        duration: 500 + i * 100,
                        ease: 'Power2',
                        onComplete: () => shockwave.destroy()
                    });
                });
            }

            // Limpiar elementos
            // Limpiar partículas de rastro
            if (this.trailParticles && Array.isArray(this.trailParticles)) {
                this.trailParticles.forEach(particle => {
                    if (particle && particle.active) {
                        particle.destroy();
                    }
                });
                this.trailParticles = [];
            }

            // Destruir elementos principales digitales
            if (this.core) this.core.destroy();
            if (this.innerCore) this.innerCore.destroy();

            // Destruir texto del núcleo
            if (this.coreText) this.coreText.destroy();

            // Destruir gráficos del chip
            if (this.coreGraphics) this.coreGraphics.destroy();

            // Destruir elementos específicos por tipo
            if (this.type === 'armored' && this.armorPlates && Array.isArray(this.armorPlates)) {
                this.armorPlates.forEach(plate => {
                    if (plate && plate.active) {
                        plate.destroy();
                    }
                });
            }

            if (this.type === 'normal' && this.organicSpikes && Array.isArray(this.organicSpikes)) {
                this.organicSpikes.forEach(spike => {
                    if (spike && spike.active) {
                        spike.destroy();
                    }
                });
            }

            // Destruir anillos de energía
            if (this.energyRings && Array.isArray(this.energyRings)) {
                this.energyRings.forEach(ring => {
                    if (ring && ring.active) {
                        ring.destroy();
                    }
                });
            }

            // Destruir partículas ambientales
            if (this.ambientParticles && Array.isArray(this.ambientParticles)) {
                this.ambientParticles.forEach(particle => {
                    if (particle.sprite && particle.sprite.active) {
                        particle.sprite.destroy();
                    }
                });
            }

            // Destruir efectos digitales
            if (this.digitalEffects && Array.isArray(this.digitalEffects)) {
                this.digitalEffects.forEach(effect => {
                    if (effect && effect.active) {
                        effect.destroy();
                    }
                });
            }

            // Limpiar temporizadores de efectos digitales
            if (this.glitchTimer) {
                this.glitchTimer.destroy();
            }
            if (this.corruptionTimer) {
                this.corruptionTimer.destroy();
            }
            if (this.malwareTimer) {
                this.malwareTimer.destroy();
            }
            if (this.interferenceTimer) {
                this.interferenceTimer.destroy();
            }

            // Destruir barra de vida
            if (this.healthBar) {
                this.healthBar.destroy();
                this.healthBarBg.destroy();
            }
            this.sprite.destroy();
        }
    }
}

class Firewall {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.range = 80;
        this.damage = 1;
        this.fireRate = 1000; // ms entre disparos
        this.lastFired = 0;
        this.level = 1;
        this.maxLevel = 3;

        // Sistema de activación/desactivación
        this.isActive = true;
        this.deactivationTime = 8000; // 8 segundos activo
        this.reactivationTime = 3000; // 3 segundos inactivo
        this.lastStateChange = Date.now();
        this.needsReactivation = false;

        // Crear sprite del firewall con diseño hexagonal mejorado
        this.sprite = scene.add.polygon(x, y, [
            [-10, 0], [-5, -8], [5, -8],
            [10, 0], [5, 8], [-5, 8]
        ], 0x0099ff);
        this.sprite.setStrokeStyle(2, 0x00ffff, 0.9);

        // Núcleo central brillante
        this.core = scene.add.circle(x, y, 4, 0xffffff, 0.9);

        // Anillos de energía rotatorios
        this.energyRings = [];
        this.ringAnimations = [];
        for (let i = 0; i < 3; i++) {
            const ring = scene.add.circle(x, y, 16 + (i * 6), 0x0099ff, 0);
            ring.setStrokeStyle(1, 0x00ffff, 0.5 - (i * 0.15));
            this.energyRings.push(ring);

            // Animación de rotación
            const rotationAnim = scene.tweens.add({
                targets: ring,
                rotation: Math.PI * 2,
                duration: 3000 - (i * 500),
                repeat: -1,
                ease: 'Linear'
            });
            this.ringAnimations.push(rotationAnim);

            // Animación de pulsación
            scene.tweens.add({
                targets: ring,
                scaleX: 1.2,
                scaleY: 1.2,
                alpha: 0.2,
                duration: 1200,
                yoyo: true,
                repeat: -1,
                delay: i * 300,
                ease: 'Sine.easeInOut'
            });
        }

        // Efecto de pulsación del sprite principal
        this.pulseAnimation = scene.tweens.add({
            targets: [this.sprite, this.core],
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Partículas ambientales
        this.ambientParticles = [];
        this.lastParticleTime = 0;

        // Indicador de rango visual
        this.rangeIndicator = scene.add.circle(x, y, this.range, 0x0099ff, 0);
        this.rangeIndicator.setStrokeStyle(1, 0x0099ff, 0.2);
        this.rangeIndicator.setVisible(false);

        // Texto de nivel
        this.levelText = scene.add.text(x, y - 25, `LV${this.level}`, {
            fontSize: '10px',
            fill: '#00ffff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Crear partículas ambientales iniciales
        this.createAmbientParticles();

        // Hacer interactivo para mostrar rango y reactivar
        this.sprite.setInteractive();
        this.sprite.on('pointerover', () => {
            this.rangeIndicator.setVisible(true);
        });
        this.sprite.on('pointerout', () => {
            this.rangeIndicator.setVisible(false);
        });

        // Evento de clic para reactivar firewall inactivo
        this.sprite.on('pointerdown', () => {
            if (!this.isActive && this.needsReactivation) {
                this.reactivate();
            }
        });

        // Indicador de estado (ACTIVO/INACTIVO) - posicionado abajo a la izquierda
        this.statusText = scene.add.text(x - 15, y + 35, 'ACTIVO', {
            fontSize: '8px',
            fill: '#00ff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
    }

    destroy() {
        // Efectos de destrucción mejorados
        const explosionColors = [0x00ffff, 0x0099ff, 0xffffff];

        // Múltiples ondas de explosión
        for (let i = 0; i < 3; i++) {
            const explosion = this.scene.add.circle(this.x, this.y, 10, explosionColors[i], 0.6);
            explosion.setStrokeStyle(3, explosionColors[i]);

            this.scene.tweens.add({
                targets: explosion,
                scaleX: 3 + i,
                scaleY: 3 + i,
                alpha: 0,
                duration: 400 + (i * 100),
                delay: i * 50,
                ease: 'Power2',
                onComplete: () => explosion.destroy()
            });
        }

        // Partículas de fragmentos
        for (let i = 0; i < 12; i++) {
            const fragment = this.scene.add.circle(
                this.x + (Math.random() - 0.5) * 10,
                this.y + (Math.random() - 0.5) * 10,
                Math.random() * 4 + 2,
                0x00ffff,
                0.8
            );

            this.scene.tweens.add({
                targets: fragment,
                x: this.x + (Math.random() - 0.5) * 80,
                y: this.y + (Math.random() - 0.5) * 80,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 600 + Math.random() * 400,
                ease: 'Power2',
                onComplete: () => fragment.destroy()
            });
        }

        // Limpiar todos los elementos
        if (this.sprite) this.sprite.destroy();
        if (this.rangeIndicator) this.rangeIndicator.destroy();
        if (this.levelText) this.levelText.destroy();
        if (this.statusText) this.statusText.destroy();

        // Limpiar anillos de energía
        if (this.energyRings && Array.isArray(this.energyRings)) {
            this.energyRings.forEach(ring => ring.destroy());
        }

        // Limpiar animaciones
        if (this.pulseAnimation) this.pulseAnimation.destroy();
        if (this.ringAnimations && Array.isArray(this.ringAnimations)) {
            this.ringAnimations.forEach(anim => anim.destroy());
        }

        // Limpiar partículas ambientales
        if (this.ambientParticles && Array.isArray(this.ambientParticles)) {
            this.ambientParticles.forEach(particle => particle.destroy());
        }
    }

    createAmbientParticles() {
        // Crear partículas flotantes alrededor del firewall
        this.ambientParticles = [];
        for (let i = 0; i < 4; i++) {
            const particle = this.scene.add.circle(
                this.x + (Math.random() - 0.5) * 30,
                this.y + (Math.random() - 0.5) * 30,
                1, 0x00ffff, 0.6
            );

            // Animación de flotación
            this.scene.tweens.add({
                targets: particle,
                x: this.x + (Math.random() - 0.5) * 40,
                y: this.y + (Math.random() - 0.5) * 40,
                alpha: 0.3,
                duration: 2000 + Math.random() * 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            this.ambientParticles.push(particle);
        }
    }

    update(viruses) {
        // Verificar estado de activación/desactivación
        this.checkActivationState();

        // Solo disparar si está activo
        if (!this.isActive) return;

        const currentTime = this.scene.time.now;

        if (currentTime - this.lastFired > this.fireRate) {
            const target = this.findTarget(viruses);
            if (target) {
                this.fire(target);
                this.lastFired = currentTime;
            }
        }
    }

    checkActivationState() {
        const currentTime = Date.now();
        const timeSinceLastChange = currentTime - this.lastStateChange;

        if (this.isActive && timeSinceLastChange > this.deactivationTime) {
            // Desactivar firewall
            this.deactivate();
        } else if (!this.isActive && !this.needsReactivation && timeSinceLastChange > this.reactivationTime) {
            // Marcar como necesita reactivación manual
            this.needsReactivation = true;
            this.updateVisualState();
        }
    }

    deactivate() {
        this.isActive = false;
        this.lastStateChange = Date.now();
        this.needsReactivation = false;
        this.updateVisualState();

        // Efecto visual de desactivación
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.3,
            duration: 500,
            ease: 'Power2'
        });

        // Pausar animaciones
        if (this.pulseAnimation) this.pulseAnimation.pause();
        if (this.ringAnimations && Array.isArray(this.ringAnimations)) {
            this.ringAnimations.forEach(anim => anim.pause());
        }
    }

    reactivate() {
        this.isActive = true;
        this.needsReactivation = false;
        this.lastStateChange = Date.now();
        this.updateVisualState();

        // Efecto visual de reactivación
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 1,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 300,
            yoyo: true,
            ease: 'Power2'
        });

        // Reanudar animaciones
        if (this.pulseAnimation) this.pulseAnimation.resume();
        if (this.ringAnimations && Array.isArray(this.ringAnimations)) {
            this.ringAnimations.forEach(anim => anim.resume());
        }

        // Efecto de partículas de reactivación
        for (let i = 0; i < 8; i++) {
            const particle = this.scene.add.circle(
                this.x + (Math.random() - 0.5) * 20,
                this.y + (Math.random() - 0.5) * 20,
                2, 0x00ff00, 0.8
            );

            this.scene.tweens.add({
                targets: particle,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 800,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }

    updateVisualState() {
        if (this.isActive) {
            this.statusText.setText('ACTIVO');
            this.statusText.setFill('#00ff00');
            this.sprite.setFillStyle(0x0099ff);
            this.sprite.setStrokeStyle(3, 0x00ffff);
        } else if (this.needsReactivation) {
            this.statusText.setText('CLIC PARA REACTIVAR');
            this.statusText.setFill('#ffff00');
            this.sprite.setFillStyle(0x666600);
            this.sprite.setStrokeStyle(3, 0xffff00);
        } else {
            this.statusText.setText('DESACTIVANDO...');
            this.statusText.setFill('#ff6600');
            this.sprite.setFillStyle(0x663300);
            this.sprite.setStrokeStyle(3, 0xff6600);
        }
    }

    findTarget(viruses) {
        for (let virus of viruses) {
            if (virus.health > 0) {
                const distance = Phaser.Math.Distance.Between(
                    this.x, this.y, virus.sprite.x, virus.sprite.y
                );
                if (distance <= this.range) {
                    return virus;
                }
            }
        }
        return null;
    }

    fire(target) {
        // Crear proyectil mejorado
        const projectile = this.scene.add.circle(this.x, this.y, 4, 0x00ffff);
        projectile.setStrokeStyle(2, 0xffffff);

        // Efecto de brillo del proyectil
        const glow = this.scene.add.circle(this.x, this.y, 8, 0x00ffff, 0.3);

        // Calcular dirección
        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.sprite.x, target.sprite.y);
        const distance = Phaser.Math.Distance.Between(this.x, this.y, target.sprite.x, target.sprite.y);
        const duration = (distance / 300) * 1000; // Velocidad del proyectil

        // Animación del proyectil con rastro
        this.scene.tweens.add({
            targets: [projectile, glow],
            x: target.sprite.x,
            y: target.sprite.y,
            duration: duration,
            ease: 'Power2',
            onComplete: () => {
                // Efecto de impacto mejorado
                this.createImpactEffect(target.sprite.x, target.sprite.y);

                // Daño al virus
                target.takeDamage();

                // Limpiar proyectil
                projectile.destroy();
                glow.destroy();
            }
        });

        // Efecto de disparo en el firewall
        const muzzleFlash = this.scene.add.circle(this.x, this.y, 15, 0x00ffff, 0.8);
        this.scene.tweens.add({
            targets: muzzleFlash,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 200,
            onComplete: () => muzzleFlash.destroy()
        });

        // Efecto de retroceso
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 0.8,
            scaleY: 0.8,
            duration: 100,
            yoyo: true,
            ease: 'Power2'
        });

        this.lastFired = this.scene.time.now;
        this.scene.playSound('firewallShoot');
    }

    createImpactEffect(x, y) {
        // Crear múltiples partículas de impacto
        for (let i = 0; i < 6; i++) {
            const spark = this.scene.add.circle(
                x + (Math.random() - 0.5) * 10,
                y + (Math.random() - 0.5) * 10,
                Math.random() * 3 + 1,
                0x00ffff,
                0.9
            );

            this.scene.tweens.add({
                targets: spark,
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 30,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 300 + Math.random() * 200,
                ease: 'Power2',
                onComplete: () => spark.destroy()
            });
        }

        // Onda de choque de impacto
        const shockwave = this.scene.add.circle(x, y, 3, 0x00ffff, 0);
        shockwave.setStrokeStyle(2, 0x00ffff);

        this.scene.tweens.add({
            targets: shockwave,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 250,
            ease: 'Power2',
            onComplete: () => shockwave.destroy()
        });
    }

    createHitEffect(x, y) {
        // Explosión de partículas
        for (let i = 0; i < 8; i++) {
            const spark = this.scene.add.circle(x, y, 3, 0x00ffff);

            this.scene.tweens.add({
                targets: spark,
                x: x + Phaser.Math.Between(-20, 20),
                y: y + Phaser.Math.Between(-20, 20),
                alpha: 0,
                scale: 0,
                duration: 400,
                onComplete: () => spark.destroy()
            });
        }

        // Onda de choque
        const shockwave = this.scene.add.circle(x, y, 5, 0x00ffff, 0);
        shockwave.setStrokeStyle(2, 0x00ffff);

        this.scene.tweens.add({
            targets: shockwave,
            scaleX: 4,
            scaleY: 4,
            alpha: 0,
            duration: 300,
            onComplete: () => shockwave.destroy()
        });
    }

    createInstructionBox() {
        // Crear fondo semi-transparente para el recuadro
        this.instructionBox = this.add.rectangle(500, 250, 600, 300, 0x000000, 0.8);
        this.instructionBox.setStrokeStyle(3, 0x00ffff);

        // Efecto de brillo en el borde
        const glowBox = this.add.rectangle(500, 250, 610, 310, 0x00ffff, 0);
        glowBox.setStrokeStyle(6, 0x00ffff, 0.3);

        // Título del juego
        this.instructionTitle = this.add.text(500, 180, 'ROBO-EXPLORER', {
            fontSize: '32px',
            fill: '#00ffff',
            fontFamily: 'Arial Black',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Subtítulo
        this.instructionSubtitle = this.add.text(500, 220, 'Reparación de Drones', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Texto de instrucción principal
        this.instructionText = this.add.text(500, 280, 'Haz click en la pantalla para continuar', {
            fontSize: '20px',
            fill: '#ffff00',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);

        // Animación de parpadeo para el texto de instrucción
        this.tweens.add({
            targets: this.instructionText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Animación de pulsación para el título
        this.tweens.add({
            targets: this.instructionTitle,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Agrupar elementos del recuadro
        this.instructionElements = [
            this.instructionBox,
            glowBox,
            this.instructionTitle,
            this.instructionSubtitle,
            this.instructionText
        ];

        // Configurar evento de click para ocultar el recuadro
        this.input.on('pointerdown', this.hideInstructionBox, this);
    }

    hideInstructionBox() {
        // Ocultar todos los elementos del recuadro
        this.instructionElements.forEach(element => {
            if (element) {
                element.setVisible(false);
            }
        });

        // Remover el evento de click
        this.input.off('pointerdown', this.hideInstructionBox, this);
    }
}