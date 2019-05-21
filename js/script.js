/** ****************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination

Code by: Cam Richardson
***************************************** */

// Global vars. The list of students as well as the amount of students to show per page.
const students = document.querySelectorAll('.student-item');
const pageLimit = 10;

// Helper function I created that can create an HTML element with optional properties set on it.
// The properties must be valid HTMLElement properties otherwise there's not much to gain from them.
const createElement = (elementName, options) => {
  const element = document.createElement(elementName);
  if (options) {
    const props = Object.keys(options);
    for (let i = 0; i < props.length; i += 1) {
      element[props[i]] = options[props[i]];
    }
  }
  return element;
};

// This function will take a list of items, a page number, and the max amount of items to show
// per page. It will then do the math and display the correct items in the list that we would expect
// to see if we were cutting up the list items into parts (or pages).
const showPage = (list, page) => {
  const startIndex = (page * pageLimit) - pageLimit;
  const endIndex = page * pageLimit;
  for (let i = 0; i < list.length; i += 1) {
    const curItem = list[i];
    if (i >= startIndex && i < endIndex) curItem.style.display = '';
    else curItem.style.display = 'none';
  }
};

// This function filters a list of HTML elements by their textContent property matching against an
// input element's value. Breaking it down it will first create an array based on the list provided.
// Then that array is filtered down to elements with textContent values that match the
// searchInput value. Then any items in the original list that aren't in the
// filtered list are hidden from the page. Finally the filtered list is returned
// so that other functions can manipulate it.
const filterStudents = (list, searchInput) => {
  const filteredStudents = Array.from(list).filter(
    student => student.textContent.toLowerCase().includes(searchInput.value.toLowerCase()),
  );
  for (let i = 0; i < list.length; i += 1) {
    const curItem = list[i];
    if (filteredStudents.indexOf(curItem) !== -1) {
      curItem.style.display = '';
    } else curItem.style.display = 'none';
  }
  return filteredStudents;
};

/*
 This function added the page links to the bottom of the page.
 First it will remove any existing page links added to the DOM as we expect
 to use this function multiple times and we wish to avoid overlap.
 Then we calculate the number of pages by taking the remainder of list.length / 10.
 If the remainder is 0 then numPages is simply list.length / 10. If the remainder is not 0
 then there is an extra page with less than 10 items we have to account for. Next we select
 the div with the page class that contains our list of elements. We create the navigation container
 that will hold our page links and then create a set of page links totalling the number
 of pages we have. Finally we append everything to the DOM and add event listeners to each page link
 that will trigger our showPage function when clicked.
*/
const appendPageLinks = (list) => {
  let pageLinks = document.querySelectorAll('a');
  for (let i = 0; i < pageLinks.length; i += 1) {
    pageLinks[i].parentNode.removeChild(pageLinks[i]);
  }
  const numPages = (list.length % 10 === 0) ? (list.length / 10) : Math.floor(list.length / 10) + 1;
  const page = document.querySelector('.page');
  const div = createElement('div', { className: 'pagination' });
  const ul = createElement('ul');
  for (let i = 0; i < numPages; i += 1) {
    const li = createElement('li');
    if (i === 0) li.appendChild(createElement('a', { href: '#', textContent: i + 1, className: 'active' }));
    else li.appendChild(createElement('a', { href: '#', textContent: i + 1 }));
    ul.appendChild(li);
  }

  div.appendChild(ul);
  page.appendChild(div);

  pageLinks = document.querySelectorAll('a');
  Array.from(pageLinks).forEach((curLink) => {
    curLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.active').className = '';
      e.target.className = 'active';
      showPage(students, e.target.textContent);
    });
  });
};

// This function adds a search bar to the element acting as a header on the page.
// Listeners are added to both the search button as well as the input. These
// listeners will call the filterStudents function above when triggered and
// use the returned list of filtered students to display and paginate results
// based on what the user is intending to find. As an addition to UX, we add
// a span to the DOM with a message letting the user know that there weren't any
// results returned. This is shown or hidden depending on if the filtered
// list is empty or not.
const appendSearchBar = () => {
  const filterAndShowResults = (list, searchInput) => {
    const filteredStudents = filterStudents(list, searchInput);
    const noResultsMsg = document.querySelector('.results');
    if (filteredStudents.length === 0) noResultsMsg.style.display = '';
    else noResultsMsg.style.display = 'none';
    showPage(filteredStudents, 1);
    appendPageLinks(filteredStudents);
  };
  const pageHeader = document.querySelector('.page-header');
  const page = document.querySelector('.page');
  const noResultsMsg = createElement('span', { className: 'results', textContent: 'No Results found...' });
  const searchDiv = createElement('div', { className: 'student-search' });
  searchDiv.appendChild(createElement('input', { placeholder: 'Search for students...' }));
  searchDiv.appendChild(createElement('button', { textContent: 'Search' }));
  pageHeader.appendChild(searchDiv);
  noResultsMsg.style.display = 'none';
  page.appendChild(noResultsMsg);

  document.querySelector('button').addEventListener('click', (e) => {
    e.preventDefault();
    filterAndShowResults(students, e.target.previousElementSibling);
  });

  document.querySelector('input').addEventListener('keyup', (e) => {
    filterAndShowResults(students, e.target);
  });
};


// We want to paginate the list immediately so when the DOM is ready we execute the functions
document.addEventListener('DOMContentLoaded', () => {
  showPage(students, 1);
  appendPageLinks(students);
  if (document.querySelector('.student-search') === null) appendSearchBar();
});
