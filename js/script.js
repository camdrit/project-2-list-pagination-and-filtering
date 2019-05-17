/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination

Code by: Cam Richardson
******************************************/

const students = document.querySelectorAll('.student-item');
console.log(students);

const pageLimit = 10;

const showPage = (list, page) => {
   const startIndex = (page * pageLimit) - pageLimit;
   const endIndex = page * pageLimit;
   for (let i = 0; i < list.length; i++) {
      if (i >= startIndex && i < endIndex) list[i].style.display = '';
      else list[i].style.display = 'none';
   }
}


const appendPageLinks = (list) => {
   const createElement = (elementName, options) => {
      const element = document.createElement(elementName);
      for (let prop in options) {
         element[prop] = options[prop];
      }
      return element;
   }
   const numPages = (list.length % 10 === 0) ? (list.length / 10) : Math.floor(list.length / 10) + 1;
   const page = document.querySelector('.page');
   const div = createElement('div', { className: 'pagination' });
   const ul = createElement('ul');
   for (let i = 0; i < numPages; i++) {
      const li = createElement('li');
      i === 0 ? li.appendChild(createElement('a', { href: '#', textContent: i+1, className: 'active' }))
         : li.appendChild(createElement('a', { href: '#', textContent: i+1 }));
      ul.appendChild(li);
   }

   div.appendChild(ul);
   page.appendChild(div);

   const pageLinks = document.querySelectorAll('a');
   Array.from(pageLinks).forEach(curLink => {
      curLink.addEventListener('click', e => {
         e.preventDefault();
         Array.from(pageLinks).forEach(link => { link.className = ''; });
         e.target.className = 'active';
         showPage(students, e.target.textContent);
      });
   });
}

document.addEventListener('DOMContentLoaded', () => {
   showPage(students, 1);
   appendPageLinks(students);
});



// Remember to delete the comments that came with this file, and replace them with your own code comments.