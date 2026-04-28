let hofData = [];

fetch('data.json')
.then(res => res.json())
.then(data => {
    hofData = data;
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
    return `<img src="${src}" alt="${pokemon}">`;
}

const gameSchemas = {
    little_emerald: [
        { key: 'player', label: 'Player' },
        { key: 'version', label: 'Version' },
        { key: 'difficulty', label: 'Difficulty' },
    ],
    mini_moon: [
        { key: 'player', label: 'Player' },
        { key: 'version', label: 'Version' },
        { key: 'date', label: 'Date' },
        { key: 'starter', label: 'Starter' },
    ],
};

function buildHofTable() {
    if (!Object.keys(hofData).length) return;

    document.getElementById('hint').classList.add('hidden');
    document.getElementById('hall-of-fame').classList.remove('hidden');

    const hof_table = document.getElementById('hof-table');

    const game = document.querySelector('input[name="game"]:checked')?.value || 'little_emerald';
    const run_type = document.querySelector('input[name="run-type"]:checked')?.value || 'hardcore_nuzlockes';

    const schema = gameSchemas[game];

    const header = `
        <tr>
            ${schema.map(col => `<th>${col.label}</th>`).join('')}
            <th colspan="6">Team</th>
        </tr>
    `;

    let entries = hofData[game][run_type].map(entry => `
        <tr>
            ${schema.map(col => `<td>${entry[col.key] ?? '-'}</td>`).join('')}
            <td>${getSprite(entry, 1)}</td>
            <td>${getSprite(entry, 2)}</td>
            <td>${getSprite(entry, 3)}</td>
            <td>${getSprite(entry, 4)}</td>
            <td>${getSprite(entry, 5)}</td>
            <td>${getSprite(entry, 6)}</td>
        </tr>    
    `);

    if (!entries.length) {
        document.getElementById('hof-table').innerHTML = 'No runs found.';

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