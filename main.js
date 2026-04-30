let hofData = [];

fetch('data.json')
.then(res => res.json())
.then(data => {
    hofData = data;
});

let extraColumns = false;
const btn = document.getElementById('extra-toggle');
document.getElementById('extra-toggle').addEventListener('click', () => {
    extraColumns = !extraColumns;

    document.getElementById('hof-table').classList.toggle('hide-extra', !extraColumns);
    btn.classList.toggle('clicked', extraColumns);
});

document.getElementById('little_emerald').addEventListener('input', () => buildHofTable());
document.getElementById('mini_moon').addEventListener('input', () => buildHofTable());

document.getElementById('hardcore_nuzlockes').addEventListener('input', () => buildHofTable());
document.getElementById('casual').addEventListener('input', () => buildHofTable());

function formatSpriteName(pokemon) { // To be used for specific special cases.
    if (pokemon.includes('Eevee')) {
        return 'eevee';
    }

    return pokemon.toLowerCase();
}

function getSprite(entry, style) {
    const sprite_override = entry?.sprite_override;
    const pokemon = entry.pokemon;

    let src;
    let link = null;
    
    switch (style) {
        case 'sprites':
            const sprite = formatSpriteName(pokemon);
            src = `https://raw.githubusercontent.com/PurpleYoyo/hall-of-fame/main/sprites/${sprite}.png`;
            break;
        case 'pmd':
            const pokedex = entry.pokedex;
            src = `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/${pokedex}/Normal.png`;
            link = `https://sprites.pmdcollab.org/#/${pokedex}?form=0`;
            break;
    }

    if (sprite_override) {
        src = sprite_override;
    }

    if (link) {
        return `<a href="${link}"><img class="${style}" src="${src}" alt="${pokemon}" title="${pokemon}"></a>`;
    }
    else {
        return `<img class="${style}" src="${src}" alt="${pokemon}" title="${pokemon}">`;
    }
}

function getStarterSprite(pokemon) {
    return `<img src="https://raw.githubusercontent.com/PurpleYoyo/hall-of-fame/main/sprites/${formatSpriteName(pokemon)}.png" alt="${pokemon}" title="${pokemon}">`;
}

function getTypeSprite(type) {
    return `<img src="https://raw.githubusercontent.com/PurpleYoyo/hall-of-fame/main/sprites/${type.toLowerCase().replace('fighting', 'fight')}.png" alt="${type}" title="${type}">`
}

const gameSchemas = {
    little_emerald: {
        "sprite_style": "sprites",
        hardcore_nuzlockes: [
            { key: 'player', label: 'Player', group: 'main' },
            { key: 'version', label: 'Version', group: 'main' },
            { key: 'date', label: 'Date', group: 'main' },
            { key: 'attempts', label: 'Attempts', group: 'main' },
            { key: 'difficulty', label: 'Difficulty', group: 'main' },
            { key: 'starter', label: 'Starter', group: 'extra' },
            { key: 'mvp', label: 'MVP', group: 'extra' },
            { key: 'deaths', label: 'Deaths', group: 'extra' },
            { key: 'monotype', label: 'Monotype', group: 'extra' },
            { key: 'sandbox', label: 'Sandbox?', group: 'extra' },
            { key: 'notes', label: 'Notes', group: 'extra' },
            { key: 'watch', label: 'Watch', group: 'extra' },
        ],
        casual: [
            { key: 'player', label: 'Player', group: 'main' },
            { key: 'version', label: 'Version', group: 'main' },
            { key: 'date', label: 'Date', group: 'main' },
            { key: 'difficulty', label: 'Difficulty', group: 'main' },
            { key: 'starter', label: 'Starter', group: 'extra' },
            { key: 'monotype', label: 'Monotype', group: 'extra' },
            { key: 'sandbox', label: 'Sandbox?', group: 'extra' },
            { key: 'notes', label: 'Notes', group: 'extra' },
        ],
    },
    mini_moon: {
        "sprite_style": "pmd",
        hardcore_nuzlockes: [
            { key: 'player', label: 'Player', group: 'main' },
            { key: 'version', label: 'Version', group: 'main' },
            { key: 'date', label: 'Date', group: 'main' },
            { key: 'attempts', label: 'Attempts', group: 'main' },
            { key: 'starter', label: 'Starter', group: 'extra' },
            { key: 'mvp', label: 'MVP', group: 'extra' },
            { key: 'deaths', label: 'Deaths', group: 'extra' },
            { key: 'notes', label: 'Notes', group: 'extra' },
            { key: 'watch', label: 'Watch', group: 'extra' },
        ],
        casual: [
            { key: 'player', label: 'Player', group: 'main' },
            { key: 'version', label: 'Version', group: 'main' },
            { key: 'date', label: 'Date', group: 'main' },
            { key: 'starter', label: 'Starter', group: 'extra' },
            { key: 'notes', label: 'Notes', group: 'extra' },
        ],
    },
};

