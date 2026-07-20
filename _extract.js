
    // --- ENREGISTREMENT DU SERVICE WORKER (POUR INSTALLATION APP) ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').then((reg) => {
                console.log('Service Worker enregistré !', reg);
            }).catch((err) => {
                console.log('Échec Service Worker : ', err);
            });
        });
    }

    // --- DONNÉES SÉANCES INTÉGRÉES DEPUIS LE FICHIER CSV ---
    let currentId = "";
    let currentLevel = "std";
    
    const data = {
        "L1A": { 
            t: "La forge verticale", 
            concept: "Séance de force brute dans l'axe. Elle simule la poussée pure pour monter droit dans la pente.",
            resume: "On renforce la chaîne postérieure (fessiers/ischios) pour gagner en puissance ascensionnelle.",
            ex: [
                { n: "1. Monster Walk", cat: "gainage", c: "Élastique genoux, pas chassés.", r: "3x20", m: "Élastique", inter: { r: "4x20" }, expert: { r: "4x30", c: "Élastique aux chevilles." } },
                { n: "2. Fentes Bulgares", cat: "force", c: "Pied AR sur Box, 2x5kg", r: "4x8/j", m: "Box + Haltères", inter: { c: "Tempo lent (5s descente)" }, expert: { c: "Pied AV sur Coussin" } },
                { n: "3. SDT unilatéral", cat: "force", c: "2x5kg, équilibre sol", r: "4x10/j", m: "Haltères", inter: { c: "Haltère opposé jambe appui" }, expert: { c: "Pied appui sur Coussin" } },
                { n: "4. Hip Thrust uni.", cat: "force", c: "Dos sur Box, pied sol", r: "4x12/j", m: "Box", inter: { c: "Haltère 5kg sur la hanche" }, expert: { c: "Pied appui sur Coussin" } },
                { n: "5. Step-down Face", cat: "force", c: "Descente lente au sol", r: "3x10/j", m: "Box", inter: { c: "Haltère 5kg devant toi" }, expert: { c: "Descente sur Coussin" } },
                { n: "6. Roulette Abdos", cat: "gainage", c: "Sur les genoux, amplitude 1/2", r: "3x12", m: "Roulette", inter: { c: "Amplitude maximale" }, expert: { c: "Départ debout (ou élastique)" } },
                { n: "7. Pallof Press", cat: "gainage", c: "Statique (élastique tendu)", r: "3x12", m: "Élastique", inter: { c: "Cercles avec les mains" }, expert: { c: "Position Fente (Instable)" } }
            ]
        },
        "L1B": { 
            t: "Le châssis tout-terrain", 
            concept: "Travail des stabilisateurs latéraux pour absorber les irrégularités du terrain technique et les dévers prolongés.",
            resume: "C'est le renforcement 'anti-affaissement', on muscle les stabilisateurs de hanche et le gainage dynamique.",
            ex: [
                { n: "1. Abduction debout", cat: "gainage", c: "Élastique chevilles, jambe côté.", r: "3x15/j", m: "Élastique", inter: { r: "4x15/j" }, expert: { r: "4x20/j" } },
                { n: "2. Step-up Haut", cat: "force", c: "Monter sur Box, sans élan", r: "4x8/j", m: "Box", inter: { c: "Haltère 5kg (Goblet)" }, expert: { c: "Descente ralentie (5s)" } },
                { n: "3. Good Morning", cat: "force", c: "Haltères épaules, dos plat", r: "4x12", m: "Haltères", inter: { c: "Élastique autour du cou" }, expert: { c: "Appui 1 jambe (unilatéral)" } },
                { n: "4. Pont Fessier", cat: "force", c: "Allongé sol, pieds sol", r: "4x12/j", m: "Tapis", inter: { c: "1 pied sur Coussin" }, expert: { c: "1 jambe levée + Coussin" } },
                { n: "5. Step-down Lat.", cat: "force", c: "Descente latérale lente", r: "3x10/j", m: "Box", inter: { c: "Haltère 5kg côté vide" }, expert: { c: "Pied appui sur Coussin" } },
                { n: "6. Gainage Commando", cat: "gainage", c: "Coudes/Mains (bassin fixe)", r: "3x12", m: "Tapis", inter: { c: "Pieds sur le Coussin" }, expert: { c: "1 bras / 1 jambe levée" } },
                { n: "7. Planche Lat. Rot.", cat: "gainage", c: "Rotation du bras sous buste", r: "3x12/côté", m: "Tapis", inter: { c: "Élastique dans la main" }, expert: { c: "Pieds sur le Coussin" } }
            ] 
        },
        "J2A": { 
            t: "L'amortisseur d'impacts", 
            concept: "Développer la capacité excentrique pour protéger les articulations lors des descentes brutales.",
            resume: "On prépare les quadriceps à l'impact des descentes (drop jumps).",
            ex: [
                { n: "1. Box Jumps", cat: "plio", c: "Saut pieds joints sur Box", r: "3x6", m: "Box", inter: { c: "Saut avec Haltères 5kg" }, expert: { c: "Saut 1 jambe (Pistol)" } },
                { n: "2. Drop Jumps", cat: "plio", c: "Chute Box + Rebond", r: "3x5", m: "Box", inter: { c: "Hauteur de Box augmentée" }, expert: { c: "Rebond + Saut 2ème Box" } },
                { n: "3. Fentes sautées", cat: "plio", c: "Ciseaux explosifs au sol", r: "3x10", m: "Aucun", inter: { c: "Fentes sautées + 5kg" }, expert: { c: "Fente sautée pied AV sur Box" } }
            ] 
        },
        "J2B": { 
            t: "Le danseur des crêtes", 
            concept: "Agilité et proprioception dynamique sur terrains instables.",
            resume: "On simule les changements d'appuis rapides sur terrain technique.",
            ex: [
                { n: "1. Sauts Grenouille", cat: "plio", c: "Saut longueur, amorti 2J", r: "3x6", m: "Aucun", inter: { c: "Enchaînement sans pause" }, expert: { c: "Saut 1 jambe (Triple)" } },
                { n: "2. Sauts Latéraux", cat: "plio", c: "Par-dessus obstacle bas", r: "3x5", m: "Obstacle", inter: { c: "Obstacle plus haut (Box)" }, expert: { c: "Sauts latéraux 1 jambe" } },
                { n: "3. Skater Jumps", cat: "plio", c: "Saut latéral 1J à 1J", r: "3x10", m: "Aucun", inter: { c: "Amplitude max (loin)" }, expert: { c: "Tenir 3s l'équilibre à l'arrivée" } }
            ] 
        },
        "V3A": { 
            t: "Le bouclier tendineux", 
            concept: "Renforcement du tissu conjonctif pour éviter les tendinites d'usure.",
            resume: "On 'blinde' les tendons (rotulien et Achille).",
            ex: [
                { n: "1. Spanish Squat", cat: "proprio", c: "Isométrie 45s (Élastique)", r: "3x45s", m: "Élastique", inter: { c: "Ajout Haltères 5kg" }, expert: { c: "Petits rebonds en bas" } },
                { n: "2. L'Huître", cat: "proprio", c: "Élastique genoux, allongé", r: "3x15", m: "Élastique", inter: { c: "Élastique aux chevilles" }, expert: { c: "Position Planche Latérale" } },
                { n: "3. Équilibre", cat: "proprio", c: "Yeux fermés sur Coussin", r: "3x45s", m: "Coussin", inter: { c: "Lancer/Rattraper objet" }, expert: { c: "Petites flexions (1/4 squat)" } },
                { n: "4. Bird-Dog", cat: "proprio", c: "Bras/Jambe opposés", r: "3x12", m: "Tapis", inter: { c: "Élastique bras/jambe" }, expert: { c: "Genoux décollés du sol" } }
            ] 
        },
        "V3B": { 
            t: "Le pilote automatique", 
            concept: "Améliorer les réflexes de rattrapage pour éviter les entorses.",
            resume: "On réveille les capteurs de cheville et la posture.",
            ex: [
                { n: "1. Squat Coussin", cat: "proprio", c: "Squat lent sur Coussin", r: "3x12", m: "Coussin", inter: { c: "Ajout Haltères 5kg" }, expert: { c: "Squat 1 jambe sur Coussin" } },
                { n: "2. Psoas March", cat: "proprio", c: "Allongé, genou poitrine", r: "3x15", m: "Élastique", inter: { c: "Élastique forte résistance" }, expert: { c: "Debout (équilibre 1 jambe)" } },
                { n: "3. L'Horloge", cat: "proprio", c: "4 points (Coussin)", r: "3 tours", m: "Coussin", inter: { c: "8 points (amplitude)" }, expert: { c: "Toucher le sol à chaque point" } },
                { n: "4. Micro-gainage", cat: "proprio", c: "Gainage statique (élastique)", r: "3x12", m: "Élastique", inter: { c: "Instabilité (mains/coussins)" }, expert: { c: "Fermer les yeux" } }
            ] 
        }
    };

    // --- CATEGORIES : libellés + couleurs ---
    const CAT_LABELS = { force: "Force", gainage: "Gainage", plio: "Pliométrie", proprio: "Proprio/Prévention" };
    const CAT_LIST = ["force", "gainage", "plio", "proprio"];

    // --- BANQUE D'EXERCICES (à plat, pour le constructeur) ---
    function buildExerciseBank() {
        let bank = [];
        Object.keys(data).forEach(sid => {
            data[sid].ex.forEach((e, idx) => {
                bank.push({ ...e, id: sid + "_" + idx, origin: sid });
            });
        });
        return bank;
    }
    const exerciseBank = buildExerciseBank();

    function computeComposition(exList) {
        let counts = { force: 0, gainage: 0, plio: 0, proprio: 0 };
        exList.forEach(e => { if (counts[e.cat] !== undefined) counts[e.cat]++; });
        let total = exList.length || 1;
        let pct = {};
        CAT_LIST.forEach(c => pct[c] = Math.round((counts[c] / total) * 100));
        return { counts, pct, total: exList.length };
    }

    function renderCompositionBar(containerId, legendId, exList) {
        const comp = computeComposition(exList);
        const bar = document.getElementById(containerId);
        const legend = document.getElementById(legendId);
        if (!bar) return;
        bar.innerHTML = "";
        CAT_LIST.forEach(c => {
            if (comp.pct[c] > 0) {
                bar.innerHTML += `<div class="comp-seg" style="width:${comp.pct[c]}%; background:var(--c-${c});" title="${CAT_LABELS[c]} ${comp.pct[c]}%"></div>`;
            }
        });
        if (legend) {
            legend.innerHTML = CAT_LIST.map(c =>
                `<span><span class="dot" style="background:var(--c-${c})"></span>${CAT_LABELS[c]} ${comp.pct[c]}%</span>`
            ).join("");
        }
        return comp;
    }

    // --- SESSIONS PERSONNALISÉES (constructeur) ---
    let customSessions = JSON.parse(localStorage.getItem('ultraCustomSessions')) || {};

    function getData(id) {
        return customSessions[id] || data[id];
    }

    function saveCustomSessions() {
        localStorage.setItem('ultraCustomSessions', JSON.stringify(customSessions));
    }

    function deleteCustomSession(id) {
        delete customSessions[id];
        saveCustomSessions();
        renderCustomHome();
        refreshModalSessionOptions();
    }

    // --- HISTORIQUE ---
    let history = JSON.parse(localStorage.getItem('ultraHistory')) || [];

    function saveHistory() {
        localStorage.setItem('ultraHistory', JSON.stringify(history));
    }

    function markSessionDone() {
        const s = getData(currentId);
        if (!s) return;
        const comp = computeComposition(s.ex);
        history.unshift({
            date: new Date().toISOString().slice(0, 10),
            id: currentId,
            title: s.t,
            level: currentLevel,
            comp: comp.counts
        });
        saveHistory();
        const btn = document.getElementById('done-btn');
        if (btn) { btn.innerText = "✔ Enregistré"; setTimeout(() => { btn.innerText = "✅ Terminer la séance"; }, 2000); }
    }

    // --- NAVIGATION DE BASE ---
    function switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        if(screenId === 'calendar-screen') initCalendar();
        if(screenId === 'history-screen') renderHistoryScreen();
    }

    function toggleSidebar() {
        const s = document.getElementById('sidebar');
        const o = document.getElementById('sidebar-overlay');
        const open = s.classList.contains('open');
        s.classList.toggle('open');
        o.style.display = open ? 'none' : 'block';
    }

    function goHome() { switchScreen('home-screen'); }

    // --- SÉANCES ET INTENSITÉ (curseur 1-10 mappé sur std/inter/expert) ---
    let currentIntensity = 5;

    function intensityToLevel(v) {
        v = +v;
        if (v <= 3) return 'std';
        if (v <= 7) return 'inter';
        return 'expert';
    }
    const LEVEL_NAMES = { std: "Standard", inter: "Intermédiaire", expert: "Expert" };

    function setIntensity(v) {
        currentIntensity = +v;
        currentLevel = intensityToLevel(v);
        document.getElementById('intensity-label').innerText = `${v}/10 · ${LEVEL_NAMES[currentLevel]}`;
        renderExercises();
    }

    // Compat : appelée depuis le planning (niveau fixé std/inter/expert)
    function changeLevel(lv) {
        const map = { std: 2, inter: 5, expert: 9 };
        const slider = document.getElementById('intensity-slider');
        if (slider) slider.value = map[lv];
        setIntensity(map[lv]);
    }

    function openSession(id, forcedLevel = null) {
        currentId = id;
        changeLevel(forcedLevel || 'inter');

        const s = getData(id);
        document.getElementById('stitle').innerText = s.t;
        document.getElementById('s-concept').innerText = s.concept;
        document.getElementById('s-resume').innerText = s.resume;
        
        document.getElementById('details-block').classList.remove('collapsed');
        document.getElementById('details-toggle').innerText = "Masquer Détails";
        
        renderExercises();
        switchScreen('session-screen');
        window.scrollTo(0, 0);
    }

    function renderExercises() {
        const s = getData(currentId);
        if (!s) return;
        let h = "";
        s.ex.forEach(e => {
            let variant = e[currentLevel] || {};
            let reps = variant.r || e.r;
            let cons = variant.c || e.c;
            let mat = variant.m || e.m;
            let tag = e.cat ? `<span class="cat-tag cat-${e.cat}" style="margin-left:8px;">${CAT_LABELS[e.cat]}</span>` : "";
            h += `<tr><td><b style="color:#000">${e.n}</b>${tag}</td><td>${cons}</td><td><b>${reps}</b></td><td>${mat}</td></tr>`;
        });
        document.getElementById('tbody').innerHTML = h;
    }

    function toggleDetails() {
        const b = document.getElementById('details-block');
        const t = document.getElementById('details-toggle');
        if (b.classList.contains('collapsed')) { b.classList.remove('collapsed'); t.innerText = "Masquer Détails"; } 
        else { b.classList.add('collapsed'); t.innerText = "Afficher Détails"; }
    }

    // --- CALENDRIER & PLANIFICATION ---
    let calDate = new Date();
    let plannedData = JSON.parse(localStorage.getItem('ultraPlan')) || {};

    function initCalendar() { renderCalendar(); }

    function changeMonth(offset) {
        calDate.setMonth(calDate.getMonth() + offset);
        renderCalendar();
    }

    function renderCalendar() {
        const grid = document.getElementById('cal-grid');
        grid.innerHTML = "";
        const year = calDate.getFullYear();
        const month = calDate.getMonth();

        document.getElementById('cal-month-title').innerText = calDate.toLocaleDateString('fr-FR', {month: 'long', year: 'numeric'});

        const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        days.forEach(d => { grid.innerHTML += `<div class="cal-day-name">${d}</div>`; });

        let firstDay = new Date(year, month, 1).getDay();
        let startOffset = firstDay === 0 ? 6 : firstDay - 1; // Ajustement Lundi = 1er jour
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for(let i=0; i<startOffset; i++) { grid.innerHTML += `<div class="cal-day empty"></div>`; }

        for(let i=1; i<=daysInMonth; i++) {
            let dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            let plan = plannedData[dateStr];
            
            let badgeHtml = "";
            if(plan && getData(plan.id)) {
                badgeHtml = `<div class="plan-badge badge-${plan.level}">${getData(plan.id).t}</div>`;
            }
            
            grid.innerHTML += `<div class="cal-day" onclick="openPlanModal('${dateStr}', ${i})"><span class="day-num">${i}</span>${badgeHtml}</div>`;
        }
    }

    function openPlanModal(dateStr, dayNum) {
        document.getElementById('modal-date-val').value = dateStr;
        document.getElementById('modal-date-title').innerText = `Planning du ${dayNum} ${calDate.toLocaleDateString('fr-FR', {month: 'long'})}`;
        
        let plan = plannedData[dateStr];
        document.getElementById('modal-session').value = plan ? plan.id : "";
        document.getElementById('modal-level').value = plan ? plan.level : "std";
        
        document.getElementById('modal-start-btn').style.display = plan ? "block" : "none";
        document.getElementById('plan-modal').style.display = "block";
        document.getElementById('sidebar-overlay').style.display = "block";
    }

    function closePlanModal() {
        document.getElementById('plan-modal').style.display = "none";
        document.getElementById('sidebar-overlay').style.display = "none";
    }

    function savePlan() {
        let dateStr = document.getElementById('modal-date-val').value;
        let id = document.getElementById('modal-session').value;
        let level = document.getElementById('modal-level').value;

        if(id === "") { delete plannedData[dateStr]; } 
        else { plannedData[dateStr] = { id: id, level: level }; }

        localStorage.setItem('ultraPlan', JSON.stringify(plannedData));
        closePlanModal();
        renderCalendar();
    }

    function getWeekNumber(d) {
        let date = new Date(d.getTime());
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        let week1 = new Date(date.getFullYear(), 0, 4);
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }

    function applyTemplate() {
        if(!confirm("Appliquer le modèle alterné (Semaine A / Semaine B) sur le mois affiché ? Cela remplacera les séances de ces jours.")) return;
        
        const year = calDate.getFullYear();
        const month = calDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for(let i=1; i<=daysInMonth; i++) {
            let d = new Date(year, month, i);
            let dayOfWeek = d.getDay(); // 0=Dim, 1=Lun, 4=Jeu, 5=Ven
            
            let weekNum = getWeekNumber(d);
            let isWeekA = (weekNum % 2 !== 0); 
            
            let dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            if(dayOfWeek === 1) plannedData[dateStr] = { id: isWeekA ? 'L1A' : 'L1B', level: 'std' };
            if(dayOfWeek === 4) plannedData[dateStr] = { id: isWeekA ? 'J2A' : 'J2B', level: 'std' };
            if(dayOfWeek === 5) plannedData[dateStr] = { id: isWeekA ? 'V3A' : 'V3B', level: 'std' };
        }
        localStorage.setItem('ultraPlan', JSON.stringify(plannedData));
        renderCalendar();
    }

    function startPlannedSession() {
        let dateStr = document.getElementById('modal-date-val').value;
        let plan = plannedData[dateStr];
        if(plan) {
            closePlanModal();
            openSession(plan.id, plan.level);
        }
    }

    // --- IMMERSION & CHRONO ---
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                const b = document.getElementById('details-block');
                const t = document.getElementById('details-toggle');
                if (b && !b.classList.contains('collapsed')) { b.classList.add('collapsed'); t.innerText = "Afficher Détails"; }
            }).catch(err => { console.log(err.message); });
        } else { if (document.exitFullscreen) document.exitFullscreen(); }
    }

    // --- CONSTRUCTEUR ---
    let selectedCats = new Set(CAT_LIST);
    let currentBuilderList = [];

    function initCatChips() {
        const row = document.getElementById('cat-chips');
        row.innerHTML = CAT_LIST.map(c =>
            `<div class="chip chip-${c} active" id="chip-${c}" onclick="toggleCat('${c}')">${CAT_LABELS[c]}</div>`
        ).join("");
    }

    function toggleCat(c) {
        if (selectedCats.has(c)) { selectedCats.delete(c); } else { selectedCats.add(c); }
        document.getElementById('chip-' + c).classList.toggle('active', selectedCats.has(c));
    }

    function updateBuilderIntensityLabel(v) {
        document.getElementById('builder-intensity-label').innerText = `${v}/10 · ${LEVEL_NAMES[intensityToLevel(v)]}`;
    }

    function shuffle(arr) {
        let a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function generateSession() {
        const count = +document.getElementById('count-slider').value;
        const cats = [...selectedCats];
        if (cats.length === 0) { return; }

        // Pool par catégorie, mélangé
        let pools = {};
        cats.forEach(c => { pools[c] = shuffle(exerciseBank.filter(e => e.cat === c)); });

        let result = [];
        let i = 0;
        while (result.length < count) {
            let anyLeft = false;
            for (const c of cats) {
                if (result.length >= count) break;
                if (pools[c].length > i) {
                    result.push(pools[c][i]);
                    anyLeft = true;
                }
            }
            if (!anyLeft) break;
            i++;
        }
        currentBuilderList = result;
        renderBuilderResult();
    }

    function renderBuilderResult() {
        document.getElementById('builder-result-card').style.display = currentBuilderList.length ? 'block' : 'none';
        renderCompositionBar('builder-comp-bar', 'builder-comp-legend', currentBuilderList);

        const listEl = document.getElementById('builder-ex-list');
        if (currentBuilderList.length === 0) {
            listEl.innerHTML = `<div class="empty-hint">Aucun exercice — élargis tes catégories.</div>`;
            return;
        }
        listEl.innerHTML = currentBuilderList.map((e, idx) => `
            <div class="ex-row">
                <div class="ex-row-info">
                    <span class="cat-tag cat-${e.cat}">${CAT_LABELS[e.cat]}</span>
                    <b> ${e.n.replace(/^\d+\.\s*/, '')}</b>
                </div>
                <div class="ex-row-actions">
                    <button class="icon-btn" onclick="swapExercise(${idx})" title="Changer">🔄</button>
                    <button class="icon-btn remove" onclick="removeExercise(${idx})" title="Retirer">✕</button>
                </div>
            </div>
        `).join("");
    }

    function swapExercise(idx) {
        const e = currentBuilderList[idx];
        const alternatives = exerciseBank.filter(x => x.cat === e.cat && !currentBuilderList.some(c => c.id === x.id));
        if (alternatives.length === 0) return;
        currentBuilderList[idx] = alternatives[Math.floor(Math.random() * alternatives.length)];
        renderBuilderResult();
    }

    function removeExercise(idx) {
        currentBuilderList.splice(idx, 1);
        renderBuilderResult();
    }

    function saveCustomSession() {
        const nameInput = document.getElementById('builder-session-name');
        const name = nameInput.value.trim();
        if (!name || currentBuilderList.length === 0) return;

        const intensity = +document.getElementById('builder-intensity-slider').value;
        const comp = computeComposition(currentBuilderList);
        const compText = CAT_LIST.filter(c => comp.pct[c] > 0).map(c => `${comp.pct[c]}% ${CAT_LABELS[c]}`).join(' · ');

        const id = 'C' + Date.now();
        customSessions[id] = {
            t: name,
            concept: `Séance hybride générée : ${compText}.`,
            resume: `Composition : ${compText}. Intensité de base : ${intensity}/10.`,
            custom: true,
            ex: currentBuilderList.map(e => ({ ...e }))
        };
        saveCustomSessions();

        nameInput.value = "";
        currentBuilderList = [];
        document.getElementById('builder-result-card').style.display = 'none';
        renderCustomHome();
        refreshModalSessionOptions();
        switchScreen('home-screen');
        goHome();
    }

    function renderCustomHome() {
        const card = document.getElementById('custom-home-card');
        const list = document.getElementById('custom-home-list');
        const ids = Object.keys(customSessions);
        if (ids.length === 0) { card.style.display = 'none'; return; }
        card.style.display = 'block';
        list.innerHTML = ids.map(id => {
            const s = customSessions[id];
            const comp = computeComposition(s.ex);
            const compText = CAT_LIST.filter(c => comp.pct[c] > 0).map(c => `${comp.pct[c]}% ${CAT_LABELS[c].split('/')[0]}`).join(' · ');
            return `
                <button class="btn-session" onclick="openSession('${id}')" style="position:relative;">
                    <span class="s-title">${s.t}</span>
                    <span class="s-subtitle">${compText}</span>
                    <span onclick="event.stopPropagation(); deleteCustomSession('${id}')" style="position:absolute; top:8px; right:10px; font-weight:900; color:#b30000;">✕</span>
                </button>
            `;
        }).join("");
    }

    function refreshModalSessionOptions() {
        const og = document.getElementById('modal-custom-optgroup');
        if (!og) return;
        const ids = Object.keys(customSessions);
        og.innerHTML = ids.length === 0
            ? `<option value="" disabled>Aucune pour l'instant</option>`
            : ids.map(id => `<option value="${id}">${customSessions[id].t}</option>`).join("");
    }

    // --- HISTORIQUE ---
    function renderHistoryScreen() {
        const listEl = document.getElementById('history-list');
        if (history.length === 0) {
            listEl.innerHTML = `<div class="empty-hint">Aucune séance terminée pour l'instant.</div>`;
        } else {
            listEl.innerHTML = history.map(h => `
                <div class="hist-row">
                    <span class="hist-date">${h.date}</span>
                    <span class="hist-title">${h.title}</span>
                    <span class="plan-badge badge-${h.level}" style="flex-shrink:0;">${LEVEL_NAMES[h.level] || h.level}</span>
                </div>
            `).join("");
        }

        // Composition cumulée
        let allEx = [];
        history.forEach(h => {
            CAT_LIST.forEach(c => { for (let i = 0; i < (h.comp[c] || 0); i++) allEx.push({ cat: c }); });
        });
        renderCompositionBar('history-comp-bar', 'history-comp-legend', allEx.length ? allEx : CAT_LIST.map(c => ({ cat: c, _empty: true })));
        if (allEx.length === 0) { document.getElementById('history-comp-bar').innerHTML = `<div class="empty-hint" style="flex-grow:1;">Pas encore de données</div>`; }
    }

    // --- EXPORT / IMPORT ---
    function exportAllData() {
        const payload = {
            exportedAt: new Date().toISOString(),
            plannedData, customSessions, history
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `renfo-ultra-trail-backup-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importAllData(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const payload = JSON.parse(e.target.result);
                if (payload.plannedData) { plannedData = payload.plannedData; localStorage.setItem('ultraPlan', JSON.stringify(plannedData)); }
                if (payload.customSessions) { customSessions = payload.customSessions; saveCustomSessions(); }
                if (payload.history) { history = payload.history; saveHistory(); }
                renderCustomHome();
                refreshModalSessionOptions();
                document.getElementById('import-status').style.color = '#1a7a3c';
                document.getElementById('import-status').innerText = "✔ Import réussi.";
            } catch (err) {
                document.getElementById('import-status').style.color = '#b30000';
                document.getElementById('import-status').innerText = "✕ Fichier invalide.";
            }
        };
        reader.readAsText(file);
    }

    // --- INIT ---
    initCatChips();
    renderCustomHome();
    refreshModalSessionOptions();

    setInterval(() => { document.getElementById('clock').textContent = new Date().toLocaleTimeString('fr-FR'); }, 1000);

    let chronoInt, secs = 0, running = false;
    function toggleChrono() {
        const b = document.getElementById('start-btn');
        if (running) { clearInterval(chronoInt); b.innerText = "REPRENDRE"; running = false; } 
        else { running = true; b.innerText = "PAUSE"; chronoInt = setInterval(() => { secs++; let m = Math.floor(secs / 60), s = secs % 60; document.getElementById('chrono').textContent = (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s); }, 1000); }
    }
    function resetChrono() { clearInterval(chronoInt); secs = 0; running = false; document.getElementById('start-btn').innerText = "DÉMARRER"; document.getElementById('chrono').textContent = "00:00"; }
