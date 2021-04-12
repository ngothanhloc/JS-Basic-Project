const addForm = document.querySelector('.add')
const list = document.querySelector('.todos')
const search = document.querySelector('.search input')

const convertHTML = todo => {
    const html = `
    <li class="list-group-item d-flex justify-content-between align-items-center">
              <span>${todo}</span>
              <i class="far fa-trash-alt delete"></i>
    </li>
    `
    list.innerHTML += html
}

// add new element 
addForm.addEventListener('submit', e => {
    e.preventDefault();
    const todo = addForm.add.value.trim();
    if (todo.length) {
        convertHTML(todo);
        addForm.reset();
    }
})

// delete element
list.addEventListener('click', e => {
    if (e.target.classList.contains('delete')) {
        e.target.parentElement.remove();
    }
})

// filter and searching
const filterMethod = (term => {
    Array.from(list.children)
        .filter((todo) => !todo.textContent.includes(term))
        .forEach((todo) => todo.classList.add('filtered'))
    Array.from(list.children)
        .filter((todo) => todo.textContent.includes(term))
        .forEach((todo) => todo.classList.remove('filtered'))
})

// keyup event sreach input
search.addEventListener('keyup', () => {
    const term = search.value.trim();
    filterMethod(term)
});