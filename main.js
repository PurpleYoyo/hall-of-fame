let hofData = [];

fetch('data.json')
.then(res => res.json())
.then(data => {
    hofData = data;
});

document.getElementById('')

document.getElementById('little_emerald').addEventListener('input', () => buildHofTable());
document.getElementById('mini_moon').addEventListener('input', () => buildHofTable());

document.getElementById('hardcore_nuzlockes').addEventListener('input', () => buildHofTable());
document.getElementById('casual').addEventListener('input', () => buildHofTable());

function formatSpriteName(pokemon) { // To be used for specific special cases; not needed yet.
    return pokemon.toLowerCase();
}

function getSprite(pokemon) {
    return `<img src="https://raw.githubusercontent.com/PurpleYoyo/LittleEmerald-SaveReader/main/sprites/${formatSpriteName(pokemon)}.png"></img>`;
}

function buildHofTable() {
    if (!hofData) return;

    document.getElementById("hint").classList.add("hidden");
    document.getElementById("hall-of-fame").classList.remove("hidden");

    const hof_table = document.getElementById("hof-table");
    let entries = [];

    let game = null;
    const game_radios = document.getElementsByName('game');
    for (let i = 0; i < game_radios.length; i++) {
        if (game_radios[i].checked) {
            game = game_radios[i].value;
            break;
        }
    }

    if (!game) {
        game = 'little_emerald';
    }

    let run_type = null;
    const run_type_radios = document.getElementsByName('run-type');
    for (let i = 0; i < run_type_radios.length; i++) {
        if (run_type_radios[i].checked) {
            run_type = run_type_radios[i].value;
            break;
        }
    }

    if (!run_type) {
        run_type = 'hardcore_nuzlockes';
    }

    hofData[game][run_type].forEach(entry => {
        entries.push(`
            <tr>
                <td>${entry.player}</td>
                <td>${entry.version}</td>
                <td>${getSprite(entry.pokemon1)}</td>
                <td>${getSprite(entry.pokemon2)}</td>
                <td>${getSprite(entry.pokemon3)}</td>
                <td>${getSprite(entry.pokemon4)}</td>
                <td>${getSprite(entry.pokemon5)}</td>
                <td>${getSprite(entry.pokemon6)}</td>
            </tr>
        `);
    });

    hof_table.innerHTML = `
        <thead>
            <tr>
                <th>Player</th>
                <th>Version</th>
                <th colspan="6">Team</th>
            </tr>
        </thead>

        <tbody>
            ${entries.join('\n')}
        </tbody>
    `;
}