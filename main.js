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

function getSprite(entry, index) {
    const sprite_override = entry.sprite_overrides?.[`pokemon${index}`];
    const pokemon = entry[`pokemon${index}`];
    const src = sprite_override ?
        sprite_override :
        `https://raw.githubusercontent.com/PurpleYoyo/hall-of-fame/main/sprites/${formatSpriteName(pokemon)}.png`;
    return `<img src="${src}" alt="${pokemon}" title="${pokemon}">`;
}

function getStarterSprite(pokemon) {
    return `<img src="https://raw.githubusercontent.com/PurpleYoyo/hall-of-fame/main/sprites/${formatSpriteName(pokemon)}.png" alt="${pokemon}" title="${pokemon}">`;
}

function getTypeSprite(type) {
    return `<img src="https://raw.githubusercontent.com/PurpleYoyo/hall-of-fame/main/sprites/${type.toLowerCase().replace('fighting', 'fight')}.png" alt="${type}" title="${type}">`
}

const gameSchemas = {
    little_emerald: {
        hardcore_nuzlockes: [
            { key: 'player', label: 'Player', group: "main" },
            { key: 'version', label: 'Version', group: "main" },
            { key: 'date', label: 'Date', group: "main" },
            { key: 'attempts', label: 'Attempts', group: "main" },
            { key: 'difficulty', label: 'Difficulty', group: "main" },
            { key: 'starter', label: 'Starter', group: "extra" },
            { key: 'deaths', label: 'Deaths', group: "extra" },
            { key: 'monotype', label: 'Monotype', group: "extra" },
            { key: 'sandbox', label: 'Sandbox?', group: "extra" },
            { key: 'notes', label: 'Notes', group: "extra" },
        ],
        casual: [
            { key: 'player', label: 'Player', group: "main" },
            { key: 'version', label: 'Version', group: "main" },
            { key: 'date', label: 'Date', group: "main" },
            { key: 'difficulty', label: 'Difficulty', group: "main" },
            { key: 'starter', label: 'Starter', group: "extra" },
            { key: 'monotype', label: 'Monotype', group: "extra" },
            { key: 'sandbox', label: 'Sandbox?', group: "extra" },
            { key: 'notes', label: 'Notes', group: "extra" },
        ],
    },
    mini_moon: {
        hardcore_nuzlockes: [
            { key: 'player', label: 'Player', group: "main" },
            { key: 'version', label: 'Version', group: "main" },
            { key: 'date', label: 'Date', group: "main" },
            { key: 'attempts', label: 'Attempts', group: "main" },
            { key: 'starter', label: 'Starter', group: "extra" },
            { key: 'deaths', label: 'Deaths', group: "extra" },
            { key: 'notes', label: 'Notes', group: "extra" },
        ],
        casual: [
            { key: 'player', label: 'Player', group: "main" },
            { key: 'version', label: 'Version', group: "main" },
            { key: 'date', label: 'Date', group: "main" },
            { key: 'starter', label: 'Starter', group: "extra" },
            { key: 'notes', label: 'Notes', group: "extra" },
        ],
    },
};

function getValue(entry, col, run_type) {
    switch (col.key) {
        case 'sandbox':
            return entry[col.key] ?? '❌';
        case 'monotype':
            return entry[col.key] ? getTypeSprite(entry[col.key]) : '-';
        case 'attempts':
        case 'deaths':
            return entry[col.key] ?? (run_type === 'hardcore_nuzlockes' ? '?' : '-');
        case 'starter':
            return entry[col.key] ? getStarterSprite(entry[col.key]) : '?';
        default:
            return entry[col.key] ?? '-';
    }
}

function getBounties(entry, index) {
    return (entry.bounties || []).includes(index) ? 'bounty' : 'normal';
}

function buildHofTable() {
    if (!Object.keys(hofData).length) return;

    document.getElementById('extra-toggle').classList.remove('hidden');
    document.getElementById('run_type-radios').classList.remove('hidden');
    document.getElementById('hint').classList.add('hidden');
    document.getElementById('hall-of-fame').classList.remove('hidden');

    const hof_table = document.getElementById('hof-table');

    const game = document.querySelector('input[name="game"]:checked')?.value || 'little_emerald';
    const run_type = document.querySelector('input[name="run-type"]:checked')?.value || 'hardcore_nuzlockes';

    const schema = gameSchemas[game][run_type];

    let title = ''
    let team = 'Team';
    if (run_type === 'hardcore_nuzlockes') {
        title = 'Bounties (Pokémon that have not been champed before) have a green background.';
        team = 'Team <span class="info">🛈</span>';
    }

    const header = `
        <tr>
            ${schema.map(col => `<th class="${col.group}-col">${col.label}</th>`).join('')}
            <th title="${title}" colspan="6">
                ${team}
            </th>
        </tr>
    `;

    let entries = hofData[game][run_type].map(entry => `
        <tr>
            ${schema.map(
                col => `<td class="${col.group}-col">${getValue(entry, col, run_type)}</td>`
            ).join('')}
            <td class="${getBounties(entry, 1)}">${getSprite(entry, 1)}</td>
            <td class="${getBounties(entry, 2)}">${getSprite(entry, 2)}</td>
            <td class="${getBounties(entry, 3)}">${getSprite(entry, 3)}</td>
            <td class="${getBounties(entry, 4)}">${getSprite(entry, 4)}</td>
            <td class="${getBounties(entry, 5)}">${getSprite(entry, 5)}</td>
            <td class="${getBounties(entry, 6)}">${getSprite(entry, 6)}</td>
        </tr>    
    `);

    if (!entries.length) {
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