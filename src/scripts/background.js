class BackgroundIcons {
    #ICON_COLOR;
    #BACK_COLOR;
    #ICON_COUNT;
    #canvas;
    #window;
    #context;
    #document;
    #icons;
    #width;
    #height;
    #velocity;
    #resizeTimeout = null;
    #isFrozen = false;
    
    constructor(canvas, window, document, isDark) {
        if (!canvas) throw new Error("Canvas non trouvé !");
        this.#canvas = canvas;
        this.#window = window;
        this.#document = document;
        this.#context = canvas.getContext('2d');
        if (!this.#context) throw new Error("Impossible d'obtenir le context 2D");
        this.#icons = [];
        this.#velocity = { x: 0.2, y: 0.1 }; // vitesse très lente
        this.#ICON_COUNT = (window.innerWidth + window.innerHeight) / 20;
        this.#window.addEventListener('resize', this.#resize);
        this.#ICON_COLOR = isDark ? '#b4b4b4' : '#5c5c5c';
        this.#BACK_COLOR = isDark ? '#111' : '#FFF';
    }
    
    launch() {
        this.#generate();
        this.#resize();
        this.#step();
    }
    
    #randomTag() {
        const tags = ['<h1>', '</h1>', '<h2>', '</h2>', '<h3>', '</h3>', '<a>', '</a>', '<p>', '</p>', '<div>', '</div>', '</>'];
        return tags[Math.floor(Math.random() * tags.length)];
    }
    
    #generate() {
        for (let i = 0; i < this.#ICON_COUNT; i++) {
            this.#icons.push({
                x: Math.random() * this.#window.innerWidth,
                y: Math.random() * this.#window.innerHeight,
                size: 10 + Math.random() * 20,
                alpha: 0.3 + Math.random() * 0.7,
                tag: this.#randomTag()
            });
        }
    }

    #clear() {
        this.#icons = [];
    }
    
    #resize = () => {
        this.#isFrozen = true;

        if (this.#resizeTimeout) {
            clearTimeout(this.#resizeTimeout);
        }

        const dpr = window.devicePixelRatio || 1;
        this.#width = this.#window.innerWidth;
        this.#height = this.#window.innerHeight;
        this.#canvas.width = this.#width * dpr;
        this.#canvas.height = this.#height * dpr;
        this.#canvas.style.width = this.#width + "px";
        this.#canvas.style.height = this.#height + "px";
        this.#canvas.style.backgroundColor = this.#BACK_COLOR;
        this.#context.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Attendre 0.1 seconde avant de régénérer les icônes
        this.#resizeTimeout = setTimeout(() => {
            this.#clear();
            this.#ICON_COUNT = (this.#window.innerWidth + this.#window.innerHeight) / 20;
            this.#generate();
            this.#isFrozen = false; 
        }, 100);
    }
    
    #step = () => {
        this.#context.clearRect(0, 0, this.#width, this.#height);
        this.#update();
        this.#render();
        requestAnimationFrame(this.#step);
    }
    
    #update() {
        if (this.#isFrozen) return;

        this.#icons.forEach(icon => {
            icon.x += this.#velocity.x;
            icon.y += this.#velocity.y;
            if (icon.x > this.#width + icon.size) icon.x = -icon.size;
            if (icon.y > this.#height + icon.size) icon.y = -icon.size;
        });
    }
    
    #render() {
        this.#context.fillStyle = this.#ICON_COLOR;
        this.#context.font = 'bold 15px monospace';
        this.#icons.forEach(icon => {
            this.#context.globalAlpha = icon.alpha;
            this.#context.fillText(icon.tag, icon.x, icon.y); // Utilise la balise pré-générée
        });
        this.#context.globalAlpha = 1;
    }
}

export default BackgroundIcons;