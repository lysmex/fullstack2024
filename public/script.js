document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault();


    const formData = new FormData(this);

    axios.post('/ajaxmessage', formData)
        .then(function(response) {
            document.getElementById("resultsBody").innerHTML = "";
            
            response.data.forEach(function(item) {
                var row = document.createElement("tr");
                row.innerHTML= `<td>${item.id}</td><td>${item.username}</td><td>${item.country}</td><td>${item.date}</td><td>${item.message}</td>`;
                document.getElementById("resultsBody").appendChild(row);
            });

            document.getElementById("results").style.display="table";
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
});