let hofData = [];

fetch('data.json')
.then(res => res.json())
.then(data => {
    hofData = data;
});