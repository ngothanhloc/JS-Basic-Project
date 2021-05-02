const id = new URLSearchParams(window.location.search).get("id");
const container = document.querySelector(".details");
const deleteBtn = document.querySelector(".deletebtn");

const renderDetails = async () => {
  const res = await fetch("http://localhost:8000/posts/" + id);
  const post = await res.json();
  console.log(post);

  const template = `
  <h1>${post.title}</h1>
  <p>${post.body}</p>
`;
  container.innerHTML = template;
};

deleteBtn.addEventListener('click', async(e)=>{
  const res = await fetch("http://localhost:8000/posts/" + id, {
    method: 'DELETE',
  })
  window.location.replace('/')
})
window.addEventListener("DOMContentLoaded", renderDetails);
