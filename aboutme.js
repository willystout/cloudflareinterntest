document.addEventListener('DOMContentLoaded', () => {
    fetchPersonalInfo();
});

function fetchPersonalInfo() {
    fetch('https://my-worker.willystout5.workers.dev/me')
    .then(response => response.json())
    .then(data => {
        displayPersonalInfo(data);
    })
    .catch(error => console.error('Error fetching personal info:', error));
}

function displayPersonalInfo(data) {
    const myselfDiv = document.getElementById('myself');

    let htmlContent = `
        <h2>About Me</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Homepage:</strong> <a href="${data.homepage}" target="_blank">${data.homepage}</a></p>
        <p><strong>GitHub:</strong> <a href="${data.githubURL}" target="_blank">${data.githubURL}</a></p>
        <p><strong>Interesting Fact:</strong> ${data.interestingFact}</p>
        <p><strong>Skills:</strong> ${data.skills.join(', ')}</p>
    `;

    myselfDiv.innerHTML = htmlContent;
}