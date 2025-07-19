import anime from 'animejs';

document.addEventListener('DOMContentLoaded', () => {
    const moduleData = [
        {
            id: 'module1',
            title: "Recognizing Undigested Conflict",
            description: "Answer interactive questions about your repressed emotions.",
        },
        {
            id: 'module2',
            title: "Body Forgiveness",
            description: "Place your virtual hands over your pancreas and send it forgiveness.",
        },
        {
            id: 'module3',
            title: "Emotional Release",
            description: "Reframe the effects of disease into statements of healing.",
        },
        {
            id: 'module4',
            title: "Energetics of Pancreas & Liver",
            description: "Follow the flow of healing energy with your finger or mouse.",
        },
        {
            id: 'module5',
            title: "21 Days of Reprogramming",
            description: "Track your daily progress on your healing journey.",
        }
    ];

    const moduleCardsContainer = document.getElementById('module-cards');
    const moduleSelectionSection = document.getElementById('module-selection');
    const moduleContentSection = document.getElementById('module-content');

    let currentModule = null;
    let audioContext, audioSource, gainNode;
    let animationInstance = null;

    // --- GENERAL FUNCTIONS ---

    function showModule(moduleId) {
        currentModule = moduleData.find(m => m.id === moduleId);
        moduleSelectionSection.classList.add('d-none');
        moduleContentSection.innerHTML = `
            <div class="card shadow-lg">
                <div class="card-body p-lg-5">
                    <button id="close-module-btn" class="btn-close float-end" aria-label="Close"></button>
                    <h2 class="card-title text-primary mb-4">${currentModule.title}</h2>
                    <div id="module-specific-content">
                        <!-- Module-specific HTML will be injected here -->
                    </div>
                </div>
            </div>`;
        moduleContentSection.classList.remove('d-none');
        document.getElementById('close-module-btn').addEventListener('click', closeModule);
        window.scrollTo(0, 0);
        loadModuleContent(moduleId);
    }

    function closeModule() {
        if (animationInstance) {
            animationInstance.pause();
            animationInstance = null;
        }
        if (audioSource) {
            audioSource.stop();
            audioSource = null;
        }
        moduleContentSection.classList.add('d-none');
        moduleContentSection.innerHTML = '';
        moduleSelectionSection.classList.remove('d-none');
        currentModule = null;
    }
    
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
        }
    }

    async function playAudio(url, loop = false) {
        initAudio();
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        if (audioSource) {
            audioSource.stop();
        }
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        audioSource = audioContext.createBufferSource();
        audioSource.buffer = audioBuffer;
        audioSource.loop = loop;
        audioSource.connect(gainNode);
        audioSource.start(0);
    }

    // --- MODULE-SPECIFIC LOGIC ---

    function loadModuleContent(moduleId) {
        const contentContainer = document.getElementById('module-specific-content');
        switch (moduleId) {
            case 'module1':
                renderModule1(contentContainer);
                break;
            case 'module2':
                renderModule2(contentContainer);
                break;
            case 'module3':
                renderModule3(contentContainer);
                break;
            case 'module4':
                renderModule4(contentContainer);
                break;
            case 'module5':
                renderModule5(contentContainer);
                break;
        }
    }

    function renderModule1(container) {
        container.innerHTML = `
            <p class="lead">Consider the following questions. Your honest reflection is the first step toward release. Your answers are private and are not stored.</p>
            <div id="questionnaire">
                <!-- Questions will be injected here -->
            </div>
            <canvas id="emotion-canvas" class="mt-4 rounded"></canvas>
        `;
        const questions = [
            "What situation in your life feels 'hard to swallow'?",
            "Is there a past conflict that still leaves a 'bitter taste'?",
            "What sweetness are you missing or craving in your life?",
            "Where do you feel a lack of nourishment or support?",
            "Who or what are you in conflict with, that you feel unable to resolve?",
            "Is there a deep-seated fear of 'not having enough' in your life (e.g., love, money, security)?",
            "What long-term resistance or opposition are you currently facing?",
            "Do you feel a sense of loss or hopelessness about a specific area of your life?",
            "What part of your life feels chaotic or out of your control?",
            "Where in your life do you reject 'sweetness' or joy, perhaps feeling you don't deserve it?"
        ];
        const questionnaireContainer = container.querySelector('#questionnaire');
        questionnaireContainer.innerHTML = ''; // Clear previous content

        questions.forEach((q, index) => {
            const questionId = `question-${index}`;
            const questionBlock = document.createElement('div');
            questionBlock.className = 'mb-4';
            questionBlock.innerHTML = `
                <label for="${questionId}" class="form-label question">${q}</label>
                <textarea class="form-control" id="${questionId}" rows="3" placeholder="Write your thoughts here..."></textarea>
            `;
            questionnaireContainer.appendChild(questionBlock);
        });
        
        // Placeholder for fire/water animation - can be developed further
        const canvas = container.querySelector('#emotion-canvas');
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 100, 200, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText("Emotional digestion animation placeholder", canvas.width / 2, canvas.height / 2);
    }

    function renderModule2(container) {
        container.innerHTML = `
            <p class="lead text-center mb-4">Place your hands over your solar center and repeat: 
                <br><em>"Forgive me for not listening to you, I am with you now."</em></p>
            <div id="pancreas-container" class="position-relative text-center">
                <img src="pancreas.png" alt="Pancreas" class="img-fluid" style="max-height: 300px;">
                <canvas id="breathing-canvas" class="position-absolute top-0 start-0 w-100 h-100"></canvas>
                <img src="hand-icon.png" id="hand-icon" class="position-absolute draggable">
            </div>
            <div class="text-center mt-3">
                <button id="play-forgiveness-audio" class="btn btn-primary">Play Guided Message</button>
            </div>
        `;
        
        container.querySelector('#play-forgiveness-audio').addEventListener('click', () => {
            playAudio('body-forgiveness-audio.mp3');
        });

        const canvas = container.querySelector('#breathing-canvas');
        const ctx = canvas.getContext('2d');
        const img = container.querySelector('img[alt="Pancreas"]');
        
        img.onload = () => {
            canvas.width = img.clientWidth;
            canvas.height = img.clientHeight;

            let glow = { intensity: 0 };
            animationInstance = anime({
                targets: glow,
                intensity: [0.1, 0.7, 0.1],
                easing: 'easeInOutSine',
                duration: 5000, // Simulates a slow breath cycle
                loop: true,
                update: () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.globalAlpha = glow.intensity;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    ctx.globalCompositeOperation = 'source-in';
                    ctx.fillStyle = 'gold';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.globalAlpha = 1.0; // reset
                }
            });
        };
    }

    function renderModule3(container) {
        container.innerHTML = `
            <p class="lead">Acknowledge the effects of this condition on your body, then transform them with your intention for healing.</p>
            <form id="release-form"></form>
        `;
        const effects = [
            "Diabetic Foot", "Neuropathy (Nerve Damage)", "Nephropathy (Kidney Disease)", "Retinopathy (Eye Damage)", "Cardiovascular Issues", "Skin Conditions", "Fatigue", "High Blood Sugar", "Emotional Toll", "Slow Healing"
        ];
        const form = container.querySelector('#release-form');
        effects.forEach(effect => {
            const div = document.createElement('div');
            div.className = 'mb-3';
            div.innerHTML = `
                <label for="${effect.replace(/\s+/g, '-')}" class="form-label"><strong>${effect}:</strong> Describe its presence.</label>
                <textarea class="form-control mb-2" id="${effect.replace(/\s+/g, '-')}" rows="2" placeholder="e.g., I experience tingling and numbness in my feet."></textarea>
                <label for="${effect.replace(/\s+/g, '-')}-healing" class="form-label text-primary"><strong>Healing Intention:</strong> Write how this is being healed.</label>
                <textarea class="form-control healing-intention" id="${effect.replace(/\s+/g, '-')}-healing" rows="2" placeholder="e.g., Healing energy is restoring full sensation and circulation to my feet."></textarea>
            `;
            form.appendChild(div);
        });
    }

    function renderModule4(container) {
        container.innerHTML = `
            <p class="lead text-center mb-2">"Activate the divine sweetness within you."</p>
            <p class="text-center text-muted">Trace the flow of energy with your mouse to nurture your pancreas and liver.</p>
            <div id="energy-flow-container" class="position-relative text-center" style="background-color: #000; border-radius: 12px; height: 500px;">
                 <img src="body-torso.png" alt="Torso with Pancreas and Liver" class="img-fluid h-100">
                 <canvas id="energy-canvas" class="position-absolute top-0 start-0 w-100 h-100"></canvas>
            </div>
             <div class="text-center mt-3">
                <button id="play-528hz" class="btn btn-primary">Play 528Hz Healing Sound</button>
            </div>
        `;

        container.querySelector('#play-528hz').addEventListener('click', (e) => {
             playAudio('solfeggio-528hz.mp3', true);
             e.target.textContent = "Playing...";
             e.target.disabled = true;
        });

        const canvas = container.querySelector('#energy-canvas');
        const ctx = canvas.getContext('2d');
        const containerRect = container.querySelector('#energy-flow-container').getBoundingClientRect();
        canvas.width = containerRect.width;
        canvas.height = containerRect.height;
        let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

        let particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                radius: anime.random(1, 3),
                alpha: 1,
                color: `hsl(${anime.random(40, 60)}, 100%, 70%)` // gold/yellow tones
            });
        }
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        animationInstance = anime({
            targets: particles,
            x: (p) => mouse.x,
            y: (p) => mouse.y,
            radius: 0,
            alpha: 0,
            loop: true,
            easing: 'linear',
            duration: 2000,
            delay: anime.stagger(20),
            update: () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.alpha;
                    ctx.fill();
                });
                ctx.globalAlpha = 1.0;
            },
            loopComplete: () => {
                 particles.forEach(p => {
                    p.x = mouse.x + anime.random(-20, 20);
                    p.y = mouse.y + anime.random(-20, 20);
                    p.radius = anime.random(1, 3);
                    p.alpha = 1;
                });
            }
        });
        animationInstance.play();
    }
    
    function renderModule5(container) {
        container.innerHTML = `
            <p class="lead">Mark each day you complete a healing session. Consistency is key to reprogramming.</p>
            <div id="calendar-container" class="bg-light p-3 rounded"></div>
        `;
        const calendarContainer = container.querySelector('#calendar-container');
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let savedState = JSON.parse(localStorage.getItem('healingCalendar')) || {};

        let calendarHTML = `<div class="calendar-header"><h3>${today.toLocaleString('default', { month: 'long' })} ${year}</h3></div><div class="calendar-grid">`;
        for (let i = 1; i <= daysInMonth; i++) {
            const dayId = `${year}-${month + 1}-${i}`;
            const isComplete = savedState[dayId];
            calendarHTML += `<div class="calendar-day ${isComplete ? 'complete' : ''}" data-dayid="${dayId}">${i}</div>`;
        }
        calendarHTML += `</div>`;
        calendarContainer.innerHTML = calendarHTML;
        
        calendarContainer.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', () => {
                const dayId = day.dataset.dayid;
                savedState[dayId] = !savedState[dayId]; // toggle state
                localStorage.setItem('healingCalendar', JSON.stringify(savedState));
                day.classList.toggle('complete');
            });
        });
    }

    // --- INITIALIZATION ---

    // Populate module cards
    moduleData.forEach(module => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card module-card h-100" data-id="${module.id}">
                <div class="card-body">
                    <h5 class="card-title text-primary">${module.title}</h5>
                    <p class="card-text">${module.description}</p>
                </div>
            </div>
        `;
        col.querySelector('.module-card').addEventListener('click', () => {
            showModule(module.id);
        });
        moduleCardsContainer.appendChild(col);
    });

    window.addEventListener('resize', () => {
        if (currentModule && !moduleContentSection.classList.contains('d-none')) {
            // Re-render module content on resize to adjust canvas etc.
            if (animationInstance) {
                animationInstance.pause();
                animationInstance = null;
            }
            loadModuleContent(currentModule.id);
        }
    });
});