function getValue(entry, col, run_type) {
    switch (col.key) {
        case 'sandbox':
            return entry[col.key] ? '✅' : '❌';
        case 'monotype':
            return entry[col.key] ? getTypeSprite(entry[col.key]) : '-';
        case 'attempts':
        case 'deaths':
            return entry[col.key] ?? '?';
        case 'starter':
        case 'mvp':
            return entry[col.key] ? getStarterSprite(entry[col.key]) : '?';
        case 'watch':
            return entry[col.key] ? makeLink(entry[col.key]) : '-';
        default:
            return entry[col.key] ?? '-';
    }
}

function makeLink(entry) {
    return `<a href="${entry.link}">${entry.name}</a>`;
}

function isBounty(entry) {
    return entry?.bounty ? 'bounty' : 'normal';
}

function buildHofTable() {
    if (!Object.keys(hofData).length) return;

    btn.classList.remove('hidden');
    document.getElementById('run_type-radios').classList.remove('hidden');
    document.getElementById('hint').classList.add('hidden');
    document.getElementById('hall-of-fame').classList.remove('hidden');

    const hof_table = document.getElementById('hof-table');

    const game = document.querySelector('input[name="game"]:checked')?.value || 'little_emerald';
    const run_type = document.querySelector('input[name="run-type"]:checked')?.value || 'hardcore_nuzlockes';

    const schema = gameSchemas[game][run_type];
    const sprite_style = gameSchemas[game].sprite_style;

    let title = ''
    let team = 'Team';
    if (run_type === 'hardcore_nuzlockes') {
        title = 'Bounties (Pokémon that have not been champed before) have a green background.';
        team = `Team <span title="${title}" class="info">🛈</span>`;
    }

    const header = `
        <tr>
            ${schema.map(col => `<th class="${col.group}-col">${col.label}</th>`).join('')}
            <th colspan="6">
                ${team}
            </th>
        </tr>
    `;

    let entries = hofData[game][run_type].map(entry => `
        <tr>
            ${schema.map(
                col => `<td class="${col.group}-col">${getValue(entry, col, run_type)}</td>`
            ).join('')}
            <td class="${isBounty(entry.pokemon1)}">${getSprite(entry.pokemon1, sprite_style)}</td>
            <td class="${isBounty(entry.pokemon2)}">${getSprite(entry.pokemon2, sprite_style)}</td>
            <td class="${isBounty(entry.pokemon3)}">${getSprite(entry.pokemon3, sprite_style)}</td>
            <td class="${isBounty(entry.pokemon4)}">${getSprite(entry.pokemon4, sprite_style)}</td>
            <td class="${isBounty(entry.pokemon5)}">${getSprite(entry.pokemon5, sprite_style)}</td>
            <td class="${isBounty(entry.pokemon6)}">${getSprite(entry.pokemon6, sprite_style)}</td>
        </tr>    
    `);

    if (!entries.length) {
        btn.classList.add('hidden');

        document.getElementById('hof-table').innerHTML = `
            <br>
            
            <span id="hint">No runs found.</span>
        `;

        return;
    }

    hof_table.innerHTML = `
        <table>
            <thead>
                ${header}
            </thead>

            <tbody>
                ${entries.join('\n')}
            </tbody>
        </table>
    `;
}