import { render } from '../js/RenderView.js';
const ghIconUlr = './images/gh.svg'

export class RenderTasks {
  constructor(url) {
    this.url = url;
    this.tasks = [];
    this.fetchFails = [];
  }

  getTask = async taskURL => {
    let res = await fetch(taskURL);
    if (!res.ok) {
      this.fetchFails.push(taskURL);
      this.renderErrors();
      return;
    };
    let tasksObj = await res.json();
    this.tasks.push(tasksObj);
    const taskContainer = document.createElement('DIV');
    taskContainer.classList.add('taskContainer');
    const taskLink = document.createElement('DIV');
    taskLink.classList.add('taskLink');
    const ghLink = document.createElement('a');
    ghLink.setAttribute('href', tasksObj.github);
    ghLink.setAttribute('target', '_blank');
    const ghImg = document.createElement('img');
    ghImg.classList.add('icon');
    ghImg.src = ghIconUlr;
    ghImg.alt = 'GitHub link'
    ghLink.appendChild(ghImg);
    ghLink.setAttribute('title', 'Original repo README');
    const link = document.createElement('a');
    link.setAttribute('href', taskURL);
    link.innerText = tasksObj.taskName;
    link.onclick = (e) => {
      e.preventDefault();
      this.tasksList.remove();
      document.querySelector('.back').classList.remove('hidden');
      render(tasksObj.criteria, tasksObj.taskName, tasksObj.information);
    };
    taskLink.appendChild(link);
    const taskLink2 = taskLink.cloneNode();
    taskLink2.innerHTML = '';
    taskLink2.appendChild(ghLink);
    taskContainer.appendChild(taskLink2);
    taskContainer.appendChild(taskLink);


    this.tasksList && this.tasksList.appendChild(taskContainer);
    this.loader.classList.remove('visible');
  }

  initTasks = async () => {
    this.loader = document.querySelector('.loader');
    this.tasksList = document.querySelector('.tasks-list');
    this.errorsContainer = document.querySelector('.fetch-errors');

    let response = await fetch(this.url);
    if (!response.ok) {
      this.fetchFails.push(this.url.match(/.*\/(?!\/)(.*)$/)[1]);
      this.renderErrors();
      return;
    };
    let filesURL = await response.json();

    const urls = Object.values(filesURL);

    for (let i = 0; i < urls.length; i++) {
      this.getTask(urls[i]);
    }

  }

  renderErrors = () => {
    if (this.fetchFails.length) {
      const errDiv = document.createElement('DIV');
      errDiv.classList.add('errMsg');

      this.fetchFails.map(err => {
        errDiv.innerHTML = `Unable to fetch <em>${err}</em>`;
        this.errorsContainer.appendChild(errDiv);
      });
      this.loader.classList.remove('visible');
    }
  }
}

