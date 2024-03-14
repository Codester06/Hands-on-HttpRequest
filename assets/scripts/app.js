const listElement = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");
const form = document.querySelector("#new-post form");
const fetchButton = document.getElementById("available-posts");
const postList = document.querySelector('ul');

// function sendHttpRequest(method, url, data) {
//     const promise = new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
//         xhr.open(method, url);
//         // console.log(xhr)
//         xhr.responseType = "json";
//         xhr.onload = function () {
//         if (xhr.status >= 200 && xhr.status < 300) {
//             resolve(xhr.response);
//         }else {
//             reject(new Error('Something went wrong!'));
//         }
//         };

//         xhr.onerror = function () {
//             reject(new Error('failed to sent request!'));
//         };

//         xhr.send(JSON.stringify(data));
//     });
//     return promise;
// }

function sendHttpRequest(method, url, data) {
        return fetch(url,{
            method: method,
            // body: JSON.stringify(data),
            body: data,
            // headers:{
            //     'Content-Type': 'application/json'
            // }
        })
        .then( response => {

            if(response.status >= 200 && response.status < 300){
            return response.json();
            }else{
                return response.json().then(errData => {
                    console.log(errData);
                    throw new Error("Something went wrong - server side!");
                })
            }
        }).catch(error => {
            console.log(error);
            throw new Error("Something went wrong!");
        });
}

async function fetchPosts() {
    try {
        const responseData = await sendHttpRequest(
            "GET",
            "https://jsonplaceholder.typicode.com/posts"
        );
    
        const listOfPosts = responseData;
        for (const post of listOfPosts) {
            const postEl = document.importNode(postTemplate.content, true);
            postEl.querySelector("h2").textContent = post.title.toUpperCase();
            postEl.querySelector("p").textContent = post.body;
            postEl.querySelector("li").id = post.id;
            listElement.append(postEl);
        }
        
    } catch (error) {
        alert(error.message)
    }
    
}

async function createPost(title, body) {
    const userId = Math.random();
    const post = {
        title: title,
        body: body,
        userId: userId,
    };

    const fd = new FormData(form);
    // fd.append("title", title);
    // fd.append("body", content);
    fd.append("userId", userId);
    

    sendHttpRequest("POST", "https://jsonplaceholder.typicode.com/posts", fd);
}

fetchButton.addEventListener("click",fetchPosts);
// createPost("DUMMY", "HELLO HERE IS DUMMY ONE !");
form.addEventListener('submit', event => {
    event.preventDefault()
    const enteredTitle = event.currentTarget.querySelector("#title").value;
    const enteredContent = event.currentTarget.querySelector("#content").value;

    createPost(enteredTitle, enteredContent);}
    )

postList.addEventListener("click",event => {
    if(event.target.tagName === "BUTTON"){
        // console.log("Clicked on button!")
        const postId = event.target.closest('li').id;
        // console.log(postId);
        sendHttpRequest('DELETE',`https://jsonplaceholder.typicode.com/posts/${postId}`)
    }
})



// const xhr = new XMLHttpRequest();

// xhr.open('GET','https://jsonplaceholder.typicode.com/posts');
// // console.log(xhr)
// xhr.responseType = 'json'
// xhr.onload = function() {
//     // console.log(xhr.response)
//     // const listOfPosts = JSON.parse(xhr.response)
//     const listOfPosts = xhr.response
//     // console.log(listOfPosts)
//     for(const post of listOfPosts) {
//         const postEl = document.importNode(postTemplate.content,true);
//         postEl.querySelector("h2").textContent = post.title.toUpperCase();
//         postEl.querySelector("p").textContent = post.body;
//         listElement.append(postEl);
//     }
// }
// xhr.send();
