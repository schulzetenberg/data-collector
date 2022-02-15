exports.processBookData = (data) => {
  if (!data) {
    return [];
  }

  const yearAgo = new Date();
  yearAgo.setDate(yearAgo.getDate() - 365);

  const booksData = data.booksRead;
  const recentBooksArr = [];

  if (!booksData) {
    console.log('No books read data');
    return [];
  }

  let pagesRead = 0;
  const topBooks = [];

  for (let i = 0; i < booksData.length; i += 1) {
    const book = booksData[i];

    // Show top 6 books, ordered from recently read
    if (topBooks.length < 6 && book.rating === 5) {
      topBooks.push(book.title);
    }

    const dateRead = book.dateRead && new Date(book.dateRead);

    if (dateRead && dateRead > yearAgo) {
      recentBooksArr.push(book);

      if (book.pages) {
        pagesRead += parseInt(book.pages, 10);
      }
    }
  }

  /*
		Since dateRead only applies to the first time a book is read, we need to instead
		rely on the booksData coming in order of most recent read date
	*/
  const parsedData = {};
  const recentBookCount = booksData.length > 6 ? 6 : booksData.length;
  parsedData.recentBooks = booksData.slice(0, recentBookCount);

  parsedData.books = recentBooksArr;
  parsedData.pagesRead = pagesRead;
  let topBooksList = '';

  for (let j = 0; j < topBooks.length; j += 1) {
    if (j % 2) {
      topBooksList += `<b>${topBooks[j]}. </b>`;
    } else {
      topBooksList += `${topBooks[j]}. `;
    }
  }

  parsedData.topBooksList = topBooksList;

  return parsedData;
};
