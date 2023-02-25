console.log('hello webpack');
import './main.css';

'use strict';

const personagesList = document.getElementById('personages-list');
const btnPrev = document.getElementById('previous');
const btnNext = document.getElementById('next');
const btnGo = document.getElementById('go-button');
const searchName = document.getElementById('search');

let numPage = document.getElementById('page');

function dataOutput(data) {
    personagesList.innerHTML = "";
    for (let items of Object.values(data)) {
        if (Array.isArray(items)) {
            Object.values(items).forEach(val => {  
                
                let div = document.createElement('div');
                let img = document.createElement('img');
                let ul = document.createElement('ul');
                let li_0 = document.createElement('li');
                let li_1 = document.createElement('li');
                
                li_0.innerText = 'name: ' + val.name;
                li_1.innerText = 'status: ' + val.status;

                img.src = val.image;
                img.classList.add('img');

                div.classList.add('div__item');
                div.setAttribute('div-name', val.name);
                div.setAttribute('div-img', val.image);
                div.classList.add('open__popup');
                
                div.appendChild(ul);
                ul.appendChild(li_0);
                ul.appendChild(li_1);
                div.appendChild(img);
                
                personagesList.appendChild(div);
            });
        }
    }  
}

let page = `https://rickandmortyapi.com/api/character?page=1`;
let state = null;

async function getData (pageUrl) {
    const responce = await fetch(pageUrl);
    const data = await responce.json();
    state = data;
    dataOutput(data);
}
getData(page);

function pagination (pageUrl) {
    const urlParams = new URL(pageUrl);
    const currentPage = urlParams.searchParams.get('page');
    numPage.innerHTML = currentPage;
    return numPage.innerHTML;
}

btnNext.addEventListener('click', () => {
    if (state.info.next === null) {
        return;
      }
    page = state.info.next;
    getData(page);
    pagination(page);
    console.log('state next', state);
    console.log('pages', state.info.pages)
});

btnPrev.addEventListener('click', () => {
    if (state.info.prev === null) {
        return;
      }
    page = state.info.prev;
    getData(page);
    pagination(page);
});

function sName (pageUrl) {
    let urlParams = new URL(pageUrl);
    urlParams.searchParams.set('name', searchName.value);
    let selected = false;
    let radios = document.getElementsByName('status');
    for (let radio of radios) {
        if (radio.type === 'radio' && radio.checked) {
            urlParams.searchParams.append('status', radio.value);
            console.log(radio.value);
            selected = true;
        }
    }
 
    if (!selected) {
        urlParams.searchParams.delete('status');
    }
    if (searchName.value === '') {
        urlParams.searchParams.delete('name');
    }
    
    state = urlParams.href;
    return state;
};

searchName.addEventListener('keypress', checkLetter);

function checkLetter(event) {
    if ("1234567890".indexOf(event.key) != -1)
    event.preventDefault();
};

btnGo.addEventListener('click', () => {
    numPage.innerHTML = 1;
    getData(sName('https://rickandmortyapi.com/api/character/'));
});

const outsideSpace = document.getElementsByTagName('body');
const popUp = document.getElementById('popup');
const closePopupButton = document.getElementById('close-popup');

let currentName = document.getElementById('name');
let currentImg = document.getElementById('img');
let srcImg = personagesList.querySelector('img');

function handleClick(e) {
    e.stopPropagation();
    popUp.classList.add('active');
    console.log('click', e.target);
    currentName.textContent = e.target.getAttribute("div-name");
    currentImg.src = e.target.getAttribute("div-img");;
}

personagesList.addEventListener('click', handleClick);

function closePopup (e) {
    popUp.classList.remove('active');
}

popUp.addEventListener('click', (e) => {
    e.stopPropagation();
})

closePopupButton.addEventListener('click', (e) => {
    closePopup();
    e.stopPropagation();
})

outsideSpace[0].addEventListener('click', () => {
    closePopup();
});


