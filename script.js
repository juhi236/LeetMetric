document.addEventListener('DOMContentLoaded',function(){
 
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");


    function validateUsername(username){
      if (username.trim() === "") {
        alert("Username should not be empty");
        return false;
      }
      const regex = /^[a-zA-Z0-9_-]{1,15}$/;

      const isMatching = regex.test(username);
      if (!isMatching) {
        alert("Invalid username")
      }
      return isMatching

    }

    async function fetchUserDetails(username) {


        const url = `https://leetcode-stats-api.herokuapp.com/${username}`
        try {
            searchButton.textContent = 'searching..'
            searchButton.disabled = true;

            statsContainer.style.setProperty('display','none')

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch user details.")
            }
            const parsedData = await response.json();
            console.log("data:",parsedData)

            displayUserData(parsedData)
            statsContainer.style.setProperty('display', 'block');
        } catch(e){
       statsContainer.innerHTML = `<p>${e.message}</p>`;
       statsContainer.style.setProperty('display', 'block'); // Ensure it is visible
        } finally{
            searchButton.textContent = 'search'
            searchButton.disabled = false;
        }

       

    }

    function updateProgress(solved, total, label, circle){
       const progressDegree = (solved/total)*100;
       circle.style.setProperty('--progress-degree', `${progressDegree}%`)
       label.textContent = `${solved}/${total}`
    }
    function calculateTotalSubmissions(submissionCalendar) {
        return Object.values(submissionCalendar).reduce((total, submissions) => total + submissions, 0);

    }

   function displayUserData(parsedData){

    const totalQues = parsedData.totalQuestions;
    const totalSolvedQues = parsedData.totalSolved; // Total solved questions
    const totalEasyQues = parsedData.totalEasy;
    const totalMediumQues = parsedData.totalMedium;
    const totalHardQues = parsedData.totalHard;

    const solvedEasyQues = parsedData.easySolved;
    const solvedMediumQues = parsedData.mediumSolved;
    const solvedHardQues = parsedData.hardSolved;

    const acceptanceRate = parsedData.acceptanceRate;
    const ranking = parsedData.ranking;
    const contributionPoints = parsedData.contributionPoints;
    const totalSubmissions = calculateTotalSubmissions(parsedData.submissionCalendar);
    console.log("Total Submissions: ", totalSubmissions);

    updateProgress(solvedEasyQues, totalEasyQues, easyLabel, easyProgressCircle)
    updateProgress(solvedMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle)
    updateProgress(solvedHardQues, totalHardQues, hardLabel, hardProgressCircle)

    const cardsData = [
        {label: "Overall submissions", value: totalSubmissions},
        {label: "Ranking", value: ranking},
        {label: "Acceptance rate ", value: acceptanceRate},
        {label: "Total solved questions ", value: totalSolvedQues},

    ]
    console.log("card data:", cardsData);

    cardStatsContainer.innerHTML = cardsData.map(data =>
          `<div class="card"> 
        <h3>${data.label}</h3>
       <p>${data.value}</p>
       </div>`
    ).join("")
   
   }

    searchButton.addEventListener('click', function() {
        const username = usernameInput.value;
        console.log("Loggin value is:", username)
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    })








})