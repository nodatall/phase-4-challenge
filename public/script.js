window.onload = function() {
  addReviewButtonToggleListener()
  listenForDeleteReview()
}

function addReviewButtonToggleListener() {
  const addReviewButton = document.querySelectorAll('.add-review-button')[0]
  if ( addReviewButton ) {
    const cancelReviewButton = document.querySelectorAll('.cancel-review')[0]
    addReviewButton.addEventListener( "click", toggleAddReviewWindow )
    cancelReviewButton.addEventListener( "click", toggleAddReviewWindow )
  }
}

function toggleAddReviewWindow() {
  toggleElementVisibility( 'album-container' )
  toggleElementVisibility( 'add-review-container' )
}

function toggleElementVisibility( className ) {
  const targetElement = document.querySelectorAll(`.${className}`)[0]
  const elementVisibility = getComputedStyle( targetElement, null).display
  if ( elementVisibility !== 'none' ) {
    targetElement.style.display = 'none'
  } else {
    targetElement.style.display = 'block'
  }
}

function listenForDeleteReview() {
  const deleteReviewForm = document.querySelectorAll('.delete-review-form')[0]
  if ( deleteReviewForm ) {
    deleteReviewForm.addEventListener( "click", function( event ) {
      event.preventDefault()
      if ( confirm( 'Are you sure you want to delete this review?' ) ) {
        deleteReviewForm.submit()
      }
    })
  }
}
