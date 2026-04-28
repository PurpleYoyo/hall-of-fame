let hofData = [];

fetch('data.json')
.then(res => res.json())
.then(data => {
    hofData = data;
});

document.getElementById('little_emerald').addEventListener('input', () => buildHofTable());
document.getElementById('mini_moon').addEventListener('input', () => buildHofTable());

document.getElementById('hardcore_nuzlocke').addEventListener('input', () => buildHofTable());
document.getElementById('casual').addEventListener('input', () => buildHofTable());

function buildHofTable() {
    const hof_table = document.getElementById("hof-table");
    let entries = [];

    let game;
    const game_radios = document.getElementsByName('game');
    for (let i = 0; i < game_radios.length; i++) {
        if (game_radios[i].checked) {
            game = game_radios[i].value;
            break;
        }
    }

    let run_type;
    const run_type_radios = document.getElementsByName('run_type');
    for (let i = 0; i < run_type_radios.length; i++) {
        if (run_type_radios[i].checked) {
            run_type = run_type_radios[i].value;
            break;
        }
    }

    data[game][run_type].forEach(entry => {
        entries.push(`
            <tr>
                <td>${entry.player}</td>
                <td>${entry.version}</td>
                <td>${entry.pokemon1}</td>
                <td>${entry.pokemon2}</td>
                <td>${entry.pokemon3}</td>
                <td>${entry.pokemon4}</td>
                <td>${entry.pokemon5}</td>
                <td>${entry.pokemon6}</td>
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