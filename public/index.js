console.log('index.js is connected')

function getStoryData (callback) {
  const settings = {
    url: '/storiesDB',
    dataType: 'json',
    type: 'GET',
    success: callback
  }
  console.log('get ajax ran')
  $.ajax(settings)
};

function postStoryData (callback) {
  let storyID = (window.location.pathname).slice(7)
  console.log(`ajax post storyID: ${storyID}`)
  const settings = {
    url: `/story/${storyID}`,
    dataType: 'json',
    type: 'POST',
    success: callback
  }
  console.log('post to storyDB ajax ran')
  $.ajax(settings)
}

function deleteUser (callback) {
  console.log('deleteUser ajax ran')
  const settings = {
    url: '/stories/delete',
    dataType: 'json',
    type: 'delete',
    success: callback
  }
  $.ajax(settings);
}

function storiesCallback (response) {
  console.log(`storyData ajax callback`)
  response.stories.forEach(function (story) {
    $('#js-story-list').append(`<li class="stories-page-li"><a href="/story/${story.id}">${story.title}</a></li>`)
  })
};

function storyIdCallback (response) {
  let requestID = (window.location.pathname).slice(7)

  console.log(`req id from window pathname: ${requestID}`)
  console.log(response)

  response.stories.forEach(function (story) {
    if (requestID === story.id) {
      let authors = story.authors
      console.log(`the authors are: ${authors}`)
      $('.grid-storyId').append(`<div class="authors-list">${story.authors}</div>`)
      // $('.authors-list').textContent = `${story.authors}`;
      $('.grid-storyId').append(`<h1 class="title">${story.title}</h1>`)
      $('.grid-storyId').append(`<div class="story">${story.content}</div>`)
    }
  })
};

function deleteUserCallback (response) {
  alert(`Your user has been deleted`)
}

// $('.add-story-button').on('click', (event) => {
//   console.log('storyID click is running')
//   event.preventDefault();
//   postStoryData(location.reload());
// })

$('.remove-user-button').on('click', () => {
  console.log('delete user id clicked')
  deleteUser(deleteUserCallback)
})

$(document).ready
(function () {
  if (window.location.pathname === '/stories') {
    console.log('stories page is up')
    getStoryData(storiesCallback)
  }
  if (window.location.pathname === '/story/:id')
    console.log('story ID page is up')
  { getStoryData(storyIdCallback) }
})
