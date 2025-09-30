class Rompecabezas extends Phaser.Scene {
    constructor() {
        super({ key: 'Rompecabezas' });
        this.state = { errors: 0, active: true, modal: false };
        this.config = {
            errors: [2, 5, 8],
            colors: { primary: 0x00ff88, secondary: 0x0066ff, accent: 0xff6b35, bg: 0x0a0a0a }
        };
    }

    create() {
        const { width: W, height: H } = this.cameras.main;
        this.W = W; this.H = H;
        
        this.createVisuals();
        this.createCode();
        this.startGame();
    }

    createVisuals() {
        // Fondo con gradiente animado
        const bg = this.add.graphics();
        bg.fillGradientStyle(this.config.colors.bg, this.config.colors.bg, 0x1a1a2e, 0x16213e);
        bg.fillRect(0, 0, this.W, this.H);

        // Grid futurista animado
        this.createGrid();
        
        // Partículas flotantes
        this.createParticles();
        
        // Título con efecto neón
        this.createTitle();
    }

    createGrid() {
        const grid = this.add.graphics();
        grid.lineStyle(1, this.config.colors.primary, 0.2);
        
        // Líneas horizontales y verticales con animación
        for (let i = 0; i < 15; i++) {
            const x = (this.W / 15) * i;
            const y = (this.H / 12) * i;
            
            if (i < 12) {
                grid.lineBetween(0, y, this.W, y);
            }
            grid.lineBetween(x, 0, x, this.H);
        }

        // Nodos pulsantes
        for (let i = 0; i < 12; i++) {
            const node = this.add.circle(
                Phaser.Math.Between(50, this.W - 50),
                Phaser.Math.Between(50, this.H - 50),
                2, this.config.colors.primary, 0.4
            );
            
            this.tweens.add({
                targets: node,
                scale: { from: 1, to: 1.8 },
                alpha: { from: 0.4, to: 0.1 },
                duration: 2500,
                yoyo: true,
                repeat: -1,
                delay: i * 300
            });
        }
    }

    createParticles() {
        for (let i = 0; i < 15; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, this.W),
                Phaser.Math.Between(0, this.H),
                1,
                this.config.colors.secondary, 0.3
            );
            
            this.tweens.add({
                targets: particle,
                y: particle.y - 120,
                x: particle.x + Phaser.Math.Between(-30, 30),
                alpha: 0,
                duration: Phaser.Math.Between(5000, 9000),
                repeat: -1,
                onRepeat: () => {
                    particle.y = this.H + 10;
                    particle.x = Phaser.Math.Between(0, this.W);
                    particle.alpha = 0.3;
                }
            });
        }
    }

    createTitle() {
        // Título principal con efecto neón
        const title = this.add.text(this.W/2, 40, '⚡ ARDUINO DEBUGGER', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            fill: '#00ff88',
            stroke: '#003322',
            strokeThickness: 2,
            shadow: { offsetX: 0, offsetY: 0, color: '#00ff88', blur: 15, fill: true }
        }).setOrigin(0.5);

        // Animación de pulso
        this.tweens.add({
            targets: title,
            scaleX: { from: 1, to: 1.03 },
            scaleY: { from: 1, to: 1.03 },
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtítulo
        this.add.text(this.W/2, 70, 'Encuentra los 3 errores en el código', {
            fontSize: '16px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            alpha: 0.8
        }).setOrigin(0.5);
    }

    createCode() {
        // Panel de código centrado y más grande
        const panel = this.add.graphics();
        panel.fillStyle(0x1a1a2e, 0.85);
        panel.lineStyle(3, this.config.colors.primary, 0.9);
        panel.fillRoundedRect(this.W/2 - 350, 100, 700, 450, 20);
        panel.strokeRoundedRect(this.W/2 - 350, 100, 700, 450, 20);

        // Código Arduino más corto
        const code = [
            'void setup() {',
            '  Serial.begin(9600);',
            '  pinMode(A0, INPUT);', // ERROR 1
            '}',
            'void loop() {',
            '  int val = analogRead(A0) * 5.0 / 1024.0;', // ERROR 2
            '  if (val > 2.5) {',
            '    digitalWrite(13, HIGH);',
            '    delay(100);', // ERROR 3
            '  }',
            '  delay(1000);',
            '}'
        ];

        this.codeLines = code.map((line, i) => {
            const isError = this.config.errors.includes(i);
            const text = this.add.text(this.W/2 - 320, 140 + i * 28, `${(i+1).toString().padStart(2, ' ')} ${line}`, {
                fontSize: '18px',
                fontFamily: 'Courier New',
                fill: isError ? '#ff4444' : '#ffffff',
                backgroundColor: isError ? '#441111' : 'transparent',
                padding: { x: 10, y: 5 }
            });

            if (isError) {
                // Hacer el área interactiva más grande
                text.setInteractive(new Phaser.Geom.Rectangle(-10, -5, text.width + 20, text.height + 10), Phaser.Geom.Rectangle.Contains)
                    .setData('lineIndex', i)
                    .on('pointerdown', (pointer, localX, localY, event) => {
                        console.log('Clic en línea de error:', i);
                        event.stopPropagation();
                        this.showOptions(i);
                    })
                    .on('pointerover', () => {
                        text.setBackgroundColor('#662222');
                        text.setScale(1.05);
                        this.input.setDefaultCursor('pointer');
                    })
                    .on('pointerout', () => {
                        text.setBackgroundColor('#441111');
                        text.setScale(1);
                        this.input.setDefaultCursor('default');
                    });

                // Efecto de parpadeo elegante
                this.tweens.add({
                    targets: text,
                    alpha: { from: 0.8, to: 1 },
                    duration: 1500,
                    yoyo: true,
                    repeat: -1
                });
            }

            return { text, isError, found: false, index: i };
        });

        // Mensaje de instrucciones centrado
        this.add.text(this.W/2, 580, 'Haz clic en las líneas rojas para corregir los errores', {
            fontSize: '14px',
            fontFamily: 'Arial',
            fill: '#00ff88',
            alpha: 0.8
        }).setOrigin(0.5);
    }

    showOptions(lineIndex) {
        console.log('showOptions llamada con lineIndex:', lineIndex);
        
        if (this.state.modal || !this.state.active) {
            console.log('Modal ya abierto o juego inactivo');
            return;
        }
        
        const line = this.codeLines[lineIndex];
        if (line && line.found) {
            console.log('Línea ya encontrada');
            return;
        }

        console.log('Creando modal para línea:', lineIndex);
        this.state.modal = true;

        // Modal posicionado en la parte superior
        const modal = this.add.container(this.W/2, this.H/3);
        
        // Background que cubre toda la pantalla
        const bg = this.add.rectangle(0, 0, this.W * 2, this.H * 2, 0x000000, 0.8);
        bg.setInteractive();
        
        // Panel principal - más alto para incluir la línea de código
        const panel = this.add.graphics();
        panel.fillStyle(0x1a1a2e, 0.95);
        panel.lineStyle(3, this.config.colors.primary, 1);
        panel.fillRoundedRect(-300, -140, 600, 280, 20);
        panel.strokeRoundedRect(-300, -140, 600, 280, 20);

        // Título
        const title = this.add.text(0, -110, '🔧 SELECCIONA LA CORRECCIÓN', {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            fill: '#00ff88'
        }).setOrigin(0.5);

        // Mostrar la línea de código seleccionada
        const code = [
            'void setup() {',
            '  Serial.begin(9600);',
            '  pinMode(A0, INPUT);', // ERROR 1
            '}',
            'void loop() {',
            '  int val = analogRead(A0) * 5.0 / 1024.0;', // ERROR 2
            '  if (val > 2.5) {',
            '    digitalWrite(13, HIGH);',
            '    delay(100);', // ERROR 3
            '  }',
            '  delay(1000);',
            '}'
        ];

        const selectedLine = code[lineIndex];
        const lineNumber = lineIndex + 1;
        
        const codeDisplay = this.add.text(0, -80, `Línea ${lineNumber}: ${selectedLine}`, {
            fontSize: '14px',
            fontFamily: 'Courier New',
            fill: '#ff4444',
            backgroundColor: '#441111',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        // Agregar background, panel, título y línea de código primero
        modal.add([bg, panel, title, codeDisplay]);

        // Opciones
        const options = this.getOptions(lineIndex);
        console.log('Opciones obtenidas:', options);
        
        if (!options) {
            console.log('No se encontraron opciones para la línea:', lineIndex);
            this.closeModal(modal);
            return;
        }
        
        const allOpts = [options.correct, ...options.wrong].sort(() => Math.random() - 0.5);
        console.log('Opciones mezcladas:', allOpts);

        allOpts.forEach((opt, i) => {
            const y = -40 + i * 40;  // Ajustado para el nuevo tamaño del panel
            const btn = this.add.graphics();
            btn.fillStyle(this.config.colors.secondary, 0.8);
            btn.fillRoundedRect(-280, y - 15, 560, 35, 10);
            
            const text = this.add.text(0, y, `${String.fromCharCode(65 + i)}) ${opt}`, {
                fontSize: '13px',
                fontFamily: 'Arial',
                fill: '#ffffff'
            }).setOrigin(0.5);

            btn.setInteractive(new Phaser.Geom.Rectangle(-280, y - 15, 560, 35), Phaser.Geom.Rectangle.Contains)
                .on('pointerdown', () => this.handleAnswer(opt === options.correct, modal, btn, text, y))
                .on('pointerover', () => {
                    btn.setAlpha(1);
                    text.setScale(1.05);
                })
                .on('pointerout', () => {
                    btn.setAlpha(0.8);
                    text.setScale(1);
                });

            // Agregar cada botón y texto después del panel
            modal.add([btn, text]);
        });
        
        // Animación de entrada
        modal.setScale(0.8).setAlpha(0);
        this.tweens.add({
            targets: modal,
            scale: 1,
            alpha: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });

        this.currentModal = modal;
    }

    getOptions(i) {
        const opts = {
            2: { correct: "Eliminar - Los pines analógicos no necesitan pinMode", wrong: ["Cambiar INPUT por OUTPUT", "Usar INPUT_PULLUP"] },
            5: { correct: "Separar en dos líneas: int val = analogRead(A0); float voltage = val * 5.0 / 1023.0;", wrong: ["Cambiar 5.0 por 3.3", "Multiplicar por 2"] },
            8: { correct: "Cambiar a delay(1000) para parpadeo normal", wrong: ["Eliminar el delay", "Cambiar a 50"] }
        };
        return opts[i];
    }

    handleAnswer(correct, modal, btn, text, y) {
        if (correct) {
            // Respuesta correcta - botón verde
            btn.clear().fillStyle(0x00aa00, 1).fillRoundedRect(-280, y - 15, 560, 35, 10);
            this.state.errors++;
            
            this.time.delayedCall(800, () => {
                this.closeModal(modal);
                this.markCorrect();
            });
        } else {
            // Respuesta incorrecta - botón rojo permanente
            btn.clear().fillStyle(0xaa0000, 1).fillRoundedRect(-280, y - 15, 560, 35, 10);
            
            // Deshabilitar la interactividad del botón incorrecto para mantener el color rojo
            btn.disableInteractive();
            btn.setAlpha(1); // Asegurar que no sea transparente
            
            // Agregar mensaje de "INCORRECTO" - pero mantener modal abierto
            const incorrectMessage = this.add.text(0, 100, '❌ INCORRECTO - Intenta de nuevo', {
                fontSize: '18px',
                fontFamily: 'Arial Black',
                fill: '#ff4444',
                backgroundColor: '#441111',
                padding: { x: 15, y: 8 }
            }).setOrigin(0.5);
            
            modal.add(incorrectMessage);
            
            // Remover el mensaje después de 2 segundos pero mantener el modal abierto
            this.time.delayedCall(2000, () => {
                incorrectMessage.destroy();
            });
            
            // NO cerrar el modal - mantenerlo abierto para que el usuario pueda intentar de nuevo
        }
    }

    markCorrect() {
        const line = this.codeLines.find(l => l.isError && !l.found);
        if (line) {
            line.found = true;
            line.text.setFill('#00ff88').setBackgroundColor('#003300');
            
            // Efecto de éxito
            this.createSuccessEffect(line.text.x, line.text.y);
            
            if (this.state.errors >= 3) this.gameWin();
        }
    }

    createSuccessEffect(x, y) {
        for (let i = 0; i < 6; i++) {
            const particle = this.add.circle(x, y, 3, this.config.colors.primary);
            this.tweens.add({
                targets: particle,
                x: x + Phaser.Math.Between(-50, 50),
                y: y + Phaser.Math.Between(-50, 50),
                alpha: 0,
                scale: 0,
                duration: 600,
                onComplete: () => particle.destroy()
            });
        }
    }

    closeModal(modal) {
        if (!modal) {
            this.state.modal = false;
            return;
        }
        
        this.tweens.add({
            targets: modal,
            scale: 0.8,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                modal.destroy();
                this.state.modal = false;
            }
        });
    }

    startGame() {
        // Solo inicializar el juego sin timer visible
        this.state.active = true;
    }

    gameWin() {
        this.state.active = false;
        
        // Mensaje de victoria centrado
        const winText = this.add.text(this.W/2, this.H/2 + 200, '🎉 ¡TODOS LOS ERRORES CORREGIDOS! 🎉', {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            fill: '#00ff88',
            stroke: '#003322',
            strokeThickness: 2,
            shadow: { offsetX: 0, offsetY: 0, color: '#00ff88', blur: 20, fill: true }
        }).setOrigin(0.5);

        // Animación de victoria
        this.tweens.add({
            targets: winText,
            scaleX: { from: 0.8, to: 1.2 },
            scaleY: { from: 0.8, to: 1.2 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        this.cameras.main.flash(1500, 0, 255, 0);
        this.time.delayedCall(3000, () => this.scene.start('DroneRepairScene'));
    }
}