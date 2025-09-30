class scenaFallos extends Phaser.Scene {
  constructor() {
    super({ key: "scenaFallos" });
    this.currentCodeIndex = 0;
    this.score = 0;
    this.gameCompleted = false;
    this.showingCode = false;
    this.showingOptions = false;

    // Códigos de Arduino incompletos - REDUCIDO A SOLO 1 CÓDIGO
    this.arduinoCodes = [
      {
        title: "Código 1 - LED Parpadeante",
        code: `int ledPin = 9;
void setup() {
  // FALTA algo aquí
}
void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, LOW);
  delay(1000);
}`,
        options: [
          "(A) Falta definir ledPin como OUTPUT",
          "(B) Falta delay en loop",
          "(C) Falta digitalWrite(ledPin, LOW)",
          "(D) Falta incluir Arduino.h"
        ],
        correctAnswer: 0, // A es correcta
        explanation: "¡Correcto! Falta pinMode(ledPin, OUTPUT); en setup() para configurar el pin como salida."
      }
    ];
  }

  preload() {
    // Intentar cargar imagen de fondo, si no existe usaremos colores sólidos
    this.load.image("fondoFallos", "assets/Fallos/fondo.jpg");
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Crear fondo espacial con estrellas y nebulosas
    this.createSpaceBackground(centerX, centerY);

    // Estilos de texto mejorados
    const estiloTitulo = {
      font: 'bold 42px Orbitron, Arial',
      fill: '#00ffff',
      align: 'center',
      stroke: '#000033',
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: '#000066', blur: 8, fill: true }
    };

    const estiloTexto = {
      font: 'bold 18px "Courier New", monospace',
      fill: '#00ff88',
      align: 'left',
      wordWrap: { width: centerX * 0.85 },
      stroke: '#001122',
      strokeThickness: 2,
      backgroundColor: 'rgba(0, 20, 40, 0.7)',
      padding: { x: 15, y: 10 },
      shadow: { offsetX: 2, offsetY: 2, color: '#003344', blur: 5, fill: true }
    };

    const estiloFeedback = {
      font: 'bold 20px Arial',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: this.cameras.main.width * 0.8 },
      stroke: '#000000',
      strokeThickness: 3,
      shadow: { offsetX: 1, offsetY: 1, color: '#000066', blur: 4, fill: true }
    };

    // Título con animación futurista
    this.titleText = this.add.text(centerX, 40, 'ARDUINO CODE ANALYZER', estiloTitulo).setOrigin(0.5);
    this.titleText.setAlpha(0);
    this.tweens.add({
      targets: this.titleText,
      alpha: 1,
      duration: 1500,
      ease: 'Power2'
    });

    // LED e información del juego sin paneles
    this.createLEDIndicator(centerX - 200);
    this.createGameInfo(centerX);

    // Código Arduino sin panel (lado izquierdo)
    this.createCodeDisplay(centerX, centerY, estiloTexto);

    // Grupo para las opciones (lado derecho)
    this.opcionesGrupo = this.add.group();

    // Placeholder para el feedback (centrado abajo)
    this.feedbackTexto = this.add.text(centerX, centerY + 200, '', estiloFeedback).setOrigin(0.5);
    this.feedbackTexto.setAlpha(0);

    // Mostrar código y opciones inmediatamente
    this.showCodeAndOptions();
  }

  createLEDIndicator(xPos) {
    // LED mejorado con diseño futurista
    this.add.text(xPos - 25, 65, 'STATUS', {
      font: 'bold 14px Orbitron, Arial',
      fill: '#00ffff',
      align: 'center',
      stroke: '#000033',
      strokeThickness: 1,
      shadow: { offsetX: 1, offsetY: 1, color: '#003366', blur: 2, fill: true }
    }).setOrigin(0.5);

    // Anillo exterior con efecto holográfico
    this.ledOuterRing = this.add.circle(xPos, 100, 25, 0x000000);
    this.ledOuterRing.setStrokeStyle(3, 0x00ffff);
    this.ledOuterRing.setAlpha(0.6);

    // Anillo medio con gradiente
    this.ledMiddleRing = this.add.circle(xPos, 100, 18, 0x001122);
    this.ledMiddleRing.setStrokeStyle(2, 0x0088ff);
    this.ledMiddleRing.setAlpha(0.8);

    // LED principal con efecto de brillo mejorado
    this.ledIndicator = this.add.circle(xPos, 100, 12, 0x666666);
    this.ledIndicator.setStrokeStyle(2, 0xffffff);

    // Anillo de brillo interior con múltiples capas
    this.ledGlow = this.add.circle(xPos, 100, 20, 0x666666);
    this.ledGlow.setAlpha(0.3);
    this.ledGlow.setStrokeStyle(1, 0xffffff);

    // Efecto de pulso adicional
    this.ledPulse = this.add.circle(xPos, 100, 30, 0x000000);
    this.ledPulse.setStrokeStyle(1, 0x00ffff);
    this.ledPulse.setAlpha(0.2);

    // Partículas de energía alrededor del LED
    this.createLEDParticles(xPos, 100);

    // Animación continua de los anillos
    this.tweens.add({
      targets: this.ledOuterRing,
      rotation: Math.PI * 2,
      duration: 4000,
      repeat: -1,
      ease: 'Linear'
    });

    this.tweens.add({
      targets: this.ledMiddleRing,
      rotation: -Math.PI * 2,
      duration: 6000,
      repeat: -1,
      ease: 'Linear'
    });

    // Pulso suave continuo
    this.tweens.add({
      targets: this.ledPulse,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 0.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createLEDParticles(x, y) {
    // Crear partículas de energía alrededor del LED
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const distance = 40;
      const particleX = x + Math.cos(angle) * distance;
      const particleY = y + Math.sin(angle) * distance;

      const particle = this.add.circle(particleX, particleY, 2, 0x00ffff);
      particle.setAlpha(0.6);

      // Animación orbital
      this.tweens.add({
        targets: particle,
        rotation: Math.PI * 2,
        duration: 3000 + (i * 200),
        repeat: -1,
        ease: 'Linear'
      });

      // Parpadeo
      this.tweens.add({
        targets: particle,
        alpha: 0.2,
        duration: 1000 + (i * 100),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createGameInfo(centerX) {
    // Información del juego sin panel contenedor
    this.gameInfo = this.add.text(centerX, 100, `CÓDIGO ${this.currentCodeIndex + 1}/${this.arduinoCodes.length} | CORRECTAS: ${this.score}`, {
      fontSize: '18px',
      fontFamily: 'Courier New, monospace',
      fill: '#00ff88',
      align: 'center',
      stroke: '#001122',
      strokeThickness: 2,
      shadow: { offsetX: 1, offsetY: 1, color: '#003344', blur: 3, fill: true }
    }).setOrigin(0.5);
  }

  createCodeDisplay(centerX, centerY, estiloTexto) {
    // Título del código sin panel - AGRANDADO para mayor visibilidad - SUBIDO MÁS ARRIBA
    this.add.text(centerX * 0.5, centerY - 120, '< CÓDIGO ARDUINO >', {
      font: 'bold 28px Orbitron, Arial',
      fill: '#00ffff',
      align: 'center',
      stroke: '#000033',
      strokeThickness: 3,
      shadow: { offsetX: 2, offsetY: 2, color: '#000066', blur: 6, fill: true }
    }).setOrigin(0.5);

    // Texto del código sin recuadro - SOLO EL TEXTO
    this.questionText = this.add.text(centerX * 0.1, centerY - 80, '', estiloTexto);
    this.questionText.setAlpha(0);
  }

  createSpaceBackground(centerX, centerY) {
    // Fondo base espacial
    const spaceGradient = this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0x000011);

    // Crear estrellas
    for (let i = 0; i < 150; i++) {
      const x = Phaser.Math.Between(0, this.cameras.main.width);
      const y = Phaser.Math.Between(0, this.cameras.main.height);
      const size = Phaser.Math.Between(1, 3);
      const brightness = Phaser.Math.FloatBetween(0.3, 1);

      const star = this.add.circle(x, y, size, 0xffffff);
      star.setAlpha(brightness);

      // Animación de parpadeo para algunas estrellas
      if (Math.random() < 0.3) {
        this.tweens.add({
          targets: star,
          alpha: 0.1,
          duration: Phaser.Math.Between(2000, 4000),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    }

    // Nebulosas de colores
    const nebula1 = this.add.circle(centerX * 0.3, centerY * 0.4, 80, 0x330066);
    nebula1.setAlpha(0.3);
    const nebula2 = this.add.circle(centerX * 1.7, centerY * 1.6, 100, 0x003366);
    nebula2.setAlpha(0.2);
    const nebula3 = this.add.circle(centerX * 1.2, centerY * 0.2, 60, 0x660033);
    nebula3.setAlpha(0.25);

    // Animación suave de las nebulosas
    [nebula1, nebula2, nebula3].forEach(nebula => {
      this.tweens.add({
        targets: nebula,
        alpha: nebula.alpha * 0.5,
        duration: 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
  }

  showCodeAndOptions() {
    if (this.gameCompleted) return;

    const currentCode = this.arduinoCodes[this.currentCodeIndex];
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Mostrar código en el lado izquierdo sin panel
    this.questionText.setText(`${currentCode.title}\n\n${currentCode.code}`);
    this.questionText.setAlpha(0);
    this.tweens.add({
      targets: this.questionText,
      alpha: 1,
      duration: 800,
      ease: 'Power2'
    });

    // Limpiar opciones anteriores
    this.clearOptions();

    // Panel de opciones con diseño futurista (ÚNICO PANEL QUE SE MANTIENE)
    this.createOptionsPanel(centerX, centerY);

    // Crear título para las opciones con efecto holográfico
    const optionsTitle = this.add.text(centerX + centerX * 0.5, centerY - 100, '[ SELECCIONA LA RESPUESTA ]', {
      font: 'bold 18px Arial',
      fill: '#ffff00',
      align: 'center',
      stroke: '#333300',
      strokeThickness: 2,
      shadow: { offsetX: 1, offsetY: 1, color: '#666600', blur: 3, fill: true }
    }).setOrigin(0.5);

    optionsTitle.setAlpha(0);
    this.tweens.add({
      targets: optionsTitle,
      alpha: 1,
      duration: 1000,
      ease: 'Power2'
    });

    // Crear nuevas opciones en el lado derecho con mejor diseño
    let startY = centerY - 40;
    const rightSideX = centerX + centerX * 0.5;

    currentCode.options.forEach((opcion, index) => {
      const yPos = startY + (index * 60);

      // Contenedor de opción con efecto holográfico - AHORA COMPLETAMENTE CLICKEABLE
      const opcionContainer = this.add.rectangle(rightSideX, yPos, 450, 50, 0x002244);
      opcionContainer.setStrokeStyle(2, 0x0088ff);
      opcionContainer.setAlpha(0.8);
      opcionContainer.setInteractive({ useHandCursor: true });

      const opcionTexto = this.add.text(rightSideX, yPos, opcion, {
        font: 'bold 16px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 420 },
        stroke: '#000033',
        strokeThickness: 1
      })
        .setOrigin(0.5, 0.5);

      // Eventos de interacción aplicados al CONTENEDOR para que toda el área sea clickeable
      opcionContainer
        .on('pointerdown', () => this.seleccionarOpcion(index, opcionContainer, opcionTexto))
        .on('pointerover', () => {
          // Solo aplicar efectos hover si la opción no ha sido marcada como incorrecta
          if (opcionTexto.getData('incorrect') !== true) {
            opcionTexto.setStyle({ fill: '#00ffff' });
            opcionContainer.setStrokeStyle(3, 0x00ffff);
            this.tweens.add({
          targets: [opcionTexto, opcionContainer],
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 150,
          ease: 'Power2.easeOut'
        });
            // Efecto de brillo
            this.tweens.add({
              targets: opcionContainer,
              alpha: 1,
              duration: 200
            });
          }
        })
        .on('pointerout', () => {
          // Solo restaurar colores si no está seleccionada y no es incorrecta
          if (opcionTexto.getData('selected') !== true && opcionTexto.getData('incorrect') !== true) {
            opcionTexto.setStyle({ fill: '#ffffff' });
            opcionContainer.setStrokeStyle(2, 0x0088ff);
            opcionContainer.setAlpha(0.8);
          }
          // Siempre restaurar la escala
          this.tweens.add({
            targets: [opcionTexto, opcionContainer],
            scaleX: 1,
            scaleY: 1,
            duration: 150,
            ease: 'Power2.easeOut'
          });
        });

      opcionTexto.setAlpha(0).setScale(0.8);
      opcionContainer.setScale(0.8);

      this.opcionesGrupo.add(opcionTexto);
      this.opcionesGrupo.add(opcionContainer);

      this.tweens.add({
        targets: [opcionTexto, opcionContainer],
        alpha: { from: 0, to: opcionContainer === opcionContainer ? 0.8 : 1 },
        scale: 1,
        duration: 300,
        delay: 100 + (index * 80),
        ease: 'Back.easeOut'
      });
    });

    this.showingCode = true;
    this.showingOptions = true;
  }

  createOptionsPanel(centerX, centerY) {
    // Panel de opciones con diseño futurista (ÚNICO PANEL MANTENIDO)
    const optionsPanel = this.add.rectangle(centerX + centerX * 0.5, centerY, centerX * 0.85, centerY * 1.2, 0x001a2e);
    optionsPanel.setStrokeStyle(2, 0x0088ff);
    optionsPanel.setAlpha(0.1);

    // Efectos de esquinas para el panel de opciones
    const cornerSize = 15;
    const panelCorners = [
      { x: (centerX + centerX * 0.5) - (centerX * 0.85)/2, y: centerY - (centerY * 1.2)/2 },
      { x: (centerX + centerX * 0.5) + (centerX * 0.85)/2, y: centerY - (centerY * 1.2)/2 },
      { x: (centerX + centerX * 0.5) - (centerX * 0.85)/2, y: centerY + (centerY * 1.2)/2 },
      { x: (centerX + centerX * 0.5) + (centerX * 0.85)/2, y: centerY + (centerY * 1.2)/2 }
    ];

    panelCorners.forEach(corner => {
      const cornerEffect = this.add.rectangle(corner.x, corner.y, cornerSize, cornerSize, 0x0088ff);
      cornerEffect.setAlpha(0.6);
    });
  }

  clearOptions() {
    // Animación de salida rápida para las opciones antes de destruirlas
    const children = this.opcionesGrupo.getChildren();
    if (children.length > 0) {
      children.forEach((opcion, index) => {
        this.tweens.add({
          targets: opcion,
          alpha: 0,
          scaleX: 0.8,
          scaleY: 0.8,
          duration: 200,
          delay: index * 30,
          ease: 'Power2.easeIn',
          onComplete: () => {
            if (opcion && opcion.destroy) {
              opcion.destroy();
            }
          }
        });
      });

      // Limpiar el grupo después de que terminen las animaciones
      this.time.delayedCall(300, () => {
        this.opcionesGrupo.clear();
      });
    } else {
      this.opcionesGrupo.clear();
    }
  }

  seleccionarOpcion(indiceOpcion, opcionContainer, opcionTexto) {
    const currentCode = this.arduinoCodes[this.currentCodeIndex];
    const esCorrecta = indiceOpcion === currentCode.correctAnswer;

    // Efectos visuales mejorados para la respuesta
    if (esCorrecta) {
      // Deshabilitar todas las opciones después de respuesta correcta
      this.opcionesGrupo.getChildren().forEach(child => {
        if (child.input) {
          child.disableInteractive();
        }
      });

      // Respuesta correcta - efectos verdes con brillo
      this.ledIndicator.setFillStyle(0x00ff00);
      this.ledGlow.setFillStyle(0x00ff00);
      this.ledMiddleRing.setFillStyle(0x004400);
      this.ledOuterRing.setStrokeStyle(3, 0x00ff00);
      this.ledGlow.setAlpha(0.8);

      // Animación de pulso para el LED con múltiples elementos
      this.tweens.add({
        targets: [this.ledIndicator, this.ledGlow, this.ledMiddleRing],
        scaleX: 1.4,
        scaleY: 1.4,
        duration: 300,
        yoyo: true,
        ease: 'Power2'
      });

      // Efecto especial en el anillo exterior
      this.tweens.add({
        targets: this.ledOuterRing,
        scaleX: 1.6,
        scaleY: 1.6,
        alpha: 1,
        duration: 500,
        yoyo: true,
        ease: 'Back.easeOut'
      });

      opcionContainer.setFillStyle(0x004400);
      opcionContainer.setStrokeStyle(4, 0x00ff00);
      opcionTexto.setStyle({ fill: '#00ff00' });

      // Efecto de partículas de éxito
      this.createSuccessParticles(opcionContainer.x, opcionContainer.y);

      this.score++;
      this.feedbackTexto.setText(`¡CORRECTO! ${currentCode.explanation}`);
      this.feedbackTexto.setColor('#00ff00');

      // Continuar al siguiente código o mostrar resultados finales (más rápido)
      this.time.delayedCall(1500, () => {
        if (this.currentCodeIndex < this.arduinoCodes.length - 1) {
          this.nextCode();
        } else {
          this.showFinalResults();
        }
      });

    } else {
      // Respuesta incorrecta - mantener opción marcada en rojo pero permitir seguir intentando
      this.ledIndicator.setFillStyle(0xff0000);
      this.ledGlow.setFillStyle(0xff0000);
      this.ledMiddleRing.setFillStyle(0x440000);
      this.ledOuterRing.setStrokeStyle(3, 0xff0000);
      this.ledGlow.setAlpha(0.8);

      // Animación de parpadeo para error con todos los elementos
      this.tweens.add({
        targets: [this.ledIndicator, this.ledGlow, this.ledMiddleRing, this.ledOuterRing],
        alpha: 0.3,
        duration: 200,
        yoyo: true,
        repeat: 3,
        ease: 'Power2'
      });

      // Efecto de vibración en el LED completo
      this.tweens.add({
        targets: [this.ledIndicator, this.ledGlow, this.ledMiddleRing, this.ledOuterRing],
        x: this.ledIndicator.x + 5,
        duration: 100,
        yoyo: true,
        repeat: 4,
        ease: 'Power2'
      });

      // Marcar la opción incorrecta permanentemente en rojo
      opcionContainer.setFillStyle(0x440000);
      opcionContainer.setStrokeStyle(4, 0xff0000);
      opcionTexto.setStyle({ fill: '#ff0000' });

      // Deshabilitar SOLO esta opción incorrecta para que no se pueda volver a seleccionar
      opcionContainer.disableInteractive();

      // Marcar como seleccionada incorrectamente para evitar efectos hover
      opcionTexto.setData('selected', true);
      opcionTexto.setData('incorrect', true);

      // Efecto de vibración para error
      this.tweens.add({
        targets: opcionContainer,
        x: opcionContainer.x + 10,
        duration: 100,
        yoyo: true,
        repeat: 3,
        ease: 'Power2'
      });

      this.feedbackTexto.setText(`INCORRECTO. Intenta de nuevo.`);
      this.feedbackTexto.setColor('#ff0000');

      // Mostrar feedback temporalmente pero NO avanzar al siguiente código
      this.feedbackTexto.setAlpha(0);
      this.feedbackTexto.setScale(0.9);
      this.tweens.add({
        targets: this.feedbackTexto,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 300,
        ease: 'Power2.easeOut'
      });

      // Ocultar el feedback después de 2 segundos pero mantener el juego activo
      this.time.delayedCall(2000, () => {
        this.tweens.add({
          targets: this.feedbackTexto,
          alpha: 0,
          duration: 300,
          ease: 'Power2.easeOut'
        });
      });

      // NO continuar automáticamente - el jugador debe seguir intentando
      return;
    }

    // Actualizar información del juego con efectos (solo para respuestas correctas)
    this.gameInfo.setText(`CÓDIGO ${this.currentCodeIndex + 1}/${this.arduinoCodes.length} | CORRECTAS: ${this.score}`);
    this.tweens.add({
      targets: this.gameInfo,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 200,
      yoyo: true,
      ease: 'Power2.easeOut'
    });

    // Mostrar feedback con animación holográfica (solo para respuestas correctas)
    this.feedbackTexto.setAlpha(0);
    this.feedbackTexto.setScale(0.9);
    this.tweens.add({
      targets: this.feedbackTexto,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: 'Power2.easeOut'
    });
  }

  createSuccessParticles(x, y) {
    // Crear partículas de éxito
    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(x, y, 3, 0x00ff00);
      const angle = (i / 8) * Math.PI * 2;
      const distance = 50;

      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        duration: 800,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  nextCode() {
    this.currentCodeIndex++;

    if (this.currentCodeIndex >= this.arduinoCodes.length) {
      this.showFinalResults();
      return;
    }

    // Resetear estado del LED mejorado
    this.ledIndicator.setFillStyle(0x666666);
    this.ledGlow.setFillStyle(0x666666);
    this.ledMiddleRing.setFillStyle(0x001122);
    this.ledOuterRing.setStrokeStyle(3, 0x00ffff);
    this.ledIndicator.setAlpha(1);
    this.ledGlow.setAlpha(0.3);
    this.ledMiddleRing.setAlpha(0.8);
    this.ledOuterRing.setAlpha(0.6);

    // Resetear escalas
    [this.ledIndicator, this.ledGlow, this.ledMiddleRing, this.ledOuterRing].forEach(element => {
      element.setScale(1);
    });

    this.showingCode = false;
    this.showingOptions = false;

    // Limpiar opciones
    this.clearOptions();

    // Actualizar información
    this.gameInfo.setText(`Código ${this.currentCodeIndex + 1} de ${this.arduinoCodes.length} | Correctas: ${this.score}`);

    // Mostrar nuevo código y opciones
    this.showCodeAndOptions();

    // Limpiar feedback
    this.feedbackTexto.setAlpha(0);
  }

  showFinalResults() {
    this.gameCompleted = true;
    this.clearOptions();

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const percentage = Math.round((this.score / this.arduinoCodes.length) * 100);

    // Crear panel de resultados con efectos holográficos
    const resultsPanel = this.add.rectangle(centerX, centerY, this.cameras.main.width * 0.8, this.cameras.main.height * 0.6, 0x001122);
    resultsPanel.setStrokeStyle(4, 0x00ffff);
    resultsPanel.setAlpha(0.9);

    // Efectos de esquinas para el panel de resultados
    const cornerSize = 30;
    const resultCorners = [
      { x: centerX - (this.cameras.main.width * 0.8)/2, y: centerY - (this.cameras.main.height * 0.6)/2 },
      { x: centerX + (this.cameras.main.width * 0.8)/2, y: centerY - (this.cameras.main.height * 0.6)/2 },
      { x: centerX - (this.cameras.main.width * 0.8)/2, y: centerY + (this.cameras.main.height * 0.6)/2 },
      { x: centerX + (this.cameras.main.width * 0.8)/2, y: centerY + (this.cameras.main.height * 0.6)/2 }
    ];

    resultCorners.forEach(corner => {
      const cornerEffect = this.add.rectangle(corner.x, corner.y, cornerSize, cornerSize, 0x00ffff);
      cornerEffect.setAlpha(0.8);
    });

    // Determinar mensaje y color según el rendimiento
    let mensaje, colorLED, colorTexto, efectoEspecial;
    // Cambiar condición: ahora requiere al menos 1 respuesta correcta Y 80% de precisión
    if (this.score >= 1 && percentage >= 80) {
      mensaje = '¡EXCELENTE TRABAJO!';
      colorLED = 0x00ff00;
      colorTexto = '#00ff00';
      efectoEspecial = 'success';
    } else if (percentage >= 60) {
      mensaje = 'BUEN TRABAJO';
      colorLED = 0xffff00;
      colorTexto = '#ffff00';
      efectoEspecial = 'good';
    } else {
      mensaje = 'SIGUE PRACTICANDO';
      colorLED = 0xff6600;
      colorTexto = '#ff6600';
      efectoEspecial = 'practice';
    }

    // Actualizar LED con el color correspondiente
    this.ledIndicator.setFillStyle(colorLED);
    this.ledGlow.setFillStyle(colorLED);
    this.ledGlow.setAlpha(0.8);

    // Animación especial del LED según el resultado
    if (efectoEspecial === 'success') {
      this.tweens.add({
        targets: [this.ledIndicator, this.ledGlow],
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 500,
        yoyo: true,
        repeat: 3,
        ease: 'Power2'
      });
    }

    // Título de resultados con animación - REPOSICIONADO PARA MEJOR DISTRIBUCIÓN
    const tituloResultados = this.add.text(centerX, centerY - 140, '[ ANÁLISIS COMPLETADO ]', {
      font: 'bold 28px Orbitron, Arial',
      fill: '#00ffff',
      align: 'center',
      stroke: '#000033',
      strokeThickness: 3,
      shadow: { offsetX: 2, offsetY: 2, color: '#000066', blur: 6, fill: true }
    }).setOrigin(0.5);

    // Mensaje principal - cambiado según el rendimiento
    let mensajeTexto = mensaje; // Usar el mensaje ya definido arriba
    let feedbackTexto = 'Revisa los errores y vuelve a intentarlo.';

    // Si el rendimiento es excelente (ahora solo requiere 1 respuesta correcta Y más del 80% de precisión)
    if (this.score >= 1 && percentage >= 80) {
      // MENSAJE DE FELICITACIONES - TAMAÑO BALANCEADO Y VISIBLE
      const felicitacionesText = this.add.text(centerX, centerY - 120, '¡FELICITACIONES!', {
        fontSize: '50px',
        fontFamily: 'Arial Black, Arial',
        fontStyle: 'bold',
        fill: '#ffd700',
        align: 'center',
        stroke: '#ffaa00',
        strokeThickness: 8,
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: '#ffd700',
          blur: 30,
          fill: true
        }
      }).setOrigin(0.5); // SIN ESCALADO ADICIONAL PARA TAMAÑO APROPIADO

      // Código de éxito técnico - SIN FONDO PARA EVITAR RECUADROS
      const codigoExito = this.add.text(centerX, centerY - 50, '', {
        font: 'bold 16px Courier New, monospace',
        fill: '#00ffff',
        align: 'center',
        stroke: '#0088ff',
        strokeThickness: 1
      }).setOrigin(0.5);

      // Subtítulo épico
      const subtituloExito = this.add.text(centerX, centerY - 20, '', {
        font: 'bold 24px Orbitron, Arial',
        fill: '#88ff88',
        align: 'center',
        stroke: '#44ff44',
        strokeThickness: 2,
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: '#88ff88',
          blur: 12,
          fill: true
        }
      }).setOrigin(0.5);

      // Feedback detallado y épico - SIN FONDO PARA EVITAR RECUADROS
      const feedbackEpico = this.add.text(centerX, centerY + 5,
        'Has demostrado una comprensión excepcional del código Arduino.\n' +
        'Tu análisis técnico ha sido preciso y eficiente.\n' +
        '¡Estás listo para desafíos más avanzados!', {
        font: '18px Arial',
        fill: '#aaffaa',
        align: 'center',
        lineSpacing: 8,
        stroke: '#66cc66',
        strokeThickness: 1,
        wordWrap: { width: 650 }
      }).setOrigin(0.5);

      // Logro desbloqueado - SIN FONDO PARA EVITAR RECUADROS
      const logroText = this.add.text(centerX, centerY + 65,
        '★ LOGRO DESBLOQUEADO: EXPERTO EN ARDUINO ★\n' +
        `Precisión: ${percentage}% | Respuestas Correctas: ${this.score} | Estado: PROGRAMADOR AVANZADO`, {
        font: 'bold 14px Arial',
        fill: '#ffdd44',
        align: 'center',
        lineSpacing: 6,
        stroke: '#cc9900',
        strokeThickness: 1
      }).setOrigin(0.5);

      // Animaciones épicas para los elementos de felicitaciones
      this.tweens.add({
        targets: felicitacionesText,
        alpha: { from: 0, to: 1 },
        scaleX: { from: 0.5, to: 1 },
        scaleY: { from: 0.5, to: 1 },
        duration: 600,
        ease: 'Back.easeOut'
      });

      this.tweens.add({
        targets: [codigoExito, subtituloExito],
        alpha: { from: 0, to: 1 },
        y: { from: '+=20', to: '-=0' },
        duration: 500,
        delay: 300,
        ease: 'Power2.easeOut'
      });

      this.tweens.add({
        targets: [feedbackEpico, logroText],
        alpha: { from: 0, to: 1 },
        scaleX: { from: 0.9, to: 1 },
        scaleY: { from: 0.9, to: 1 },
        duration: 400,
        delay: 600,
        ease: 'Power2.easeOut'
      });

      // Efecto de partículas doradas para celebración
      this.time.delayedCall(800, () => {
        for (let i = 0; i < 15; i++) {
          const particula = this.add.circle(
            centerX + Phaser.Math.Between(-200, 200),
            centerY + Phaser.Math.Between(-100, 100),
            Phaser.Math.Between(3, 8),
            0xffd700
          );

          this.tweens.add({
            targets: particula,
            alpha: { from: 1, to: 0 },
            scaleX: { from: 1, to: 0 },
            scaleY: { from: 1, to: 0 },
            y: '-=50',
            duration: 2000,
            ease: 'Power2.easeOut',
            onComplete: () => particula.destroy()
          });
        }
      });

    } else {
      // Mensaje estándar para otros casos
      const mensajePrincipal = this.add.text(centerX, centerY - 80, mensajeTexto, {
        font: 'bold 24px Arial',
        fill: colorTexto,
        align: 'center',
        stroke: '#000000',
        strokeThickness: 2,
        shadow: { offsetX: 1, offsetY: 1, color: '#000033', blur: 4, fill: true },
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: { x: 15, y: 8 }
      }).setOrigin(0.5);

      // Feedback personalizado estándar
      const feedback = this.add.text(centerX, centerY - 45, feedbackTexto, {
        font: '16px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 600 },
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: { x: 10, y: 5 }
      }).setOrigin(0.5);
    }

    // Botón - cambiado según el rendimiento con ESTILO MEJORADO
    let textoBotonTexto = 'REINICIAR';
    let accionBoton = () => {
      this.scene.restart();
    };

    // Si el rendimiento es excelente (ahora solo requiere 1 respuesta correcta Y más del 80% de precisión)
    if (this.score >= 1 && percentage >= 80) {
      textoBotonTexto = 'SIGUIENTE';
      accionBoton = () => {
        this.scene.start('scenaVideo2');
      };

      // BOTÓN ÉPICO PARA FELICITACIONES
      const botonSiguiente = this.add.rectangle(centerX, centerY + 120, 250, 60, 0x228844);
      botonSiguiente.setStrokeStyle(4, 0x44ff88);
      botonSiguiente.setInteractive({ useHandCursor: true });

      const textoBotonSiguiente = this.add.text(centerX, centerY + 120, '🚀 SIGUIENTE MISIÓN 🚀', {
        font: 'bold 20px Orbitron, Arial',
        fill: '#ffffff',
        align: 'center',
        stroke: '#004422',
        strokeThickness: 3,
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: '#44ff88',
          blur: 8,
          fill: true
        }
      }).setOrigin(0.5);

      // Efectos interactivos épicos del botón de siguiente
      botonSiguiente
        .on('pointerover', () => {
          botonSiguiente.setFillStyle(0x33aa55);
          botonSiguiente.setStrokeStyle(5, 0x66ffaa);
          textoBotonSiguiente.setStyle({ fill: '#88ffaa' });
          this.tweens.add({
            targets: [botonSiguiente, textoBotonSiguiente],
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 200,
            ease: 'Back.easeOut'
          });
        })
        .on('pointerout', () => {
          botonSiguiente.setFillStyle(0x228844);
          botonSiguiente.setStrokeStyle(4, 0x44ff88);
          textoBotonSiguiente.setStyle({ fill: '#ffffff' });
          this.tweens.add({
            targets: [botonSiguiente, textoBotonSiguiente],
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Back.easeOut'
          });
        })
        .on('pointerdown', () => {
          // Efecto de click épico
          this.tweens.add({
            targets: [botonSiguiente, textoBotonSiguiente],
            scaleX: 0.95,
            scaleY: 0.95,
            duration: 100,
            yoyo: true,
            ease: 'Power2.easeInOut',
            onComplete: () => {
              accionBoton();
            }
          });
        });

      // Animación de entrada del botón épico
      botonSiguiente.setAlpha(0);
      textoBotonSiguiente.setAlpha(0);
      this.tweens.add({
        targets: [botonSiguiente, textoBotonSiguiente],
        alpha: { from: 0, to: 1 },
        scaleX: { from: 0.8, to: 1 },
        scaleY: { from: 0.8, to: 1 },
        duration: 500,
        delay: 1000,
        ease: 'Back.easeOut'
      });

    } else {
      // BOTÓN ESTÁNDAR PARA OTROS CASOS
      const botonReiniciar = this.add.rectangle(centerX, centerY + 80, 200, 50, 0x004488);
      botonReiniciar.setStrokeStyle(3, 0x0088ff);
      botonReiniciar.setInteractive({ useHandCursor: true });

      const textoBoton = this.add.text(centerX, centerY + 80, textoBotonTexto, {
        font: 'bold 18px Arial',
        fill: '#ffffff',
        align: 'center',
        stroke: '#000033',
        strokeThickness: 2
      }).setOrigin(0.5);

      // Efectos interactivos del botón estándar
      botonReiniciar
        .on('pointerover', () => {
          botonReiniciar.setFillStyle(0x0066aa);
          botonReiniciar.setStrokeStyle(4, 0x00aaff);
          textoBoton.setStyle({ fill: '#00ffff' });
          this.tweens.add({
            targets: [botonReiniciar, textoBoton],
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 200,
            ease: 'Back.easeOut'
          });
        })
        .on('pointerout', () => {
          botonReiniciar.setFillStyle(0x004488);
          botonReiniciar.setStrokeStyle(3, 0x0088ff);
          textoBoton.setStyle({ fill: '#ffffff' });
          this.tweens.add({
            targets: [botonReiniciar, textoBoton],
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Back.easeOut'
          });
        })
        .on('pointerdown', () => {
          // Efecto de click estándar
          this.tweens.add({
            targets: [botonReiniciar, textoBoton],
            scaleX: 0.95,
            scaleY: 0.95,
            duration: 100,
            yoyo: true,
            ease: 'Power2.easeInOut',
            onComplete: () => {
              accionBoton();
            }
          });
        });
    }
  }

  createCelebrationParticles(centerX, centerY) {
    // Crear partículas de celebración
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(centerX, centerY, Phaser.Math.Between(2, 5), 0x00ff00);
      const angle = Math.random() * Math.PI * 2;
      const distance = Phaser.Math.Between(100, 200);
      const targetX = centerX + Math.cos(angle) * distance;
      const targetY = centerY + Math.sin(angle) * distance;

      this.tweens.add({
        targets: particle,
        x: targetX,
        y: targetY,
        alpha: 0,
        duration: Phaser.Math.Between(1000, 2000),
        delay: i * 100,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  updateLEDPulse() {
    if (this.ledGlow) {
      this.tweens.add({
        targets: this.ledGlow,
        scaleX: 1.3,
        scaleY: 1.3,
        alpha: 0.8,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  update() {
    // Actualización continua si es necesaria
  }
}