document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('usuarioForm');
    const paisSelect = document.getElementById('paisSelect');

    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            data.forEach(pais => {
                const option = document.createElement('option');
                option.value = pais.name.common;
                option.textContent = pais.name.common;
                paisSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar países:', error));

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const githubUsername = document.getElementById('githubUsername').value;
        const paisSeleccionado = paisSelect.value;
        const telefono = document.getElementById('telefono').value;
        const correo = document.getElementById('correo').value;


        fetch(`https://api.github.com/users/${githubUsername}`)
            .then(response => response.json())
            .then(githubData => {
                if (githubData.name) {
                    const nombreGitHub = githubData.name;

                    fetch(`https://restcountries.com/v3.1/name/${paisSeleccionado}`)
                        .then(response => response.json())
                        .then(paisData => {
                            const dialCode = paisData[0].idd.root + (paisData[0].idd.suffixes[0] || '');

                            const tablaCuerpo = document.querySelector('#datosTabla tbody');
                            const fila = document.createElement('tr');
                            fila.innerHTML = `
                                <td>${nombreGitHub}</td>
                                <td>${dialCode} ${telefono}</td>
                                <td>${correo}</td>
                            `;
                            tablaCuerpo.appendChild(fila);

                            fetch('enviar_datos.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    nombre_github: nombreGitHub,
                                    telefono: `${dialCode} ${telefono}`,
                                    correo
                                }),
                            })
                            .then(response => response.json())
                            .then(data => {
                                console.log('Datos enviados:', data);
                            })
                            .catch(error => console.error('Error al enviar datos:', error));
                        })
                        .catch(error => console.error('Error al obtener código de marcación:', error));
                } else {
                    alert('Nombre no encontrado en GitHub.');
                }
            })
            .catch(error => console.error('Error al obtener datos de GitHub:', error));
    });
});
