const internshipList = document.getElementById("internshipList");
const searchInput = document.getElementById("searchInput");
const domainFilter = document.getElementById("domainFilter");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const errorState = document.getElementById("errorState");

let internships = [];


/* ---------- Load Internship Data ---------- */

async function loadInternships() {
    try {
        const response = await fetch("internship-records.json");

        if (!response.ok) {
            throw new Error("Unable to load internship data");
        }

        const data = await response.json();

        if (!data.internships || !Array.isArray(data.internships)) {
            throw new Error("Invalid internship data");
        }

        internships = data.internships;

        createDomainOptions();
        displayInternships(internships);

    } catch (error) {
        console.error(error);

        internshipList.innerHTML = "";
        resultCount.textContent = "";
        errorState.hidden = false;
    }
}


/* ---------- Create Domain Filter Options ---------- */

function createDomainOptions() {

    const domains = [...new Set(
        internships.map(internship => internship.domain)
    )];

    domains.forEach(domain => {

        const option = document.createElement("option");

        option.value = domain;
        option.textContent = domain;

        domainFilter.appendChild(option);
    });
}


/* ---------- Display Internship Cards ---------- */

function displayInternships(list) {

    internshipList.innerHTML = "";

    emptyState.hidden = list.length !== 0;

    resultCount.textContent =
        `${list.length} internship${list.length === 1 ? "" : "s"} found`;

    list.forEach(internship => {

        const card = document.createElement("article");

        card.className = "internship-card";

        card.innerHTML = `
            <h3>${internship.title}</h3>

            <p class="domain">${internship.domain}</p>

            <p class="card-info">
                <strong>Mode:</strong> ${internship.mode}
            </p>

            <p class="card-info">
                <strong>Location:</strong> ${internship.location}
            </p>

            <div class="skills">
                ${internship.skills
                    .map(skill => `<span class="skill">${skill}</span>`)
                    .join("")}
            </div>

            <p class="openings">
                Openings: ${internship.openings}
            </p>
        `;

        internshipList.appendChild(card);
    });
}


/* ---------- Search & Filter ---------- */

function filterInternships() {

    const searchText = searchInput.value
        .toLowerCase()
        .trim();

    const selectedDomain = domainFilter.value;

    const filteredInternships = internships.filter(internship => {

        const searchableText = `
            ${internship.title}
            ${internship.domain}
            ${internship.location}
            ${internship.skills.join(" ")}
        `.toLowerCase();

        const matchesSearch =
            searchableText.includes(searchText);

        const matchesDomain =
            selectedDomain === "all" ||
            internship.domain === selectedDomain;

        return matchesSearch && matchesDomain;
    });

    displayInternships(filteredInternships);
}


/* ---------- Event Listeners ---------- */

searchInput.addEventListener("input", filterInternships);

domainFilter.addEventListener("change", filterInternships);


/* ---------- Start App ---------- */

loadInternships();